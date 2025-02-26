import type { Metric } from "web-vitals";

export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  if (
    onPerfEntry &&
    typeof onPerfEntry === "function" &&
    typeof window !== "undefined"
  ) {
    import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
}

// Example analytics reporter function
export function sendVitalsToAnalytics(metric: Metric) {
  // When ready to send to a real analytics system, uncomment and configure:
  /*
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value.toFixed(2),
    delta: metric.delta.toFixed(2),
    id: metric.id,
  });

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    fetch('/api/analytics/vitals', {
      body,
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  */

  // For now, just log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.log(`Web Vital: ${metric.name}`, metric);
  }
}
