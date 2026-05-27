import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#15171c",
          borderRadius: 112,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 332,
            height: 332,
            background: "linear-gradient(135deg, #d7baff, #6f00b4, #5bd5fc)",
            borderRadius: 74,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 172,
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
    { width: 512, height: 512 }
  );
}
