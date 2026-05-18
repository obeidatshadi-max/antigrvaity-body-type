// supabase/functions/og-image/index.ts
// Generates a dynamic Open Graph image for social sharing
// Returns SVG (browsers) or can be extended with Resvg for PNG

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ORGANS = [
  { num: 1, emoji: "🧠", name: "BRAIN",         company: "Leadership & Strategy",        color: "#c94a2e" },
  { num: 2, emoji: "❤️", name: "HEART",         company: "Culture & Motivation",          color: "#b83232" },
  { num: 3, emoji: "🫁", name: "LUNGS",         company: "Innovation & Learning",         color: "#c97e2e" },
  { num: 4, emoji: "⚙️", name: "STOMACH",       company: "Operations",                    color: "#8b5e3c" },
  { num: 5, emoji: "🟤", name: "LIVER",         company: "Risk Management & Compliance",  color: "#3a6b4a" },
  { num: 6, emoji: "💧", name: "KIDNEYS",       company: "Finance & Audit",               color: "#2a5c7a" },
  { num: 7, emoji: "🛡️", name: "IMMUNE SYSTEM", company: "Legal / Security / QA",         color: "#4a3a6e" },
];

const STRIPE_COLORS = ["#c94a2e","#c97e2e","#c9b42e","#4a5c2e","#2a5c7a","#1c2630"];
const stripeW = Math.floor(1200 / STRIPE_COLORS.length);

function stripes(y: number, h: number): string {
  return STRIPE_COLORS.map((c, i) =>
    `<rect x="${i * stripeW}" y="${y}" width="${stripeW + 1}" height="${h}" fill="${c}"/>`
  ).join("");
}

function buildSVG(): string {
  const W = 1200, H = 630;
  const cream = "#f0e8d0";
  const sand  = "#e8ddc0";
  const dark  = "#1c2630";
  const olive = "#4a5c2e";

  // Organ pills — 2 rows, 4 then 3 centered
  const pillW = 160, pillH = 56, pillGap = 12;
  const row1 = ORGANS.slice(0, 4);
  const row2 = ORGANS.slice(4);
  const row1TotalW = row1.length * pillW + (row1.length - 1) * pillGap;
  const row2TotalW = row2.length * pillW + (row2.length - 1) * pillGap;
  const row1X = (W - row1TotalW) / 2;
  const row2X = (W - row2TotalW) / 2;
  const row1Y = 330;
  const row2Y = row1Y + pillH + 16;

  const pillsHTML = [
    ...row1.map((o, i) => {
      const x = row1X + i * (pillW + pillGap);
      return `
        <rect x="${x}" y="${row1Y}" width="${pillW}" height="${pillH}" rx="4" fill="${o.color}"/>
        <text x="${x + 10}" y="${row1Y + 22}" font-family="sans-serif" font-size="18" font-weight="900" fill="white" letter-spacing="1">${o.num}. ${o.name}</text>
        <text x="${x + 10}" y="${row1Y + 42}" font-family="sans-serif" font-size="10" fill="rgba(255,255,255,0.75)" letter-spacing="0.5">${o.company}</text>
      `;
    }),
    ...row2.map((o, i) => {
      const x = row2X + i * (pillW + pillGap);
      return `
        <rect x="${x}" y="${row2Y}" width="${pillW}" height="${pillH}" rx="4" fill="${o.color}"/>
        <text x="${x + 10}" y="${row2Y + 22}" font-family="sans-serif" font-size="18" font-weight="900" fill="white" letter-spacing="1">${o.num}. ${o.name}</text>
        <text x="${x + 10}" y="${row2Y + 42}" font-family="sans-serif" font-size="10" fill="rgba(255,255,255,0.75)" letter-spacing="0.5">${o.company}</text>
      `;
    }),
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${sand}"/>
      <stop offset="100%" stop-color="${cream}"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Top stripe -->
  ${stripes(0, 14)}

  <!-- Bottom stripe -->
  ${stripes(H - 14, 14)}

  <!-- Dark header band -->
  <rect x="0" y="14" width="${W}" height="80" fill="${dark}"/>

  <!-- antigravity-70s label -->
  <text x="40" y="52" font-family="monospace" font-size="13" letter-spacing="3" fill="${"#c97e2e"}" text-transform="uppercase">ANTIGRAVITY-70S</text>

  <!-- Star -->
  <text x="${W - 70}" y="68" font-family="sans-serif" font-size="40" fill="#c9b42e">✦</text>

  <!-- MAIN TITLE -->
  <text x="${W/2}" y="170" font-family="sans-serif" font-size="72" font-weight="900" fill="${dark}" text-anchor="middle" letter-spacing="4">THE HUMAN BODY</text>
  <text x="${W/2}" y="248" font-family="sans-serif" font-size="72" font-weight="900" fill="#c94a2e" text-anchor="middle" letter-spacing="4">AS A COMPANY</text>

  <!-- Subtitle -->
  <text x="${W/2}" y="290" font-family="monospace" font-size="16" fill="${olive}" text-anchor="middle" letter-spacing="3">7 ESSENTIAL ORGANS · 7 CORE FUNCTIONS · 1 LIVING ORGANIZATION</text>

  <!-- Separator line -->
  <line x1="80" y1="310" x2="${W - 80}" y2="310" stroke="${olive}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.4"/>

  <!-- Organ Pills -->
  ${pillsHTML}

  <!-- Bottom tagline -->
  <rect x="0" y="${H - 80}" width="${W}" height="66" fill="${dark}"/>
  <text x="${W/2}" y="${H - 44}" font-family="sans-serif" font-size="16" font-weight="700" fill="${cream}" text-anchor="middle" letter-spacing="1.5">WHEN EVERY PART KNOWS ITS ROLE — EXTRAORDINARY BECOMES INEVITABLE</text>
  <text x="${W/2}" y="${H - 22}" font-family="serif" font-size="14" font-style="italic" fill="#c97e2e" text-anchor="middle">Shadi Shafiq Obeidat · www.shobeidat.com</text>
</svg>`;
}

serve((_req) => {
  const svg = buildSVG();
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
