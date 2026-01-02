import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work, Services, Pricing, Testimonials } from "@/types";
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
    link: "https://cal.com/bokox/blueprint-session",
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

const services: Services = {
  path: "/services",
  label: "Services",
  title: `Services & Pricing – ${person.name}`,
  description: "Full-stack development and systems architecture consulting with transparent pricing",
  image: "/images/og/services.jpg",

  hero: {
    headline: <>Turn chaos into systems that scale</>,
    subline: <>I build ERPs, CRMs, custom applications, and automation workflows that help businesses operate smoothly. From idea to deployment, I handle the technical complexity so you can focus on growth.</>,
  },

  process: {
    display: true,
    title: "How I Work",
    steps: [
      {
        number: 1,
        title: "Blueprint Session (FREE)",
        description: <>
          We start with a 30-minute call where you brain-dump your challenges
          and I ask clarifying questions. By the end, you'll have clarity on
          what's possible—even if you don't hire me.
        </>,
        icon: "📋",
      },
      {
        number: 2,
        title: "Scope & Estimate",
        description: <>
          I analyze your requirements, estimate complexity in story points,
          and provide transparent pricing. You'll know exactly what you're
          getting and what it costs before we begin.
        </>,
        icon: "📊",
      },
      {
        number: 3,
        title: "Build & Iterate",
        description: <>
          I design, develop, and deploy your solution using modern tools and
          frameworks. You get regular updates, working prototypes, and direct
          communication—no middlemen, no surprises.
        </>,
        icon: "🏗️",
      },
      {
        number: 4,
        title: "Deliver & Support",
        description: <>
          You receive complete code ownership, documentation, training materials,
          and ongoing support options. Your system is yours to scale, modify,
          or hand off to another team.
        </>,
        icon: "🚀",
      },
    ],
  },

  offerings: {
    display: true,
    title: "What I Build",
    services: [
      {
        title: "ERP Implementation & Consulting",
        description: <>
          Design and implement business systems that connect inventory, sales,
          finance, and operations. I specialize in Zoho One ecosystems and
          custom-built ERPs tailored to your workflows.
        </>,
        icon: "🏢",
        tags: ["Zoho One", "Custom ERP", "Business Process Optimization"],
        examples: [
          "Multi-warehouse inventory management",
          "Automated order-to-invoice workflows",
          "Real-time dashboards and reporting",
        ],
      },
      {
        title: "Custom Software Development",
        description: <>
          Build web applications, internal tools, and customer-facing platforms
          from scratch. I handle frontend, backend, databases, and deployment
          to deliver production-ready solutions.
        </>,
        icon: "💻",
        tags: ["Next.js", "React", "Node.js", "PostgreSQL"],
        examples: [
          "Booking platforms with payment integration",
          "Client portals and dashboards",
          "Admin panels and data management tools",
        ],
      },
      {
        title: "CRM Implementation",
        description: <>
          Set up and customize CRM systems like GoHighLevel to automate lead
          capture, nurture sequences, and sales pipelines. Get campaigns,
          automations, and integrations working seamlessly.
        </>,
        icon: "📈",
        tags: ["GoHighLevel", "Zoho CRM", "HubSpot"],
        examples: [
          "Multi-stage sales pipeline automation",
          "Email & SMS campaign sequences",
          "Lead scoring and attribution tracking",
        ],
      },
      {
        title: "AI & Automation Solutions",
        description: <>
          Implement AI-powered workflows for document processing, data extraction,
          chatbots, and intelligent decision-making. I use OpenAI, Anthropic,
          and custom models to solve real business problems.
        </>,
        icon: "🤖",
        tags: ["OpenAI API", "Claude API", "Document AI", "Workflow Automation"],
        examples: [
          "Invoice and receipt data extraction",
          "Customer support chatbots",
          "Automated report generation",
        ],
      },
      {
        title: "Low-Code Platform Development",
        description: <>
          Build applications using low-code platforms like Bubble, Softr, and
          Retool when speed and flexibility matter more than custom code.
          Perfect for MVPs and rapid iteration.
        </>,
        icon: "⚡",
        tags: ["Bubble.io", "Softr", "Retool", "Airtable"],
        examples: [
          "MVP product launches in weeks",
          "Internal admin tools and dashboards",
          "Client-facing portals and directories",
        ],
      },
    ],
  },

  examples: {
    display: true,
    title: "Recent Projects",
    subtitle: <>Real examples from my portfolio—see the full case studies for details.</>,
  },
};

const pricing: Pricing = {
  path: "/pricing",
  label: "Pricing",
  title: `Pricing – ${person.name}`,
  description: "Transparent pricing for development and consulting services",
  image: "/images/og/pricing.jpg",

  hero: {
    headline: <>Transparent pricing. No surprises.</>,
    subline: <>I use story points for project-based work and hourly retainers for ongoing support. Everything is scoped upfront, so you know exactly what you're paying for before we start.</>,
  },

  storyPoints: {
    display: true,
    title: "Story Point Model",
    description: <>
      I estimate projects in story points (SP)—a measure of complexity,
      not hours. A simple feature might be 5 SP, while a full platform
      could be 200+ SP. After our Blueprint Session, I'll provide a detailed
      estimate and transparent pricing based on these tiers:
    </>,
    tiers: [
      {
        range: "1-50 SP",
        ratePerSP: 150,
        description: "Small features, integrations, and focused builds",
      },
      {
        range: "51-200 SP",
        ratePerSP: 125,
        description: "Full systems, multi-feature platforms, complex workflows",
      },
      {
        range: "200+ SP",
        ratePerSP: 100,
        description: "Enterprise rollouts, comprehensive solutions, long-term projects",
      },
    ],
  },

  retainers: {
    display: true,
    title: "Retainer Consulting",
    description: <>
      Prefer ongoing support? Lock in monthly hours for maintenance,
      feature development, and strategic guidance. Retainers include
      priority response times and flexible scheduling.
    </>,
    packages: [
      {
        name: "Part-Time Support",
        hours: 10,
        ratePerHour: 150,
        features: [
          "Bug fixes and maintenance",
          "2-3 day response time",
          "Monthly check-in calls",
          "Email and Slack support",
        ],
      },
      {
        name: "Active Development",
        hours: 20,
        ratePerHour: 140,
        features: [
          "New features and enhancements",
          "1 business day response time",
          "Weekly progress updates",
          "Priority Slack access",
        ],
        recommended: true,
      },
      {
        name: "Dedicated Partnership",
        hours: 40,
        ratePerHour: 130,
        features: [
          "Embedded team member experience",
          "Same-day response time",
          "Daily Slack availability",
          "Strategic planning sessions",
        ],
      },
    ],
  },

  exampleProjects: {
    display: true,
    title: "What Things Actually Cost",
    projects: [
      {
        name: "CRM Implementation (GoHighLevel)",
        description: <>
          Set up pipelines, automations, landing pages, and email/SMS campaigns.
          Includes training and documentation for your team.
        </>,
        storyPoints: "25-40 SP",
        priceRange: "$3,750-$6,000",
        deliverables: [
          "Configured CRM with custom fields",
          "10+ automated workflows",
          "Email & SMS campaign templates",
          "Training documentation",
        ],
      },
      {
        name: "Custom Automation Workflow",
        description: <>
          Build API integrations, data syncing, and automated processes
          between your tools (e.g., Stripe → Zoho → QuickBooks sync).
        </>,
        storyPoints: "30-50 SP",
        priceRange: "$4,500-$7,500",
        deliverables: [
          "Custom API integration",
          "Error handling & logging",
          "Automated data sync",
          "Monitoring dashboard",
        ],
      },
      {
        name: "Low-Code Platform Build",
        description: <>
          Full application built on Bubble, Softr, or Retool with custom
          workflows, user authentication, and database design.
        </>,
        storyPoints: "50-100 SP",
        priceRange: "$7,500-$12,500",
        deliverables: [
          "Production-ready application",
          "User authentication & permissions",
          "Database schema design",
          "Responsive UI/UX",
        ],
      },
      {
        name: "Enterprise Business System",
        description: <>
          Comprehensive ERP or custom platform with inventory, sales,
          finance, reporting, and multi-user access. Fully custom-built.
        </>,
        storyPoints: "200+ SP",
        priceRange: "$20,000+",
        deliverables: [
          "Full system architecture",
          "Multi-module integration",
          "Role-based access control",
          "Comprehensive documentation",
          "Training and handoff",
        ],
      },
    ],
  },

  blueprintSessions: {
    display: true,
    title: "Blueprint Sessions",
    description: <>
      Book a FREE 30-minute Blueprint Session to discuss your project.
      I'll help you clarify requirements, explore solutions, and provide
      an initial scope estimate—whether you hire me or not.
    </>,
    duration: "30 minutes",
    price: "FREE",
  },
};

const testimonials: Testimonials = {
  display: true,
  title: "Loved by many",
  overallRating: 4.80,
  totalReviews: 24,
  items: [
    {
      name: "David Chen",
      role: "CEO",
      company: "TradeFlex Imports",
      content: "Boko transformed our chaotic operations into a streamlined ERP system. What used to take hours now takes minutes. The ROI was visible within the first month.",
      rating: 5,
    },
    {
      name: "Sarah Mitchell",
      role: "Founder",
      company: "GlowBook Studios",
      content: "The booking platform Boko built exceeded all expectations. Our clients love the seamless experience, and our no-show rate dropped by 60%.",
      rating: 5,
    },
    {
      name: "Michael Okonkwo",
      role: "Operations Director",
      company: "LogiCore Solutions",
      content: "Working with Boko was refreshingly straightforward. Clear communication, transparent pricing, and delivered exactly what was promised. Rare in this industry.",
      rating: 5,
    },
    {
      name: "Jennifer Park",
      role: "Marketing Director",
      company: "Bloom Agency",
      content: "The CRM automation Boko set up saves our team 20+ hours per week. Lead nurturing that used to fall through the cracks is now completely automated.",
      rating: 5,
    },
    {
      name: "Thomas Adebayo",
      role: "Founder",
      company: "QuickServe Logistics",
      content: "From messy spreadsheets to a custom dashboard that shows everything in real-time. Boko understood our problems before we finished explaining them.",
      rating: 4,
    },
    {
      name: "Amanda Foster",
      role: "COO",
      company: "HealthBridge Clinics",
      content: "The document processing AI Boko implemented cut our intake time by 70%. Patients are happier, staff is happier, everyone wins.",
      rating: 5,
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery, services, pricing, testimonials };
