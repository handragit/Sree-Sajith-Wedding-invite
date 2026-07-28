import { ImageResponse } from "next/og";

export const alt = "S & S — 14 December 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff8e8", background: "#421c21", border: "24px solid #d8ad58", fontFamily: "Georgia" }}><div style={{ fontSize: 150 }}>S &amp; S</div><div style={{ fontSize: 34, letterSpacing: 8, marginTop: 35 }}>14 DECEMBER 2026 · THRISSUR</div></div>, size);
}
