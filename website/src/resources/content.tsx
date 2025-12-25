import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Boko",
  lastName: "Isaac",
  name: "Boko Isaac",
  role: "Software Developer & Systems Architect",
  avatar: "/images/boko-avatar-new.png",
  email: "boko@elivate.io",
  location: "Africa/Lagos", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: [
    { name: "English", proficiency: 100 },
    { name: "French", proficiency: 65 },
    { name: "Spanish", proficiency: 25 },
  ],
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>Weekly insights on systems architecture, automation, and building better software</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/bokoisaac",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/boko-isaac/",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/bokoisaac/",
    essential: false,
  },
  {
    name: "Twitter",
    icon: "x",
    link: "https://twitter.com/bokoisaac",
    essential: false,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>I build systems that run businesses</>,
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Featured Project</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work",
  },
  subline: (
    <>
    I'm Boko, a <Text as="span" size="xl" weight="strong">software developer and systems architect</Text> with 7+ years of experience. <br /> I build ERPs, CRMs, custom web apps, and automation workflows that turn chaos into streamlined systems.
</>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I'm a full-stack developer and systems architect who builds the operational backbone of
        businesses — ERPs, CRMs, custom applications, and automation workflows that turn manual
        chaos into streamlined systems. I started coding at 14 and now have 7+ years of experience
        delivering 70+ projects for 40+ clients.
        <br />
        <br />
        I work across Next.js, Python, Zoho One, GoHighLevel, and AI integrations, with a simple
        philosophy: knowledge before action, systems over one-off fixes, and clarity in everything
        I ship.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Independent Consultant",
        timeframe: "2017 - Present",
        role: "Full-Stack Developer & Systems Architect",
        achievements: [
          <>
            Delivered 70+ projects for 40+ clients, replacing spreadsheets and manual processes with
            integrated systems across ERP, CRM, and custom web apps.
          </>,
          <>
            Specializes in Zoho One, GoHighLevel, Next.js, and automation that reduces busywork and
            increases visibility for growing teams.
          </>,
        ],
        images: [],
      },
      {
        company: "TradeFlex Imports (client)",
        timeframe: "2024",
        role: "ERP Implementation Lead",
        achievements: [
          <>
            Built a full Zoho One rollout (Inventory, CRM, Books, custom Creator apps) to unify
            operations across three warehouses.
          </>,
          <>
            Cut manual admin from 6 hours to 45 minutes a day and eliminated lost invoices with
            automated approvals and alerts.
          </>,
        ],
        images: [],
      },
      {
        company: "GlowBook Studios (client)",
        timeframe: "2024",
        role: "Full-Stack Developer",
        achievements: [
          <>
            Shipped a custom Next.js booking platform with real-time availability, reminders, and
            payments across five locations.
          </>,
          <>Reduced double-bookings and no-shows while giving staff and customers a simple portal.</>,
        ],
        images: [],
      },
    ],
  },
  philosophy: {
    display: true, // set to false to hide this section
    title: "My Philosophy",
    principles: [
      {
        icon: "📖",
        title: "Knowledge Before Action",
        description: (
          <>
            I spend the first week of every project just listening and observing. Not planning features, not picking tools—just understanding how the business actually works. The best solutions come from knowing the problem deeply, not jumping to the shiniest tech stack.
          </>
        ),
      },
      {
        icon: "🏗️",
        title: "Systems Over One-Off Fixes",
        description: (
          <>
            I don't build features, I build systems. A good system solves today's problem and creates the foundation for tomorrow's growth. That means thinking about scalability, documentation, and maintainability from day one—not as afterthoughts.
          </>
        ),
      },
      {
        icon: "✨",
        title: "Clarity in Everything",
        description: (
          <>
            If a team member can't explain how the system works, I've failed. I document processes, write clear code, and design interfaces that make sense at 2 AM when someone's troubleshooting alone. Complexity is easy. Simplicity is hard—and valuable.
          </>
        ),
      },
      {
        icon: "🎯",
        title: "Build for Humans, Not Perfection",
        description: (
          <>
            The "perfect" system that no one uses is worthless. I design for real workflows, messy edge cases, and the humans who will actually click the buttons. That means flexible workflows, helpful error messages, and accepting that business reality is never as clean as a flowchart.
          </>
        ),
      },
      {
        icon: "🔧",
        title: "Pragmatism Over Dogma",
        description: (
          <>
            I'll use Zoho when it fits, build custom when it's needed, or mix both if that's what works. I care about outcomes, not "the right way" according to some framework. The best tool is the one that solves the problem efficiently and can be maintained long-term.
          </>
        ),
      },
      {
        icon: "📊",
        title: "Measure What Matters",
        description: (
          <>
            Every project should have a clear success metric—time saved, errors reduced, revenue increased. Not vague "improvements," but real numbers. If we can't measure it, we can't prove it worked. And if it didn't work, I want to know so we can fix it.
          </>
        ),
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Miva Open University",
        description: <>BSc Software Engineering (in progress).</>,
      },
      {
        name: "Certifications",
        description: (
          <>
            Zoho Creator Certified Developer (2023), Zoho CRM Administrator (2022), Google Project
            Management, Meta Front-End Developer, IBM Full Stack Software Developer, HubSpot CRM.
          </>
        ),
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Systems architecture & process design",
        description: (
          <>
            Design scalable, documented workflows and system blueprints that connect people,
            processes, and tools with clear success metrics.
          </>
        ),
        tags: [],
        images: [],
      },
      {
        title: "Automation & integrations",
        description: (
          <>Zapier, Make, n8n, and custom webhooks/APIs to connect tools and remove manual work.</>
        ),
        tags: [
          {
            name: "Zapier",
          },
          {
            name: "n8n",
          },
          {
            name: "Custom APIs",
          },
        ],
        images: [],
      },
      {
        title: "Full-stack web development",
        description: (
          <>
            Next.js, React, Python, and Node.js for performant web apps with clean, maintainable
            code and clear documentation.
          </>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "React",
          },
        ],
        images: [],
      },
      {
        title: "CRM/ERP platforms",
        description: (
          <>
            Zoho One, GoHighLevel, HubSpot, and Salesforce to design revenue and operations systems
            that teams actually use.
          </>
        ),
        tags: [
          {
            name: "Zoho",
          },
          {
            name: "GoHighLevel",
          },
          {
            name: "HubSpot",
          },
        ],
        images: [],
      },
      {
        title: "AI integration & data workflows",
        description: (
          <>
            OpenAI/Claude APIs, LangChain, and vector stores to add assistants, document processing,
            and intelligent automations.
          </>
        ),
        tags: [],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
