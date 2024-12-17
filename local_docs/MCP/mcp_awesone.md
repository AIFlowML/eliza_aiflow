Directory Structure:

└── ./
    └── mcp-directory-main
        ├── app
        │   ├── (default)
        │   │   ├── [slug]
        │   │   │   └── [name]
        │   │   │       └── page.tsx
        │   │   ├── layout.tsx
        │   │   └── page.tsx
        │   ├── (policy)
        │   │   ├── privacy-policy
        │   │   │   └── page.tsx
        │   │   ├── terms-of-service
        │   │   │   └── page.tsx
        │   │   └── layout.tsx
        │   ├── api
        │   │   ├── submit-project
        │   │   │   └── route.ts
        │   │   ├── submit-projects
        │   │   │   └── route.ts
        │   │   ├── summarize-project
        │   │   │   └── route.ts
        │   │   └── summarize-projects
        │   │       └── route.ts
        │   └── layout.tsx
        ├── components
        │   └── markdown
        │       └── index.tsx
        ├── models
        │   ├── db.ts
        │   ├── project.ts
        │   └── user.ts
        ├── providers
        │   └── theme.tsx
        ├── services
        │   ├── llms
        │   │   └── openai.ts
        │   ├── prompts
        │   │   ├── extract_project.ts
        │   │   └── summarize_project.ts
        │   ├── reader
        │   │   └── jina.ts
        │   └── project.ts
        ├── templates
        │   └── tailspark
        │       └── landing
        │           ├── components
        │           │   ├── crumb
        │           │   │   └── index.tsx
        │           │   ├── faq
        │           │   │   └── index.tsx
        │           │   ├── footer
        │           │   │   └── index.tsx
        │           │   ├── header
        │           │   │   ├── dropdown.tsx
        │           │   │   └── index.tsx
        │           │   ├── hero
        │           │   │   └── index.tsx
        │           │   ├── project
        │           │   │   ├── index.tsx
        │           │   │   └── preview.tsx
        │           │   ├── projects
        │           │   │   ├── index.tsx
        │           │   │   └── item.tsx
        │           │   ├── search
        │           │   │   └── index.tsx
        │           │   └── stars
        │           │       └── index.tsx
        │           ├── pages
        │           │   ├── index.tsx
        │           │   └── single.tsx
        │           └── layout.tsx
        ├── types
        │   ├── agent.d.ts
        │   ├── landing.d.ts
        │   ├── nav.d.ts
        │   ├── post.d.ts
        │   ├── project.d.ts
        │   └── user.d.ts
        ├── utils
        │   ├── index.ts
        │   ├── resp.ts
        │   └── time.ts
        ├── README.md
        └── tailwind.config.ts



---
File: /mcp-directory-main/app/(default)/[slug]/[name]/page.tsx
---

import { findProjectByName, getRandomProjects } from "@/models/project";

import Single from "@/templates/tailspark/landing/pages/single";
import pagejson from "@/pagejson/en.json";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const project = await findProjectByName(name);

  return {
    title: `${project?.title || "-"} | ${pagejson?.metadata?.title}`,
    description: project?.description || "-",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEB_URL}/server/${name}`,
    },
  };
}

export default async function ({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const project = await findProjectByName(name);
  if (!project || !project.uuid) {
    return <div>Project not found</div>;
  }

  const more_projects = await getRandomProjects(1, 50);

  return <Single project={project} more_projects={more_projects} />;
}



---
File: /mcp-directory-main/app/(default)/layout.tsx
---

import LandingLayout from "@/templates/tailspark/landing/layout";
import { Metadata } from "next";
import pagejson from "@/pagejson/en.json";

export const metadata: Metadata = {
  title: pagejson?.metadata?.title,
  description: pagejson?.metadata?.description,
  keywords: pagejson?.metadata?.keywords,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_WEB_URL}/`,
  },
};

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LandingLayout page={pagejson}>{children}</LandingLayout>;
}



---
File: /mcp-directory-main/app/(default)/page.tsx
---

import {
  getFeaturedProjects,
  getProjectsCount,
  getProjectsWithKeyword,
} from "@/models/project";

import LandingPage from "@/templates/tailspark/landing/pages/index";
import { Project } from "@/types/project";
import pagejson from "@/pagejson/en.json";

export const runtime = "edge";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  let projects: Project[] = [];

  if (q) {
    projects = await getProjectsWithKeyword(q as string, 1, 100);
  } else {
    projects = await getFeaturedProjects(1, 100);
  }

  const projectsCount = await getProjectsCount();

  return (
    <LandingPage
      page={pagejson}
      projects={projects}
      projectsCount={projectsCount}
    />
  );
}



---
File: /mcp-directory-main/app/(policy)/privacy-policy/page.tsx
---

import Markdown from "@/components/markdown";
import { MdOutlineHome } from "react-icons/md";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEB_URL}/privacy-policy`,
    },
  };
}

export default function () {
  const content = `# Privacy Policy

## Introduction

Welcome to mcp.so, a third-party Model Context Protocol (MCP) servers store. We value your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and safeguard your information when you use our MCP server hosting and distribution services.

## Information Collection and Use

We collect and use the following types of information:

1. **MCP Server Information**
   - **What We Collect**: Information necessary to host and distribute MCP servers, including server configurations, technical specifications, and usage metrics.
   - **Purpose**: To provide secure and reliable MCP server hosting and distribution services.

2. **Account Information**
   - **What We Collect**: Basic contact information such as name, email, and developer/organization details.
   - **Purpose**: To manage user accounts and provide support for MCP server deployments.

3. **Technical Data**
   - **What We Collect**: Information about how you interact with our MCP servers and platform.
   - **Purpose**: To improve our services, ensure security, and enhance user experience.

## Data Security

We implement industry-standard security measures to protect your information and MCP server data. All data is treated with strict confidentiality and is only accessed by authorized personnel who need it to maintain our services.

## Information Sharing

We do not sell or share your information with third parties except:
- When required by law
- With your explicit consent
- With service providers who help us operate our services (under confidentiality agreements)

## Your Rights

You have the right to:
- Access your personal information
- Request corrections to your data
- Request deletion of your data
- Opt-out of marketing communications

## Contact Us

If you have questions about this privacy policy or our privacy practices, please contact us at:

**Email**: [support@mcp.so](mailto:support@mcp.so)

## Updates to This Policy

We may update this privacy policy periodically. Any changes will be posted on this page with an updated effective date. Your continued use of our services after such modifications constitutes your acknowledgment of the modified policy.

Last updated: December 6, 2024`;
  return (
    <div>
      <a className="text-base-content cursor-pointer" href="/">
        <MdOutlineHome className="text-2xl mx-8 my-8" />
        {/* <img className="w-10 h-10 mx-4 my-4" src="/logo.png" /> */}
      </a>
      <div className="max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8">
        <Markdown content={content} />
      </div>
    </div>
  );
}



---
File: /mcp-directory-main/app/(policy)/terms-of-service/page.tsx
---

import Markdown from "@/components/markdown";
import { MdOutlineHome } from "react-icons/md";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Service",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/terms-of-service`,
    },
  };
}

export default function () {
  const content = ` # Terms of Service

## Introduction and Acceptance of Terms

Welcome to **MCP** (mcp.so), a platform dedicated to providing a marketplace for Model Context Protocol (MCP) servers. Our service enables developers and organizations to discover, share, and manage MCP servers that connect AI assistants with various data sources. By accessing or using our service, you agree to be bound by these Terms of Service.

## Use of the Service

MCP.so provides a platform where users can:
- Browse and discover MCP server implementations
- Share and publish their own MCP servers
- Access documentation and implementation guides
- Manage MCP server deployments and configurations

You agree to use the service in accordance with all applicable laws and regulations.

## User Accounts and Registration

1. **Account Creation**: To publish or manage MCP servers, you must create an account by providing accurate and complete information.

2. **Account Security**: You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.

3. **Developer Responsibilities**: When publishing MCP servers, you must provide accurate documentation, maintain security standards, and respond to reported issues.

## Content and Intellectual Property Rights

1. **Platform Rights**: The MCP.so platform, including its interface, features, and functionality, is protected under copyright law. MCP.so retains all rights to the platform infrastructure.

2. **User Content**: You retain your rights to any MCP servers you publish. By publishing, you grant MCP.so a license to host and distribute your content through our platform.

3. **Open Source**: We encourage open-source contributions while respecting individual licensing choices.

## Prohibited Activities

You agree not to:
- Publish malicious or harmful MCP servers
- Misrepresent server capabilities or compatibility
- Access other users' accounts without authorization
- Interfere with the platform's security or performance
- Attempt to reverse engineer the platform
- Use the service for any illegal purpose

## Data Collection and Privacy

We collect and process:
- Account information
- MCP server metadata and configurations
- Usage analytics and deployment statistics
- Technical logs
- Payment information (if applicable)

For complete details, see our [Privacy Policy](/privacy-policy).

## Service Availability and Support

- The service is provided "as is" and "as available"
- Support is available via support@mcp.so
- We maintain a public status page for service availability
- We may modify or discontinue features with notice

## MCP Server Guidelines

Published servers must:
- Follow MCP specification standards
- Include proper documentation
- Maintain security best practices
- Respect data privacy requirements
- Include clear licensing terms

## Termination

We reserve the right to suspend or terminate accounts that:
- Violate these terms
- Publish malicious or harmful servers
- Engage in fraudulent activity
- Have extended periods of inactivity
- Fail to maintain published servers

## Disclaimer of Warranties

THE SERVICE IS PROVIDED "AS IS" WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES. MCP.SO DISCLAIMS ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

## Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, MCP.SO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE OR ANY MCP SERVERS PUBLISHED THROUGH THE SERVICE.

## Changes to Terms

We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.

## Governing Law

These terms shall be governed by and construed in accordance with the laws of the jurisdiction where MCP.so operates, without regard to conflict of law principles.

## Contact Information

For questions about these terms, please contact us at [support@mcp.so](mailto:support@mcp.so).

---

By using MCP.so, you acknowledge that you have read and agree to these Terms of Service.
`;

  return (
    <div>
      <a className="text-base-content cursor-pointer" href="/">
        <MdOutlineHome className="text-2xl mx-8 my-8" />
        {/* <img className="w-10 h-10 mx-4 my-4" src="/logo.png" /> */}
      </a>
      <div className="max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8">
        <Markdown content={content} />
      </div>
    </div>
  );
}



---
File: /mcp-directory-main/app/(policy)/layout.tsx
---

import "./style.css";

import { Metadata } from "next";
import React from "react";
import pagejson from "@/pagejson/en.json";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `%s | ${pagejson.metadata.title}`,
      default: pagejson.metadata.title,
    },
    description: pagejson.metadata.description,
    keywords: pagejson.metadata.keywords,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}



---
File: /mcp-directory-main/app/api/submit-project/route.ts
---

import { parseProject, saveProject } from "@/services/project";
import { respData, respErr } from "@/utils/resp";

import { Project } from "@/types/project";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    let project: Project = await req.json();

    const parsedProject = parseProject(project);
    if (!parsedProject) {
      return respErr("invalid project");
    }

    const savedProject = await saveProject(parsedProject);
    if (!savedProject) {
      return respErr("save project failed");
    }

    return respData(savedProject);
  } catch (e) {
    console.log("submit project failed", e);
    return respErr("submit project failed");
  }
}



---
File: /mcp-directory-main/app/api/submit-projects/route.ts
---

import { parseProject, saveProject } from "@/services/project";
import { respData, respErr } from "@/utils/resp";

import { Project } from "@/types/project";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    let projects: Project[] = await req.json();

    const parsedProjects = projects.map((p) => parseProject(p));
    if (!parsedProjects) {
      return respErr("invalid project");
    }

    const savedProjects = await Promise.all(
      parsedProjects
        .filter((p): p is Project => p !== undefined)
        .map(saveProject)
    );
    if (!savedProjects) {
      return respErr("save project failed");
    }

    return respData(savedProjects);
  } catch (e) {
    console.log("submit projects failed", e);
    return respErr("submit projects failed");
  }
}



---
File: /mcp-directory-main/app/api/summarize-project/route.ts
---

import { respData, respErr } from "@/utils/resp";

import { findProjectByName } from "@/models/project";
import { sumProject } from "@/services/project";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    let { name } = await req.json();
    if (!name) {
      return respErr("name is required");
    }

    const project = await findProjectByName(name);
    if (!project || !project.uuid || !project.url) {
      return respErr("invalid project");
    }

    const summarizedProject = await sumProject(project);

    return respData(summarizedProject);
  } catch (e) {
    console.log("summarize project failed: ", e);
    return respErr("summarize project failed");
  }
}



---
File: /mcp-directory-main/app/api/summarize-projects/route.ts
---

import { respData, respErr } from "@/utils/resp";

import { getProjectsWithoutSummary } from "@/models/project";
import { sumProject } from "@/services/project";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { page, limit } = await req.json();

    const projects = await getProjectsWithoutSummary(page, limit);
    console.log("projects", projects);

    const summarizedProjects = await Promise.all(
      projects
        .filter((project) => project.uuid && project.name && project.url)
        .map((project) => sumProject(project))
    );

    return respData(summarizedProjects);
  } catch (e) {
    console.log("summarize projects failed: ", e);
    return respErr("summarize projects failed");
  }
}



---
File: /mcp-directory-main/app/layout.tsx
---

import { ThemeProvider } from "@/providers/theme";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no"
        />
        <meta name="google-adsense-account" content="ca-pub-2123767634383915" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}



---
File: /mcp-directory-main/components/markdown/index.tsx
---

"use client";

import "highlight.js/styles/atom-one-dark.min.css"; // Import a highlight.js style
import "../markdown/markdown.css";

import MarkdownIt from "markdown-it";
import React from "react";
import hljs from "highlight.js";

export default function Markdown({ content }: { content: string }) {
  const md: MarkdownIt = new MarkdownIt({
    highlight: function (str: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          }</code></pre>`;
        } catch (_) {}
      }

      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
  });

  const renderedMarkdown = md.render(content);

  return (
    <div
      className="max-w-full overflow-x-auto markdown"
      dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
    />
  );
}



---
File: /mcp-directory-main/models/db.ts
---

import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const client = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_ANON_KEY || ""
  );

  return client;
}



---
File: /mcp-directory-main/models/project.ts
---

import { Project } from "@/types/project";
import { getSupabaseClient } from "./db";

export enum ProjectStatus {
  Created = "created",
  Deleted = "deleted",
}

export async function insertProject(project: Project) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("projects").insert(project);

  if (error) throw error;
  return data;
}

export async function findProjectByUuid(
  uuid: string
): Promise<Project | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("uuid", uuid)
    .eq("status", ProjectStatus.Created)
    .single();

  if (!data) return undefined;

  return data;
}

export async function findProjectByName(
  name: string
): Promise<Project | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("name", name)
    .eq("status", ProjectStatus.Created)
    .single();

  if (!data) return undefined;

  return data;
}

export async function getProjects(
  page: number,
  limit: number
): Promise<Project[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", ProjectStatus.Created)
    .order("sort", { ascending: false })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) return [];

  return data;
}

export async function getProjectsCount(): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("projects").select("count");

  if (error) return 0;

  return data?.[0]?.count || 0;
}

export async function getFeaturedProjects(
  page: number,
  limit: number
): Promise<Project[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .eq("status", ProjectStatus.Created)
    .order("sort", { ascending: false })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) return [];

  return data;
}

export async function getRandomProjects(
  page: number,
  limit: number
): Promise<Project[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", ProjectStatus.Created)
    .order("sort", { ascending: false })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) return [];

  return data.sort(() => Math.random() - 0.5);
}

export async function getProjectsWithKeyword(
  keyword: string,
  page: number,
  limit: number
): Promise<Project[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .or(
      `name.ilike.%${keyword}%,title.ilike.%${keyword}%,description.ilike.%${keyword}%`
    )
    .eq("status", ProjectStatus.Created)
    .order("sort", { ascending: false })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) return [];

  return data;
}

export async function getProjectsWithoutSummary(
  page: number,
  limit: number
): Promise<Project[]> {
  if (!page) {
    page = 1;
  }

  if (!limit) {
    limit = 20;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .is("summary", null)
    .eq("status", ProjectStatus.Created)
    .range((page - 1) * limit, page * limit - 1);

  if (error) return [];

  return data;
}

export async function updateProject(uuid: string, project: Partial<Project>) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("uuid", uuid);

  if (error) throw error;

  return data;
}



---
File: /mcp-directory-main/models/user.ts
---

import { User } from "@/types/user";
import { getSupabaseClient } from "./db";

export async function insertUser(user: User) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("users").insert(user);

  if (error) throw error;
  return data;
}

export async function findUserByEmail(
  email: string,
  signin_provider: string
): Promise<User | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("signin_provider", signin_provider)
    .single();

  if (!data) return undefined;

  return formatUser(data);
}

export async function findUserByUuid(uuid: string): Promise<User | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (!data) return undefined;

  return formatUser(data);
}

export function formatUser(row: any): User {
  const user: User = {
    uuid: row.uuid,
    email: row.email,
    created_at: row.created_at,
    nickname: row.nickname,
    avatar_url: row.avatar_url,
    locale: row.locale,
    signin_type: row.signin_type,
    signin_ip: row.signin_ip,
    signin_provider: row.signin_provider,
    signin_openid: row.signin_openid,
  };

  return user;
}



---
File: /mcp-directory-main/providers/theme.tsx
---

import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-9ZWF7FKDR8"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-9ZWF7FKDR8');
            `,
        }}
      ></script>

      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2123767634383915"
        crossOrigin="anonymous"
      ></script>

      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2123767634383915"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}



---
File: /mcp-directory-main/services/llms/openai.ts
---

import OpenAI, { ClientOptions } from "openai";

export function getOpenAIClient(model?: string): OpenAI {
  const options: ClientOptions = {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  };

  const openai = new OpenAI(options);

  return openai;
}



---
File: /mcp-directory-main/services/prompts/extract_project.ts
---

export const extractProjectPrompt = `Please extract project from the given content and return a project with JSON format.
project object should contain:
- name: project name, should be unique, for example, mcp-server-chatsum
- title: a human readable title of the project
- description: a brief description of the project
- author_name: author name of the project if available

Example response format:
{
    "name": "mcp-server-example",
    "title": "MCP Server Example",
    "description": "A sample MCP server implementation",
    "author_name": "mcpso"
}

given content:
{content}
`;



---
File: /mcp-directory-main/services/prompts/summarize_project.ts
---

export const summarizeProjectPrompt = `You are a project analyzer. Your task is to analyze the given project information and generate a concise summary in JSON format.

Please analyze the given project information and output a JSON object with the following structure:
{
  "tags": ["mathgpt", "math-solver", "math-assistant"],
  "category": "research-and-data",
  "summary": "string"
}

category should be one of the following:
browser-automation, cloud-platforms, communication, customer-data-platforms, databases, developer-tools, file-systems, knowledge-and-memory, location-services, monitoring, search, travel-and-transportation, version-control, virtualization, finance, research-and-data, os-automation, note-taking, cloud-storage, calendar-management, entertainment-and-media, speech-processing, image-and-video-processing, security

the summary should contain the following information:
- what is the project about?
- how to use the project?
- key features of the project
- use cases of the project
- FAQ from the project

Example of the response JSON:
{
    "tags": ["mathgpt", "math-solver", "math-assistant"],
    "category": "research-and-data",
    "summary": "## what is MathGPT?
    MathGPT is a math learning assistant that can help you learn math and solve math problems.

    ## how to use MathGPT?
    To use MathGPT, upload a photo of your problem, and it will generate a step-by-step solution and video explanation.

    ## key features of MathGPT?
    - Instant homework help from an AI math solver
    - Step-by-step problem solving
    - Generation of educational math videos

    ## use cases of MathGPT?
    1. Solving complex algebra problems
    2. Explaining calculus concepts through animations
    3. Generating educational math videos

    ## FAQ from MathGPT?
    - Can MathGPT help with all math subjects?
    > Yes! MathGPT covers a wide range of subjects including algebra, geometry, calculus, and statistics.

    - Is MathGPT free to use?
    > Yes! MathGPT is free to use for everyone.

    - How accurate is MathGPT?
    > MathGPT is designed to be highly accurate, but the quality of the response depends on the complexity of the problem and the clarity of the image.
}

Given project information:
{project}
`;



---
File: /mcp-directory-main/services/reader/jina.ts
---

import { Post } from "@/types/post";

export async function readUrl(url: string): Promise<Post | undefined> {
  try {
    const uri = "https://r.jina.ai/";

    console.log("jina url", uri, url);
    const resp = await fetch(uri, {
      method: "POST",
      body: JSON.stringify({
        url: url,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-Return-Format": "markdown",
        "X-Timeout": "10",
        // "X-No-Cache": "true",
        Accept: "application/json",
      },
    });
    if (!resp.ok) {
      throw new Error("read url failed with status: " + resp.status);
    }

    const res = await resp.json();
    console.log("jina resp", res);

    const { code, status, data } = res;
    if (code !== 200) {
      throw new Error("read url failed with status: " + status);
    }

    const { title, description, content } = data;

    return {
      url: url,
      title: title,
      description: description,
      content: content,
    };
  } catch (err) {
    console.log("read url failed: ", err);
    throw err;
  }
}



---
File: /mcp-directory-main/services/project.ts
---

import {
  ProjectStatus,
  findProjectByName,
  insertProject,
  updateProject,
} from "@/models/project";

import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs";
import { Project } from "@/types/project";
import { extractProjectPrompt } from "@/services/prompts/extract_project";
import { genUuid } from "@/utils";
import { getIsoTimestr } from "@/utils/time";
import { getOpenAIClient } from "@/services/llms/openai";
import { readUrl } from "./reader/jina";
import { summarizeProjectPrompt } from "./prompts/summarize_project";

export function parseProject(project: Project): Project | undefined {
  try {
    if (!project || !project.url) {
      return;
    }

    if (!project.url.startsWith("https://github.com")) {
      return;
    }

    if (!project.name) {
      const urlParts = project.url.split("/");
      project.name = urlParts[urlParts.length - 1];
      if (!project.name) {
        return;
      }
    }

    if (!project.author_name) {
      const urlParts = project.url.split("/");
      if (urlParts.length > 2) {
        project.author_name = urlParts[urlParts.length - 2];
      }
    }

    if (!project.title) {
      project.title = project.name
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return project;
  } catch (e) {
    console.log("parse project failed", e);
    return;
  }
}

export async function extractProject(content: string): Promise<Project> {
  try {
    const prompt = extractProjectPrompt.replace("{content}", content);
    const openai = getOpenAIClient();

    const params: ChatCompletionCreateParamsNonStreaming = {
      model: process.env.OPENAI_MODEL as string,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    };

    console.log("request llm params: ", openai.baseURL, params);

    const res = await openai.chat.completions.create(params);

    const result = res.choices[0].message.content;

    const project = JSON.parse(result || "{}");
    if (!project.name || !project.title || !project.description) {
      throw new Error("project is invalid");
    }

    return project;
  } catch (e) {
    console.error("extract project failed: ", e);
    throw e;
  }
}

export async function sumProject(project: Project): Promise<Project> {
  try {
    if (!project || !project.uuid || !project.name || !project.url) {
      throw new Error("invalid project");
    }

    let content_url = project.url;

    if (content_url.startsWith("https://github.com")) {
      const githubUrl = new URL(content_url);
      const [owner, repo] = githubUrl.pathname.slice(1).split("/");
      if (owner === "modelcontextprotocol") {
        content_url = `https://raw.githubusercontent.com/${owner}/servers/main/src/${project.name}/README.md`;
      } else {
        content_url = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
      }
    }

    console.log("project", project, content_url);

    const projectUpdatedAt = project.updated_at;

    if (!project.content && content_url) {
      const post = await readUrl(content_url);
      console.log("post", post);
      if (post && post.content && post.content.length > 100) {
        project.content = post.content;
        project.updated_at = getIsoTimestr();
      }
    }

    if (!project.summary && project.content) {
      const summarizedProject = await summarizeProject(project);
      project.category = summarizedProject.category;
      project.tags = Array.isArray(summarizedProject.tags)
        ? summarizedProject.tags.join(",")
        : summarizedProject.tags;
      project.summary = summarizedProject.summary;
      project.target = "_self";
      project.updated_at = getIsoTimestr();
    }

    if (projectUpdatedAt !== project.updated_at) {
      await updateProject(project.uuid, project);
    }

    return project;
  } catch (e) {
    console.log("summarize project failed: ", e);
    return project;
  }
}

export async function summarizeProject(project: Project): Promise<Project> {
  try {
    const prompt = summarizeProjectPrompt.replace(
      "{project}",
      JSON.stringify(project)
    );
    const openai = getOpenAIClient();

    const params: ChatCompletionCreateParamsNonStreaming = {
      model: process.env.OPENAI_MODEL as string,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    };

    console.log("request llm params: ", openai.baseURL, params);

    const res = await openai.chat.completions.create(params);

    const result = res.choices[0].message.content;

    console.log("summarize project result: ", result);

    const summarizedProject = JSON.parse(result || "{}");
    if (!summarizedProject.summary) {
      throw new Error("summary is invalid");
    }

    return summarizedProject;
  } catch (e) {
    console.error("summarize project failed: ", e);
    throw e;
  }
}

export async function saveProject(
  project: Project
): Promise<Project | undefined> {
  try {
    if (!project.name) {
      throw new Error("invalid project");
    }

    const existProject = await findProjectByName(project.name);

    if (existProject && existProject.uuid) {
      project.uuid = existProject.uuid;
      project.created_at = existProject.created_at;
      await updateProject(existProject.uuid, project);
      return { ...existProject, ...project };
    }

    const created_at = getIsoTimestr();

    project.uuid = genUuid();
    project.created_at = created_at;
    project.updated_at = created_at;
    project.status = ProjectStatus.Created;
    project.target = "_self";
    project.is_featured = true;
    project.sort = 1;

    await insertProject(project);

    return project;
  } catch (e) {
    console.error("save project failed: ", e);
    throw e;
  }
}



---
File: /mcp-directory-main/templates/tailspark/landing/components/crumb/index.tsx
---

import { FiHome } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Project } from "@/types/project";

export default ({ project }: { project: Project }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        <li>
          <div>
            <a className="text-gray-400 hover:text-gray-500" href="/">
              <FiHome />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>

        {/* <li>
          <div className="flex items-center">
            <MdKeyboardArrowRight />
            <a
              className="ml-2 text-md font-medium text-gray-500 hover:text-gray-700"
              aria-current="page"
              href={"/servers"}
            >
              servers
            </a>
          </div>
        </li> */}

        <li>
          <div className="flex items-center">
            <MdKeyboardArrowRight />
            <a
              className="ml-2 text-md font-medium text-gray-500 hover:text-gray-700"
              aria-current="page"
              // href={renameShortUrl(gpts.short_url, gpts.uuid)}
            >
              {project.name}
            </a>
          </div>
        </li>
      </ol>
    </nav>
  );
};



---
File: /mcp-directory-main/templates/tailspark/landing/components/faq/index.tsx
---

"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Section } from "@/types/landing";
import { useState } from "react";

export default function ({ section }: { section: Section }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-5xl font-bold text-center mb-8">{section.title}</h2>
      <p className="text-center text-2xl mb-8">{section.description}</p>

      <div className="space-y-4">
        {section?.items?.map((faq, index) => (
          <div
            key={index}
            className="border border-[#7e7e7e] rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium text-gray-900">{faq.title}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-4 bg-gray-50"
                >
                  <p className="text-gray-600">{faq.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}



---
File: /mcp-directory-main/templates/tailspark/landing/components/footer/index.tsx
---

"use client";

import { Footer, Item } from "@/types/landing";

export default ({ footer }: { footer: Footer }) => {
  return (
    <footer className="block">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-row justify-between max-[767px]:flex-col max-[767px]:items-start">
          <div className="max-[767px]: w-full max-w-[560px] max-[991px]:mr-4 max-[991px]:flex-initial">
            <p className="text-lg md:text-3xl font-normal md:leading-relaxed">
              {footer?.brand?.description}
            </p>
          </div>
          <div className="max-[767px]: max-[991px]:ml-4 max-[991px]:flex-none max-[767px]:mt-8">
            <div className="mb-4 flex max-w-[272px] items-start justify-start">
              <p className="text-[#636262] max-[479px]:text-sm">Contact</p>
            </div>
            <div className="mb-4 flex max-w-[272px] items-start justify-start">
              <img
                src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6358f6e24e55dd49a541fd06_EnvelopeSimple-3.svg"
                alt="image"
                className="mr-3 inline-block"
              />
              <a
                className="text-primary max-[479px]:text-sm"
                href={footer?.social?.items?.email?.url}
                target={footer?.social?.items?.email?.target}
              >
                {footer?.social?.items?.email?.title}
              </a>
            </div>
          </div>
        </div>
        <div className="mb-14 mt-16 w-full [border-bottom:1.7px_solid_rgb(0,_0,_0)]"></div>
        <div className="flex flex-row justify-between max-[991px]:items-center max-[767px]:flex-col max-[767px]:items-start max-[479px]:flex-col-reverse">
          {footer?.nav?.items?.map((item: Item, idx: number) => {
            return (
              <div
                className="max-[991px]: text-left font-semibold max-[991px]:py-1 max-[479px]:mb-4"
                key={idx}
              >
                <p>{item?.title}</p>
                {item?.children?.map((child: Item, iidx: number) => {
                  return (
                    <p key={iidx}>
                      <a
                        href={child?.url}
                        className="inline-block py-1.5 font-normal text-[#276EF1] transition hover:text-[#276EF1]"
                        target={child?.target}
                      >
                        {child?.title}
                      </a>
                    </p>
                  );
                })}
              </div>
            );
          })}

          <div className="max-[991px]:flex-none">
            <p className="text-[#636262] max-[479px]:text-sm pb-8">
              ©{" "}
              <a
                className="text-primary"
                href={footer?.copyright?.url}
                target={footer?.copyright?.target}
              >
                {footer?.copyright?.owner}
              </a>{" "}
              {footer?.copyright?.text}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};



---
File: /mcp-directory-main/templates/tailspark/landing/components/header/dropdown.tsx
---

import { Menu, Transition } from "@headlessui/react";

import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="mt-1.5 flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/pricing"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Pricing
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/feed"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Feed
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/extension"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Extension
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://chat.openai.com/g/g-EBKM6RsBl-gpts-works"
                  target="_blank"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  GPTs
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/dashboard/my-gpts"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Dashboard
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};



---
File: /mcp-directory-main/templates/tailspark/landing/components/header/index.tsx
---

"use client";

import { BsGithub, BsTwitter } from "react-icons/bs";
import { Header, Item } from "@/types/landing";

import DropDown from "./dropdown";
import { usePathname } from "next/navigation";

export default ({ header }: { header: Header }) => {
  const pathname = usePathname();

  return (
    <header className="mx-auto w-full max-w-7xl px-4 md:px-10 mt-4 md:mt-4">
      <div className="flex items-center">
        <p className="text-lg md:text-3xl font-medium ">
          <a
            className="flex items-center bg-cover bg-center px-3 py-3 md:px-4 md:py-4 m text-primary cursor-pointer font-bold"
            href={header?.brand?.url}
          >
            <img
              src={header?.brand?.avatar?.src}
              alt={header?.brand?.avatar?.title || header?.brand?.title}
              className="w-10 h-10 rounded-full border-2 border-slate-300 shadow-lg mr-2"
            />
            {header?.brand?.title}
          </a>
        </p>

        <div className="flex-1">
          <ul className="md:flex float-right flex text-lg text-slate-700 mr-4 items-center">
            {header?.nav?.items?.map((item: Item, idx: number) => {
              return (
                <li className="mx-4 hidden md:block" key={idx}>
                  <a
                    href={item.url}
                    target={item.target}
                    className={
                      pathname === item.url
                        ? "text-[#2752f4]"
                        : "hover:text-[#2752f4]"
                    }
                  >
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        {/* <a
          className="mr-4"
          href="https://www.buymeacoffee.com/idoubi"
          target="_blank"
        >
          <svg
            viewBox="0 0 27 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 md:h-8 md:w-8 fill-current"
          >
            <path
              d="M14.3206 17.9122C12.9282 18.5083 11.3481 19.1842 9.30013 19.1842C8.44341 19.1824 7.59085 19.0649 6.76562 18.8347L8.18203 33.3768C8.23216 33.9847 8.50906 34.5514 8.95772 34.9645C9.40638 35.3776 9.994 35.6069 10.6039 35.6068C10.6039 35.6068 12.6122 35.7111 13.2823 35.7111C14.0036 35.7111 16.1662 35.6068 16.1662 35.6068C16.776 35.6068 17.3635 35.3774 17.8121 34.9643C18.2606 34.5512 18.5374 33.9846 18.5876 33.3768L20.1046 17.3073C19.4267 17.0757 18.7425 16.9219 17.9712 16.9219C16.6372 16.9214 15.5623 17.3808 14.3206 17.9122Z"
              fill="#FFDD00"
            ></path>
            <path
              d="M26.6584 10.3609L26.4451 9.28509C26.2537 8.31979 25.8193 7.40768 24.8285 7.05879C24.5109 6.94719 24.1505 6.89922 23.907 6.66819C23.6634 6.43716 23.5915 6.07837 23.5351 5.74565C23.4308 5.13497 23.3328 4.52377 23.2259 3.91413C23.1336 3.39002 23.0606 2.80125 22.8202 2.32042C22.5073 1.6748 21.858 1.29723 21.2124 1.04743C20.8815 0.923938 20.5439 0.819467 20.2012 0.734533C18.5882 0.308987 16.8922 0.152536 15.2328 0.0633591C13.241 -0.046547 11.244 -0.0134338 9.25692 0.162444C7.77794 0.296992 6.22021 0.459701 4.81476 0.971295C4.30108 1.15851 3.77175 1.38328 3.38115 1.78015C2.90189 2.26775 2.74544 3.02184 3.09537 3.62991C3.34412 4.06172 3.7655 4.3668 4.21242 4.56862C4.79457 4.82867 5.40253 5.02654 6.02621 5.15896C7.76282 5.54279 9.56148 5.6935 11.3356 5.75765C13.302 5.83701 15.2716 5.77269 17.2286 5.56521C17.7126 5.51202 18.1956 5.44822 18.6779 5.37382C19.2458 5.28673 19.6103 4.54411 19.4429 4.02678C19.2427 3.40828 18.7045 3.16839 18.0959 3.26173C18.0062 3.27581 17.917 3.28885 17.8273 3.30189L17.7626 3.31128C17.5565 3.33735 17.3503 3.36169 17.1441 3.38429C16.7182 3.43018 16.2913 3.46773 15.8633 3.49693C14.9048 3.56368 13.9437 3.59445 12.9831 3.59602C12.0391 3.59602 11.0947 3.56942 10.1529 3.50736C9.72314 3.4792 9.29447 3.44339 8.86684 3.39993C8.67232 3.37959 8.47832 3.35821 8.28432 3.33422L8.0997 3.31076L8.05955 3.30502L7.86816 3.27738C7.47703 3.21845 7.0859 3.15066 6.69895 3.06878C6.6599 3.06012 6.62498 3.03839 6.59994 3.0072C6.57491 2.976 6.56127 2.9372 6.56127 2.8972C6.56127 2.85721 6.57491 2.81841 6.59994 2.78721C6.62498 2.75602 6.6599 2.73429 6.69895 2.72563H6.70625C7.04158 2.65418 7.37951 2.59317 7.71849 2.53997C7.83148 2.52224 7.94482 2.50486 8.05851 2.48782H8.06164C8.27389 2.47374 8.48718 2.43567 8.69839 2.41064C10.536 2.2195 12.3845 2.15434 14.231 2.2156C15.1275 2.24168 16.0234 2.29435 16.9157 2.38509C17.1076 2.40491 17.2985 2.42577 17.4894 2.44923C17.5624 2.4581 17.6359 2.46853 17.7094 2.47739L17.8575 2.49878C18.2893 2.56309 18.7189 2.64115 19.1462 2.73293C19.7793 2.87061 20.5923 2.91546 20.8739 3.60906C20.9636 3.82913 21.0043 4.07371 21.0538 4.30474L21.1169 4.59939C21.1186 4.60467 21.1198 4.61008 21.1206 4.61555C21.2697 5.31089 21.4191 6.00623 21.5686 6.70157C21.5795 6.75293 21.5798 6.80601 21.5693 6.85748C21.5589 6.90895 21.5379 6.95771 21.5078 7.00072C21.4776 7.04373 21.4389 7.08007 21.3941 7.10747C21.3493 7.13487 21.2993 7.15274 21.2473 7.15997H21.2431L21.1519 7.17248L21.0617 7.18448C20.7759 7.22168 20.4897 7.25644 20.2033 7.28878C19.639 7.3531 19.0739 7.40872 18.5079 7.45566C17.3831 7.54918 16.2562 7.61055 15.127 7.63975C14.5516 7.65505 13.9763 7.66217 13.4013 7.66113C11.1124 7.65933 8.82553 7.5263 6.55188 7.2627C6.30574 7.2335 6.05959 7.20221 5.81344 7.1704C6.00431 7.19491 5.67472 7.15162 5.60797 7.14224C5.45152 7.12033 5.29506 7.09756 5.13861 7.07392C4.61346 6.99517 4.09144 6.89817 3.56733 6.81317C2.9337 6.70887 2.32771 6.76102 1.75458 7.07392C1.28413 7.33136 0.903361 7.72614 0.663078 8.20558C0.415886 8.71665 0.342354 9.2731 0.231796 9.82224C0.121237 10.3714 -0.0508594 10.9622 0.0143284 11.526C0.154613 12.7427 1.00518 13.7314 2.22863 13.9525C3.37959 14.1611 4.5368 14.3301 5.69714 14.474C10.2552 15.0323 14.8601 15.0991 19.4325 14.6733C19.8048 14.6385 20.1767 14.6006 20.548 14.5596C20.6639 14.5468 20.7813 14.5602 20.8914 14.5987C21.0016 14.6372 21.1017 14.6998 21.1845 14.782C21.2673 14.8642 21.3307 14.9639 21.37 15.0737C21.4093 15.1836 21.4235 15.3009 21.4116 15.4169L21.2958 16.5423C21.0625 18.8164 20.8292 21.0903 20.596 23.3641C20.3526 25.7519 20.1077 28.1395 19.8612 30.5269C19.7916 31.1993 19.7221 31.8715 19.6526 32.5436C19.5858 33.2054 19.5764 33.888 19.4507 34.542C19.2526 35.5704 18.5564 36.2019 17.5405 36.433C16.6098 36.6448 15.659 36.756 14.7045 36.7646C13.6464 36.7704 12.5888 36.7234 11.5307 36.7292C10.4011 36.7354 9.01755 36.6311 8.1456 35.7905C7.37951 35.052 7.27365 33.8958 7.16935 32.8961C7.03028 31.5725 6.89243 30.2491 6.75579 28.9259L5.98918 21.568L5.49324 16.8072C5.48489 16.7285 5.47655 16.6508 5.46873 16.5715C5.40927 16.0036 5.0072 15.4477 4.37357 15.4764C3.83121 15.5004 3.21479 15.9614 3.27841 16.5715L3.64607 20.1011L4.40642 27.4021C4.62302 29.4759 4.8391 31.5501 5.05465 33.6247C5.09637 34.022 5.13548 34.4205 5.17929 34.8179C5.41762 36.9894 7.07599 38.1596 9.12967 38.4892C10.3291 38.6822 11.5578 38.7218 12.775 38.7416C14.3353 38.7667 15.9113 38.8267 17.4461 38.544C19.7203 38.1268 21.4267 36.6082 21.6702 34.2526C21.7398 33.5725 21.8093 32.8923 21.8788 32.2119C22.11 29.9618 22.3409 27.7115 22.5714 25.4611L23.3255 18.1079L23.6713 14.7379C23.6885 14.5708 23.759 14.4137 23.8725 14.2898C23.986 14.1659 24.1363 14.0819 24.3012 14.0501C24.9515 13.9233 25.5732 13.7069 26.0357 13.212C26.7721 12.424 26.9187 11.3967 26.6584 10.3609ZM2.19525 11.0879C2.20516 11.0832 2.18691 11.1682 2.17909 11.2079C2.17752 11.1479 2.18065 11.0947 2.19525 11.0879ZM2.25836 11.5761C2.26357 11.5724 2.27921 11.5933 2.29538 11.6183C2.27087 11.5953 2.25523 11.5781 2.25783 11.5761H2.25836ZM2.32041 11.6579C2.34284 11.696 2.35483 11.72 2.32041 11.6579V11.6579ZM2.44505 11.7591H2.44818C2.44818 11.7627 2.45392 11.7664 2.456 11.7701C2.45255 11.766 2.4487 11.7624 2.44453 11.7591H2.44505ZM24.271 11.6079C24.0373 11.83 23.6853 11.9333 23.3375 11.9849C19.4366 12.5638 15.479 12.8569 11.5354 12.7275C8.71299 12.6311 5.92035 12.3176 3.12613 11.9229C2.85234 11.8843 2.55561 11.8342 2.36735 11.6324C2.01273 11.2517 2.18691 10.4851 2.27921 10.0251C2.3637 9.60373 2.52536 9.04207 3.02653 8.9821C3.80878 8.89031 4.71724 9.22042 5.49115 9.33776C6.4229 9.47996 7.35813 9.59382 8.29683 9.67935C12.303 10.0444 16.3765 9.98755 20.3649 9.45354C21.0919 9.35584 21.8163 9.24233 22.538 9.11299C23.181 8.99774 23.8939 8.78132 24.2825 9.44728C24.5489 9.90098 24.5844 10.508 24.5432 11.0207C24.5305 11.244 24.4329 11.4541 24.2705 11.6079H24.271Z"
              fill="#0D0C22"
            ></path>
          </svg>
        </a>

        <div className="ml:0 md:ml-8 hidden md:block">
          <a href="/dashboard/my-gpts">Dashboard</a>
        </div>

        <div className="md:hidden">
          <DropDown />
        </div> */}
      </div>
    </header>
  );
};



---
File: /mcp-directory-main/templates/tailspark/landing/components/hero/index.tsx
---

import BgStar from "../../assets/imgs/bgstar.svg";
import { Hero } from "@/types/landing";

export default ({ hero, count }: { hero: Hero; count?: number }) => {
  return (
    <section className="relatve">
      <div className="mx-auto w-full max-w-7xl px-4 mt-12 md:mt-24">
        <div className="mx-auto w-full max-w-4xl text-center">
          <h1 className="text-primary leading-tight text-5xl font-bold md:text-6xl">
            {hero.title}
          </h1>
          <h2 className="mt-4 mb-4 md:mt-8 md:mb-4 text-2xl md:text-3xl text-center">
            <span className="text-primary font-bold">{count}</span>{" "}
            {hero.description}
          </h2>
        </div>
      </div>
      <img
        src={BgStar.src}
        alt=""
        className="absolute bottom-[auto] left-[auto] right-0 top-24 -z-10 inline-block max-[767px]:hidden"
      />
      <img
        src={BgStar.src}
        alt="bgstar"
        className="absolute bottom-[auto] right-[auto] left-0 top-60 -z-10 inline-block max-[767px]:hidden"
      />
    </section>
  );
};



---
File: /mcp-directory-main/templates/tailspark/landing/components/project/index.tsx
---

import { BiCategory } from "react-icons/bi";
import { BsTags } from "react-icons/bs";
import Crumb from "../crumb";
import Markdown from "@/components/markdown";
import Preview from "./preview";
import { Project } from "@/types/project";
import Projects from "../projects";
import Stars from "../stars";
import moment from "moment";

export default ({
  project,
  more_projects,
}: {
  project: Project;
  more_projects?: Project[];
}) => {
  const tagsArr = project.tags ? project.tags.split(",") : [];

  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-10 md:py-8 lg:py-8">
        <div className="w-full mb-4 text-lg">
          <Crumb project={project} />
        </div>

        <div className="grid gap-12 sm:gap-20 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-4xl font-bold md:text-6xl">{project.title}</h1>

            <div className="flex items-center gap-2 mt-4">
              <p className="text-md sm:text-md">
                Created at{" "}
                <span className="text-primary">
                  {moment(project.updated_at).fromNow()}
                </span>
              </p>
              <p className="text-md sm:text-md">
                by <span className="text-primary">{project.author_name}</span>
              </p>
            </div>
            <div className="mt-4">
              <Stars />
            </div>
            <p className="text-sm text-[#808080] sm:text-xl mt-4">
              {project.description}
            </p>
            <div className="mb-8 mt-8 h-px w-full bg-black"></div>
            <div className="mb-6 flex flex-col gap-2 text-sm text-[#808080] sm:text-base lg:mb-8">
              <p className="font-medium">
                <BiCategory className="inline-block mr-2" />
                Categories
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-primary text-xs border border-solid border-primary rounded-md px-2 py-1">
                  {project.category}
                </span>
              </div>
              <p className="font-medium mt-4">
                <BsTags className="inline-block mr-2" />
                Tags
              </p>
              {tagsArr &&
                tagsArr.map((tag) => (
                  <p key={tag}>
                    <input
                      type="checkbox"
                      className="mr-2"
                      readOnly
                      checked={tagsArr && tagsArr.includes(tag)}
                    />
                    {tag}
                  </p>
                ))}
            </div>

            <div className="flex flex-col gap-4 font-semibold sm:flex-row">
              <a
                href={project.url}
                target="_blank"
                className="flex items-center gap-2 rounded-md border border-solid bg-primary text-white px-6 py-3 truncate"
              >
                <span>Visit {project.title} 👉</span>
              </a>
            </div>
          </div>
          {(project.img_url || project.avatar_url) && (
            <div className="min-h-96 rounded-md overflow-hidden">
              <Preview project={project} />
            </div>
          )}
        </div>
      </div>

      {project.summary && (
        <div className="w-full md:max-w-7xl mx-auto px-8 py-4 mt-16 text-left border border-gray-200 rounded-lg">
          <Markdown content={project.summary || ""} />
        </div>
      )}

      <div className="w-full text-center">
        <p className="mx-auto font-bold text-3xl mt-16 mb-4">View More</p>
        {more_projects && <Projects projects={more_projects} />}
      </div>
    </section>
  );
};



---
File: /mcp-directory-main/templates/tailspark/landing/components/project/preview.tsx
---

import { Project } from "@/types/project";

export default function ({ project }: { project: Project }) {
  return (
    <img
      src={project.img_url || project.avatar_url || ""}
      alt={project.title}
      className="rounded-md"
    />
  );
}



---
File: /mcp-directory-main/templates/tailspark/landing/components/projects/index.tsx
---

"use client";

import { Project } from "@/types/project";
import ProjectItem from "./item";

export default ({
  projects,
  loading,
}: {
  projects: Project[];
  loading?: boolean;
}) => {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-5 py-4 md:px-10 md:py-4 lg:py-4">
        {!loading ? (
          <div className="mb-8 gap-5 py-4 [column-count:1] md:mb-12 md:[column-count:2] lg:mb-16 lg:[column-count:3]">
            {projects.map((item: Project, idx: number) => {
              return (
                <div key={idx}>
                  <ProjectItem project={item} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto text-center">Loading data...</div>
        )}
      </div>
    </section>
  );
};



---
File: /mcp-directory-main/templates/tailspark/landing/components/projects/item.tsx
---

import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
import { Project } from "@/types/project";
import StarIcon from "../../assets/imgs/star.svg";
import Stars from "../stars";
import moment from "moment";

export default ({ project }: { project: Project }) => {
  return (
    <Link
      href={
        project.target === "_blank"
          ? project.url || ""
          : `/server/${project.name}`
      }
      target={project.target || "_self"}
    >
      <div className="mb-6 gap-6 overflow-hidden rounded-2xl border border-solid border-[#7e7e7e] bg-white p-8">
        <div className="mb-4 flex flex-row">
          {project.avatar_url && (
            <LazyLoadImage
              src={project.avatar_url}
              placeholderSrc={`/logo.png`}
              alt={project.title}
              className="mr-4 inline-block h-16 w-16 object-cover rounded-full"
            />
          )}
          <div className="flex flex-col">
            <p className="text-base font-semibold">{project.title}</p>
            <p className="text-sm text-[#636262]">{project.author_name}</p>
          </div>
        </div>
        <p className="mb-4 text-sm text-[#636262]">{project.description}</p>

        <div className="flex items-center">
          {true && <Stars />}
          <div className="flex-1"></div>

          <p className="text-slate-500 text-sm">
            {moment(project.created_at).fromNow()}
          </p>
        </div>
      </div>
    </Link>
  );
};



---
File: /mcp-directory-main/templates/tailspark/landing/components/search/index.tsx
---

"use client";

import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

interface Props {
  query?: string;
}

export default ({ query }: Props) => {
  const router = useRouter();
  const [inputDisabled, setInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      if (e.keyCode !== 229) {
        e.preventDefault();
        handleSubmit("", content);
      }
    }
  };

  const handleSubmit = async (keyword: string, question: string) => {
    try {
      const url = `?q=${encodeURIComponent(question)}`;
      console.log("query url", url);
      router.push(url);
      setInputDisabled(true);
    } catch (e) {
      console.log("search failed: ", e);
    }
  };

  useEffect(() => {
    if (query) {
      setContent(query);
      setInputDisabled(false);
    }
  }, [query]);

  return (
    <section className="relatve mt-4 md:mt-8">
      <div className="mx-auto w-full max-w-2xl px-6 text-center">
        <form
          method="POST"
          action="/gpts/search"
          className="flex items-center relative"
        >
          <input
            type="text"
            className="text-sm md:text-md flex-1 px-4 py-3 border-2 border-primary bg-white rounded-lg disabled:border-gray-300 disabled:text-gray-300"
            placeholder="keyword to search"
            ref={inputRef}
            value={content}
            disabled={inputDisabled}
            onChange={handleInputChange}
            onKeyDown={handleInputKeydown}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-4 cursor-pointer"
            onClick={() => {
              if (content) {
                handleSubmit("", content);
              }
            }}
          >
            <polyline points="9 10 4 15 9 20"></polyline>
            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
          </svg>
        </form>
      </div>
    </section>
  );
};



---
File: /mcp-directory-main/templates/tailspark/landing/components/stars/index.tsx
---

import StarIcon from "../../assets/imgs/star.svg";

export default function () {
  return (
    <div className="flex flex-row">
      {Array.from({ length: 5 }).map((_, idx: number) => (
        <img
          key={idx}
          src={StarIcon.src}
          alt="star"
          className="mr-1.5 inline-block w-4 flex-none"
        />
      ))}
    </div>
  );
}



---
File: /mcp-directory-main/templates/tailspark/landing/pages/index.tsx
---

import Faq from "../components/faq";
import Hero from "../components/hero";
import { Page } from "@/types/landing";
import { Project } from "@/types/project";
import Projects from "../components/projects";
import Search from "../components/search";

export default function ({
  page,
  projects,
  projectsCount,
}: {
  page: Page;
  projects: Project[];
  projectsCount: number;
}) {
  return (
    <div>
      {page.hero && <Hero hero={page.hero} count={projectsCount} />}
      <Search />
      <Projects projects={projects} />
      {page.faq && <Faq section={page.faq} />}
    </div>
  );
}



---
File: /mcp-directory-main/templates/tailspark/landing/pages/single.tsx
---

import { Project } from "@/types/project";
import ProjectDetail from "@/templates/tailspark/landing/components/project";

export default function ({
  project,
  more_projects,
}: {
  project: Project;
  more_projects: Project[];
}) {
  return (
    <section className="relatve">
      <div className="mx-auto w-full max-w-7xl px-5 py-2">
        {project && (
          <ProjectDetail project={project} more_projects={more_projects} />
        )}
      </div>
    </section>
  );
}



---
File: /mcp-directory-main/templates/tailspark/landing/layout.tsx
---

import "./assets/style.css";

import Footer from "./components/footer";
import Header from "./components/header";
import { Page } from "@/types/landing";

export default function ({
  children,
  page,
}: Readonly<{
  children: React.ReactNode;
  page: Page;
}>) {
  return (
    <main>
      {page.header && <Header header={page.header} />}
      {children}
      {page.footer && <Footer footer={page.footer} />}
    </main>
  );
}



---
File: /mcp-directory-main/types/agent.d.ts
---

export interface Agent {
  name: string;
  title: string;
  description?: string;
  avatar_url?: string;
}



---
File: /mcp-directory-main/types/landing.d.ts
---

import { ReactNode } from "react";

export interface Page {
  template?: string;
  theme?: string;
  metadata?: Metadata;
  header?: Header;
  hero?: Hero;
  usercase?: Section;
  sections?: Section[];
  section?: Section;
  feature?: Section;
  testimonial?: Section;
  faq?: Section;
  cta?: Section;
  social?: Social;
  footer?: Footer;
  user?: User;
  localesComponent?: ReactNode;
}

export interface Metadata {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
}

export interface User {
  name?: string;
  email?: string;
  avatar?: Image;
  url?: string;
  target?: string;
  items?: Item[];
}

export interface Header {
  brand?: Brand;
  nav?: Nav;
  login_button?: Button;
  buttons?: Button[];
  disabled?: boolean;
}

export interface Hero {
  title?: string;
  description?: string;
  image?: Image;
  video?: Video;
  tip?: string;
  primary_button?: Button;
  secondary_button?: Button;
  image_position?: ImagePosition;
  text_align?: TextAlign;
  buttons?: Button[];
  show_happy_users?: boolean;
  highlight_text?: string;
  disabled?: boolean;
  show_proof?: boolean;
}

export interface Section extends Item {}

export interface Contact {
  [key: string]: Item[];
}

export interface Footer {
  brand?: Brand;
  social?: Social;
  navs?: Nav[];
  copyright?: Copyright;
  qrcode?: Image;
  nav?: Nav;
  buttons?: Button[];
  disabled?: boolean;
  badge_disabled?: boolean;
}

export interface Nav {
  title?: string;
  items: Item[];
}

export interface Item {
  name?: string;
  title?: string;
  description?: string;
  content?: string;
  type?: string;
  url?: string;
  target?: string;
  icon?: JSX.Element;
  avatar?: Image;
  image?: Image;
  video?: Video;
  theme?: string;
  children?: Item[];
  tip?: string;
  button?: Button;
  image_position?: ImagePosition;
  text_align?: TextAlign;
  items?: Item[];
  buttons?: Button[];
  disabled?: boolean;
  label?: string;
}

export interface Image {
  src: string;
  title?: string;
  status?: string;
}

export interface Video {
  src: string;
  title?: string;
  auto_play?: boolean;
}

export interface Button extends Item {}

export interface Brand {
  title?: string;
  description?: string;
  domain?: string;
  avatar?: Image;
  url?: string;
}

export interface Social {
  title?: string;
  description?: string;
  items?: { [key: string]: Item };
}

export interface Copyright {
  owner?: string;
  text?: string;
  url?: string;
  target?: string;
}

export type ImagePosition = "right" | "left" | "center" | undefined;

export type TextAlign = "left" | "center" | undefined;



---
File: /mcp-directory-main/types/nav.d.ts
---

import { ReactNode } from "react";

export interface Nav {
  title: string;
  name?: string;
  url?: string;
  target?: string;
  active?: boolean;
  icon?: ReactNode;
  children?: Nav[];
}



---
File: /mcp-directory-main/types/post.d.ts
---

export interface Post {
  uuid?: string;
  url?: string;
  title?: string;
  description?: string;
  cover_url?: string;
  content?: string;
  source_name?: string;
  author_name?: string;
  content_len?: number;
  word_count?: number;
  read_time?: number;
  created_at?: string;
}



---
File: /mcp-directory-main/types/project.d.ts
---

export interface Project {
  uuid?: string;
  name?: string;
  title: string;
  description?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  author_name?: string;
  author_avatar_url?: string;
  tags?: string;
  category?: string;
  is_featured?: boolean;
  sort?: number;
  url?: string;
  target?: "_blank" | "_self";
  content?: string;
  summary?: string;
  img_url?: string;
}



---
File: /mcp-directory-main/types/user.d.ts
---

export interface User {
  id?: number;
  uuid?: string;
  email: string;
  created_at?: string;
  nickname: string;
  avatar_url: string;
  locale?: string;
  signin_type?: string;
  signin_ip?: string;
  signin_provider?: string;
  signin_openid?: string;
  credits?: UserCredits;
}

export interface UserCredits {
  one_time_credits?: number;
  monthly_credits?: number;
  total_credits?: number;
  used_credits?: number;
  left_credits: number;
  free_credits?: number;
  has_recharged?: number;
  is_pro?: number;
}



---
File: /mcp-directory-main/utils/index.ts
---

import { v4 as uuidv4 } from "uuid";

export function genUuid(): string {
  return uuidv4();
}

export function genUniSeq(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);

  return `${prefix}${randomPart}${timestamp}`;
}

export function getIsoTimestr(): string {
  return new Date().toISOString();
}

export function removeYamlMarkers(text: string): string {
  const cleanedText = text.replace(/^```yaml\s*|\s*```$/g, "");
  return cleanedText;
}

export function parseEventData(data: string) {
  const lines = data.split("\n");
  const dataLine = lines.find((line) => line.startsWith("data:"));

  if (!dataLine) {
    throw new Error("invalid event data: " + data);
  }

  const jsonData = dataLine.replace("data: ", "");
  try {
    const dataObj = JSON.parse(jsonData);

    return dataObj;
  } catch (e) {
    throw e;
  }
}

export const isSmScreen = () => {
  const isNarrowScreen = window.innerWidth < 768;

  return isNarrowScreen;
};

export function genNonceStr(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

export function bytesToKB(bytes: number): string {
  const kb = bytes / 1024;
  return kb.toFixed(1);
}

export function bytesToMB(bytes: number): string {
  const MB = bytes / 1024 / 1024;
  return MB.toFixed(1);
}

export function upperFirstChar(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function removeUrlSearchParams(originalUrl: string): string {
  if (!originalUrl) {
    return "";
  }

  const url = new URL(originalUrl);

  url.search = "";

  return url.toString();
}



---
File: /mcp-directory-main/utils/resp.ts
---

export function respData(data: any) {
  return respJson(0, "ok", data || []);
}

export function respOk() {
  return respJson(0, "ok");
}

export function respErr(message: string) {
  return respJson(-1, message);
}

export function respJson(code: number, message: string, data?: any) {
  let json = {
    code: code,
    message: message,
    data: data,
  };
  if (data) {
    json["data"] = data;
  }

  return Response.json(json);
}



---
File: /mcp-directory-main/utils/time.ts
---

export function getIsoTimestr(): string {
  return new Date().toISOString();
}

export const getTimestamp = () => {
  let time = Date.parse(new Date().toUTCString());

  return time / 1000;
};

export const getMillisecond = () => {
  let time = new Date().getTime();

  return time;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const msToSeconds = (ms: number): string => {
  const seconds = ms / 1000;
  return seconds.toFixed(2);
};



---
File: /mcp-directory-main/README.md
---

## MCP Directory

a directory for Awesome MCP Servers.

live preview: [https://mcp.so](https://mcp.so)

![preview](./preview.png)

## Quick Start

1. clone the repo

```bash
git clone https://github.com/chatmcp/mcp-directory.git
cd mcp-directory
```

2. install dependencies

```bash
pnpm install
```

3. prepare database

create a database with [Supabase](https://supabase.com/)

run the sql file in `data/install.sql`

4. set env variables

put a .env file in the root directory

with env variables:

```env
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

NEXT_PUBLIC_WEB_URL="http://localhost:3000"
```

5. run the dev server

```bash
pnpm dev
```

6. preview the site

open [http://localhost:3000](http://localhost:3000) in your browser

## Community

- [MCP Server Telegram](https://t.me/+N0gv4O9SXio2YWU1)
- [MCP Server Discord](https://discord.gg/RsYPRrnyqg)

## About the author

- [idoubi](https://bento.me/idoubi)
- [Follow me on Twitter](https://x.com/idoubi)
- [Buy me a coffee](https://www.buymeacoffee.com/idoubi)


---
File: /mcp-directory-main/tailwind.config.ts
---

import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./templates/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;

