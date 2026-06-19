# Security Specification for TechFix AI

This document establishes the security specs and validation conditions for the Firestore database of TechFix AI, safeguarding the integrity of our posts and categories.

## 1. Data Invariants
- **Public Read Access**: Published posts (`status == 'published'`) and all categories are readable by any user (authenticated or unauthenticated) to maximize SEO indexability.
- **Draft Protection**: Draft articles (`status == 'draft'`) must ONLY be readable by authenticated administrators.
- **Admin Write Authority**: Only authenticated administrators are permitted to create, update, or delete posts and categories.
- **Privilege Escalation Block**: There are no client-writable user-specific roles or custom user profile fields that grant admin status. Admin status is hardcoded for verified email `hadi681sa@gmail.com` or dynamically verified backend-side.
- **Temporal Integrity**: Article creation and modification dates must use the server time (`request.time`).
- **Data Shape Integrity**: All fields of a post must adhere strictly to defined types (e.g., `title`, `slug`, and `excerpt` are strings under pre-defined length boundaries, and `tags` must be a populated array/list of limited bounds).

---

## 2. The Dirty Dozen (Malicious Payloads)
The following 12 payloads are designed to challenge our Firestore security, and must result in `PERMISSION_DENIED`:

### P1: Unauthenticated Post Creation
Attempt by a public/unauthenticated user to insert an article.
```json
{
  "collection": "posts",
  "operation": "create",
  "auth": null,
  "data": {
    "title": "Hacked Post",
    "slug": "hacked-post",
    "excerpt": "Hacked by guest",
    "content": "Guest content",
    "featuredImage": "https://example.com/hacked.jpg",
    "category": "tech",
    "tags": ["hack"],
    "metaTitle": "Hacked Title",
    "metaDescription": "Hacked Desc",
    "status": "published",
    "createdAt": "2026-05-31T11:40:00Z",
    "updatedAt": "2026-05-31T11:40:00Z"
  }
}
```

### P2: Non-Admin Email Writing Post
Attempt by an authenticated user with a different email to create/update an article.
```json
{
  "collection": "posts",
  "operation": "create",
  "auth": {
    "uid": "regular_user_123",
    "token": {
      "email": "malicious@gmail.com",
      "email_verified": true
    }
  },
  "data": {
    "title": "Unauthorized Article",
    "slug": "unauthorized-article",
    "excerpt": "Excerpt...",
    "content": "Content...",
    "featuredImage": "https://example.com/cover.jpg",
    "category": "tech",
    "tags": ["news"],
    "metaTitle": "Meta Title",
    "metaDescription": "Meta Desc",
    "status": "published",
    "createdAt": "2026-05-31T11:40:00Z",
    "updatedAt": "2026-05-31T11:40:00Z"
  }
}
```

### P3: Email Spoof Attack (Admin Email but Unverified)
Attempt by an attacker to sign up with a fake verified claim to act as the primary Admin (`hadi681sa@gmail.com`).
```json
{
  "collection": "posts",
  "operation": "create",
  "auth": {
    "uid": "attacker_456",
    "token": {
      "email": "hadi681sa@gmail.com",
      "email_verified": false
    }
  },
  "data": {
    "title": "Spoofed Admin Article",
    "slug": "spoofed-article",
    "excerpt": "Excerpt...",
    "content": "Content...",
    "featuredImage": "https://example.com/image.jpg",
    "category": "tech",
    "tags": ["tech"],
    "metaTitle": "Meta... ",
    "metaDescription": "Meta... ",
    "status": "published",
    "createdAt": "2026-05-31T11:40:00Z",
    "updatedAt": "2026-05-31T11:40:00Z"
  }
}
```

### P4: Post Image Resource Poisoning
Creating a post with an extremely long image URL (1MB payload) to cause Denial of Wallet.
```json
{
  "collection": "posts",
  "operation": "create",
  "auth": {
    "uid": "hadi681sa_uid",
    "token": {
      "email": "hadi681sa@gmail.com",
      "email_verified": true
    }
  },
  "data": {
    "title": "Valid Title",
    "slug": "valid-slug",
    "excerpt": "Valid excerpt",
    "content": "Valid content",
    "featuredImage": "[REPEATED STRING OF 1,000,000 CHARS]",
    "category": "tech",
    "tags": ["test"],
    "metaTitle": "Title",
    "metaDescription": "Desc",
    "status": "published",
    "createdAt": "2026-05-31T11:40:00Z",
    "updatedAt": "2026-05-31T11:40:00Z"
  }
}
```

### P5: Creating Category without Admin Authentication
Attempt to insert generic categories on TechFix AI without proper admin rights.
```json
{
  "collection": "categories",
  "operation": "create",
  "auth": null,
  "data": {
    "name": "Spam Category",
    "slug": "spam-category",
    "description": "Spam"
  }
}
```

### P6: Creating Post with Client-Supplied Non-Server Timestamp
Client attempts to bypass server timestamp checks to back-date/front-date a post.
```json
{
  "collection": "posts",
  "operation": "create",
  "auth": {
    "uid": "hadi681sa_uid",
    "token": {
      "email": "hadi681sa@gmail.com",
      "email_verified": true
    }
  },
  "data": {
    "title": "Valid Post",
    "slug": "valid-post",
    "excerpt": "Excerpt",
    "content": "Content",
    "featuredImage": "https://example.com/img.jpg",
    "category": "tech",
    "tags": ["tech"],
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Desc",
    "status": "published",
    "createdAt": "2020-01-01T00:00:00Z",
    "updatedAt": "2020-01-01T00:00:00Z"
  }
}
```

### P7: Injecting Ghost Fields (The Shadow Update Test)
Attempt by admin to create/update a post with fields not permitted by schema definition (e.g. `isFeaturedHomeSpotlight`).
```json
{
  "collection": "posts",
  "operation": "create",
  "auth": {
    "uid": "hadi681sa_uid",
    "token": {
      "email": "hadi681sa@gmail.com",
      "email_verified": true
    }
  },
  "data": {
    "title": "Valid Post",
    "slug": "valid-post",
    "excerpt": "Excerpt",
    "content": "Content",
    "featuredImage": "https://example.com/img.jpg",
    "category": "tech",
    "tags": ["tech"],
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Desc",
    "status": "published",
    "createdAt": "request.time",
    "updatedAt": "request.time",
    "ghostField": "maliciousSecretSetting"
  }
}
```

### P8: Guest Reading Draft Post
Unauthenticated reader targeting a direct get / list querying for articles with state `draft`.
```json
{
  "collection": "posts",
  "documentId": "draft_post_xyz",
  "operation": "get",
  "auth": null
}
```

### P9: Immortality Field Alteration (Modifying `createdAt`)
Admin attempting to change the underlying immutable `createdAt` timestamp of a published post.
```json
{
  "collection": "posts",
  "documentId": "post_123",
  "operation": "update",
  "auth": {
    "uid": "hadi681sa_uid",
    "token": {
      "email": "hadi681sa@gmail.com",
      "email_verified": true
    }
  },
  "data": {
    "title": "Updated Title",
    "slug": "post-123",
    "excerpt": "Excerpt",
    "content": "Content",
    "featuredImage": "https://example.com/img.jpg",
    "category": "tech",
    "tags": ["tech"],
    "metaTitle": "Title",
    "metaDescription": "Desc",
    "status": "published",
    "createdAt": "2015-12-12T00:00:00Z",
    "updatedAt": "request.time"
  }
}
```

### P10: ID Poisoning Attempt (Excessive Path Key Size)
Creating an article with a junk character/exotic ID of 500 characters to bloat database indexes.
```json
{
  "collection": "posts",
  "documentId": "extremely_long_junk_id_repeated_over_and_over_to_try_and_exhaust_indexing_capacity_and_break_the_storage_limits_or_override_the_routing_mechanism_of_the_live_firestore_nodes_to_cause_system_latency_and_exhaust_wallet_credits",
  "operation": "create",
  "auth": {
    "uid": "hadi681sa_uid",
    "token": {
      "email": "hadi681sa@gmail.com",
      "email_verified": true
    }
  },
  "data": {
    "title": "Valid Post",
    "slug": "valid-post",
    "excerpt": "Excerpt",
    "content": "Content",
    "featuredImage": "https://example.com/img.jpg",
    "category": "tech",
    "tags": ["tech"],
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Desc",
    "status": "published",
    "createdAt": "request.time",
    "updatedAt": "request.time"
  }
}
```

### P11: Overriding Post Slug to Arbitrary Format
Creating a post slug with non-slug characters (dangerous scripts like `<script>` or invalid sequences).
```json
{
  "collection": "posts",
  "operation": "create",
  "auth": {
    "uid": "hadi681sa_uid",
    "token": {
      "email": "hadi681sa@gmail.com",
      "email_verified": true
    }
  },
  "data": {
    "title": "XSS Slug",
    "slug": "bad/slug/<script>alert(1)</script>",
    "excerpt": "Excerpt",
    "content": "Content",
    "featuredImage": "https://example.com/img.jpg",
    "category": "tech",
    "tags": ["tech"],
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Desc",
    "status": "published",
    "createdAt": "request.time",
    "updatedAt": "request.time"
  }
}
```

### P12: Non-Admin Direct Deletion of Database Post
Unauthorized deletion request to prune database articles from the client.
```json
{
  "collection": "posts",
  "documentId": "post_to_delete_abc",
  "operation": "delete",
  "auth": {
    "uid": "not_admin_123",
    "token": {
      "email": "hacker@example.com",
      "email_verified": true
    }
  }
}
```
