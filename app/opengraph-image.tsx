import { ImageResponse } from "next/og";

export const alt = "AJITDEV — Technical Hub & Developer Ecosystem by Ajit Dev";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#050505",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Subtle background gradients */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "200px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              A
            </div>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              AJITDEV
            </span>
          </div>

          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 500,
            }}
          >
            next.ajitdev.com
          </div>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              background: "linear-gradient(to right, #ffffff, #e2e8f0, #94a3b8)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Technical Hub & Developer Ecosystem
          </div>

          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.5,
              color: "rgba(255, 255, 255, 0.65)",
              maxWidth: "960px",
            }}
          >
            Full Stack Development · DevOps · DevSecOps · Cloud · System Design · DSA · Developer APIs · Production Suite
          </p>
        </div>

        {/* Bottom tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "14px",
            }}
          >
            {["Full Stack", "DevOps", "Cloud", "System Design", "Free APIs"].map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            Ajit Dev · Katihar, Bihar, India
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
