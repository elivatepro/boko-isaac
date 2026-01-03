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
  IconButton,
  Media,
} from "@once-ui-system/core";

interface Project {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  images: string[];
  content: string;
}

interface UploadedImage {
  name: string;
  path: string;
}

export default function ModifyPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "edit" | "new">("list");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const [availableImages, setAvailableImages] = useState<UploadedImage[]>([]);
  const [showImagePicker, setShowImagePicker] = useState<number | null>(null);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Form state
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    publishedAt: "",
    summary: "",
    images: ["", ""],
    content: "",
  });

  useEffect(() => {
    fetchProjects();
    fetchImages();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/modify/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/modify/upload");
      if (res.ok) {
        const data = await res.json();
        setAvailableImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      slug: project.slug,
      title: project.title,
      publishedAt: project.publishedAt,
      summary: project.summary,
      images: project.images.length >= 2 ? project.images : [...project.images, "", ""].slice(0, 2),
      content: project.content,
    });
    setView("edit");
    setMessage(null);
  };

  const handleNew = () => {
    setCurrentProject(null);
    setFormData({
      slug: "",
      title: "",
      publishedAt: new Date().toISOString().split("T")[0],
      summary: "",
      images: ["", ""],
      content: "",
    });
    setView("new");
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const endpoint = view === "new" ? "/api/modify/projects" : `/api/modify/projects/${currentProject?.slug}`;
      const method = view === "new" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: view === "new" ? "Project created successfully!" : "Project updated successfully!" });
        await fetchProjects();
        setTimeout(() => {
          setView("list");
          setMessage(null);
        }, 1500);
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to save project" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save project" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/modify/projects/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Project deleted successfully!" });
        await fetchProjects();
      } else {
        setMessage({ type: "error", text: "Failed to delete project" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete project" });
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploading(index);
    setMessage(null);

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
            <Heading variant="display-strong-l">Modify Portfolio</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Add, edit, or delete your projects
            </Text>
          </Column>
          <Button onClick={handleNew} prefixIcon="plus">
            New Project
          </Button>
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
          {projects.map((project) => (
            <Row
              key={project.slug}
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
                <Text variant="heading-strong-m">{project.title}</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {project.summary.substring(0, 100)}...
                </Text>
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  {project.publishedAt}
                </Text>
              </Column>
              <Row gap="8">
                <IconButton
                  icon="edit"
                  variant="secondary"
                  onClick={() => handleEdit(project)}
                  tooltip="Edit"
                />
                <IconButton
                  icon="trash"
                  variant="danger"
                  onClick={() => handleDelete(project.slug)}
                  tooltip="Delete"
                />
              </Row>
            </Row>
          ))}

          {projects.length === 0 && (
            <Column fillWidth padding="40" horizontal="center" align="center" gap="16">
              <Icon name="folder" size="xl" onBackground="neutral-weak" />
              <Text variant="body-default-m" onBackground="neutral-weak">
                No projects yet. Create your first one!
              </Text>
            </Column>
          )}
        </Column>
      </Column>
    );
  }

  // Edit/New View
  return (
    <Column maxWidth="l" fillWidth gap="l" paddingY="xl">
      <Row fillWidth horizontal="between" vertical="center">
        <Column gap="4">
          <Heading variant="display-strong-l">
            {view === "new" ? "New Project" : "Edit Project"}
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            {view === "new" ? "Create a new portfolio project" : `Editing: ${currentProject?.title}`}
          </Text>
        </Column>
        <Button onClick={() => setView("list")} variant="secondary" prefixIcon="arrowLeft">
          Back
        </Button>
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

      <Column fillWidth gap="20" padding="24" radius="l" border="neutral-alpha-weak" background="surface">
        {view === "new" && (
          <Input
            id="slug"
            label="Slug (URL path)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
            description="e.g., my-awesome-project"
          />
        )}

        <Input
          id="title"
          label="Project Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <Input
          id="publishedAt"
          label="Published Date"
          type="date"
          value={formData.publishedAt}
          onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
        />

        <Textarea
          id="summary"
          label="Summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          description="Brief description shown on the work page"
          lines={3}
        />

        <Column gap="16">
          <Text variant="label-default-s">Images</Text>

          {[0, 1].map((index) => (
            <Column key={index} gap="8">
              <Row gap="8" vertical="center" fillWidth>
                <Column style={{ flex: 1 }}>
                  <Input
                    id={`image${index + 1}`}
                    label={`Image ${index + 1} Path`}
                    value={formData.images[index]}
                    onChange={(e) => handleImageChange(index, e.target.value)}
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
                  {uploading === index ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  variant="tertiary"
                  size="s"
                  onClick={() => setShowImagePicker(showImagePicker === index ? null : index)}
                >
                  Browse
                </Button>
              </Row>

              {/* Image Preview */}
              {formData.images[index] && (
                <Row padding="8" radius="m" border="neutral-alpha-weak" style={{ width: "200px", height: "120px", overflow: "hidden" }}>
                  <Media
                    src={formData.images[index]}
                    alt={`Preview ${index + 1}`}
                    aspectRatio="16/9"
                    radius="s"
                  />
                </Row>
              )}

              {/* Image Picker */}
              {showImagePicker === index && (
                <Column
                  gap="8"
                  padding="16"
                  radius="m"
                  border="neutral-alpha-weak"
                  background="page"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <Text variant="label-default-xs" onBackground="neutral-weak">
                    Select an existing image:
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
                        No images uploaded yet
                      </Text>
                    )}
                  </Row>
                </Column>
              )}
            </Column>
          ))}
        </Column>

        <Textarea
          id="content"
          label="Content (Markdown)"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          description="Project details in Markdown format"
          lines={20}
        />
      </Column>

      <Row fillWidth horizontal="end" gap="12">
        <Button onClick={() => setView("list")} variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Project"}
        </Button>
      </Row>
    </Column>
  );
}
