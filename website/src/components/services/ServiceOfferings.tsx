import { Column, Row, Text, Tag } from "@once-ui-system/core";
import styles from "@/styles/animations.module.css";

interface ServiceOfferingsProps {
  services: Array<{
    title: string;
    description: React.ReactNode;
    icon: string;
    tags?: string[];
    examples?: string[];
  }>;
}

export function ServiceOfferings({ services }: ServiceOfferingsProps) {
  return (
    <Column fillWidth gap="xl" className={styles.staggerChildren}>
      {services.map((service, index) => (
        <Column
          key={`service-${index}`}
          fillWidth
          gap="m"
          padding="l"
          border="neutral-alpha-medium"
          radius="l"
          background="surface"
          className={styles.hoverLift}
        >
          <Row gap="12" vertical="center">
            <Text variant="display-strong-xs">{service.icon}</Text>
            <Text variant="heading-strong-l">{service.title}</Text>
          </Row>
          <Text variant="body-default-m" onBackground="neutral-weak">
            {service.description}
          </Text>
          {service.tags && service.tags.length > 0 && (
            <Row wrap gap="8" paddingTop="4">
              {service.tags.map((tag, tagIndex) => (
                <Tag key={`${service.title}-tag-${tagIndex}`} size="l">
                  {tag}
                </Tag>
              ))}
            </Row>
          )}
          {service.examples && service.examples.length > 0 && (
            <Column gap="8" paddingTop="4">
              {service.examples.map((example, exampleIndex) => (
                <Text
                  key={`${service.title}-example-${exampleIndex}`}
                  variant="body-default-s"
                  onBackground="neutral-weak"
                >
                  • {example}
                </Text>
              ))}
            </Column>
          )}
        </Column>
      ))}
    </Column>
  );
}
