/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
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

const projectsDir = path.join(__dirname, "..", "src", "app", "work", "projects");

const DEFAULT_TEAM = [
  {
    name: "Boko Isaac",
    role: "Systems Architect & Automation Engineer",
    avatar: "/images/boko-avatar-new.png",
    linkedIn: "https://www.linkedin.com/in/boko-isaac/",
  },
];

async function migrate() {
  if (!fs.existsSync(projectsDir)) {
    console.error(`Projects directory not found at ${projectsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(projectsDir).filter((file) => file.endsWith(".mdx"));

  if (files.length === 0) {
    console.log("No project files found to migrate.");
    return;
  }

  for (const file of files) {
    const filePath = path.join(projectsDir, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);
    const slug = path.basename(file, path.extname(file));

    const payload = {
      slug,
      title: data.title || slug,
      summary: data.summary || "",
      content,
      images: (data.images || []).filter(Boolean),
      published_at: data.publishedAt || null,
      link: data.link || null,
      team: data.team?.length ? data.team : DEFAULT_TEAM,
      image: data.image || (data.images && data.images[0]) || null,
    };

    const { error } = await supabase.from("projects").upsert(payload, { onConflict: "slug" });

    if (error) {
      console.error(`Failed to import ${slug}: ${error.message}`);
    } else {
      console.log(`Imported ${slug}`);
    }
  }

  console.log("Migration complete.");
}

migrate();
