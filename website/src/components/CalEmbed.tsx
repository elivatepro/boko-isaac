"use client";

import { useEffect, useState } from "react";
import { Row, Icon, IconButton } from "@once-ui-system/core";

interface CalEmbedProps {
  calLink: string;
  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

export function CalEmbed({ calLink, children }: CalEmbedProps) {
  const [isReady, setIsReady] = useState(false);
  const calUsername = calLink.replace("https://cal.com/", "");

  useEffect(() => {
    // Create Cal namespace using official embed code
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", { origin: "https://cal.com" });

    window.Cal("ui", {
      theme: "dark",
      styles: { branding: { brandColor: "#00b4d8" } },
      hideEventTypeDetails: false,
    });

    setIsReady(true);
  }, []);

  const openCalModal = () => {
    if (!isReady) return;

    window.Cal("modal", {
      calLink: calUsername,
      config: {
        layout: "month_view",
        theme: "dark",
      },
    });
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
        cursor: "pointer",
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
