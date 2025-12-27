"use client";

import { mailchimp } from "@/resources";
import { Button, Heading, Input, Text, Background, Column, Row, Textarea } from "@once-ui-system/core";
import { opacity, SpacingToken } from "@once-ui-system/core";
import { useState } from "react";

export const QuoteRequestForm: React.FC<React.ComponentProps<typeof Column>> = ({ ...flex }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectDescription: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    projectDescription: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    company: false,
    projectDescription: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const validateEmail = (email: string): boolean => {
    if (email === "") return false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "" ? "Name is required" : "",
      email: !validateEmail(formData.email) ? "Please enter a valid email address" : "",
      projectDescription: formData.projectDescription.trim() === "" ? "Please describe your project" : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (touched[field as keyof typeof touched]) {
      if (field === "email") {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) ? "" : "Please enter a valid email address" }));
      } else if (field === "name") {
        setErrors((prev) => ({ ...prev, name: value.trim() ? "" : "Name is required" }));
      } else if (field === "projectDescription") {
        setErrors((prev) => ({ ...prev, projectDescription: value.trim() ? "" : "Please describe your project" }));
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(formData.email) ? "" : "Please enter a valid email address" }));
    } else if (field === "name") {
      setErrors((prev) => ({ ...prev, name: formData.name.trim() ? "" : "Name is required" }));
    } else if (field === "projectDescription") {
      setErrors((prev) => ({ ...prev, projectDescription: formData.projectDescription.trim() ? "" : "Please describe your project" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setTouched({
        name: true,
        email: true,
        company: true,
        projectDescription: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send form data to our API route which forwards to Zoho webhook
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        projectDescription: "",
      });
      setTouched({
        name: false,
        email: false,
        company: false,
        projectDescription: false,
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Error submitting quote request:", error);
      setSubmitStatus("error");

      // Reset error message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
      {...flex}
    >
      <Background
        top="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor,
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />
      <Column maxWidth="xs" horizontal="center">
        <Heading marginBottom="s" variant="display-strong-xs">
          Request a Quote
        </Heading>
        <Text wrap="balance" marginBottom="l" variant="body-default-l" onBackground="neutral-weak">
          Tell me about your project and I'll get back to you with a detailed proposal within 24 hours.
        </Text>
      </Column>

      {submitStatus === "success" && (
        <Column fillWidth maxWidth={24} marginBottom="m" padding="m" radius="m" background="surface" border="brand-medium">
          <Text variant="body-default-m" onBackground="brand-strong">
            ✓ Thank you! I'll review your request and get back to you within 24 hours.
          </Text>
        </Column>
      )}

      {submitStatus === "error" && (
        <Column fillWidth maxWidth={24} marginBottom="m" padding="m" radius="m" background="surface" border="neutral-medium">
          <Text variant="body-default-m" onBackground="neutral-strong">
            ✗ Something went wrong. Please try again or email me directly at boko@elivate.io
          </Text>
        </Column>
      )}

      <form
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <Column fillWidth maxWidth={24} gap="16">
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            errorMessage={touched.name ? errors.name : ""}
          />

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            errorMessage={touched.email ? errors.email : ""}
          />

          <Input
            id="company"
            name="company"
            type="text"
            placeholder="Company (Optional)"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            onBlur={() => handleBlur("company")}
          />

          <Textarea
            id="projectDescription"
            name="projectDescription"
            placeholder="Tell me about your project - what do you need help with?"
            required
            value={formData.projectDescription}
            onChange={(e) => handleChange("projectDescription", e.target.value)}
            onBlur={() => handleBlur("projectDescription")}
            errorMessage={touched.projectDescription ? errors.projectDescription : ""}
            rows={5}
          />

          <Row height="48" vertical="center">
            <Button type="submit" size="m" fillWidth disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Request Quote"}
            </Button>
          </Row>
        </Column>
      </form>
    </Column>
  );
};
