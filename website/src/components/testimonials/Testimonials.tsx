"use client";

import { Column, Row, Text, Heading, Avatar } from "@once-ui-system/core";
import styles from "./Testimonials.module.css";

interface Testimonial {
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  overallRating: number;
  totalReviews: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <Row gap="4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          variant="body-default-s"
          onBackground={star <= rating ? "brand-strong" : "neutral-weak"}
        >
          ★
        </Text>
      ))}
    </Row>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Column
      className={styles.testimonialCard}
      padding="l"
      gap="m"
      border="neutral-alpha-medium"
      radius="l"
      background="surface"
    >
      <StarRating rating={testimonial.rating} />
      <Text variant="body-default-m" onBackground="neutral-weak">
        "{testimonial.content}"
      </Text>
      <Row gap="12" vertical="center">
        {testimonial.avatar ? (
          <Avatar src={testimonial.avatar} size="s" />
        ) : (
          <Column
            horizontal="center"
            vertical="center"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--brand-alpha-weak)",
            }}
          >
            <Text variant="label-default-s" onBackground="brand-strong">
              {testimonial.name.charAt(0)}
            </Text>
          </Column>
        )}
        <Column gap="2">
          <Text variant="label-default-s">{testimonial.name}</Text>
          {(testimonial.role || testimonial.company) && (
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {testimonial.role}
              {testimonial.role && testimonial.company && " · "}
              {testimonial.company}
            </Text>
          )}
        </Column>
      </Row>
    </Column>
  );
}

export function Testimonials({
  testimonials,
  overallRating,
  totalReviews,
}: TestimonialsProps) {
  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <Column fillWidth gap="l">
      <Row
        fillWidth
        gap="24"
        vertical="stretch"
        s={{ direction: "column" }}
      >
        {/* Rating Card */}
        <Column
          className={styles.ratingCard}
          padding="xl"
          gap="m"
          radius="l"
          horizontal="center"
          vertical="center"
          style={{ minWidth: 200 }}
        >
          <div className={styles.animatedBackground} />
          <Column
            horizontal="center"
            vertical="center"
            gap="8"
            style={{ position: "relative", zIndex: 1 }}
          >
            <Text variant="label-default-m" onBackground="neutral-weak">
              Excellent
            </Text>
            <Heading variant="display-strong-xl">{overallRating.toFixed(2)}</Heading>
            <Text variant="body-default-s" onBackground="brand-strong">
              {totalReviews} Reviews
            </Text>
          </Column>
        </Column>

        {/* Testimonials Carousel */}
        <Column fillWidth style={{ overflow: "hidden", flex: 1 }}>
          <Row className={styles.carousel}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`testimonial-${index}`}
                testimonial={testimonial}
              />
            ))}
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
