import {
  Column,
  Heading,
  Text,
  Button,
  Row,
  Meta,
  RevealFx,
  Avatar,
  Line,
  Icon,
} from "@once-ui-system/core";
import { baseURL, person, about, social } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: `Booking Confirmed – ${person.name}`,
    description: "Your Blueprint Session is confirmed! Here's what to expect.",
    baseURL: baseURL,
    path: "/booking-confirmed",
  });
}

export default function BookingConfirmed() {
  const preparationTips = [
    {
      icon: "rocket",
      title: "Define Your Challenge",
      description: "Think about the biggest operational pain point you want to solve.",
    },
    {
      icon: "briefcase",
      title: "List Your Current Tools",
      description: "Jot down the software and systems you're using today.",
    },
    {
      icon: "globe",
      title: "Know Your Numbers",
      description: "How much time does this problem cost you weekly?",
    },
    {
      icon: "document",
      title: "Prepare Questions",
      description: "About timelines, pricing, technical approach—anything.",
    },
  ] as const;

  const whatHappensNext = [
    {
      step: "1",
      title: "Check Your Email",
      description: "You'll receive a calendar invite with the video meeting link.",
    },
    {
      step: "2",
      title: "24-Hour Reminder",
      description: "I'll send a reminder the day before with final prep tips.",
    },
    {
      step: "3",
      title: "We Meet",
      description: "30 minutes of focused discussion. You'll walk away with clarity.",
    },
  ];

  return (
    <Column maxWidth="m" gap="l" paddingY="12" horizontal="center" paddingX="m">
      {/* Success Hero */}
      <Column fillWidth horizontal="center" align="center" gap="m">
        <RevealFx translateY="4" horizontal="center">
          <Row
            padding="16"
            radius="full"
            background="brand-alpha-weak"
            border="brand-alpha-medium"
          >
            <Icon name="rocket" size="xl" onBackground="brand-strong" />
          </Row>
        </RevealFx>

        <RevealFx translateY="8" delay={0.1} horizontal="center">
          <Heading variant="display-strong-xl" align="center">
            You're all set!
          </Heading>
        </RevealFx>

        <RevealFx translateY="8" delay={0.2} horizontal="center">
          <Text
            variant="body-default-l"
            onBackground="neutral-weak"
            align="center"
            style={{ maxWidth: "460px" }}
          >
            Your Blueprint Session is confirmed. I'm looking forward to learning about your business and exploring how I can help.
          </Text>
        </RevealFx>

        <RevealFx translateY="8" delay={0.3} horizontal="center">
          <Row
            padding="12"
            paddingX="20"
            radius="l"
            background="brand-alpha-weak"
            border="brand-alpha-medium"
            gap="12"
            vertical="center"
          >
            <Avatar src={person.avatar} size="m" />
            <Column gap="2">
              <Text variant="heading-strong-s">{person.name}</Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {person.role}
              </Text>
            </Column>
          </Row>
        </RevealFx>
      </Column>

      {/* Divider */}
      <Row fillWidth horizontal="center">
        <Line maxWidth={48} />
      </Row>

      {/* What Happens Next */}
      <RevealFx translateY="12" delay={0.4} fillWidth>
        <Column fillWidth gap="16">
          <Heading as="h2" variant="heading-strong-l" align="center">
            What happens next
          </Heading>

          <Row fillWidth gap="12" s={{ direction: "column" }}>
            {whatHappensNext.map((item, index) => (
              <Column
                key={index}
                flex={1}
                padding="20"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                gap="8"
                horizontal="center"
                align="center"
                s={{ padding: "16" }}
              >
                <Row
                  padding="8"
                  paddingX="12"
                  radius="full"
                  background="brand-alpha-weak"
                  border="brand-alpha-medium"
                >
                  <Text variant="heading-strong-m" onBackground="brand-strong">
                    {item.step}
                  </Text>
                </Row>
                <Text variant="heading-strong-s" align="center">
                  {item.title}
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak" align="center">
                  {item.description}
                </Text>
              </Column>
            ))}
          </Row>
        </Column>
      </RevealFx>

      {/* Divider */}
      <Row fillWidth horizontal="center">
        <Line maxWidth={48} />
      </Row>

      {/* Preparation Tips */}
      <RevealFx translateY="12" delay={0.5} fillWidth>
        <Column fillWidth gap="16">
          <Column gap="4" horizontal="center" align="center">
            <Heading as="h2" variant="heading-strong-l" align="center">
              Make the most of our time
            </Heading>
            <Text
              variant="body-default-m"
              onBackground="neutral-weak"
              align="center"
            >
              A little preparation goes a long way
            </Text>
          </Column>

          <Row fillWidth gap="12" wrap>
            {preparationTips.map((tip, index) => (
              <Column
                key={index}
                padding="16"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                gap="8"
                style={{ flex: "1 1 calc(50% - 6px)", minWidth: "280px" }}
              >
                <Row gap="12" vertical="center">
                  <Icon name={tip.icon} size="m" onBackground="brand-strong" style={{ flexShrink: 0 }} />
                  <Text variant="heading-strong-s">{tip.title}</Text>
                </Row>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {tip.description}
                </Text>
              </Column>
            ))}
          </Row>
        </Column>
      </RevealFx>

      {/* Divider */}
      <Row fillWidth horizontal="center">
        <Line maxWidth={48} />
      </Row>

      {/* What to Expect Section */}
      <RevealFx translateY="12" delay={0.6} fillWidth>
        <Column
          fillWidth
          padding="24"
          radius="l"
          border="brand-alpha-medium"
          background="brand-alpha-weak"
          gap="16"
          s={{ padding: "16" }}
        >
          <Heading as="h2" variant="heading-strong-l" align="center">
            What to expect in our call
          </Heading>

          <Column gap="12">
            <Row gap="12" vertical="center">
              <Icon name="arrowRight" size="s" onBackground="brand-strong" style={{ flexShrink: 0 }} />
              <Text variant="body-default-m">
                <strong>Honest assessment</strong> — I'll tell you what's realistic and what's not.
              </Text>
            </Row>
            <Row gap="12" vertical="center">
              <Icon name="arrowRight" size="s" onBackground="brand-strong" style={{ flexShrink: 0 }} />
              <Text variant="body-default-m">
                <strong>Clear next steps</strong> — You'll leave with actionable insights.
              </Text>
            </Row>
            <Row gap="12" vertical="center">
              <Icon name="arrowRight" size="s" onBackground="brand-strong" style={{ flexShrink: 0 }} />
              <Text variant="body-default-m">
                <strong>No pressure</strong> — This is a discovery call, not a sales pitch.
              </Text>
            </Row>
            <Row gap="12" vertical="center">
              <Icon name="arrowRight" size="s" onBackground="brand-strong" style={{ flexShrink: 0 }} />
              <Text variant="body-default-m">
                <strong>Scope estimate</strong> — I'll provide a rough estimate if it's a fit.
              </Text>
            </Row>
          </Column>
        </Column>
      </RevealFx>

      {/* CTA Section */}
      <RevealFx translateY="12" delay={0.7} fillWidth>
        <Column fillWidth gap="16" horizontal="center" align="center">
          <Column gap="4" horizontal="center" align="center">
            <Text variant="heading-strong-m" align="center">
              While you wait...
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak" align="center">
              Learn more about my work and approach
            </Text>
          </Column>

          <Row gap="8" wrap horizontal="center">
            <Button
              href="/work"
              variant="secondary"
              size="s"
              data-border="rounded"
              prefixIcon="grid"
            >
              Projects
            </Button>
            <Button
              href="/blog"
              variant="secondary"
              size="s"
              data-border="rounded"
              prefixIcon="book"
            >
              Blog
            </Button>
            <Button
              href={about.path}
              variant="secondary"
              size="s"
              data-border="rounded"
              prefixIcon="person"
            >
              About
            </Button>
          </Row>

          {/* Social Links */}
          <Row gap="8" wrap horizontal="center">
            {social
              .filter((item) => item.essential)
              .map((item) => (
                <Button
                  key={item.name}
                  href={item.link}
                  variant="tertiary"
                  size="s"
                  prefixIcon={item.icon}
                  data-border="rounded"
                >
                  {item.name}
                </Button>
              ))}
          </Row>
        </Column>
      </RevealFx>
    </Column>
  );
}
