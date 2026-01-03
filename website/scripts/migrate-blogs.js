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

const blogsDir = path.join(__dirname, "..", "src", "app", "blog", "posts");

async function migrate() {
  if (!fs.existsSync(blogsDir)) {
    console.error(`Blog posts directory not found at ${blogsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(blogsDir).filter((file) => file.endsWith(".mdx"));

  if (files.length === 0) {
    console.log("No blog files found to migrate.");
    return;
  }

  for (const file of files) {
    const filePath = path.join(blogsDir, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);
    const slug = path.basename(file, path.extname(file));

    const payload = {
      slug,
      title: data.title || slug,
      subtitle: data.subtitle || null,
      summary: data.summary || "",
      content,
      image: data.image || null,
      published_at: data.publishedAt || null,
      tag: data.tag || null,
    };

    const { error } = await supabase.from("blogs").upsert(payload, { onConflict: "slug" });

    if (error) {
      console.error(`Failed to import ${slug}: ${error.message}`);
    } else {
      console.log(`Imported ${slug}`);
    }
  }

  console.log("Blog migration complete.");
}

migrate();
