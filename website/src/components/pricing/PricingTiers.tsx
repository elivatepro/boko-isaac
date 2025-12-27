import { Column, Row, Heading, Text } from "@once-ui-system/core";
import styles from "@/styles/animations.module.css";

interface PricingTiersProps {
  tiers: Array<{
    range: string;
    ratePerSP: number;
    description?: string;
  }>;
}

export function PricingTiers({ tiers }: PricingTiersProps) {
  return (
    <Row fillWidth gap="16" s={{ direction: "column" }} className={styles.staggerChildren}>
      {tiers.map((tier, index) => (
        <Column
          key={`tier-${index}`}
          fillWidth
          padding="l"
          gap="m"
          border="neutral-alpha-medium"
          radius="l"
          background="surface"
          className={styles.hoverLift}
        >
          <Heading variant="heading-strong-xl">{tier.range}</Heading>
          <Text variant="display-strong-l" onBackground="brand-weak">
            ${tier.ratePerSP}
            <Text as="span" variant="body-default-m" onBackground="neutral-weak">
              {" "}
              / SP
            </Text>
          </Text>
          {tier.description && (
            <Text variant="body-default-s" onBackground="neutral-weak">
              {tier.description}
            </Text>
          )}
        </Column>
      ))}
    </Row>
  );
}
