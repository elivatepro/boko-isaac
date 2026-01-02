"use client";

import { useEffect, useState } from "react";
import { Row, Icon, IconButton } from "@once-ui-system/core";

interface CalEmbedProps {
  calLink: string;
  children?: React.ReactNode;
}

export function CalEmbed({ calLink, children }: CalEmbedProps) {
  const [isReady, setIsReady] = useState(false);
  const calUsername = calLink.replace("https://cal.com/", "");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    if (!win.Cal) {
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      script.onload = () => {
        win.Cal("init", { origin: "https://cal.com" });
        win.Cal("ui", {
          theme: "dark",
          styles: { branding: { brandColor: "#00b4d8" } },
          hideEventTypeDetails: false,
        });
        setIsReady(true);
      };
      document.head.appendChild(script);
    } else {
      setIsReady(true);
    }
  }, []);

  const openCalModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    if (win.Cal) {
      win.Cal("modal", {
        calLink: calUsername,
        config: {
          layout: "month_view",
          theme: "dark",
        },
      });
    } else {
      window.open(calLink, "_blank");
    }
  };

  if (children) {
    return (
      <div onClick={openCalModal} style={{ cursor: "pointer" }}>
        {children}
      </div>
    );
  }

  return (
    <Row
      fitWidth
      border="brand-alpha-medium"
      background="brand-alpha-weak"
      radius="full"
      padding="4"
      gap="8"
      vertical="center"
      onClick={openCalModal}
      style={{
        backdropFilter: "blur(var(--static-space-1))",
        cursor: isReady ? "pointer" : "wait",
      }}
    >
      <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
      <Row paddingX="8">Schedule a call</Row>
      <IconButton
        data-border="rounded"
        variant="secondary"
        icon="chevronRight"
      />
    </Row>
  );
}
