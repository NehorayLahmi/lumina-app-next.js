import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "#15171c",
          borderRadius: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 124,
            height: 124,
            background: "linear-gradient(135deg, #d7baff, #6f00b4, #5bd5fc)",
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#0f1115",
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}
          >
            L
          </span>
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
