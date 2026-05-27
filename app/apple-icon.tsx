import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#15171c",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 116,
            height: 116,
            background: "linear-gradient(135deg, #d7baff, #6f00b4, #5bd5fc)",
            borderRadius: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 60,
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
    { width: 180, height: 180 }
  );
}
