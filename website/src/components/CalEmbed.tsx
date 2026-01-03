"use client";

import { useEffect, useRef } from "react";
import { Row, Icon, IconButton } from "@once-ui-system/core";

interface CalEmbedProps {
  calLink: string;
  children?: React.ReactNode;
}

export function CalEmbed({ calLink, children }: CalEmbedProps) {
  const calUsername = calLink.replace("https://cal.com/", "");
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    // Cal.com official embed snippet
    const script = document.createElement("script");
    script.innerHTML = `
      (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
      Cal("init", {origin:"https://cal.com"});
      Cal("ui", {"theme":"dark","styles":{"branding":{"brandColor":"#00b4d8"}},"hideEventTypeDetails":false});
    `;
    document.head.appendChild(script);
  }, []);

  const openCalModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Cal = (window as any).Cal;

    if (typeof Cal === "function") {
      Cal("modal", {
        calLink: calUsername,
        config: {
          layout: "month_view",
          theme: "dark",
        },
      });
    } else {
      // Fallback if Cal not ready
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
