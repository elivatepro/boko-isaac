import { Column, Row, Heading, Text, Badge, Icon } from "@once-ui-system/core";
import retainerStyles from "./RetainerPackages.module.css";

interface RetainerPackagesProps {
  packages: Array<{
    name: string;
    hours: number;
    ratePerHour: number;
    features: string[];
    recommended?: boolean;
  }>;
}

export function RetainerPackages({ packages }: RetainerPackagesProps) {
  return (
    <Row
      fillWidth
      gap="24"
      horizontal="center"
      vertical="stretch"
      s={{ direction: "column" }}
    >
      {packages.map((pkg, index) => (
        <Column
          key={`package-${index}`}
          fillWidth
          padding="xl"
          gap="l"
          radius="l"
          position="relative"
          horizontal="center"
          className={`${retainerStyles.card} ${pkg.recommended ? retainerStyles.recommended : ""}`}
        >
          {pkg.recommended && (
            <Badge
              background="brand-strong"
              paddingX="16"
              paddingY="8"
              textVariant="label-default-s"
              arrow={false}
              className={retainerStyles.badge}
            >
              <Row paddingY="2" gap="8" vertical="center" style={{ color: "var(--static-white)" }}>
                <Icon name="rocket" size="xs" />
                Best Value
              </Row>
            </Badge>
          )}
          <Column gap="8" horizontal="center" align="center">
            <Text variant="heading-strong-l" align="center">{pkg.name}</Text>
            <Column horizontal="center" align="center">
              <Text variant="display-strong-xl" onBackground="brand-strong">
                {pkg.hours}
              </Text>
              <Text variant="body-default-m" onBackground="neutral-weak">
                hours / month
              </Text>
            </Column>
            <Column
              paddingY="8"
              paddingX="16"
              radius="m"
              background="neutral-alpha-weak"
              horizontal="center"
            >
              <Text variant="heading-strong-m" onBackground="neutral-strong">
                ${pkg.hours * pkg.ratePerHour}
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                ${pkg.ratePerHour}/hour
              </Text>
            </Column>
          </Column>
          <Column gap="12" paddingTop="8" fillWidth>
            {pkg.features.map((feature, featureIndex) => (
              <Row
                key={`${pkg.name}-feature-${featureIndex}`}
                gap="12"
                vertical="start"
              >
                <Text
                  variant="body-default-m"
                  onBackground={pkg.recommended ? "brand-strong" : "neutral-weak"}
                  style={{ flexShrink: 0 }}
                >
                  ✓
                </Text>
                <Text variant="body-default-m">
                  {feature}
                </Text>
              </Row>
            ))}
          </Column>
        </Column>
      ))}
    </Row>
  );
}
