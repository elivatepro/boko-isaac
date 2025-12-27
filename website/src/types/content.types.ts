import { IconName } from "@/resources/icons";
import { zones } from "tzdata";

/**
 * IANA time zone string (e.g., 'Asia/Calcutta', 'Europe/Vienna').
 * See: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 */
export type IANATimeZone = Extract<keyof typeof zones, string>; // Narrow to string keys for React usage

/**
 * Represents a person featured in the portfolio.
 */
export type Person = {
  /** First name of the person */
  firstName: string;
  /** Last name of the person */
  lastName: string;
  /** The name you want to display, allows variations like nicknames */
  name: string;
  /** Role or job title */
  role: string;
  /** Path to avatar image */
  avatar: string;
  /** Email address */
  email: string;
  /** IANA time zone location */
  location: IANATimeZone;
  /** Languages spoken with proficiency levels (0-100) */
  languages?: Array<{
    /** Language name */
    name: string;
    /** Proficiency level (0-100) */
    proficiency: number;
  }>;
};

/**
 * Newsletter Section
 * @description The below information will be displayed on the Home page in Newsletter block
 */
export type Newsletter = {
  /** Whether to display the newsletter section */
  display: boolean;
  /** Title of the newsletter   */
  title: React.ReactNode;
  /** Description of the newsletter */
  description: React.ReactNode;
};

/**
 * Social link configuration.
 */
export type Social = Array<{
  /** Name of the social platform */
  name: string;
  /** Icon for the social platform
   * The icons are a part of "src/resources/icons.ts" file.
   * If you need a different icon, import it there and reference it everywhere else
   */
  icon: IconName;
  /**
   * The link to the social platform
   *
   * The link is not validated by code, make sure it's correct
   */
  link: string;
  /** Whether this social link is essential and should be displayed on the about page */
  essential?: boolean;
}>;

/**
 * Base interface for page configuration with common properties.
 */
export interface BasePageConfig {
  /** Path to the page
   *
   * The path should be relative to the public directory
   */
  path: `/${string}` | string;
  /** Label for navigation or display */
  label: string;
  /** Title of the page */
  title: string;
  /** Description for SEO and metadata */
  description: string;
  /** OG Image should be put inside `public/images` folder */
  image?: `/images/${string}` | string;
}

/**
 * Home page configuration.
 */
export interface Home extends BasePageConfig {
  /** The image to be displayed in metadata
   *
   * The image needs to be put inside `/public/images/` directory
   */
  image: `/images/${string}` | string;
  /** The headline of the home page */
  headline: React.ReactNode;
  /** Featured badge, which appears above the headline */
  featured: {
    display: boolean;
    title: React.ReactNode;
    href: string;
  };
  /** The sub text which appears below the headline */
  subline: React.ReactNode;
}

/**
 * About page configuration.
 * @description Configuration for the About page, including sections for table of contents, avatar, calendar, introduction, work experience, studies, and technical skills.
 */
export interface About extends BasePageConfig {
  /** Table of contents configuration */
  tableOfContent: {
    /** Whether to display the table of contents */
    display: boolean;
    /** Whether to show sub-items in the table of contents */
    subItems: boolean;
  };
  /** Avatar section configuration */
  avatar: {
    /** Whether to display the avatar */
    display: boolean;
  };
  /** Calendar section configuration */
  calendar: {
    /** Whether to display the calendar */
    display: boolean;
    /** Link to the calendar */
    link: string;
  };
  /** Introduction section */
  intro: {
    /** Whether to display the introduction */
    display: boolean;
    /** Title of the introduction section */
    title: string;
    /** Description of the introduction section */
    description: React.ReactNode;
  };
  /** Work experience section */
  work: {
    /** Whether to display work experience */
    display: boolean;
    /** Title for the work experience section */
    title: string;
    /** List of work experiences */
    experiences: Array<{
      /** Company name */
      company: string;
      /** Timeframe of employment */
      timeframe: string;
      /** Role or job title */
      role: string;
      /** Achievements at the company */
      achievements: React.ReactNode[];
      /** Images related to the experience */
      images?: Array<{
        /** Image source path */
        src: string;
        /** Image alt text */
        alt: string;
        /** Image width ratio */
        width: number;
        /** Image height ratio */
        height: number;
      }>;
    }>;
  };
  /** Philosophy section */
  philosophy: {
    /** Whether to display philosophy section */
    display: boolean;
    /** Title for the philosophy section */
    title: string;
    /** List of philosophy principles */
    principles: Array<{
      /** Principle icon or emoji */
      icon: string;
      /** Principle title */
      title: string;
      /** Principle description */
      description: React.ReactNode;
    }>;
  };
  /** Studies/education section */
  studies: {
    /** Whether to display studies section */
    display: boolean;
    /** Title for the studies section */
    title: string;
    /** List of institutions attended */
    institutions: Array<{
      /** Institution name */
      name: string;
      /** Description of studies */
      description: React.ReactNode;
    }>;
  };
  /** Technical skills section */
  technical: {
    /** Whether to display technical skills section */
    display: boolean;
    /** Title for the technical skills section */
    title: string;
    /** List of technical skills */
    skills: Array<{
      /** Skill title */
      title: string;
      /** Skill description */
      description?: React.ReactNode;
      /** Skill tags */
      tags?: Array<{
        name: string;
        icon?: string;
      }>;
      /** Images related to the skill */
      images?: Array<{
        /** Image source path */
        src: string;
        /** Image alt text */
        alt: string;
        /** Image width ratio */
        width: number;
        /** Image height ratio */
        height: number;
      }>;
    }>;
  };
}

/**
 * Blog page configuration.
 * @description Configuration for the Blog page, including metadata and navigation label.
 */
export interface Blog extends BasePageConfig {}

/**
 * Work/projects page configuration.
 * @description Configuration for the Work/Projects page, including metadata and navigation label.
 */
export interface Work extends BasePageConfig {}

/**
 * Gallery page configuration.
 * @description Configuration for the Gallery page, including metadata, navigation label, and image list.
 */
export interface Gallery extends BasePageConfig {
  /** List of images in the gallery */
  images: Array<{
    /** Image source path */
    src: string;
    /** Image alt text */
    alt: string;
    /** Image orientation (horizontal/vertical) */
    orientation: string;
  }>;
}

/**
 * Services page configuration.
 * @description Configuration for the Services page, including hero, process steps, service offerings, and examples.
 */
export interface Services extends BasePageConfig {
  /** Hero section */
  hero: {
    /** Main headline */
    headline: React.ReactNode;
    /** Subheadline */
    subline: React.ReactNode;
  };
  /** Process section */
  process: {
    /** Whether to display the process section */
    display: boolean;
    /** Section title */
    title: string;
    /** Process steps */
    steps: Array<{
      /** Step number */
      number: number;
      /** Step title */
      title: string;
      /** Step description */
      description: React.ReactNode;
      /** Step icon or emoji */
      icon: string;
    }>;
  };
  /** Service offerings section */
  offerings: {
    /** Whether to display offerings */
    display: boolean;
    /** Section title */
    title: string;
    /** List of services */
    services: Array<{
      /** Service title */
      title: string;
      /** Service description */
      description: React.ReactNode;
      /** Service icon or emoji */
      icon: string;
      /** Technology tags */
      tags?: string[];
      /** Example use cases */
      examples?: string[];
    }>;
  };
  /** Example projects section */
  examples: {
    /** Whether to display examples */
    display: boolean;
    /** Section title */
    title: string;
    /** Section subtitle */
    subtitle?: React.ReactNode;
  };
}

/**
 * Pricing page configuration.
 * @description Configuration for the Pricing page, including story points, retainers, example projects, and blueprint sessions.
 */
export interface Pricing extends BasePageConfig {
  /** Hero section */
  hero: {
    /** Main headline */
    headline: React.ReactNode;
    /** Subheadline */
    subline: React.ReactNode;
  };
  /** Story points pricing section */
  storyPoints: {
    /** Whether to display story points */
    display: boolean;
    /** Section title */
    title: string;
    /** Section description */
    description: React.ReactNode;
    /** Pricing tiers */
    tiers: Array<{
      /** Story point range (e.g., "1-50 SP") */
      range: string;
      /** Rate per story point */
      ratePerSP: number;
      /** Tier description */
      description?: string;
    }>;
  };
  /** Retainer packages section */
  retainers: {
    /** Whether to display retainers */
    display: boolean;
    /** Section title */
    title: string;
    /** Section description */
    description?: React.ReactNode;
    /** Retainer packages */
    packages: Array<{
      /** Package name */
      name: string;
      /** Hours per month */
      hours: number;
      /** Rate per hour */
      ratePerHour: number;
      /** Package features */
      features: string[];
      /** Whether this is the recommended package */
      recommended?: boolean;
    }>;
  };
  /** Example projects section */
  exampleProjects: {
    /** Whether to display example projects */
    display: boolean;
    /** Section title */
    title: string;
    /** List of example projects */
    projects: Array<{
      /** Project name */
      name: string;
      /** Project description */
      description: React.ReactNode;
      /** Story points range */
      storyPoints: string;
      /** Price range */
      priceRange: string;
      /** List of deliverables */
      deliverables: string[];
    }>;
  };
  /** Blueprint sessions section */
  blueprintSessions: {
    /** Whether to display blueprint sessions */
    display: boolean;
    /** Section title */
    title: string;
    /** Section description */
    description: React.ReactNode;
    /** Session duration */
    duration: string;
    /** Session price */
    price: string;
  };
}

/**
 * Testimonial configuration.
 * @description Configuration for client testimonials and social proof.
 */
export interface Testimonials {
  /** Whether to display testimonials */
  display: boolean;
  /** Section title */
  title: string;
  /** Overall rating (e.g., 4.80) */
  overallRating: number;
  /** Total number of reviews */
  totalReviews: number;
  /** List of testimonials */
  items: Array<{
    /** Client name */
    name: string;
    /** Client role/position */
    role?: string;
    /** Client company */
    company?: string;
    /** Avatar image path */
    avatar?: string;
    /** Testimonial content */
    content: string;
    /** Rating (1-5) */
    rating: number;
  }>;
}
