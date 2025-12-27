import { Column, Row, Heading, Text } from "@once-ui-system/core";
import styles from "@/styles/animations.module.css";

interface ExampleProjectsProps {
  projects: Array<{
    name: string;
    description: React.ReactNode;
    storyPoints: string;
    priceRange: string;
    deliverables: string[];
  }>;
}

export function ExampleProjects({ projects }: ExampleProjectsProps) {
  return (
    <Row fillWidth gap="16" wrap s={{ direction: "column" }} className={styles.staggerChildren}>
      {projects.map((project, index) => (
        <Column
          key={`project-${index}`}
          padding="l"
          gap="m"
          border="neutral-alpha-medium"
          radius="l"
          background="surface"
          style={{ flex: "1 1 calc(50% - 8px)", minWidth: "300px" }}
          className={styles.hoverLift}
        >
          <Column gap="8">
            <Heading variant="heading-strong-l">{project.name}</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {project.description}
            </Text>
          </Column>
          <Column gap="4">
            <Row gap="8" vertical="center">
              <Text variant="label-default-s" onBackground="neutral-weak">
                Story Points:
              </Text>
              <Text variant="heading-strong-l" onBackground="brand-weak">
                {project.storyPoints}
              </Text>
            </Row>
            <Text variant="display-strong-l" onBackground="accent-weak">
              {project.priceRange}
            </Text>
          </Column>
          <Column gap="4" paddingTop="8">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Deliverables:
            </Text>
            <Column gap="4">
              {project.deliverables.map((deliverable, deliverableIndex) => (
                <Text
                  key={`${project.name}-deliverable-${deliverableIndex}`}
                  variant="body-default-s"
                >
                  • {deliverable}
                </Text>
              ))}
            </Column>
          </Column>
        </Column>
      ))}
    </Row>
  );
}
