import { useEffect } from 'react';

interface SEOHelperProps {
  title: string;
  description: string;
  slug?: string;
  type?: 'website' | 'article';
  imageUrl?: string;
  publishDate?: string;
  modifiedDate?: string;
  categoryName?: string;
  schemaType?: 'article' | 'breadcrumb' | 'general';
  breadcrumbSteps?: { name: string; url: string }[];
}

export default function SEOHelper({
  title,
  description,
  slug = '',
  type = 'website',
  imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  publishDate,
  modifiedDate,
  categoryName,
  schemaType = 'general',
  breadcrumbSteps = []
}: SEOHelperProps) {
  useEffect(() => {
    // 1. Update document title
    const formattedTitle = title.includes('TechFix AI') ? title : `${title} | TechFix AI`;
    document.title = formattedTitle;

    // Helper to update or create meta tags
    const updateMetaTag = (attribute: string, value: string, content: string) => {
      let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create canonical links
    const updateCanonicalLink = (url: string) => {
      let element = document.head.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', url);
    };

    // Calculate URLs
    const siteUrl = window.location.origin;
    const currentUrl = `${siteUrl}/${slug}`;

    // 2. Standard SEO Tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateCanonicalLink(currentUrl);

    // 3. Open Graph / Facebook Tags
    updateMetaTag('property', 'og:title', formattedTitle);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:image', imageUrl);
    updateMetaTag('property', 'og:site_name', 'TechFix AI');
    updateMetaTag('property', 'og:locale', 'ar_AR');

    // 4. Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', formattedTitle);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', imageUrl);

    // 5. Schema JSON-LD Injections
    // Remove existing TechFix schemas to avoid duplicates
    const existingSchemas = document.head.querySelectorAll('script[type="application/ld+json"].techfix-schema');
    existingSchemas.forEach(el => el.remove());

    const schemasToInject: any[] = [];

    // General WebSite Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "TechFix AI",
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    schemasToInject.push(websiteSchema);

    // Breadcrumb Schema
    if (breadcrumbSteps.length > 0) {
      const breadcrumbListSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbSteps.map((step, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": step.name,
          "item": step.url.startsWith('http') ? step.url : `${siteUrl}${step.url}`
        }))
      };
      schemasToInject.push(breadcrumbListSchema);
    } else if (slug) {
      // Default fallback breadcrumb based on slug/category
      const items = [
        { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": siteUrl }
      ];
      if (categoryName) {
        items.push({ "@type": "ListItem", "position": 2, "name": categoryName, "item": `${siteUrl}/categories` });
      }
      items.push({ "@type": "ListItem", "position": items.length + 1, "name": title, "item": currentUrl });

      schemasToInject.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
      });
    }

    // Article Schema
    if (type === 'article' && schemaType === 'article') {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        },
        "headline": title,
        "description": description,
        "image": imageUrl,
        "datePublished": publishDate || new Date().toISOString(),
        "dateModified": modifiedDate || publishDate || new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": "كتاب TechFix AI",
          "url": siteUrl
        },
        "publisher": {
          "@type": "Organization",
          "name": "TechFix AI",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/assets/logo.png`
          }
        },
        "genre": categoryName || "تكنولوجيا",
        "keywords": "تقنية, ذكاء اصطناعي, أدوات ذكاء اصطناعي, سيو, برمجة"
      };
      schemasToInject.push(articleSchema);
    }

    // Inject Scripts
    schemasToInject.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.classList.add('techfix-schema');
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup on unmount
    return () => {
      const cleanupSchemas = document.head.querySelectorAll('script[type="application/ld+json"].techfix-schema');
      cleanupSchemas.forEach(el => el.remove());
    };
  }, [title, description, slug, type, imageUrl, publishDate, modifiedDate, categoryName, schemaType, breadcrumbSteps]);

  // Render nothing as it updates the head imperatively
  return null;
}
