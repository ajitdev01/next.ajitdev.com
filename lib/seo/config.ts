/**
 * AJITDEV Central SEO Configuration
 * Genuine entity data, site constants, social profiles, ecosystem mappings,
 * RSS configuration, and 150-keyword semantic cluster taxonomy.
 */

export const siteConfig = {
  name: "AJITDEV",
  legalName: "AJITDEV",
  siteUrl: "https://next.ajitdev.com",
  canonicalHost: "next.ajitdev.com",
  defaultTitle: "AJITDEV | Full Stack Development, DevOps, Cloud & APIs",
  titleTemplate: "%s | AJITDEV",
  description:
    "AJITDEV is the central developer platform by Ajit Dev covering full stack engineering, DevOps, DevSecOps, cloud architecture, system design, DSA, and modern developer tools.",
  locale: "en_US",
  creator: "Ajit Dev",
  publisher: "AJITDEV",
  keywords: [
    "AJITDEV",
    "Ajit Dev",
    "Full Stack Development",
    "DevOps",
    "DevSecOps",
    "Cloud Architecture",
    "System Design",
    "DSA",
    "Developer APIs",
    "API Hub",
    "Next.js Developer",
  ],
} as const;

export const personConfig = {
  name: "Ajit Dev",
  alternateName: "AJITDEV",
  url: "https://www.ajitdev.com/",
  jobTitle: "Full Stack Developer",
  description:
    "A developer focused on full stack development, backend engineering, APIs, DevOps, DevSecOps, cloud technologies, system design, DSA, and software projects.",
  location: {
    addressLocality: "Katihar",
    addressRegion: "Bihar",
    addressCountry: "IN",
  },
  sameAs: [
    "https://leetcode.com/u/ajitdev01/",
    "https://neetcode.io/user/MoltenJinchuriki774",
    "https://codeforces.com/profile/ajitdev01",
    "https://www.codechef.com/users/ajitdev01",
    "https://www.instagram.com/ajitdev01/",
    "https://x.com/ajitdev01",
  ],
  knowsAbout: [
    "Full Stack Development",
    "Backend Engineering",
    "REST & JSON APIs",
    "DevOps Automation & CI/CD",
    "DevSecOps & Cloud Security",
    "Cloud Infrastructure & Deployment",
    "System Design & Scalable Architecture",
    "Data Structures & Algorithms (DSA)",
    "Next.js & React",
    "TypeScript & JavaScript",
  ],
} as const;

export const ecosystemLinks = [
  {
    name: "AJITDEV Portfolio",
    url: "https://www.ajitdev.com/",
    description: "Personal engineering portfolio, technical writeups, and software projects by Ajit Dev.",
    category: "Portfolio",
  },
  {
    name: "AJITDEV API Hub",
    url: "https://api.ajitdev.com/",
    description: "Free developer APIs, REST documentation, and public JSON endpoints.",
    category: "API Hub",
  },
  {
    name: "AJITDEV Interactive Playground",
    url: "https://try.ajitdev.com/",
    description: "Interactive browser testing playground and developer experiments.",
    category: "Developer Tools",
  },
  {
    name: "next.ajitdev.com",
    url: "https://next.ajitdev.com/",
    description: "Central Next.js developer hub, productivity tools, and modern web applications.",
    category: "Core Hub",
  },
  {
    name: "Brainzima",
    url: "https://www.brainzima.com/",
    description: "Educational platform and tech resources.",
    category: "Education",
  },
  {
    name: "CollegeSure",
    url: "https://collegesure.brainzima.com/",
    description: "Higher education analytics and college guidance portal.",
    category: "Education",
  },
  {
    name: "RexVel",
    url: "https://rexvel.com/",
    description: "Web development and digital solutions studio.",
    category: "Solutions",
  },
  {
    name: "BiFindr",
    url: "https://bifindr.com/",
    description: "Developer and business intelligence discovery tools.",
    category: "Tools",
  },
] as const;

/**
 * 150 SEO Keywords Taxonomy mapped into 9 semantic clusters.
 * Used for contextual page intent, sitemaps, internal linking, and content architecture.
 */
export const keywordTaxonomy = {
  // 1. Brand + Identity (1–20)
  brand: [
    "Ajit Dev",
    "AJITDEV",
    "ajitdev",
    "ajitdev01",
    "Ajit Dev Developer",
    "Ajit Dev Software Engineer",
    "Ajit Dev Full Stack Developer",
    "Ajit Dev Web Developer",
    "Ajit Dev Backend Developer",
    "Ajit Dev API Developer",
    "Ajit Dev DevOps Engineer",
    "Ajit Dev Cloud Engineer",
    "Ajit Dev DevSecOps Engineer",
    "Ajit Dev Software Developer",
    "AJITDEV Developer",
    "AJITDEV Software Engineer",
    "AJITDEV Full Stack Developer",
    "AJITDEV Developer Portfolio",
    "AJITDEV Projects",
    "AJITDEV Developer Profile",
  ],

  // 2. Location + Developer (21–40)
  location: [
    "Full Stack Developer in Katihar",
    "Full Stack Developer Katihar",
    "Full Stack Engineer Katihar",
    "Software Developer in Katihar",
    "Software Engineer Katihar",
    "Web Developer in Katihar",
    "Backend Developer in Katihar",
    "Frontend Developer in Katihar",
    "API Developer in Katihar",
    "DevOps Engineer in Katihar",
    "DevOps Engineer Katihar",
    "DevSecOps Engineer Katihar",
    "Cloud Engineer Katihar",
    "Cloud Engineer in Katihar",
    "Software Developer Bihar",
    "Software Engineer Bihar",
    "Full Stack Developer Bihar",
    "Full Stack Engineer Bihar",
    "DevOps Engineer Bihar",
    "Cloud Engineer Bihar",
  ],

  // 3. Full Stack Development (41–60)
  fullStack: [
    "Full Stack Development",
    "Full Stack Developer",
    "Full Stack Engineer",
    "Modern Full Stack Development",
    "Web Application Development",
    "Full Stack Web Development",
    "JavaScript Developer",
    "TypeScript Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "MERN Developer",
    "MERN Stack Developer",
    "Frontend Development",
    "Backend Development",
    "Backend Engineering",
    "API Development",
    "Web Application Developer",
    "JavaScript Full Stack Developer",
    "TypeScript Full Stack Developer",
  ],

  // 4. Backend + API Engineering (61–75)
  backendApi: [
    "Backend Engineer",
    "Backend Software Engineer",
    "Backend Development",
    "REST API Development",
    "REST API Developer",
    "REST API Engineering",
    "JSON API",
    "JSON API Developer",
    "API Engineering",
    "API Architecture",
    "Backend Architecture",
    "API Integration",
    "API Design",
    "Database Backend Development",
    "Scalable Backend Development",
  ],

  // 5. AJITDEV API Hub (76–95)
  apiHub: [
    "AJITDEV API Hub",
    "AJITDEV API",
    "AJITDEV APIs",
    "Free APIs",
    "Free APIs for Developers",
    "Free Developer APIs",
    "Free REST APIs",
    "Free JSON APIs",
    "Public APIs",
    "Public APIs for Developers",
    "Developer APIs",
    "REST APIs",
    "REST API Documentation",
    "API Documentation",
    "API Reference",
    "API Testing",
    "API Resources",
    "Developer API Resources",
    "Free API Resources",
    "JSON REST API",
  ],

  // 6. DevOps (96–110)
  devops: [
    "DevOps",
    "DevOps Engineer",
    "DevOps Engineering",
    "DevOps Development",
    "DevOps Automation",
    "CI/CD",
    "CI/CD Pipeline",
    "Continuous Integration",
    "Continuous Deployment",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Linux Engineering",
    "Infrastructure Engineering",
    "Cloud Infrastructure",
  ],

  // 7. DevSecOps + Cloud (111–125)
  devSecOpsCloud: [
    "DevSecOps",
    "DevSecOps Engineer",
    "DevSecOps Engineering",
    "Cloud Security",
    "Application Security",
    "API Security",
    "CI/CD Security",
    "Infrastructure Security",
    "Secure Software Development",
    "Security Automation",
    "Cloud Engineering",
    "Cloud Engineer",
    "AWS Cloud Engineering",
    "Cloud Infrastructure Engineering",
    "Cloud Security Engineering",
  ],

  // 8. System Design + Software Engineering (126–140)
  systemDesign: [
    "System Design",
    "Software Architecture",
    "Software Engineering",
    "Software Development",
    "Backend Architecture",
    "Distributed Systems",
    "Scalable Systems",
    "Scalable Software Architecture",
    "Application Architecture",
    "Database Design",
    "System Architecture",
    "API Architecture",
    "Software Design",
    "Low Level Design",
    "High Level Design",
  ],

  // 9. DSA + Competitive Programming (141–150)
  dsa: [
    "Data Structures and Algorithms",
    "DSA",
    "DSA Problem Solving",
    "Algorithmic Problem Solving",
    "Competitive Programming",
    "LeetCode",
    "NeetCode",
    "Codeforces",
    "CodeChef",
    "Programming Problem Solving",
  ],
} as const;

export const rssConfig = {
  title: "AJITDEV — Technical Hub & Developer Ecosystem",
  description:
    "Engineering updates, developer tools, free APIs, system design architectures, and productivity apps by Ajit Dev.",
  feedUrl: "https://next.ajitdev.com/feed.xml",
  siteUrl: "https://next.ajitdev.com",
  author: {
    name: "Ajit Dev",
    email: "contact@ajitdev.com",
    link: "https://www.ajitdev.com/",
  },
} as const;
