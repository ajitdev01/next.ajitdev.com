import { siteConfig, personConfig } from "./config";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface WebPageSchemaOptions {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
  datePublished?: string;
  dateModified?: string;
}

export interface SoftwareApplicationOptions {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  features?: string[];
}

/**
 * Builds the canonical Person schema for Ajit Dev
 */
export function buildPersonSchema() {
  return {
    "@type": "Person",
    "@id": `${siteConfig.siteUrl}/#person`,
    name: personConfig.name,
    alternateName: personConfig.alternateName,
    url: personConfig.url,
    jobTitle: personConfig.jobTitle,
    description: personConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: personConfig.location.addressLocality,
      addressRegion: personConfig.location.addressRegion,
      addressCountry: personConfig.location.addressCountry,
    },
    sameAs: [...personConfig.sameAs],
    knowsAbout: [...personConfig.knowsAbout],
  };
}

/**
 * Builds the canonical WebSite schema for next.ajitdev.com
 */
export function buildWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    url: siteConfig.siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.locale.replace("_", "-"),
    publisher: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    author: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
  };
}

/**
 * Builds BreadcrumbList structured data
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[], pageUrl: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Builds WebPage schema linked to WebSite, Person, and Breadcrumbs
 */
export function buildWebPageSchema(options: WebPageSchemaOptions) {
  const schema: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${options.url}#webpage`,
    url: options.url,
    name: options.name,
    description: options.description,
    inLanguage: siteConfig.locale.replace("_", "-"),
    isPartOf: {
      "@id": `${siteConfig.siteUrl}/#website`,
    },
    about: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
  };

  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    schema.breadcrumb = {
      "@id": `${options.url}#breadcrumb`,
    };
  }

  if (options.datePublished) {
    schema.datePublished = options.datePublished;
  }
  if (options.dateModified) {
    schema.dateModified = options.dateModified;
  }

  return schema;
}

/**
 * Builds SoftwareApplication schema for real apps like Todo and Notes
 */
export function buildSoftwareApplicationSchema(options: SoftwareApplicationOptions) {
  return {
    "@type": "SoftwareApplication",
    "@id": `${options.url}#software`,
    name: options.name,
    description: options.description,
    url: options.url,
    applicationCategory: options.applicationCategory,
    operatingSystem: options.operatingSystem || "Any (Modern Web Browser)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    creator: {
      "@id": `${siteConfig.siteUrl}/#person`,
    },
    featureList: options.features || [],
  };
}

/**
 * Combines entities into a single connected Schema.org @graph
 */
export function buildConnectedGraph(entities: Array<Record<string, unknown> | null | undefined>) {
  const cleanEntities = entities.filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": cleanEntities,
  };
}
