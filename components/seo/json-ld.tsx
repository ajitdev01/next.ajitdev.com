import React from "react";

interface JsonLdProps {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
}

/**
 * Server component that renders a safe application/ld+json script tag.
 */
export default function JsonLd({ schema, id }: JsonLdProps) {
  if (!schema) return null;

  // Safe JSON serialization preventing </script> injection
  const jsonString = JSON.stringify(schema, null, process.env.NODE_ENV === "development" ? 2 : 0);
  const safeJson = jsonString.replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
