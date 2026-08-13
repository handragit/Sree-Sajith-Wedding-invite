import { ImageResponse } from "next/og";

export const alt = "S & S — 13–14 December 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fffaf0", background: "#6b1726", border: "24px solid #b68a3e", fontFamily: "Georgia" }}><div style={{ fontSize: 142 }}>S &amp; S</div><div style={{ fontSize: 30, letterSpacing: 7, marginTop: 35 }}>13–14 DECEMBER 2026 · THRISSUR</div></div>, size);
}
