/* eslint-disable no-console */
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testimonials = [
  {
    name: "David Chen",
    role: "CEO",
    company: "TradeFlex Imports",
    content:
      "Boko transformed our chaotic operations into a streamlined ERP system. What used to take hours now takes minutes. The ROI was visible within the first month.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Founder",
    company: "GlowBook Studios",
    content:
      "The booking platform Boko built exceeded all expectations. Our clients love the seamless experience, and our no-show rate dropped by 60%.",
    rating: 5,
  },
  {
    name: "Michael Okonkwo",
    role: "Operations Director",
    company: "LogiCore Solutions",
    content:
      "Working with Boko was refreshingly straightforward. Clear communication, transparent pricing, and delivered exactly what was promised. Rare in this industry.",
    rating: 5,
  },
  {
    name: "Jennifer Park",
    role: "Marketing Director",
    company: "Bloom Agency",
    content:
      "The CRM automation Boko set up saves our team 20+ hours per week. Lead nurturing that used to fall through the cracks is now completely automated.",
    rating: 5,
  },
  {
    name: "Thomas Adebayo",
    role: "Founder",
    company: "QuickServe Logistics",
    content:
      "From messy spreadsheets to a custom dashboard that shows everything in real-time. Boko understood our problems before we finished explaining them.",
    rating: 4,
  },
  {
    name: "Amanda Foster",
    role: "COO",
    company: "HealthBridge Clinics",
    content:
      "The document processing AI Boko implemented cut our intake time by 70%. Patients are happier, staff is happier, everyone wins.",
    rating: 5,
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function migrate() {
  for (const testimonial of testimonials) {
    const payload = {
      slug: slugify(testimonial.name),
      name: testimonial.name,
      role: testimonial.role || null,
      company: testimonial.company || null,
      content: testimonial.content,
      rating: testimonial.rating || 5,
      avatar: null,
    };

    const { error } = await supabase.from("reviews").upsert(payload, { onConflict: "slug" });

    if (error) {
      console.error(`Failed to import ${payload.slug}: ${error.message}`);
    } else {
      console.log(`Imported ${payload.slug}`);
    }
  }

  console.log("Review migration complete.");
}

migrate();
