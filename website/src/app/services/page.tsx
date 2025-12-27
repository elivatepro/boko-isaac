import {
  Column,
  Heading,
  Text,
  Row,
  Meta,
  Schema,
  Line,
  Badge,
} from "@once-ui-system/core";
import { baseURL, services, person, about, pricing } from "@/resources";
import {
  HeroSection,
  ProcessSteps,
  ServiceOfferings,
  PricingTiers,
  RetainerPackages,
  ExampleProjects,
  BlueprintCTA,
  QuoteRequestForm,
} from "@/components";
import { Projects } from "@/components/work/Projects";

export async function generateMetadata() {
  return Meta.generate({
    title: services.title,
    description: services.description,
    baseURL: baseURL,
    path: services.path,
    image: services.image,
  });
}

export default function Services() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={services.path}
        title={services.title}
        description={services.description}
        image={`/api/og/generate?title=${encodeURIComponent(services.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Hero Section */}
      <HeroSection
        headline={services.hero.headline}
        subline={services.hero.subline}
      />

      {/* Service Offerings */}
      {services.offerings.display && (
        <Column fillWidth gap="24" marginBottom="xl">
          <Column gap="8" horizontal="center" align="center">
            <Heading as="h2" variant="display-strong-s" align="center">
              {services.offerings.title}
            </Heading>
          </Column>
          <ServiceOfferings services={services.offerings.services} />
        </Column>
      )}

      {/* Divider */}
      <Row fillWidth horizontal="center" paddingY="l">
        <Line maxWidth={48} />
      </Row>

      {/* Pricing Section Header */}
      <Column fillWidth gap="16" horizontal="center" align="center" marginBottom="l">
        <Badge
          background="brand-alpha-weak"
          paddingX="16"
          paddingY="8"
          onBackground="brand-strong"
          textVariant="label-default-s"
          arrow={false}
        >
          <Row paddingY="2">Transparent Pricing</Row>
        </Badge>
        <Heading as="h2" variant="display-strong-l" align="center">
          {pricing.hero.headline}
        </Heading>
        <Text
          variant="body-default-l"
          onBackground="neutral-weak"
          align="center"
          style={{ maxWidth: "600px" }}
        >
          {pricing.hero.subline}
        </Text>
      </Column>

      {/* Story Points Pricing */}
      {pricing.storyPoints.display && (
        <Column fillWidth gap="24" marginBottom="xl">
          <Column gap="12" horizontal="center" align="center">
            <Heading as="h3" variant="heading-strong-xl" align="center">
              {pricing.storyPoints.title}
            </Heading>
            <Text
            variant="body-default-m"
            onBackground="neutral-weak"
            align="center"
            style={{ maxWidth: "600px" }}
          >
            {pricing.storyPoints.description}
          </Text>
          </Column>
          <PricingTiers tiers={pricing.storyPoints.tiers} />
        </Column>
      )}

      {/* Retainer Packages */}
      {pricing.retainers.display && (
        <Column fillWidth gap="24" marginBottom="xl">
          <Column gap="12" horizontal="center" align="center">
            <Heading as="h3" variant="heading-strong-xl" align="center">
              {pricing.retainers.title}
            </Heading>
            {pricing.retainers.description && (
            <Text
              variant="body-default-m"
              onBackground="neutral-weak"
              align="center"
              style={{ maxWidth: "600px" }}
            >
              {pricing.retainers.description}
            </Text>
          )}
          </Column>
          <RetainerPackages packages={pricing.retainers.packages} />
        </Column>
      )}

      {/* Divider */}
      <Row fillWidth horizontal="center" paddingY="l">
        <Line maxWidth={48} />
      </Row>

      {/* Example Projects */}
      {pricing.exampleProjects.display && (
        <Column fillWidth gap="24" marginBottom="xl">
          <Column gap="12" horizontal="center" align="center">
            <Heading as="h3" variant="heading-strong-xl" align="center">
              {pricing.exampleProjects.title}
            </Heading>
          </Column>
          <ExampleProjects projects={pricing.exampleProjects.projects} />
        </Column>
      )}

      {/* Divider */}
      <Row fillWidth horizontal="center" paddingY="l">
        <Line maxWidth={48} />
      </Row>

      {/* Process Steps */}
      {services.process.display && (
        <Column fillWidth gap="24" marginBottom="xl">
          <Heading as="h3" variant="heading-strong-xl" align="center">
            {services.process.title}
          </Heading>
          <ProcessSteps steps={services.process.steps} />
        </Column>
      )}

      {/* Divider */}
      <Row fillWidth horizontal="center" paddingY="l">
        <Line maxWidth={48} />
      </Row>

      {/* Blueprint Sessions CTA */}
      {pricing.blueprintSessions.display && (
        <Column fillWidth marginBottom="xl">
          <BlueprintCTA
            title={pricing.blueprintSessions.title}
            description={pricing.blueprintSessions.description}
            duration={pricing.blueprintSessions.duration}
            price={pricing.blueprintSessions.price}
          />
        </Column>
      )}

      {/* Example Projects from Portfolio */}
      {services.examples.display && (
        <Column fillWidth gap="24" marginBottom="xl">
          <Column gap="8" horizontal="center" align="center">
            <Heading as="h3" variant="heading-strong-xl" align="center">
              {services.examples.title}
            </Heading>
            {services.examples.subtitle && (
              <Text
                variant="body-default-m"
                onBackground="neutral-weak"
                align="center"
                style={{ maxWidth: "600px" }}
              >
                {services.examples.subtitle}
              </Text>
            )}
          </Column>
          <Projects range={[1, 3]} />
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
