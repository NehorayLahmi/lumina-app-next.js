import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "linear-gradient(135deg, #d7baff, #6f00b4, #5bd5fc)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#0f1115",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          L
        </span>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
