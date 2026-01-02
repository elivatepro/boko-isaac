import {
  Column,
  Heading,
  Text,
  Button,
  Icon,
  Row,
  Meta,
  RevealFx,
  Avatar,
  Line,
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
      icon: "target",
      title: "Define Your Challenge",
      description: "Think about the biggest operational pain point you want to solve. The clearer you can describe it, the more value we'll extract from our time.",
    },
    {
      icon: "tool",
      title: "List Your Current Tools",
      description: "Jot down the software and systems you're using today—spreadsheets, CRMs, accounting tools, anything relevant.",
    },
    {
      icon: "chart",
      title: "Know Your Numbers",
      description: "How much time does this problem cost you weekly? What would solving it be worth? These help me understand the ROI potential.",
    },
    {
      icon: "question",
      title: "Prepare Questions",
      description: "About timelines, pricing, technical approach—anything you want clarity on. No question is too basic.",
    },
  ];

  const whatHappensNext = [
    {
      step: "1",
      title: "Check Your Email",
      description: "You'll receive a calendar invite with the video meeting link. Add it to your calendar so you don't miss it.",
    },
    {
      step: "2",
      title: "24-Hour Reminder",
      description: "I'll send a reminder email the day before with the meeting link and any final prep tips.",
    },
    {
      step: "3",
      title: "We Meet",
      description: "30 minutes of focused discussion. You'll walk away with clarity—even if we don't end up working together.",
    },
  ];

  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      {/* Success Hero */}
      <Column fillWidth horizontal="center" align="center" gap="l" marginBottom="l">
        <RevealFx translateY="4">
          <Row
            padding="20"
            radius="full"
            background="success-alpha-weak"
            border="success-alpha-medium"
            style={{
              backdropFilter: "blur(var(--static-space-1))",
            }}
          >
            <Icon name="check" size="xl" onBackground="success-strong" />
          </Row>
        </RevealFx>

        <RevealFx translateY="8" delay={0.1}>
          <Heading variant="display-strong-xl" align="center">
            You're all set!
          </Heading>
        </RevealFx>

        <RevealFx translateY="8" delay={0.2}>
          <Text
            variant="heading-default-l"
            onBackground="neutral-weak"
            align="center"
            style={{ maxWidth: "500px" }}
          >
            Your Blueprint Session is confirmed. I'm looking forward to learning about your business and exploring how I can help.
          </Text>
        </RevealFx>

        <RevealFx translateY="8" delay={0.3}>
          <Row
            padding="16"
            paddingX="24"
            radius="l"
            background="brand-alpha-weak"
            border="brand-alpha-medium"
            gap="16"
            vertical="center"
            style={{
              backdropFilter: "blur(var(--static-space-1))",
            }}
          >
            <Avatar src={person.avatar} size="l" />
            <Column gap="4">
              <Text variant="heading-strong-m">{person.name}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {person.role}
              </Text>
            </Column>
          </Row>
        </RevealFx>
      </Column>

      {/* What Happens Next */}
      <RevealFx translateY="12" delay={0.4} fillWidth>
        <Column fillWidth gap="24">
          <Heading as="h2" variant="display-strong-s" align="center">
            What happens next
          </Heading>

          <Row fillWidth gap="16" s={{ direction: "column" }}>
            {whatHappensNext.map((item, index) => (
              <Column
                key={index}
                flex={1}
                padding="24"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                gap="12"
                horizontal="center"
                align="center"
              >
                <Row
                  padding="12"
                  radius="full"
                  background="brand-alpha-weak"
                  border="brand-alpha-medium"
                >
                  <Text variant="heading-strong-l" onBackground="brand-strong">
                    {item.step}
                  </Text>
                </Row>
                <Text variant="heading-strong-m" align="center">
                  {item.title}
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak" align="center">
                  {item.description}
                </Text>
              </Column>
            ))}
          </Row>
        </Column>
      </RevealFx>

      {/* Divider */}
      <Row fillWidth horizontal="center" paddingY="l">
        <Line maxWidth={48} />
      </Row>

      {/* Preparation Tips */}
      <RevealFx translateY="12" delay={0.5} fillWidth>
        <Column fillWidth gap="24">
          <Column gap="8" horizontal="center" align="center">
            <Heading as="h2" variant="display-strong-s" align="center">
              Make the most of our time
            </Heading>
            <Text
              variant="body-default-l"
              onBackground="neutral-weak"
              align="center"
              style={{ maxWidth: "500px" }}
            >
              A little preparation goes a long way. Here's how to come ready:
            </Text>
          </Column>

          <Column fillWidth gap="16">
            {preparationTips.map((tip, index) => (
              <Row
                key={index}
                fillWidth
                padding="20"
                radius="l"
                border="neutral-alpha-weak"
                background="surface"
                gap="16"
                vertical="center"
              >
                <Row
                  padding="12"
                  radius="m"
                  background="brand-alpha-weak"
                  style={{ flexShrink: 0 }}
                >
                  <Icon name={tip.icon} size="m" onBackground="brand-strong" />
                </Row>
                <Column gap="4" flex={1}>
                  <Text variant="heading-strong-m">{tip.title}</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {tip.description}
                  </Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Column>
      </RevealFx>

      {/* Divider */}
      <Row fillWidth horizontal="center" paddingY="l">
        <Line maxWidth={48} />
      </Row>

      {/* What to Expect Section */}
      <RevealFx translateY="12" delay={0.6} fillWidth>
        <Column
          fillWidth
          padding="32"
          radius="l"
          border="brand-alpha-medium"
          background="brand-alpha-weak"
          gap="20"
          style={{
            backdropFilter: "blur(var(--static-space-1))",
          }}
        >
          <Heading as="h2" variant="heading-strong-xl" align="center">
            What to expect in our call
          </Heading>

          <Column gap="16" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <Row gap="12" vertical="start">
              <Icon name="check" onBackground="success-strong" style={{ marginTop: "4px" }} />
              <Text variant="body-default-l">
                <strong>Honest assessment</strong> — I'll tell you what's realistic and what's not, even if it means recommending a different approach.
              </Text>
            </Row>
            <Row gap="12" vertical="start">
              <Icon name="check" onBackground="success-strong" style={{ marginTop: "4px" }} />
              <Text variant="body-default-l">
                <strong>Clear next steps</strong> — Whether we work together or not, you'll leave with actionable insights.
              </Text>
            </Row>
            <Row gap="12" vertical="start">
              <Icon name="check" onBackground="success-strong" style={{ marginTop: "4px" }} />
              <Text variant="body-default-l">
                <strong>No pressure</strong> — This is a discovery call, not a sales pitch. My goal is to help you make the right decision.
              </Text>
            </Row>
            <Row gap="12" vertical="start">
              <Icon name="check" onBackground="success-strong" style={{ marginTop: "4px" }} />
              <Text variant="body-default-l">
                <strong>Scope estimate</strong> — If your project is a fit, I'll provide a rough estimate of complexity and cost.
              </Text>
            </Row>
          </Column>
        </Column>
      </RevealFx>

      {/* CTA Section */}
      <RevealFx translateY="12" delay={0.7} fillWidth>
        <Column fillWidth gap="24" horizontal="center" align="center" marginTop="l">
          <Column gap="8" horizontal="center" align="center">
            <Heading as="h3" variant="heading-strong-l" align="center">
              While you wait...
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak" align="center">
              Learn more about my work and approach
            </Text>
          </Column>

          <Row gap="12" wrap horizontal="center">
            <Button
              href="/work"
              variant="secondary"
              size="m"
              data-border="rounded"
              prefixIcon="grid"
            >
              View Projects
            </Button>
            <Button
              href="/blog"
              variant="secondary"
              size="m"
              data-border="rounded"
              prefixIcon="book"
            >
              Read Blog
            </Button>
            <Button
              href={about.path}
              variant="secondary"
              size="m"
              data-border="rounded"
              prefixIcon="person"
            >
              About Me
            </Button>
          </Row>

          {/* Social Links */}
          <Row gap="8" marginTop="l">
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
