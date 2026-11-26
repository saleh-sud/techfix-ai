import type { Category } from "../types";

/** التصنيفات الثابتة للموقع. عامل المقالات يختار واحداً منها لكل مقال. */
export const CATEGORIES: Category[] = [
  { id: "ai", name: "الذكاء الاصطناعي", nameEn: "Artificial Intelligence", icon: "🤖", description: "شروحات ومراجعات لأدوات الذكاء الاصطناعي وكيف تستفيد منها في العمل والدراسة.", descriptionEn: "Guides and reviews of AI tools and how to use them for work and study." },
  { id: "android", name: "أندرويد", nameEn: "Android", icon: "📱", description: "حلول مشاكل هواتف أندرويد، وتسريعها، وأفضل التطبيقات والإعدادات المخفية.", descriptionEn: "Fix Android phone problems, speed them up, and discover useful apps and hidden settings." },
  { id: "windows", name: "ويندوز", nameEn: "Windows", icon: "🪟", description: "حلول أعطال ويندوز 10 و11 خطوة بخطوة، وتسريع الكمبيوتر وضبط الإعدادات.", descriptionEn: "Step-by-step fixes for Windows 10 and 11, plus speed and settings tips." },
  { id: "iphone", name: "آيفون", nameEn: "iPhone", icon: "🍏", description: "مشاكل آيفون وiOS وحلولها، ونصائح البطارية والتخزين والخصوصية.", descriptionEn: "iPhone and iOS problems and solutions, with battery, storage and privacy tips." },
  { id: "internet", name: "الإنترنت والراوترات", nameEn: "Internet & Routers", icon: "📶", description: "تسريع الإنترنت وضبط الراوتر والواي فاي وحل مشاكل الاتصال.", descriptionEn: "Speed up your internet, configure your router and Wi-Fi, and solve connection problems." },
  { id: "security", name: "الأمان والحماية", nameEn: "Security & Privacy", icon: "🔒", description: "حماية حساباتك وأجهزتك من الاختراق والفيروسات والاحتيال الإلكتروني.", descriptionEn: "Protect your accounts and devices from hacking, malware and online scams." },
  { id: "software", name: "البرامج والتطبيقات", nameEn: "Software & Apps", icon: "🧩", description: "أفضل البرامج والتطبيقات المجانية وشرح استخدامها وحل مشاكلها.", descriptionEn: "The best free programs and apps, how to use them and fix their problems." },
  { id: "gaming", name: "الألعاب", nameEn: "Gaming", icon: "🎮", description: "تحسين أداء الألعاب على الكمبيوتر والجوال والكونسول وحل مشاكلها.", descriptionEn: "Improve game performance on PC, mobile and console, and solve common issues." },
  { id: "hardware", name: "الهاردوير", nameEn: "Hardware", icon: "🖥️", description: "اختيار القطع وتجميع الكمبيوتر وصيانة الأجهزة وفهم المواصفات.", descriptionEn: "Choose parts, build a PC, maintain your devices and understand specs." },
  { id: "tutorials", name: "شروحات خطوة بخطوة", nameEn: "Step-by-Step Guides", icon: "🛠️", description: "أدلة عملية مفصلة تشرح أي مهمة تقنية من البداية للنهاية.", descriptionEn: "Detailed practical guides that walk you through any tech task from start to finish." },
  { id: "tech", name: "أخبار وتقنيات", nameEn: "Tech Trends", icon: "🚀", description: "شرح مبسط لأحدث التقنيات والاتجاهات وكيف ستؤثر على حياتك.", descriptionEn: "Simple explanations of the latest technologies and how they will affect your life." },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
