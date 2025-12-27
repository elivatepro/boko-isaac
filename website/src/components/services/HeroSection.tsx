import { Column, Heading, Text } from "@once-ui-system/core";

interface HeroSectionProps {
  headline: React.ReactNode;
  subline: React.ReactNode;
}

export function HeroSection({ headline, subline }: HeroSectionProps) {
  return (
    <Column
      fillWidth
      minHeight="160"
      vertical="center"
      marginBottom="40"
      horizontal="center"
      align="center"
    >
      <Heading
        variant="display-strong-xl"
        align="center"
        marginBottom="m"
      >
        {headline}
      </Heading>
      <Text
        variant="body-default-l"
        onBackground="neutral-weak"
        align="center"
        style={{ maxWidth: "600px" }}
      >
        {subline}
      </Text>
    </Column>
  );
}
