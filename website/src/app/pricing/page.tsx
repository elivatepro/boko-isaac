import {
  Column,
  Heading,
  Text,
  Meta,
  Schema,
  Row,
  Line,
} from "@once-ui-system/core";
import { baseURL, pricing, person, about } from "@/resources";
import {
  HeroSection,
  PricingTiers,
  RetainerPackages,
  ExampleProjects,
  BlueprintCTA,
  QuoteRequestForm,
} from "@/components";

export async function generateMetadata() {
  return Meta.generate({
    title: pricing.title,
    description: pricing.description,
    baseURL: baseURL,
    path: pricing.path,
    image: pricing.image,
  });
}

export default function Pricing() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={pricing.path}
        title={pricing.title}
        description={pricing.description}
        image={`/api/og/generate?title=${encodeURIComponent(pricing.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Hero */}
      <HeroSection
        headline={pricing.hero.headline}
        subline={pricing.hero.subline}
      />

      {/* Story Points Section */}
      {pricing.storyPoints.display && (
        <Column fillWidth gap="24" marginBottom="l">
          <Heading as="h2" variant="display-strong-s">
            {pricing.storyPoints.title}
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak">
            {pricing.storyPoints.description}
          </Text>
          <PricingTiers tiers={pricing.storyPoints.tiers} />
        </Column>
      )}

      {/* Divider */}
      <Row fillWidth paddingX="64">
        <Line maxWidth={48} />
      </Row>

      {/* Retainer Packages */}
      {pricing.retainers.display && (
        <Column fillWidth gap="24" marginBottom="l">
          <Heading as="h2" variant="display-strong-s">
            {pricing.retainers.title}
          </Heading>
          {pricing.retainers.description && (
            <Text variant="body-default-l" onBackground="neutral-weak">
              {pricing.retainers.description}
            </Text>
          )}
          <RetainerPackages packages={pricing.retainers.packages} />
        </Column>
      )}

      {/* Divider */}
      <Row fillWidth paddingX="64">
        <Line maxWidth={48} />
      </Row>

      {/* Example Projects */}
      {pricing.exampleProjects.display && (
        <Column fillWidth gap="24" marginBottom="l">
          <Heading as="h2" variant="display-strong-s">
            {pricing.exampleProjects.title}
          </Heading>
          <ExampleProjects projects={pricing.exampleProjects.projects} />
        </Column>
      )}

      {/* Divider */}
      <Row fillWidth paddingX="64">
        <Line maxWidth={48} />
      </Row>

      {/* Blueprint Sessions CTA */}
      {pricing.blueprintSessions.display && (
        <Column fillWidth marginBottom="l">
          <BlueprintCTA
            title={pricing.blueprintSessions.title}
            description={pricing.blueprintSessions.description}
            duration={pricing.blueprintSessions.duration}
            price={pricing.blueprintSessions.price}
          />
        </Column>
      )}

      {/* Alternative: Quote Form */}
      <Column fillWidth gap="16" marginTop="xl">
        <Heading as="h3" variant="heading-strong-l" align="center">
          Prefer Email?
        </Heading>
        <Text variant="body-default-m" onBackground="neutral-weak" align="center">
          Send a project description and I'll respond within 24 hours.
        </Text>
        <QuoteRequestForm />
      </Column>
    </Column>
  );
}
