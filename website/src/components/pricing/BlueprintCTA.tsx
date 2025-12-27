import { Column, Row, Heading, Text, IconButton, Icon } from "@once-ui-system/core";
import { about } from "@/resources";

interface BlueprintCTAProps {
  title: string;
  description: React.ReactNode;
  duration: string;
  price: string;
}

export function BlueprintCTA({ title, description, duration, price }: BlueprintCTAProps) {
  return (
    <Column
      fillWidth
      padding="xl"
      gap="l"
      radius="l"
      border="brand-alpha-medium"
      background="brand-alpha-weak"
      horizontal="center"
      align="center"
      style={{
        backdropFilter: "blur(var(--static-space-1))",
      }}
    >
      <Column gap="m" horizontal="center" align="center" style={{ maxWidth: "600px" }}>
        <Heading variant="display-strong-s" align="center">
          {title}
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak" align="center">
          {description}
        </Text>
        <Row gap="16" paddingTop="8" vertical="center">
          <Column gap="4" horizontal="center">
            <Icon name="clock" onBackground="brand-weak" />
            <Text variant="label-default-s" onBackground="neutral-weak">
              {duration}
            </Text>
          </Column>
          <Column gap="4" horizontal="center">
            <Icon name="tag" onBackground="brand-weak" />
            <Text variant="heading-strong-l" onBackground="brand-strong">
              {price}
            </Text>
          </Column>
        </Row>
      </Column>
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
        <Row paddingX="8">Schedule a Blueprint Session</Row>
        <IconButton
          href={about.calendar.link}
          data-border="rounded"
          variant="secondary"
          icon="chevronRight"
        />
      </Row>
    </Column>
  );
}
