import type { Category } from "../types";

/** التصنيفات الثابتة للموقع. عامل المقالات يختار واحداً منها لكل مقال. */
export const CATEGORIES: Category[] = [
  { id: "ai", name: "الذكاء الاصطناعي", nameEn: "Artificial Intelligence", icon: "🤖", description: "شروحات ومراجعات لأدوات الذكاء الاصطناعي وكيف تستفيد منها في العمل والدراسة." },
  { id: "android", name: "أندرويد", nameEn: "Android", icon: "📱", description: "حلول مشاكل هواتف أندرويد، وتسريعها، وأفضل التطبيقات والإعدادات المخفية." },
  { id: "windows", name: "ويندوز", nameEn: "Windows", icon: "🪟", description: "حلول أعطال ويندوز 10 و11 خطوة بخطوة، وتسريع الكمبيوتر وضبط الإعدادات." },
  { id: "iphone", name: "آيفون", nameEn: "iPhone", icon: "🍏", description: "مشاكل آيفون وiOS وحلولها، ونصائح البطارية والتخزين والخصوصية." },
  { id: "internet", name: "الإنترنت والراوترات", nameEn: "Internet & Routers", icon: "📶", description: "تسريع الإنترنت وضبط الراوتر والواي فاي وحل مشاكل الاتصال." },
  { id: "security", name: "الأمان والحماية", nameEn: "Security & Privacy", icon: "🔒", description: "حماية حساباتك وأجهزتك من الاختراق والفيروسات والاحتيال الإلكتروني." },
  { id: "software", name: "البرامج والتطبيقات", nameEn: "Software & Apps", icon: "🧩", description: "أفضل البرامج والتطبيقات المجانية وشرح استخدامها وحل مشاكلها." },
  { id: "gaming", name: "الألعاب", nameEn: "Gaming", icon: "🎮", description: "تحسين أداء الألعاب على الكمبيوتر والجوال والكونسول وحل مشاكلها." },
  { id: "hardware", name: "الهاردوير", nameEn: "Hardware", icon: "🖥️", description: "اختيار القطع وتجميع الكمبيوتر وصيانة الأجهزة وفهم المواصفات." },
  { id: "tutorials", name: "شروحات خطوة بخطوة", nameEn: "Step-by-Step Guides", icon: "🛠️", description: "أدلة عملية مفصلة تشرح أي مهمة تقنية من البداية للنهاية." },
  { id: "tech", name: "أخبار وتقنيات", nameEn: "Tech Trends", icon: "🚀", description: "شرح مبسط لأحدث التقنيات والاتجاهات وكيف ستؤثر على حياتك." },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
