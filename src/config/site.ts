import config from "../../site.config.json";

export const SITE = config;
export const SITE_URL = config.siteUrl.replace(/\/+$/, "");
export const PAGE_SIZE = 24;
