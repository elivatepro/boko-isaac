import { Column, Row, Text, Heading } from "@once-ui-system/core";
import styles from "@/styles/animations.module.css";

interface ProcessStepsProps {
  steps: Array<{
    number: number;
    title: string;
    description: React.ReactNode;
    icon: string;
  }>;
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  // Split steps into pairs for 2-column grid
  const topRow = steps.slice(0, 2);
  const bottomRow = steps.slice(2, 4);

  return (
    <Column fillWidth gap="16" className={styles.staggerChildren}>
      <Row fillWidth gap="16" s={{ direction: "column" }}>
        {topRow.map((step) => (
          <Column
            key={`step-${step.number}`}
            fillWidth
            padding="l"
            gap="m"
            border="neutral-alpha-medium"
            radius="l"
            background="surface"
            className={styles.hoverLift}
          >
            <Text variant="display-strong-m">{step.icon}</Text>
            <Heading variant="heading-strong-l">
              {step.number}. {step.title}
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {step.description}
            </Text>
          </Column>
        ))}
      </Row>
      {bottomRow.length > 0 && (
        <Row fillWidth gap="16" s={{ direction: "column" }}>
          {bottomRow.map((step) => (
            <Column
              key={`step-${step.number}`}
              fillWidth
              padding="l"
              gap="m"
              border="neutral-alpha-medium"
              radius="l"
              background="surface"
              className={styles.hoverLift}
            >
              <Text variant="display-strong-m">{step.icon}</Text>
              <Heading variant="heading-strong-l">
                {step.number}. {step.title}
              </Heading>
              <Text variant="body-default-m" onBackground="neutral-weak">
                {step.description}
              </Text>
            </Column>
          ))}
        </Row>
      )}
    </Column>
  );
}
