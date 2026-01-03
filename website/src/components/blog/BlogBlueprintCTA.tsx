import { Column, Row, Heading, Text, IconButton, Icon } from "@once-ui-system/core";
import { about } from "@/resources";
import { CalEmbed } from "@/components";

interface BlogBlueprintCTAProps {
  variant?: "blog" | "project";
}

export function BlogBlueprintCTA({ variant = "blog" }: BlogBlueprintCTAProps) {
  const content = {
    blog: {
      title: "Ready to build something?",
      description:
        "If this article sparked ideas for your own project, let's talk. Book a free 30-minute Blueprint Session to discuss your requirements and explore solutions.",
    },
    project: {
      title: "Want similar results?",
      description:
        "If this project resonates with what you're trying to build, let's discuss it. Book a free 30-minute Blueprint Session to explore how I can help.",
    },
  };

  return (
    <Column
      fillWidth
      padding="l"
      gap="m"
      radius="l"
      border="brand-alpha-medium"
      background="brand-alpha-weak"
      horizontal="center"
      align="center"
      style={{
        backdropFilter: "blur(var(--static-space-1))",
      }}
    >
      <Column gap="s" horizontal="center" align="center" style={{ maxWidth: "500px" }}>
        <Heading variant="heading-strong-l" align="center">
          {content[variant].title}
        </Heading>
        <Text variant="body-default-m" onBackground="neutral-weak" align="center">
          {content[variant].description}
        </Text>
      </Column>
      <CalEmbed calLink={about.calendar.link}>
        <Row
          fitWidth
          border="brand-alpha-medium"
          background="brand-alpha-weak"
          radius="full"
          padding="4"
          gap="8"
          vertical="center"
          style={{
            backdropFilter: "blur(var(--static-space-1))",
          }}
        >
          <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
          <Row paddingX="8">
            <Text variant="label-default-s">Schedule a Blueprint Session</Text>
          </Row>
          <IconButton data-border="rounded" variant="secondary" icon="chevronRight" />
        </Row>
      </CalEmbed>
    </Column>
  );
}
