"use client";

import { useState, useEffect, useRef } from "react";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  Spinner,
  Icon,
  Media,
  ToggleButton,
} from "@once-ui-system/core";

type ContentType = "projects" | "blogs" | "reviews";

interface Review {
  slug: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
}

interface Project {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  images: string[];
  content: string;
}

interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tag?: string;
  content: string;
}

interface UploadedImage {
  name: string;
  path: string;
}

export default function ModifyPage() {
  const [contentType, setContentType] = useState<ContentType>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "edit" | "new">("list");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const [availableImages, setAvailableImages] = useState<UploadedImage[]>([]);
  const [showImagePicker, setShowImagePicker] = useState<number | null>(null);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const blogFileInputRef = useRef<HTMLInputElement>(null);
  const [showBlogImagePicker, setShowBlogImagePicker] = useState(false);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    slug: "",
    title: "",
    publishedAt: "",
    summary: "",
    images: ["", ""],
    content: "",
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    slug: "",
    title: "",
    subtitle: "",
    summary: "",
    image: "",
    publishedAt: "",
    tag: "",
    content: "",
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    slug: "",
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatar: "",
  });

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // spaces -> hyphen
      .replace(/[^a-z0-9-]/g, "") // drop other symbols
      .replace(/-+/g, "-") // collapse multiple hyphens
      .replace(/^-+|-+$/g, ""); // trim hyphens from ends

  const autoSetSlug = (value: string, type: ContentType) => {
    const nextSlug = slugify(value);
    if (type === "projects") {
      setProjectForm((prev) => {
        const shouldUpdate = !prev.slug || prev.slug === slugify(prev.title);
        return shouldUpdate ? { ...prev, slug: nextSlug } : prev;
      });
    } else if (type === "blogs") {
      setBlogForm((prev) => {
        const shouldUpdate = !prev.slug || prev.slug === slugify(prev.title);
        return shouldUpdate ? { ...prev, slug: nextSlug } : prev;
      });
    } else {
      setReviewForm((prev) => {
        const shouldUpdate = !prev.slug || prev.slug === slugify(prev.name);
        return shouldUpdate ? { ...prev, slug: nextSlug } : prev;
      });
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchBlogs(), fetchReviews(), fetchImages()]);
      setLoading(false);
    };
    load();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/modify/projects", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
        setMessage(null);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/modify/blogs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs);
        setMessage(null);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/modify/reviews", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setMessage(null);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/modify/upload", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAvailableImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const resetMessages = () => setMessage(null);

  const handleSwitchType = (type: ContentType) => {
    setContentType(type);
    setView("list");
    setCurrentProject(null);
    setCurrentBlog(null);
    setCurrentReview(null);
    resetMessages();
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentBlog(null);
    setProjectForm({
      slug: project.slug,
      title: project.title,
      publishedAt: project.publishedAt,
      summary: project.summary,
      images: project.images.length >= 2 ? project.images : [...project.images, "", ""].slice(0, 2),
      content: project.content,
    });
    setView("edit");
    resetMessages();
  };

  const handleEditBlog = (blog: BlogPost) => {
    setCurrentBlog(blog);
    setCurrentProject(null);
    setCurrentReview(null);
    setBlogForm({
      slug: blog.slug,
      title: blog.title,
      subtitle: blog.subtitle || "",
      summary: blog.summary,
      image: blog.image || "",
      publishedAt: blog.publishedAt,
      tag: blog.tag || "",
      content: blog.content,
    });
    setView("edit");
    resetMessages();
  };

  const handleEditReview = (review: Review) => {
    setCurrentReview(review);
    setCurrentBlog(null);
    setCurrentProject(null);
    setReviewForm({
      slug: review.slug,
      name: review.name,
      role: review.role || "",
      company: review.company || "",
      content: review.content,
      rating: review.rating,
      avatar: review.avatar || "",
    });
    setView("edit");
    resetMessages();
  };

  const handleNew = () => {
    setCurrentProject(null);
    setCurrentBlog(null);
    setCurrentReview(null);
    if (contentType === "projects") {
      setProjectForm({
        slug: "",
        title: "",
        publishedAt: new Date().toISOString().split("T")[0],
        summary: "",
        images: ["", ""],
        content: "",
      });
    } else {
      if (contentType === "blogs") {
        setBlogForm({
          slug: "",
          title: "",
          subtitle: "",
          summary: "",
          image: "",
          publishedAt: new Date().toISOString().split("T")[0],
          tag: "",
          content: "",
        });
      } else {
        setReviewForm({
          slug: "",
          name: "",
          role: "",
          company: "",
          content: "",
          rating: 5,
          avatar: "",
        });
      }
    }
    setView("new");
    resetMessages();
  };

  const handleSave = async () => {
    setSaving(true);
    resetMessages();

    try {
      if (contentType === "projects") {
        const endpoint =
          view === "new" ? "/api/modify/projects" : `/api/modify/projects/${currentProject?.slug}`;
        const method = view === "new" ? "POST" : "PUT";

        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectForm),
        });

        if (res.ok) {
          setMessage({
            type: "success",
            text: view === "new" ? "Project created successfully!" : "Project updated successfully!",
          });
          await fetchProjects();
          setView("list");
        } else {
          const data = await res.json();
          setMessage({ type: "error", text: data.error || "Failed to save project" });
        }
      } else if (contentType === "blogs") {
        const endpoint =
          view === "new" ? "/api/modify/blogs" : `/api/modify/blogs/${currentBlog?.slug}`;
        const method = view === "new" ? "POST" : "PUT";

        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogForm),
        });

        if (res.ok) {
          setMessage({
            type: "success",
            text: view === "new" ? "Blog post created successfully!" : "Blog post updated successfully!",
          });
          await fetchBlogs();
          setView("list");
        } else {
          const data = await res.json();
          setMessage({ type: "error", text: data.error || "Failed to save blog post" });
        }
      } else {
        const endpoint =
          view === "new" ? "/api/modify/reviews" : `/api/modify/reviews/${currentReview?.slug}`;
        const method = view === "new" ? "POST" : "PUT";

        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...reviewForm, rating: Number(reviewForm.rating) || 0 }),
        });

        if (res.ok) {
          setMessage({
            type: "success",
            text: view === "new" ? "Review created successfully!" : "Review updated successfully!",
          });
          await fetchReviews();
          setView("list");
        } else {
          const data = await res.json();
          setMessage({ type: "error", text: data.error || "Failed to save review" });
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save changes" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!slug) {
      setMessage({ type: "error", text: "Cannot delete item: missing slug" });
      return;
    }

    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const endpoint =
        contentType === "projects"
          ? `/api/modify/projects/${slug}`
          : contentType === "blogs"
            ? `/api/modify/blogs/${slug}`
            : `/api/modify/reviews/${slug}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        cache: "no-store",
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Deleted successfully!" });
      } else {
        const data = await res.json();
        const text = data.error || "Failed to delete";
        setMessage({ type: res.status === 404 ? "success" : "error", text });
      }

      // Always refresh the list after a delete attempt
      if (contentType === "projects") {
        await fetchProjects();
      } else if (contentType === "blogs") {
        await fetchBlogs();
      } else {
        await fetchReviews();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete item" });
      if (contentType === "projects") {
        await fetchProjects();
      } else if (contentType === "blogs") {
        await fetchBlogs();
      } else {
        await fetchReviews();
      }
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...projectForm.images];
    newImages[index] = value;
    setProjectForm({ ...projectForm, images: newImages });
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploading(index);
    resetMessages();

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/modify/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        handleImageChange(index, data.path);
        await fetchImages();
        setMessage({ type: "success", text: "Image uploaded successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to upload image" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to upload image" });
    } finally {
      setUploading(null);
    }
  };

  const handleSelectExistingImage = (index: number, path: string) => {
    handleImageChange(index, path);
    setShowImagePicker(null);
  };

  const handleSelectExistingBlogImage = (path: string) => {
    setBlogForm((prev) => ({ ...prev, image: path }));
    setShowBlogImagePicker(false);
  };

  const handleBlogFileUpload = async (file: File) => {
    setUploading(0);
    resetMessages();

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/modify/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setBlogForm((prev) => ({ ...prev, image: data.path }));
        await fetchImages();
        setMessage({ type: "success", text: "Image uploaded successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to upload image" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to upload image" });
    } finally {
      setUploading(null);
    }
  };

  const items = contentType === "projects" ? projects : contentType === "blogs" ? blogs : reviews;

  if (loading) {
    return (
      <Column fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Column>
    );
  }

  // List View
  if (view === "list") {
    return (
      <Column maxWidth="l" fillWidth gap="l" paddingY="xl">
        <Row fillWidth horizontal="between" vertical="center">
          <Column gap="4">
            <Heading variant="display-strong-l">
              Manage{" "}
              {contentType === "projects"
                ? "Projects"
                : contentType === "blogs"
                  ? "Blog Posts"
                  : "Reviews"}
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {contentType === "projects"
                ? "Add, edit, or delete your portfolio projects"
                : contentType === "blogs"
                  ? "Add, edit, or delete your blog posts"
                  : "Add, edit, or delete your testimonials"}
            </Text>
          </Column>
          <Row gap="8">
            <ToggleButton
              label="Projects"
              value="projects"
              selected={contentType === "projects"}
              onClick={() => handleSwitchType("projects")}
            />
            <ToggleButton
              label="Blog"
              value="blogs"
              selected={contentType === "blogs"}
              onClick={() => handleSwitchType("blogs")}
            />
            <ToggleButton
              label="Reviews"
              value="reviews"
              selected={contentType === "reviews"}
              onClick={() => handleSwitchType("reviews")}
            />
            <Button onClick={handleNew} prefixIcon="plus">
              Add {contentType === "projects" ? "Project" : contentType === "blogs" ? "Post" : "Review"}
            </Button>
          </Row>
        </Row>

        {message && (
          <Row
            fillWidth
            padding="16"
            radius="m"
            background={message.type === "success" ? "success-weak" : "danger-weak"}
            border={message.type === "success" ? "success-medium" : "danger-medium"}
          >
            <Text onBackground={message.type === "success" ? "success-strong" : "danger-strong"}>
              {message.text}
            </Text>
          </Row>
        )}

        <Column fillWidth gap="12">
          {items.map((item) => {
            const isProjectItem = contentType === "projects";
            const isBlogItem = contentType === "blogs";
            const reviewItem = item as Review;
            const title = isProjectItem
              ? (item as Project).title
              : isBlogItem
                ? (item as BlogPost).title
                : reviewItem.name;
            const summary = isProjectItem
              ? (item as Project).summary
              : isBlogItem
                ? (item as BlogPost).summary
                : reviewItem.content;
            const meta = isProjectItem || isBlogItem
              ? `Published: ${(item as Project | BlogPost).publishedAt}`
              : `Rating: ${reviewItem.rating}/5${reviewItem.company ? ` · ${reviewItem.company}` : ""}`;

            return (
              <Row
                key={item.slug}
                fillWidth
                padding="20"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                horizontal="between"
                vertical="center"
                gap="16"
              >
                <Column gap="4" style={{ flex: 1 }}>
                  <Text variant="heading-strong-m">{title}</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {summary && summary.length > 100 ? summary.substring(0, 100) + "..." : summary}
                  </Text>
                  <Text variant="label-default-xs" onBackground="neutral-weak">
                    {meta}
                  </Text>
                </Column>
                <Row gap="8">
                  <Button
                    variant="secondary"
                    size="s"
                    prefixIcon="edit"
                    onClick={() =>
                      contentType === "projects"
                        ? handleEditProject(item as Project)
                        : contentType === "blogs"
                          ? handleEditBlog(item as BlogPost)
                          : handleEditReview(item as Review)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="s"
                    prefixIcon="trash"
                    onClick={() => handleDelete(item.slug)}
                  >
                    Delete
                  </Button>
                </Row>
              </Row>
            );
          })}

          {items.length === 0 && (
            <Column fillWidth padding="40" horizontal="center" align="center" gap="16">
              <Icon name="folder" size="xl" onBackground="neutral-weak" />
              <Text variant="body-default-m" onBackground="neutral-weak">
                No{" "}
                {contentType === "projects"
                  ? "projects"
                  : contentType === "blogs"
                    ? "blog posts"
                    : "reviews"}{" "}
                yet. Create your first one!
              </Text>
            </Column>
          )}
        </Column>
      </Column>
    );
  }

  // Edit/New View
  const isProject = contentType === "projects";
  const isBlog = contentType === "blogs";
  const isReview = contentType === "reviews";

  return (
    <Column maxWidth="l" fillWidth gap="l" paddingY="xl">
      <Row fillWidth horizontal="between" vertical="center">
        <Column gap="4">
          <Heading variant="display-strong-l">
            {view === "new"
              ? `Add New ${isProject ? "Project" : isBlog ? "Blog Post" : "Review"}`
              : `Edit ${isProject ? "Project" : isBlog ? "Blog Post" : "Review"}`}
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            {view === "new"
              ? `Fill in the details for your new ${isProject ? "project" : isBlog ? "post" : "review"}`
              : `Editing: ${
                  isProject
                    ? currentProject?.title
                    : isBlog
                      ? currentBlog?.title
                      : currentReview?.name
                }`}
          </Text>
        </Column>
        <Row gap="8">
          <ToggleButton
            label="Projects"
            value="projects"
            selected={contentType === "projects"}
            onClick={() => handleSwitchType("projects")}
          />
          <ToggleButton
            label="Blog"
            value="blogs"
            selected={contentType === "blogs"}
            onClick={() => handleSwitchType("blogs")}
          />
          <ToggleButton
            label="Reviews"
            value="reviews"
            selected={contentType === "reviews"}
            onClick={() => handleSwitchType("reviews")}
          />
          <Button onClick={() => setView("list")} variant="secondary" prefixIcon="arrowLeft">
            Back to List
          </Button>
        </Row>
      </Row>

      {message && (
        <Row
          fillWidth
          padding="16"
          radius="m"
          background={message.type === "success" ? "success-weak" : "danger-weak"}
          border={message.type === "success" ? "success-medium" : "danger-medium"}
        >
          <Text onBackground={message.type === "success" ? "success-strong" : "danger-strong"}>
            {message.text}
          </Text>
        </Row>
      )}

      <Column fillWidth gap="24" padding="24" radius="l" border="neutral-alpha-weak" background="surface">
        {view === "new" && (
          <Input
            id="slug"
            label="URL Slug"
            value={isProject ? projectForm.slug : isBlog ? blogForm.slug : reviewForm.slug}
            onChange={(e) => {
              const value = slugify(e.target.value);
              if (isProject) {
                setProjectForm({ ...projectForm, slug: value });
              } else if (isBlog) {
                setBlogForm({ ...blogForm, slug: value });
              } else {
                setReviewForm((prev) => ({ ...prev, slug: value || prev.slug }));
              }
            }}
            description={`This will be the URL path for your ${isProject ? "project" : isBlog ? "post" : "review"} (e.g., my-awesome-${isProject ? "project" : isBlog ? "post" : "review"})`}
          />
        )}

        {isReview ? (
          <>
            <Input
              id="name"
              label="Name"
              value={reviewForm.name}
              onChange={(e) => {
                const value = e.target.value;
                setReviewForm((prev) => ({
                  ...prev,
                  name: value,
                  slug:
                    view === "new" && (!prev.slug || prev.slug === slugify(prev.name))
                      ? slugify(value)
                      : prev.slug,
                }));
                autoSetSlug(value, "reviews");
              }}
              description="Client or reviewer name"
            />
            <Input
              id="role"
              label="Role"
              value={reviewForm.role}
              onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
              description="Optional role/title"
            />
            <Input
              id="company"
              label="Company"
              value={reviewForm.company}
              onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
              description="Optional company or organization"
            />
            <Input
              id="avatar"
              label="Avatar (optional)"
              value={reviewForm.avatar}
              onChange={(e) => setReviewForm({ ...reviewForm, avatar: e.target.value })}
              description="Optional avatar image path or URL"
            />
            <Input
              id="rating"
              type="number"
              min={1}
              max={5}
              label="Rating"
              value={String(reviewForm.rating)}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) || 0 })}
              description="Star rating from 1-5"
            />
            <Textarea
              id="content"
              label="Review"
              value={reviewForm.content}
              onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
              description="Quote to display on the testimonials carousel"
              lines={10}
            />
          </>
        ) : (
          <>
            <Input
              id="title"
              label={isProject ? "Project Title" : "Post Title"}
              value={isProject ? projectForm.title : blogForm.title}
              onChange={(e) => {
                const value = e.target.value;
                if (isProject) {
                  setProjectForm({ ...projectForm, title: value });
                  autoSetSlug(value, "projects");
                } else {
                  setBlogForm({ ...blogForm, title: value });
                  autoSetSlug(value, "blogs");
                }
              }}
              description={isProject ? "The main title displayed on the project page" : "The main title displayed on the blog post"}
            />

            {!isProject && (
              <Input
                id="subtitle"
                label="Subtitle"
                value={blogForm.subtitle}
                onChange={(e) => setBlogForm({ ...blogForm, subtitle: e.target.value })}
                description="Optional subtitle for the blog post"
              />
            )}

            <Input
              id="publishedAt"
              label="Publication Date"
              type="date"
              value={isProject ? projectForm.publishedAt : blogForm.publishedAt}
              onChange={(e) =>
                isProject
                  ? setProjectForm({ ...projectForm, publishedAt: e.target.value })
                  : setBlogForm({ ...blogForm, publishedAt: e.target.value })
              }
              description="When this content was published"
            />

            <Textarea
              id="summary"
              label={isProject ? "Project Summary" : "Post Summary"}
              value={isProject ? projectForm.summary : blogForm.summary}
              onChange={(e) =>
                isProject
                  ? setProjectForm({ ...projectForm, summary: e.target.value })
                  : setBlogForm({ ...blogForm, summary: e.target.value })
              }
              description={isProject ? "Shown on the work listing page (1-2 sentences)" : "Shown on the blog listing page (1-2 sentences)"}
              lines={3}
            />

            {!isProject && (
              <>
                <Input
                  id="image"
                  label="Cover Image"
                  value={blogForm.image}
                  onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                  description="Main image shown on the blog card"
                />
                <Row gap="8" vertical="center">
                  <input
                    type="file"
                    ref={blogFileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleBlogFileUpload(file);
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="s"
                    onClick={() => blogFileInputRef.current?.click()}
                    disabled={uploading !== null}
                  >
                    {uploading !== null ? "Uploading..." : "Upload Cover"}
                  </Button>
                  <Button
                    variant="tertiary"
                    size="s"
                    onClick={() => setShowBlogImagePicker(!showBlogImagePicker)}
                  >
                    Browse Library
                  </Button>
                </Row>
                {blogForm.image && (
                  <Row padding="8" radius="m" border="neutral-alpha-weak" style={{ width: "200px", height: "120px", overflow: "hidden" }}>
                    <Media src={blogForm.image} alt="Cover preview" aspectRatio="16/9" radius="s" />
                  </Row>
                )}
                {showBlogImagePicker && (
                  <Column
                    gap="8"
                    padding="16"
                    radius="m"
                    border="neutral-alpha-weak"
                    background="page"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      Select from uploaded images:
                    </Text>
                    <Row gap="8" wrap>
                      {availableImages.map((img) => (
                        <Column
                          key={img.path}
                          gap="4"
                          padding="8"
                          radius="s"
                          border="neutral-alpha-weak"
                          style={{ cursor: "pointer", width: "100px" }}
                          onClick={() => handleSelectExistingBlogImage(img.path)}
                        >
                          <Row style={{ width: "84px", height: "60px", overflow: "hidden" }} radius="s">
                            <Media src={img.path} alt={img.name} aspectRatio="16/9" radius="s" />
                          </Row>
                          <Text variant="label-default-xs" style={{ fontSize: "10px", wordBreak: "break-all" }}>
                            {img.name.length > 15 ? img.name.substring(0, 12) + "..." : img.name}
                          </Text>
                        </Column>
                      ))}
                      {availableImages.length === 0 && (
                        <Text variant="body-default-s" onBackground="neutral-weak">
                          No images uploaded yet. Use the Upload button above.
                        </Text>
                      )}
                    </Row>
                  </Column>
                )}
                <Input
                  id="tag"
                  label="Tag"
                  value={blogForm.tag}
                  onChange={(e) => setBlogForm({ ...blogForm, tag: e.target.value })}
                  description="Optional tag/category"
                />
              </>
            )}

            {isProject && (
              <Column gap="16">
                <Column gap="4">
                  <Text variant="heading-strong-s">Project Images</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Upload or select images to showcase your project
                  </Text>
                </Column>

                {[0, 1].map((index) => (
                  <Column key={index} gap="8">
                    <Row gap="8" vertical="center" fillWidth>
                      <Column style={{ flex: 1 }}>
                        <Input
                          id={`image${index + 1}`}
                          label={index === 0 ? "Cover Image" : "Secondary Image"}
                          value={projectForm.images[index]}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          description={index === 0 ? "Main image shown on the project card" : "Additional image for the project gallery"}
                        />
                      </Column>
                      <input
                        type="file"
                        ref={fileInputRefs[index]}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(index, file);
                        }}
                      />
                      <Button
                        variant="secondary"
                        size="s"
                        onClick={() => fileInputRefs[index].current?.click()}
                        disabled={uploading === index}
                      >
                        {uploading === index ? "Uploading..." : "Upload New"}
                      </Button>
                      <Button
                        variant="tertiary"
                        size="s"
                        onClick={() => setShowImagePicker(showImagePicker === index ? null : index)}
                      >
                        Browse Library
                      </Button>
                    </Row>

                    {projectForm.images[index] && (
                      <Row padding="8" radius="m" border="neutral-alpha-weak" style={{ width: "200px", height: "120px", overflow: "hidden" }}>
                        <Media
                          src={projectForm.images[index]}
                          alt={`Preview ${index + 1}`}
                          aspectRatio="16/9"
                          radius="s"
                        />
                      </Row>
                    )}

                    {showImagePicker === index && (
                      <Column
                        gap="8"
                        padding="16"
                        radius="m"
                        border="neutral-alpha-weak"
                        background="page"
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                      >
                        <Text variant="label-default-s" onBackground="neutral-weak">
                          Select from uploaded images:
                        </Text>
                        <Row gap="8" wrap>
                          {availableImages.map((img) => (
                            <Column
                              key={img.path}
                              gap="4"
                              padding="8"
                              radius="s"
                              border="neutral-alpha-weak"
                              style={{ cursor: "pointer", width: "100px" }}
                              onClick={() => handleSelectExistingImage(index, img.path)}
                            >
                              <Row style={{ width: "84px", height: "60px", overflow: "hidden" }} radius="s">
                                <Media
                                  src={img.path}
                                  alt={img.name}
                                  aspectRatio="16/9"
                                  radius="s"
                                />
                              </Row>
                              <Text variant="label-default-xs" style={{ fontSize: "10px", wordBreak: "break-all" }}>
                                {img.name.length > 15 ? img.name.substring(0, 12) + "..." : img.name}
                              </Text>
                            </Column>
                          ))}
                          {availableImages.length === 0 && (
                            <Text variant="body-default-s" onBackground="neutral-weak">
                              No images uploaded yet. Use the Upload button above.
                            </Text>
                          )}
                        </Row>
                      </Column>
                    )}
                  </Column>
                ))}
              </Column>
            )}

            <Textarea
              id="content"
              label={isProject ? "Project Content" : "Post Content"}
              value={isProject ? projectForm.content : blogForm.content}
              onChange={(e) =>
                isProject
                  ? setProjectForm({ ...projectForm, content: e.target.value })
                  : setBlogForm({ ...blogForm, content: e.target.value })
              }
              description={
                isProject
                  ? "Detailed project description using Markdown formatting. Include sections like Overview, Challenge, Solution, Results, etc."
                  : "Blog post body (Markdown/MDX supported)."
              }
              lines={20}
            />
          </>
        )}
      </Column>

      <Row fillWidth horizontal="end" gap="12">
        <Button onClick={() => setView("list")} variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : view === "new" ? `Create ${isProject ? "Project" : "Post"}` : "Save Changes"}
        </Button>
      </Row>
    </Column>
  );
}
