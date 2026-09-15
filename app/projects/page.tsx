import Link from "next/link";
import {
  ExternalLink,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  FileText,
  CheckSquare,
  Globe,
  Compass,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ScrollReveal from "@/components/ui/scroll-reveal";

const PROJECTS = [
  {
    title: "Todo App — Local-First Task Manager",
    description:
      "A fast, distraction-free productivity app with offline local storage, priority categorizing, and complete data sovereignty. Built with React 19, Next.js 16, and TypeScript.",
    href: "/todo",
    tag: "Productivity",
    badge: "Live on next.ajitdev.com",
    external: false,
    tech: ["Next.js 16", "React 19", "TypeScript", "Local-First"],
  },
  {
    title: "Notes App — Minimal Private Notes",
    description:
      "Ultra-clean, local-first notes application with category organization, real-time search, color accents, and full JSON backup and restore capabilities.",
    href: "/note",
    tag: "Productivity",
    badge: "Live on next.ajitdev.com",
    external: false,
    tech: ["Next.js 16", "Tailwind CSS", "Framer Motion", "Offline Storage"],
  },
  {
    title: "Google OAuth Login — Auth.js v5",
    description:
      "Production-ready Google OAuth 2.0 sign-in page powered by Auth.js (NextAuth v5). Features a live session modal, error handling, and a protected dashboard redirect after authentication.",
    href: "/login/google",
    tag: "Authentication",
    badge: "Live on next.ajitdev.com",
    external: false,
    tech: ["Next.js 16", "Auth.js v5", "Google OAuth 2.0", "Server Actions"],
  },
  {
    title: "NextAuth Login — Auth.js Session Demo",
    description:
      "Demonstrates the full Auth.js authentication flow: sign-in with Google, encrypted JWT session management, protected route guard, and server-side session verification.",
    href: "/login/nextauth",
    tag: "Authentication",
    badge: "Live on next.ajitdev.com",
    external: false,
    tech: ["NextAuth v5", "JWT Sessions", "Protected Routes", "TypeScript"],
  },
  {
    title: "AJITDEV API Hub",
    description:
      "The dedicated developer API ecosystem providing free REST and JSON APIs, live interactive endpoint testing, comprehensive documentation, and developer resources.",
    href: "https://api.ajitdev.com/",
    tag: "Developer Tools",
    badge: "api.ajitdev.com",
    external: true,
    tech: ["REST APIs", "JSON APIs", "API Docs", "Public Endpoints"],
  },
  {
    title: "AJITDEV Interactive Playground",
    description:
      "Browser testing environment and interactive web sandbox for testing developer tools, experimental components, and web APIs.",
    href: "https://try.ajitdev.com/",
    tag: "Playground",
    badge: "try.ajitdev.com",
    external: true,
    tech: ["Web Sandbox", "Client Tools", "Interactive Testing"],
  },
  {
    title: "RexVel Web Solution",
    description:
      "Modern digital solutions, responsive web engineering, and custom application development studio.",
    href: "https://rexvel.com/",
    tag: "Solutions",
    badge: "rexvel.com",
    external: true,
    tech: ["Full Stack", "Web Development", "UI/UX Architecture"],
  },
  {
    title: "BiFindr",
    description:
      "Discovery platform and developer utility hub for finding business intelligence, technical tools, and digital solutions.",
    href: "https://bifindr.com/",
    tag: "Discovery",
    badge: "bifindr.com",
    external: true,
    tech: ["Search Tools", "Data Discovery", "Web Utility"],
  },
  {
    title: "CollegeSure",
    description:
      "Higher education analytics and college guidance portal designed to help students evaluate academic institutions and degree programs.",
    href: "https://collegesure.brainzima.com/",
    tag: "Education",
    badge: "collegesure.brainzima.com",
    external: true,
    tech: ["Education Portal", "Analytics", "College Discovery"],
  },
  {
    title: "Brainzima",
    description:
      "Educational platform providing learning resources, computer science training, and structured tech tutorials.",
    href: "https://www.brainzima.com/",
    tag: "Education",
    badge: "brainzima.com",
    external: true,
    tech: ["Tech Education", "E-Learning", "Student Resources"],
  },
];

export default function ProjectsPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero Header */}
      <ScrollReveal direction="up" delay={0.05}>
        <section aria-labelledby="projects-heading" className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Production Engineering Showcase
          </div>

          <h1
            id="projects-heading"
            className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            AJITDEV Projects & Software Applications
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            A showcase of live production applications, local-first web suites, public developer APIs, and digital tools engineered by{" "}
            <strong className="text-slate-900">Ajit Dev</strong>.
          </p>
        </section>
      </ScrollReveal>

      {/* Projects Grid */}
      <section aria-labelledby="projects-grid" className="mt-12">
        <h2 id="projects-grid" className="sr-only">
          List of AJITDEV Projects
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROJECTS.map((project, index) => {
            const isExternal = project.external;
            const cardContent = (
              <article className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition duration-200 hover:border-slate-300 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
                      {project.tag}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                      {project.badge}
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900" />
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-slate-50 border border-slate-200/60 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            );

            return (
              <ScrollReveal
                key={project.href}
                direction="up"
                delay={Math.min(index * 0.07, 0.35)}
                className="h-full"
              >
                {isExternal ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Visit ${project.title}`}
                    className="block h-full"
                  >
                    {cardContent}
                  </a>
                ) : (
                  <Link
                    href={project.href}
                    title={`Open ${project.title}`}
                    className="block h-full"
                  >
                    {cardContent}
                  </Link>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </section>
    </main>
  );
}
