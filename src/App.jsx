import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer, ComposedChart, BarChart, Bar, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ReferenceLine, ScatterChart, Scatter, ZAxis, Cell,
  Legend as RLegend,
} from "recharts";
import { LayoutDashboard, Activity, Timer, Coins, Info } from "lucide-react";

const STYLES = `
:root {
  --ink: #14213d;
  --ink-2: #1d2c4f;
  --steel: #46536b;
  --muted: #7a869c;
  --paper: #f5f6f8;
  --card: #ffffff;
  --line: #dee3ea;
  --go: #1e9e6a;
  --go-bg: #e2f4ec;
  --hold: #e5a63b;
  --hold-bg: #fbf1dd;
  --stop: #d9483b;
  --stop-bg: #fbe6e4;
  --sys: #4c6fbf;
  --sys-bg: #e6ecf9;
  --move: #8a6fb8;
  --move-bg: #efe9f8;
  --hi: #f5c518;
  --radius: 10px;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}

* { box-sizing: border-box; }
html, body, #root { height: 100%; margin: 0; }
body {
  font-family: var(--sans);
  background: var(--paper);
  color: var(--ink);
  font-size: 14px;
}

.app { display: flex; min-height: 100vh; }

/* ---------- sidebar ---------- */
.side {
  width: 220px; flex-shrink: 0; background: var(--ink); color: #cfd8e8;
  display: flex; flex-direction: column; padding: 18px 0;
  position: sticky; top: 0; height: 100vh;
}
.side-brand {
  padding: 0 18px 18px; border-bottom: 1px solid rgba(255,255,255,.08);
}
.side-brand b { color: #fff; font-size: 15px; letter-spacing: .02em; display: block; }
.side-brand span { font-size: 11px; color: #8fa0bd; font-family: var(--mono); }
.side nav { padding: 14px 8px; display: flex; flex-direction: column; gap: 2px; }
.side button {
  display: flex; align-items: center; gap: 10px;
  background: none; border: none; color: #b9c5d9; font: inherit;
  padding: 9px 12px; border-radius: 8px; cursor: pointer; text-align: left;
  border-left: 3px solid transparent;
}
.side button:hover { background: rgba(255,255,255,.06); color: #fff; }
.side button.on {
  background: var(--ink-2); color: #fff;
  border-left: 3px solid var(--hi);
}
.side .foot { margin-top: auto; padding: 14px 18px; font-size: 11px; color: #6d7d99; }

/* ---------- main ---------- */
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.page { padding: 18px 22px 30px; display: flex; flex-direction: column; gap: 16px; }
.page-h { display: flex; align-items: baseline; gap: 12px; }
.page-h h1 { margin: 0; font-size: 20px; font-weight: 600; }
.page-h span { color: var(--muted); font-size: 12.5px; }

/* ---------- filter bar ---------- */
.filters {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
  background: var(--card); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 10px 12px; position: sticky; top: 0; z-index: 20;
}
.filters label { font-size: 11px; color: var(--muted); display: block; margin-bottom: 2px; }
.filters select, .filters input[type="date"] {
  font: inherit; font-size: 13px; padding: 6px 8px; border: 1px solid var(--line);
  border-radius: 7px; background: #fff; color: var(--ink); min-width: 110px;
}
.filters .seg { display: flex; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; }
.filters .seg button {
  font: inherit; font-size: 12.5px; padding: 6px 10px; border: none; background: #fff;
  color: var(--steel); cursor: pointer;
}
.filters .seg button.on { background: var(--ink); color: #fff; }
.filters .grow { flex: 1; }

/* ---------- KPI cards ---------- */
.kpis { display: grid; grid-template-columns: repeat(auto-fill, minmax(158px, 1fr)); gap: 10px; }
.kpi {
  background: var(--card); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 12px 14px; position: relative;
}
.kpi .k-label { font-size: 11.5px; color: var(--muted); display: flex; gap: 5px; align-items: center; }
.kpi .k-val { font-size: 24px; font-weight: 600; margin-top: 3px; font-variant-numeric: tabular-nums; }
.kpi .k-sub { font-size: 11px; color: var(--muted); font-family: var(--mono); margin-top: 2px; }
.kpi.good .k-val { color: var(--go); }
.kpi.warn .k-val { color: var(--hold); }
.kpi.bad .k-val { color: var(--stop); }
.kpi .k-info { cursor: help; color: #b0bac9; }
.kpi .k-tip {
  display: none; position: absolute; z-index: 30; top: calc(100% + 6px); left: 8px; right: 8px;
  background: var(--ink); color: #e5ebf5; font-size: 11.5px; line-height: 1.45;
  padding: 8px 10px; border-radius: 8px;
}
.kpi:hover .k-tip { display: block; }

/* ---------- cards / sections ---------- */
.card {
  background: var(--card); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 14px 16px;
}
.card h3 { margin: 0 0 10px; font-size: 13.5px; font-weight: 600; letter-spacing: .01em; }
.card h3 small { color: var(--muted); font-weight: 400; margin-left: 6px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.grid31 { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
@media (max-width: 1080px) { .grid2, .grid31 { grid-template-columns: 1fr; } }

/* ---------- insights ---------- */
.insights { display: flex; flex-direction: column; gap: 8px; }
.insight {
  display: flex; gap: 9px; align-items: flex-start; font-size: 13px; line-height: 1.45;
  padding: 9px 11px; border-radius: 8px; border: 1px solid var(--line); background: #fbfcfe;
}
.insight .dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.insight.stop .dot { background: var(--stop); }
.insight.hold .dot { background: var(--hold); }
.insight.info .dot { background: var(--sys); }

/* ---------- status pills ---------- */
.pill {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 500;
  padding: 3px 9px; border-radius: 99px;
}
.pill.go { background: var(--go-bg); color: var(--go); }
.pill.hold { background: var(--hold-bg); color: #a8720f; }
.pill.stop { background: var(--stop-bg); color: var(--stop); }

/* ---------- tables ---------- */
table.data { width: 100%; border-collapse: collapse; font-size: 13px; }
table.data th {
  text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em;
  color: var(--muted); font-weight: 600; padding: 6px 8px; border-bottom: 1px solid var(--line);
}
table.data td { padding: 7px 8px; border-bottom: 1px solid #edf0f4; font-variant-numeric: tabular-nums; }
table.data tr.click { cursor: pointer; }
table.data tr.click:hover td { background: #f4f7fb; }
td.mono, .mono { font-family: var(--mono); font-size: 12.5px; }
td.num, th.num { text-align: right; }

/* ---------- dock-strip timeline (signature element) ---------- */
.strip-wrap { display: flex; flex-direction: column; gap: 4px; }
.strip-head { display: flex; justify-content: space-between; font-size: 12px; }
.strip-head .mono { color: var(--steel); }
.strip {
  display: flex; height: 22px; border-radius: 5px; overflow: hidden;
  border: 1px solid var(--line); position: relative; background: #fff;
}
.seg { height: 100%; min-width: 2px; position: relative; }
.seg.active { background: var(--go); }
.seg.system { background: var(--sys); }
.seg.transport { background: var(--move); }
.seg.wait {
  background: repeating-linear-gradient(45deg, var(--hold), var(--hold) 5px, #f2c979 5px, #f2c979 10px);
}
.seg.sla {
  background: repeating-linear-gradient(45deg, var(--stop), var(--stop) 5px, #eb8d84 5px, #eb8d84 10px);
}
.sla-mark {
  position: absolute; top: -4px; bottom: -4px; width: 2px; background: var(--ink);
  z-index: 2;
}
.sla-mark::after {
  content: "SLA"; position: absolute; top: -13px; left: -11px; font-size: 9px;
  font-family: var(--mono); color: var(--ink);
}
.legend { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11.5px; color: var(--steel); }
.legend i { width: 14px; height: 10px; display: inline-block; border-radius: 2px; margin-right: 5px; vertical-align: -1px; }
.legend i.active { background: var(--go); }
.legend i.system { background: var(--sys); }
.legend i.transport { background: var(--move); }
.legend i.wait { background: repeating-linear-gradient(45deg, var(--hold), var(--hold) 4px, #f2c979 4px, #f2c979 8px); }
.legend i.sla { background: repeating-linear-gradient(45deg, var(--stop), var(--stop) 4px, #eb8d84 4px, #eb8d84 8px); }

/* ---------- ops process flow ---------- */
.flow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
@media (max-width: 1180px) { .flow { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 760px) { .flow { grid-template-columns: repeat(2, 1fr); } }
.flow .step {
  background: var(--card); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 10px 11px; border-top: 3px solid var(--line);
}
.flow .step.go { border-top-color: var(--go); }
.flow .step.hold { border-top-color: var(--hold); }
.flow .step.stop { border-top-color: var(--stop); }
.flow .step b { font-size: 12.5px; display: block; }
.flow .step .row { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--steel); margin-top: 4px; }
.flow .step .row .mono { font-size: 11.5px; }
.flow .bar { height: 5px; border-radius: 3px; background: #edf0f4; margin-top: 7px; overflow: hidden; }
.flow .bar i { display: block; height: 100%; background: var(--go); }

/* ---------- drawer ---------- */
.drawer-bg {
  position: fixed; inset: 0; background: rgba(16, 25, 43, .45); z-index: 50;
  display: flex; justify-content: flex-end;
}
.drawer {
  width: min(560px, 100%); background: #fff; height: 100%; overflow-y: auto;
  padding: 18px 20px; box-shadow: -12px 0 40px rgba(0,0,0,.25);
}
.drawer h2 { margin: 0; font-size: 16px; }
.drawer .sub { color: var(--muted); font-size: 12.5px; margin: 2px 0 14px; }
.drawer .close {
  float: right; border: 1px solid var(--line); background: #fff; border-radius: 7px;
  font: inherit; padding: 4px 10px; cursor: pointer;
}
.step-rows { display: flex; flex-direction: column; gap: 0; margin-top: 10px; }
.step-row {
  display: grid; grid-template-columns: 52px 14px 1fr 64px; gap: 8px; align-items: center;
  padding: 7px 0; border-bottom: 1px solid #edf0f4; font-size: 12.5px;
}
.step-row .t { font-family: var(--mono); color: var(--steel); font-size: 12px; }
.step-row .d { text-align: right; font-family: var(--mono); font-size: 12px; color: var(--steel); }
.step-row .c { width: 10px; height: 10px; border-radius: 3px; }
.c.active { background: var(--go); }
.c.system { background: var(--sys); }
.c.transport { background: var(--move); }
.c.wait { background: var(--hold); }

/* misc */
.muted { color: var(--muted); }
.right { text-align: right; }
.mt8 { margin-top: 8px; }
.chart-note { font-size: 11.5px; color: var(--muted); margin-top: 6px; }

@media (max-width: 900px) {
  .side { width: 64px; }
  .side-brand b, .side-brand span, .side nav button span, .side .foot { display: none; }
  .side nav button { justify-content: center; padding: 10px; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }

/* ---------- lead-time priority control ---------- */
.lt-toggle { display:flex; border:1px solid var(--line); border-radius:8px; overflow:hidden; }
.lt-toggle button { border:0; background:#fff; color:var(--steel); padding:7px 14px; font:inherit; cursor:pointer; }
.lt-toggle button.on { background:var(--ink); color:#fff; }
.status-summary { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.status-box { border:1px solid var(--line); border-radius:9px; padding:11px 12px; background:#fff; }
.status-box b { display:block; font-size:20px; margin-top:3px; }
.status-box span { font-size:11.5px; color:var(--muted); }
.status-chip { display:inline-flex; align-items:center; gap:6px; padding:4px 9px; border-radius:99px; font-size:11.5px; font-weight:600; white-space:nowrap; }
.status-chip::before { content:""; width:7px; height:7px; border-radius:50%; background:currentColor; }
.status-chip.waiting { color:#a8720f; background:var(--hold-bg); }
.status-chip.active-processing { color:var(--sys); background:var(--sys-bg); }
.status-chip.arrived-at-storage-location { color:var(--go); background:var(--go-bg); }
.status-chip.late-inbound { color:var(--stop); background:var(--stop-bg); }
.stock-zero { color:var(--stop); font-weight:700; }
.stock-ok { color:var(--go); font-weight:600; }
.priority-score { min-width:38px; display:inline-block; text-align:center; padding:3px 7px; border-radius:6px; font-family:var(--mono); font-weight:700; }
.priority-score.p1 { background:var(--stop-bg); color:var(--stop); }
.priority-score.p2 { background:var(--hold-bg); color:#a8720f; }
.priority-score.p3 { background:#edf0f4; color:var(--steel); }
.wave-grid { display:grid; grid-template-columns:repeat(5,minmax(190px,1fr)); gap:10px; overflow-x:auto; padding-bottom:3px; }
.wave-card { border:1px solid var(--line); border-radius:10px; background:#fff; padding:12px; min-width:190px; }
.wave-card.critical { border-top:4px solid var(--stop); }
.wave-card.watch { border-top:4px solid var(--hold); }
.wave-card.ready { border-top:4px solid var(--go); }
.wave-head { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
.wave-time { font-size:22px; font-weight:700; font-family:var(--mono); }
.wave-name { color:var(--muted); font-size:11.5px; margin-top:2px; }
.wave-total { font-size:11px; color:var(--muted); text-align:right; }
.stack { display:flex; height:12px; overflow:hidden; border-radius:6px; background:#edf0f4; margin:12px 0 9px; }
.stack i { display:block; height:100%; }
.stack .loaded { background:var(--go); }
.stack .packed { background:var(--sys); }
.stack .not-packed { background:var(--hold); }
.stack .not-picked { background:var(--move); }
.stack .critical-open { background:var(--stop); }
.wave-status { display:grid; grid-template-columns:1fr auto; gap:5px 8px; font-size:11.5px; }
.wave-status b { font-family:var(--mono); }
.wave-status .critical-text { color:var(--stop); font-weight:700; }
.priority-callout { border-left:4px solid var(--stop); background:#fff8f7; padding:10px 12px; border-radius:7px; font-size:12.5px; line-height:1.45; }
@media (max-width:1000px) { .status-summary { grid-template-columns:repeat(2,1fr); } }

`;

/* ------------------------------------------------------------------
   Dummy data for the Warehouse KPI dashboard.
   Deterministic (seeded) so every build shows the same numbers.
   ------------------------------------------------------------------ */

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WAREHOUSES = [
  {
    id: "OBH",
    name: "Oberhausen",
    region: "DACH",
    profile: { ots: 0.97, otpa: 0.95, lph: 62, cpl: 1.32, waitBias: 0.8, ewmDelay: 0.7, overtime: 0.04 },
  },
  {
    id: "NUE",
    name: "Nürnberg",
    region: "DACH",
    profile: { ots: 0.93, otpa: 0.92, lph: 55, cpl: 1.51, waitBias: 1.0, ewmDelay: 0.9, overtime: 0.11 },
  },
  {
    id: "VIE",
    name: "Wien",
    region: "DACH",
    profile: { ots: 0.9, otpa: 0.84, lph: 51, cpl: 1.58, waitBias: 1.7, ewmDelay: 1.1, overtime: 0.08 },
  },
  {
    id: "ZRH",
    name: "Zürich",
    region: "DACH",
    profile: { ots: 0.96, otpa: 0.94, lph: 58, cpl: 1.86, waitBias: 0.9, ewmDelay: 0.8, overtime: 0.05 },
  },
  {
    id: "WRO",
    name: "Wroclaw",
    region: "CEE",
    profile: { ots: 0.86, otpa: 0.88, lph: 48, cpl: 1.44, waitBias: 1.3, ewmDelay: 1.8, overtime: 0.14 },
  },
];

const SHIFTS = ["Early", "Late", "Night"];
const REGIONS = ["All regions", "DACH", "CEE"];
const PROCESSES = [
  "All processes",
  "Inbound",
  "Put-Away",
  "Picking",
  "Packing",
  "Staging",
  "Loading",
];

const TARGETS = {
  ots: 95,
  otpa: 92,
  lph: 58,
  cpl: 1.45,
  inboundLT: 180, // minutes
  outboundLT: 210,
  quality: 99.0,
};

/* ---------- 14-day daily series per warehouse ---------- */
const DAYS = (() => {
  const out = [];
  const base = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    out.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      dow: d.getDay(),
    });
  }
  return out;
})();

function shiftFactor(shift) {
  if (shift === "Early") return 1.04;
  if (shift === "Late") return 0.98;
  return 0.9; // Night
}

const DAILY = (() => {
  const rows = [];
  WAREHOUSES.forEach((w, wi) => {
    const rnd = mulberry32(1000 + wi * 77);
    DAYS.forEach((day, di) => {
      SHIFTS.forEach((shift, si) => {
        const weekend = day.dow === 0 || day.dow === 6;
        const volBase = weekend ? 0.45 : 1;
        const noise = () => (rnd() - 0.5) * 2;
        const sf = shiftFactor(shift);
        const p = w.profile;
        const badDay = rnd() < 0.12; // occasional bad day
        const ots = Math.min(99.5, Math.max(72, p.ots * 100 + noise() * 3 - (badDay ? 7 : 0)));
        const otpa = Math.min(99.5, Math.max(70, p.otpa * 100 + noise() * 3.5 - (badDay ? 6 : 0)));
        const lph = Math.max(34, p.lph * sf + noise() * 4 - (badDay ? 6 : 0));
        const overtimePct = Math.max(0, p.overtime * 100 + noise() * 2 + (badDay ? 4 : 0));
        const cpl = Math.max(1.05, p.cpl * (1 + overtimePct / 400) + noise() * 0.06);
        const inboundLT = Math.round(
          150 * p.waitBias * (badDay ? 1.35 : 1) + noise() * 18 + (shift === "Night" ? 15 : 0)
        );
        const outboundLT = Math.round(
          185 * (2 - p.ots) * (badDay ? 1.25 : 1) + p.ewmDelay * 14 + noise() * 20
        );
        const linesOut = Math.round((3200 + noise() * 380) * volBase * (0.9 + wi * 0.05));
        const linesIn = Math.round(linesOut * (0.62 + rnd() * 0.12));
        rows.push({
          wh: w.id,
          day: day.key,
          dayLabel: day.label,
          shift,
          ots: +ots.toFixed(1),
          otpa: +otpa.toFixed(1),
          lph: +lph.toFixed(1),
          cpl: +cpl.toFixed(2),
          inboundLT,
          outboundLT,
          backlog: Math.max(0, Math.round(420 * (1 - p.ots) * 10 + noise() * 60 + (badDay ? 180 : 0))),
          attendance: +(Math.min(99, 96 - overtimePct / 3 + noise() * 2)).toFixed(1),
          overtime: +overtimePct.toFixed(1),
          quality: +(Math.min(99.9, 99.4 - (badDay ? 0.5 : 0) + noise() * 0.25)).toFixed(2),
          rework: Math.max(0, Math.round(18 + noise() * 8 + (badDay ? 14 : 0))),
          volumeIn: linesIn,
          volumeOut: linesOut,
          exceptions: Math.max(0, Math.round(6 + noise() * 4 + (badDay ? 11 : 0) + p.ewmDelay * 3)),
        });
      });
    });
  });
  return rows;
})();

/* ---------- lead-time step templates ---------- */
/* categories: wait | active | system | transport | sla */
const INBOUND_STEPS = [
  { id: "arrival", label: "Truck arrival at gate", cat: "transport" },
  { id: "yardWait", label: "Waiting before unloading", cat: "wait" },
  { id: "firstTouch", label: "First physical handling", cat: "active" },
  { id: "unload", label: "Unloading", cat: "active" },
  { id: "grPosting", label: "Goods receipt posting", cat: "system" },
  { id: "sorting", label: "Sorting & internal handling", cat: "active" },
  { id: "paWait", label: "Waiting for put-away", cat: "wait" },
  { id: "putaway", label: "Put-away (first → final)", cat: "active" },
  { id: "available", label: "Available at storage location", cat: "system" },
];

const OUTBOUND_STEPS = [
  { id: "booked", label: "Customer order booked", cat: "system" },
  { id: "ewm", label: "Transfer to EWM", cat: "system" },
  { id: "pickWait", label: "Waiting for first pick", cat: "wait" },
  { id: "picking", label: "Picking (first → last)", cat: "active" },
  { id: "packWait", label: "Waiting for packing", cat: "wait" },
  { id: "packing", label: "Packing (first → last)", cat: "active" },
  { id: "staging", label: "Move to staging", cat: "transport" },
  { id: "loading", label: "Loading onto truck", cat: "active" },
  { id: "departure", label: "Truck departure", cat: "transport" },
];

const fmtHM = (min) => {
  const h = Math.floor(min / 60) % 24;
  const m = Math.round(min % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/* build one inbound truckload with per-step timestamps + durations */
function buildInbound(rnd, w, idx) {
  const p = w.profile;
  const start = 6 * 60 + Math.round(rnd() * 300); // arrival 06:00–11:00
  const durs = {
    arrival: 0,
    yardWait: Math.round((14 + rnd() * 40) * p.waitBias),
    firstTouch: Math.round(4 + rnd() * 6),
    unload: Math.round(25 + rnd() * 25),
    grPosting: Math.round((6 + rnd() * 10) * p.ewmDelay),
    sorting: Math.round(18 + rnd() * 22),
    paWait: Math.round((10 + rnd() * 35) * p.waitBias),
    putaway: Math.round(30 + rnd() * 40),
    available: 3,
  };
  let t = start;
  const steps = INBOUND_STEPS.map((s) => {
    const row = { ...s, start: t, dur: durs[s.id] };
    t += durs[s.id];
    return row;
  });
  const total = t - start;
  const sla = 180;
  return {
    id: `${w.id}-IB-${100 + idx}`,
    wh: w.id,
    type: "inbound",
    carrier: ["DSV", "DB Schenker", "Raben", "Gebr. Weiss", "Dachser"][idx % 5],
    steps,
    arrival: start,
    done: t,
    total,
    sla,
    slaBreach: Math.max(0, total - sla),
    lateOutboundImpact: total > sla ? Math.round(8 + rnd() * 26) : 0,
  };
}

/* build one outbound order/delivery */
function buildOutbound(rnd, w, idx) {
  const p = w.profile;
  const start = 8 * 60 + Math.round(rnd() * 330); // booked 08:00–13:30
  const durs = {
    booked: 0,
    ewm: Math.round((3 + rnd() * 9) * p.ewmDelay),
    pickWait: Math.round((8 + rnd() * 30) * p.waitBias),
    picking: Math.round(15 + rnd() * 30),
    packWait: Math.round(5 + rnd() * 18),
    packing: Math.round(10 + rnd() * 20),
    staging: Math.round(6 + rnd() * 10),
    loading: Math.round(10 + rnd() * 14),
    departure: 0,
  };
  let t = start;
  const steps = OUTBOUND_STEPS.map((s) => {
    const row = { ...s, start: t, dur: durs[s.id] };
    t += durs[s.id];
    return row;
  });
  const plannedDep = start + 200 + Math.round(rnd() * 40);
  const actualDep = t;
  const deviation = actualDep - plannedDep;
  return {
    id: `${w.id}-DL-${4000 + idx}`,
    wh: w.id,
    type: "outbound",
    customer: ["Bauhof Nord", "ProFix GmbH", "Hansa Bau", "Metalux", "CityTech", "Werkstatt24"][idx % 6],
    lines: 4 + Math.round(rnd() * 26),
    steps,
    booked: start,
    plannedDep,
    actualDep,
    total: actualDep - start,
    deviation,
    slaBreach: Math.max(0, deviation),
  };
}

const TRUCKLOADS = (() => {
  const list = [];
  WAREHOUSES.forEach((w, wi) => {
    const rnd = mulberry32(500 + wi * 13);
    for (let i = 0; i < 6; i++) list.push(buildInbound(rnd, w, i));
  });
  return list;
})();

const ORDERS = (() => {
  const list = [];
  WAREHOUSES.forEach((w, wi) => {
    const rnd = mulberry32(900 + wi * 29);
    for (let i = 0; i < 8; i++) list.push(buildOutbound(rnd, w, i));
  });
  return list;
})();

/* ---------- operational snapshot (today) ---------- */
const OPS_STEPS = [
  "Inbound",
  "Put-Away",
  "Picking",
  "Packing",
  "Staging",
  "Loading",
  "Departure",
];

const OPS = (() => {
  const map = {};
  WAREHOUSES.forEach((w, wi) => {
    const rnd = mulberry32(300 + wi * 7);
    const p = w.profile;
    map[w.id] = OPS_STEPS.map((step, si) => {
      const total = Math.round(600 + rnd() * 900);
      const donePct = 0.35 + rnd() * 0.45 - (si > 3 ? 0.1 : 0);
      const done = Math.round(total * Math.max(0.1, donePct));
      const avgLT = Math.round([28, 55, 24, 18, 12, 20, 0][si] * p.waitBias + rnd() * 8);
      const tgtLT = [25, 45, 22, 16, 10, 18, 0][si];
      const cap = Math.round(8 + rnd() * 14);
      const risk =
        avgLT > tgtLT * 1.3 || done / total < 0.35
          ? "stop"
          : avgLT > tgtLT * 1.1
          ? "hold"
          : "go";
      return { step, total, done, open: total - done, avgLT, tgtLT, cap, risk };
    });
  });
  return map;
})();

/* ---------- rule-based insights ---------- */
function buildInsights(rows, whFilter) {
  const agg = aggregate(rows);
  const list = [];
  if (agg.ots < TARGETS.ots)
    list.push({
      tone: "stop",
      text: `OTS ${agg.ots.toFixed(1)}% is below the ${TARGETS.ots}% target — ${Math.round(
        (TARGETS.ots - agg.ots) * 0.6
      )} truckloads departed after SLA this period.`,
    });
  if (agg.inboundLT > TARGETS.inboundLT)
    list.push({
      tone: "hold",
      text: `Inbound lead time is ${agg.inboundLT} min (target ${TARGETS.inboundLT}) — trucks are waiting too long before unloading, mainly in Wien and Wroclaw.`,
    });
  if (agg.cpl > TARGETS.cpl)
    list.push({
      tone: "hold",
      text: `Cost per Line rose to €${agg.cpl.toFixed(2)} — driven by ${agg.overtime.toFixed(
        1
      )}% overtime and productivity below ${TARGETS.lph} lines/h.`,
    });
  list.push({
    tone: "info",
    text: "Orders booked after 14:00 show a significantly higher OTS risk — consider earlier cutoff communication to sales.",
  });
  if (!whFilter || whFilter === "ALL")
    list.push({
      tone: "stop",
      text: "Wroclaw needs attention: EWM transfer delays and backlog are pushing truck departures past SLA.",
    });
  return list.slice(0, 4);
}

function aggregate(rows) {
  if (!rows.length)
    return {
      ots: 0, otpa: 0, lph: 0, cpl: 0, inboundLT: 0, outboundLT: 0,
      backlog: 0, attendance: 0, overtime: 0, quality: 0,
      volumeIn: 0, volumeOut: 0, exceptions: 0, rework: 0,
    };
  const n = rows.length;
  const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
  return {
    ots: sum("ots") / n,
    otpa: sum("otpa") / n,
    lph: sum("lph") / n,
    cpl: sum("cpl") / n,
    inboundLT: Math.round(sum("inboundLT") / n),
    outboundLT: Math.round(sum("outboundLT") / n),
    backlog: Math.round(sum("backlog") / n),
    attendance: sum("attendance") / n,
    overtime: sum("overtime") / n,
    quality: sum("quality") / n,
    volumeIn: sum("volumeIn"),
    volumeOut: sum("volumeOut"),
    exceptions: sum("exceptions"),
    rework: sum("rework"),
  };
}

const KPI_DEFS = {
  ots: "On-Time Shipping: share of deliveries that physically departed within the agreed truck SLA.",
  otpa: "On-Time Put-Away: share of inbound receipts stored at the final location within the inbound SLA.",
  lph: "Lines per Hour: productive picking/packing lines per paid productive hour.",
  cpl: "Cost per Line: total warehouse cost divided by processed order lines.",
  inLT: "Inbound lead time: truck arrival → goods available at storage location.",
  outLT: "Outbound lead time: order booking → actual truck departure.",
  backlog: "Backlog: order lines past their planned processing time and still open.",
  attendance: "Attendance: present hours vs. planned hours of the scheduled workforce.",
  overtime: "Overtime: paid overtime hours as a share of total paid hours.",
  quality: "Quality: share of lines processed without error or rework.",
};

const PAGES = [
  { id: "mgmt", label: "Management Overview", icon: LayoutDashboard },
  { id: "ops", label: "Operational Control", icon: Activity },
  { id: "lead", label: "Lead-Time Analysis", icon: Timer },
  { id: "prod", label: "Productivity & Cost", icon: Coins },
];

function Sidebar({ page, setPage }) {
  return (
    <aside className="side">
      <div className="side-brand">
        <b>Warehouse KPI Control</b>
        <span>EU network · dummy data</span>
      </div>
      <nav>
        {PAGES.map((p) => {
          const Icon = p.icon;
          return (
            <button key={p.id} className={page === p.id ? "on" : ""} onClick={() => setPage(p.id)}>
              <Icon size={17} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="foot">v0.1 · prototype<br />no backend</div>
    </aside>
  );
}

function FilterBar({ f, setF }) {
  const set = (k, v) => setF({ ...f, [k]: v });
  return (
    <div className="filters">
      <div>
        <label>Date</label>
        <select value={f.day} onChange={(e) => set("day", e.target.value)}>
          <option value="ALL">Last 14 days</option>
          {DAYS.map((d) => (
            <option key={d.key} value={d.key}>{d.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Warehouse</label>
        <select value={f.wh} onChange={(e) => set("wh", e.target.value)}>
          <option value="ALL">All warehouses</option>
          {WAREHOUSES.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Shift</label>
        <select value={f.shift} onChange={(e) => set("shift", e.target.value)}>
          <option value="ALL">All shifts</option>
          {SHIFTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Process</label>
        <select value={f.process} onChange={(e) => set("process", e.target.value)}>
          {PROCESSES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Region</label>
        <select value={f.region} onChange={(e) => set("region", e.target.value)}>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Scope</label>
        <div className="seg">
          {["Today Must", "Today Can"].map((s) => (
            <button key={s} className={f.scope === s ? "on" : ""} onClick={() => set("scope", s)}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="grow" />
      <div>
        <label>View</label>
        <div className="seg">
          {["Management", "Tactical", "Operational"].map((v) => (
            <button key={v} className={f.view === v ? "on" : ""} onClick={() => set("view", v)}>
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, tone, tip }) {
  return (
    <div className={`kpi ${tone || ""}`}>
      <div className="k-label">
        {label}
        {tip && <Info size={12} className="k-info" />}
      </div>
      <div className="k-val">{value}</div>
      {sub && <div className="k-sub">{sub}</div>}
      {tip && <div className="k-tip">{tip}</div>}
    </div>
  );
}

function Pill({ risk }) {
  const label = risk === "go" ? "On track" : risk === "hold" ? "Watch" : "Action";
  return <span className={`pill ${risk}`}>{label}</span>;
}

function toneFor(value, target, higherIsBetter = true, warnBand = 0.03) {
  if (higherIsBetter) {
    if (value >= target) return "good";
    if (value >= target * (1 - warnBand)) return "warn";
    return "bad";
  }
  if (value <= target) return "good";
  if (value <= target * (1 + warnBand)) return "warn";
  return "bad";
}

/* The dock-strip: a segmented lead-time bar styled like warehouse floor markings.
   wait = hatched amber, active = solid green, system = blue, transport = violet,
   time beyond SLA = hatched red. An SLA tick marks the target. */
function SegmentBar({ steps, sla, startAt, title, rightLabel }) {
  const total = steps.reduce((a, s) => a + s.dur, 0);
  const span = Math.max(total, sla || 0);
  let acc = 0;
  const segs = [];
  steps.forEach((s) => {
    if (s.dur <= 0) return;
    const from = acc;
    const to = acc + s.dur;
    acc = to;
    if (sla && from >= sla) {
      segs.push({ ...s, dur: s.dur, cat: "sla", tip: `${s.label} · after SLA` });
    } else if (sla && to > sla) {
      segs.push({ ...s, dur: sla - from, tip: s.label });
      segs.push({ ...s, dur: to - sla, cat: "sla", tip: `${s.label} · after SLA` });
    } else {
      segs.push({ ...s, tip: s.label });
    }
  });
  return (
    <div className="strip-wrap">
      {(title || rightLabel) && (
        <div className="strip-head">
          <span>{title}</span>
          <span className="mono">{rightLabel}</span>
        </div>
      )}
      <div className="strip">
        {segs.map((s, i) => (
          <div
            key={i}
            className={`seg ${s.cat}`}
            style={{ width: `${(s.dur / span) * 100}%` }}
            title={`${s.tip} · ${s.dur} min${startAt != null ? ` · from ${fmtHM(startAt + cum(segs, i))}` : ""}`}
          />
        ))}
        {sla && sla < span && (
          <div className="sla-mark" style={{ left: `${(sla / span) * 100}%` }} />
        )}
        {sla && sla >= span && (
          <div className="sla-mark" style={{ left: "calc(100% - 2px)" }} />
        )}
      </div>
    </div>
  );
}

function cum(segs, idx) {
  let a = 0;
  for (let i = 0; i < idx; i++) a += segs[i].dur;
  return a;
}

function Legend() {
  return (
    <div className="legend">
      <span><i className="wait" />Waiting</span>
      <span><i className="active" />Active processing</span>
      <span><i className="system" />System processing</span>
      <span><i className="transport" />Transport / movement</span>
      <span><i className="sla" />Beyond SLA</span>
    </div>
  );
}

/* Drill-down drawer: full step list with timestamps + the strip */
function DetailDrawer({ item, onClose }) {
  if (!item) return null;
  const isIn = item.type === "inbound";
  return (
    <div className="drawer-bg" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>Close</button>
        <h2>{item.id}</h2>
        <div className="sub">
          {isIn
            ? `Inbound truckload · ${item.carrier} · arrival ${fmtHM(item.arrival)}`
            : `Outbound delivery · ${item.customer} · ${item.lines} lines · booked ${fmtHM(item.booked)}`}
        </div>
        <SegmentBar
          steps={item.steps}
          sla={isIn ? item.sla : item.plannedDep - item.booked}
          startAt={isIn ? item.arrival : item.booked}
          title={isIn ? "Arrival → available at storage" : "Booking → truck departure"}
          rightLabel={`${item.total} min total`}
        />
        <div className="mt8"><Legend /></div>

        <div className="step-rows">
          {item.steps.map((s) => (
            <div className="step-row" key={s.id}>
              <span className="t">{fmtHM(s.start)}</span>
              <span className={`c ${s.cat}`} />
              <span>{s.label}</span>
              <span className="d">{s.dur > 0 ? `${s.dur} min` : "—"}</span>
            </div>
          ))}
        </div>

        {isIn ? (
          <p className="chart-note">
            SLA {item.sla} min · breach {item.slaBreach} min
            {item.lateOutboundImpact > 0 &&
              ` · late put-away put ${item.lateOutboundImpact} outbound order lines at risk`}
          </p>
        ) : (
          <p className="chart-note">
            Planned departure {fmtHM(item.plannedDep)} · actual {fmtHM(item.actualDep)} ·{" "}
            {item.deviation > 0 ? `${item.deviation} min late` : `${-item.deviation} min early`}
          </p>
        )}
      </div>
    </div>
  );
}

function Management({ rows, allRows, f }) {
  const agg = useMemo(() => aggregate(rows), [rows]);
  const insights = useMemo(() => buildInsights(rows, f.wh), [rows, f.wh]);

  const trend = useMemo(() => {
    return DAYS.map((d) => {
      const dr = rows.filter((r) => r.day === d.key);
      const a = aggregate(dr);
      return {
        day: d.label,
        OTS: +a.ots.toFixed(1),
        OTPA: +a.otpa.toFixed(1),
        volume: a.volumeOut,
      };
    });
  }, [rows]);

  const attention = useMemo(() => {
    return WAREHOUSES.map((w) => {
      const a = aggregate(allRows.filter((r) => r.wh === w.id));
      const risk =
        a.ots < TARGETS.ots - 3 || a.backlog > 600
          ? "stop"
          : a.ots < TARGETS.ots || a.otpa < TARGETS.otpa
          ? "hold"
          : "go";
      return { ...w, a, risk };
    }).sort((x, y) => x.a.ots - y.a.ots);
  }, [allRows]);

  return (
    <>
      <div className="kpis">
        <KpiCard label="On-Time Shipping" tip={KPI_DEFS.ots}
          value={`${agg.ots.toFixed(1)}%`} sub={`target ${TARGETS.ots}%`}
          tone={toneFor(agg.ots, TARGETS.ots)} />
        <KpiCard label="On-Time Put-Away" tip={KPI_DEFS.otpa}
          value={`${agg.otpa.toFixed(1)}%`} sub={`target ${TARGETS.otpa}%`}
          tone={toneFor(agg.otpa, TARGETS.otpa)} />
        <KpiCard label="Lines per Hour" tip={KPI_DEFS.lph}
          value={agg.lph.toFixed(1)} sub={`target ${TARGETS.lph}`}
          tone={toneFor(agg.lph, TARGETS.lph)} />
        <KpiCard label="Cost per Line" tip={KPI_DEFS.cpl}
          value={`€${agg.cpl.toFixed(2)}`} sub={`target €${TARGETS.cpl.toFixed(2)}`}
          tone={toneFor(agg.cpl, TARGETS.cpl, false)} />
        <KpiCard label="Inbound lead time" tip={KPI_DEFS.inLT}
          value={`${agg.inboundLT} min`} sub={`target ${TARGETS.inboundLT} min`}
          tone={toneFor(agg.inboundLT, TARGETS.inboundLT, false, 0.1)} />
        <KpiCard label="Outbound lead time" tip={KPI_DEFS.outLT}
          value={`${agg.outboundLT} min`} sub={`target ${TARGETS.outboundLT} min`}
          tone={toneFor(agg.outboundLT, TARGETS.outboundLT, false, 0.1)} />
        <KpiCard label="Backlog" tip={KPI_DEFS.backlog}
          value={agg.backlog} sub="open lines past plan"
          tone={agg.backlog > 600 ? "bad" : agg.backlog > 350 ? "warn" : "good"} />
        <KpiCard label="Attendance" tip={KPI_DEFS.attendance}
          value={`${agg.attendance.toFixed(1)}%`} sub="present vs planned"
          tone={toneFor(agg.attendance, 94)} />
        <KpiCard label="Overtime" tip={KPI_DEFS.overtime}
          value={`${agg.overtime.toFixed(1)}%`} sub="of paid hours"
          tone={agg.overtime > 10 ? "bad" : agg.overtime > 6 ? "warn" : "good"} />
        <KpiCard label="Quality" tip={KPI_DEFS.quality}
          value={`${agg.quality.toFixed(2)}%`} sub={`target ${TARGETS.quality}%`}
          tone={toneFor(agg.quality, TARGETS.quality, true, 0.005)} />
        <KpiCard label="Volume out" value={agg.volumeOut.toLocaleString("en")} sub="order lines shipped" />
        <KpiCard label="Exceptions" value={agg.exceptions} sub="process exceptions"
          tone={agg.exceptions > 120 ? "warn" : undefined} />
      </div>

      <div className="grid31">
        <div className="card">
          <h3>OTS & OTPA trend <small>vs shipped volume · 14 days</small></h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={trend} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="#edf0f4" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="p" domain={[75, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis yAxisId="v" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <RLegend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="v" dataKey="volume" name="Lines shipped" fill="#dbe3ee" radius={[3, 3, 0, 0]} />
              <ReferenceLine yAxisId="p" y={TARGETS.ots} stroke="#d9483b" strokeDasharray="4 3" />
              <Line yAxisId="p" dataKey="OTS" stroke="#1e9e6a" strokeWidth={2} dot={false} />
              <Line yAxisId="p" dataKey="OTPA" stroke="#4c6fbf" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="chart-note">Dashed line = OTS target {TARGETS.ots}%.</div>
        </div>

        <div className="card">
          <h3>Why the numbers look like this</h3>
          <div className="insights">
            {insights.map((ins, i) => (
              <div key={i} className={`insight ${ins.tone}`}>
                <span className="dot" />
                <span>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Warehouses requiring attention <small>ranked by OTS, full network</small></h3>
        <table className="data">
          <thead>
            <tr>
              <th>Warehouse</th><th>Region</th>
              <th className="num">OTS</th><th className="num">OTPA</th>
              <th className="num">Lines/h</th><th className="num">€/Line</th>
              <th className="num">Backlog</th><th className="num">Overtime</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attention.map((w) => (
              <tr key={w.id}>
                <td><b>{w.name}</b></td>
                <td className="muted">{w.region}</td>
                <td className="num">{w.a.ots.toFixed(1)}%</td>
                <td className="num">{w.a.otpa.toFixed(1)}%</td>
                <td className="num">{w.a.lph.toFixed(1)}</td>
                <td className="num">€{w.a.cpl.toFixed(2)}</td>
                <td className="num">{w.a.backlog}</td>
                <td className="num">{w.a.overtime.toFixed(1)}%</td>
                <td><Pill risk={w.risk} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const CUTOFF_MIN = 14 * 60;

function Operations({ f }) {
  const [sel, setSel] = useState(null);
  const whIds = f.wh === "ALL" ? WAREHOUSES.map((w) => w.id) : [f.wh];

  /* merge the per-warehouse process snapshots for the selected scope */
  const steps = useMemo(() => {
    const merged = OPS[whIds[0]].map((s) => ({ ...s }));
    whIds.slice(1).forEach((id) => {
      OPS[id].forEach((s, i) => {
        merged[i].total += s.total;
        merged[i].done += s.done;
        merged[i].open += s.open;
        merged[i].avgLT = Math.round((merged[i].avgLT + s.avgLT) / 2);
        merged[i].cap += s.cap;
        if (s.risk === "stop" || merged[i].risk === "stop") merged[i].risk = "stop";
        else if (s.risk === "hold" || merged[i].risk === "hold") merged[i].risk = "hold";
      });
    });
    return merged;
  }, [whIds.join(",")]);

  const totals = useMemo(() => {
    const total = steps.reduce((a, s) => a + s.total, 0);
    const done = steps.reduce((a, s) => a + s.done, 0);
    const cap = steps.reduce((a, s) => a + s.cap, 0);
    return { total, done, open: total - done, cap };
  }, [steps]);

  const now = 11 * 60 + 20; // simulated "now" 11:20
  const minsLeft = CUTOFF_MIN - now;
  const reqProd = Math.round(totals.open / (minsLeft / 60) / Math.max(1, totals.cap));

  const atRiskIn = TRUCKLOADS.filter((t) => whIds.includes(t.wh) && t.slaBreach > 0);
  const atRiskOut = ORDERS.filter((o) => whIds.includes(o.wh) && o.deviation > 0);
  const bottleneck = [...steps].sort((a, b) => b.avgLT / b.tgtLT - a.avgLT / a.tgtLT)[0];

  return (
    <>
      <div className="kpis">
        <KpiCard label="Current workload" value={totals.total.toLocaleString("en")} sub="order lines today" />
        <KpiCard label="Completed" value={totals.done.toLocaleString("en")}
          sub={`${Math.round((totals.done / totals.total) * 100)}% done`} tone="good" />
        <KpiCard label="Open" value={totals.open.toLocaleString("en")} sub="lines remaining"
          tone={totals.open > totals.done ? "warn" : undefined} />
        <KpiCard label="Time to cutoff" value={`${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m`}
          sub={`cutoff ${fmtHM(CUTOFF_MIN)} · now ${fmtHM(now)}`}
          tone={minsLeft < 120 ? "warn" : undefined} />
        <KpiCard label="Labor on floor" value={`${totals.cap} FTE`} sub="available capacity" />
        <KpiCard label="Required productivity" value={`${reqProd} l/h`} sub="per FTE to clear open work"
          tone={reqProd > 60 ? "bad" : reqProd > 50 ? "warn" : "good"} />
        <KpiCard label="At-risk deliveries" value={atRiskOut.length} sub="departure after SLA"
          tone={atRiskOut.length > 6 ? "bad" : atRiskOut.length > 2 ? "warn" : "good"} />
        <KpiCard label="At-risk truckloads" value={atRiskIn.length} sub="inbound past SLA"
          tone={atRiskIn.length > 4 ? "bad" : atRiskIn.length > 1 ? "warn" : "good"} />
      </div>

      <div className="card">
        <h3>
          Main process today
          <small>
            bottleneck: <b>{bottleneck.step}</b> ({bottleneck.avgLT} vs {bottleneck.tgtLT} min target)
          </small>
        </h3>
        <div className="flow">
          {steps.map((s) => (
            <div key={s.step} className={`step ${s.risk}`}>
              <b>{s.step}</b>
              <div className="row"><span>Done / total</span><span className="mono">{s.done}/{s.total}</span></div>
              <div className="row"><span>Open</span><span className="mono">{s.open}</span></div>
              <div className="row"><span>Lead time</span>
                <span className="mono">{s.avgLT || "—"}{s.tgtLT ? ` / ${s.tgtLT}` : ""}{s.avgLT ? " min" : ""}</span>
              </div>
              <div className="row"><span>Capacity</span><span className="mono">{s.cap} FTE</span></div>
              <div className="bar"><i style={{ width: `${(s.done / s.total) * 100}%` }} /></div>
              <div className="row mt8"><Pill risk={s.risk} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <h3>At-risk inbound truckloads <small>click a row for the timeline</small></h3>
          <table className="data">
            <thead>
              <tr><th>Truckload</th><th>WH</th><th>Carrier</th><th className="num">Arrival</th>
                <th className="num">Total</th><th className="num">Breach</th></tr>
            </thead>
            <tbody>
              {atRiskIn.map((t) => (
                <tr key={t.id} className="click" onClick={() => setSel(t)}>
                  <td className="mono">{t.id}</td>
                  <td>{t.wh}</td>
                  <td>{t.carrier}</td>
                  <td className="num mono">{fmtHM(t.arrival)}</td>
                  <td className="num mono">{t.total} min</td>
                  <td className="num mono" style={{ color: "var(--stop)" }}>+{t.slaBreach} min</td>
                </tr>
              ))}
              {atRiskIn.length === 0 && (
                <tr><td colSpan={6} className="muted">No inbound truckloads past SLA in this scope.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>At-risk outbound deliveries <small>click a row for the timeline</small></h3>
          <table className="data">
            <thead>
              <tr><th>Delivery</th><th>WH</th><th>Customer</th><th className="num">Planned dep.</th>
                <th className="num">Actual</th><th className="num">Deviation</th></tr>
            </thead>
            <tbody>
              {atRiskOut.map((o) => (
                <tr key={o.id} className="click" onClick={() => setSel(o)}>
                  <td className="mono">{o.id}</td>
                  <td>{o.wh}</td>
                  <td>{o.customer}</td>
                  <td className="num mono">{fmtHM(o.plannedDep)}</td>
                  <td className="num mono">{fmtHM(o.actualDep)}</td>
                  <td className="num mono" style={{ color: "var(--stop)" }}>+{o.deviation} min</td>
                </tr>
              ))}
              {atRiskOut.length === 0 && (
                <tr><td colSpan={6} className="muted">No deliveries at risk in this scope.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailDrawer item={sel} onClose={() => setSel(null)} />
    </>
  );
}

const MATERIAL_GROUPS = [
  { wh:"OBH", group:"Fasteners & Anchors", articles:46, zeroStock:9, openOrders:128, status:"Late Inbound", arrival:"07:18", age:224, sla:180, completion:64 },
  { wh:"OBH", group:"Power Tools", articles:18, zeroStock:5, openOrders:74, status:"Active Processing", arrival:"09:05", age:118, sla:180, completion:48 },
  { wh:"OBH", group:"Consumables", articles:62, zeroStock:0, openOrders:31, status:"Arrived at storage location", arrival:"06:42", age:151, sla:180, completion:100 },
  { wh:"NUE", group:"Diamond Systems", articles:14, zeroStock:6, openOrders:93, status:"Waiting", arrival:"08:24", age:171, sla:180, completion:12 },
  { wh:"NUE", group:"Measuring Systems", articles:21, zeroStock:2, openOrders:44, status:"Active Processing", arrival:"09:32", age:96, sla:180, completion:58 },
  { wh:"NUE", group:"Installation Systems", articles:37, zeroStock:0, openOrders:18, status:"Arrived at storage location", arrival:"07:11", age:166, sla:180, completion:100 },
  { wh:"VIE", group:"Fasteners & Anchors", articles:41, zeroStock:12, openOrders:167, status:"Late Inbound", arrival:"06:55", age:249, sla:180, completion:39 },
  { wh:"VIE", group:"Firestop", articles:25, zeroStock:4, openOrders:61, status:"Waiting", arrival:"08:47", age:159, sla:180, completion:8 },
  { wh:"VIE", group:"Power Tools", articles:16, zeroStock:1, openOrders:39, status:"Active Processing", arrival:"10:02", age:81, sla:180, completion:67 },
  { wh:"ZRH", group:"Consumables", articles:55, zeroStock:0, openOrders:22, status:"Arrived at storage location", arrival:"07:38", age:143, sla:180, completion:100 },
  { wh:"ZRH", group:"Measuring Systems", articles:19, zeroStock:3, openOrders:57, status:"Active Processing", arrival:"09:18", age:103, sla:180, completion:52 },
  { wh:"ZRH", group:"Installation Systems", articles:28, zeroStock:0, openOrders:13, status:"Waiting", arrival:"10:26", age:65, sla:180, completion:4 },
  { wh:"WRO", group:"Fasteners & Anchors", articles:49, zeroStock:15, openOrders:201, status:"Late Inbound", arrival:"06:21", age:283, sla:180, completion:31 },
  { wh:"WRO", group:"Diamond Systems", articles:17, zeroStock:7, openOrders:112, status:"Late Inbound", arrival:"07:04", age:241, sla:180, completion:43 },
  { wh:"WRO", group:"Power Tools", articles:23, zeroStock:2, openOrders:48, status:"Waiting", arrival:"09:44", age:91, sla:180, completion:5 },
];

const DEPARTURE_WAVES = [
  { key:"P18", time:"18:00", name:"Parcel departure", loaded:420, packed:96, notPacked:54, notPicked:37, critical:28 },
  { key:"L18", time:"18:00", name:"Linehaul departure", loaded:286, packed:74, notPacked:63, notPicked:51, critical:36 },
  { key:"1830", time:"18:30", name:"Express departure", loaded:174, packed:68, notPacked:35, notPicked:26, critical:15 },
  { key:"20", time:"20:00", name:"Evening departure", loaded:118, packed:82, notPacked:47, notPicked:44, critical:12 },
  { key:"22", time:"22:00", name:"Late departure", loaded:42, packed:61, notPacked:52, notPicked:67, critical:8 },
];

function statusSlug(value) { return value.toLowerCase().replaceAll(" ", "-"); }

function LeadTime({ f }) {
  const [dir, setDir] = useState("inbound");
  const whIds = f.wh === "ALL" ? WAREHOUSES.map((w) => w.id) : [f.wh];

  const inboundRows = useMemo(() => MATERIAL_GROUPS
    .filter((r) => whIds.includes(r.wh))
    .map((r) => ({
      ...r,
      priority: (r.status === "Late Inbound" ? 45 : 0) + Math.min(35, r.zeroStock * 3) + Math.min(20, Math.round(r.openOrders / 10)),
    }))
    .sort((a,b) => b.priority - a.priority), [whIds.join(",")]);

  const inboundAgg = useMemo(() => ({
    articles: inboundRows.reduce((a,r)=>a+r.articles,0),
    zeroStock: inboundRows.reduce((a,r)=>a+r.zeroStock,0),
    openOrders: inboundRows.reduce((a,r)=>a+r.openOrders,0),
    lateOrders: inboundRows.filter(r=>r.status === "Late Inbound").reduce((a,r)=>a+r.openOrders,0),
  }), [inboundRows]);

  const statusCounts = useMemo(() => ["Waiting","Active Processing","Arrived at storage location","Late Inbound"].map(status => ({
    status,
    articles: inboundRows.filter(r=>r.status===status).reduce((a,r)=>a+r.articles,0),
    orders: inboundRows.filter(r=>r.status===status).reduce((a,r)=>a+r.openOrders,0),
  })), [inboundRows]);

  const factor = whIds.length === WAREHOUSES.length ? 1 : 0.23 + WAREHOUSES.findIndex(w=>w.id===whIds[0]) * 0.015;
  const waves = useMemo(() => DEPARTURE_WAVES.map(w => {
    const scale = v => Math.max(1, Math.round(v * factor));
    const row = { ...w, loaded:scale(w.loaded), packed:scale(w.packed), notPacked:scale(w.notPacked), notPicked:scale(w.notPicked), critical:scale(w.critical) };
    row.total = row.loaded + row.packed + row.notPacked + row.notPicked + row.critical;
    row.readiness = Math.round((row.loaded / row.total) * 100);
    row.risk = row.critical > row.total*.07 ? "critical" : row.critical > row.total*.035 ? "watch" : "ready";
    return row;
  }), [factor]);

  const outboundAgg = useMemo(() => ({
    total: waves.reduce((a,w)=>a+w.total,0),
    loaded: waves.reduce((a,w)=>a+w.loaded,0),
    packed: waves.reduce((a,w)=>a+w.packed,0),
    critical: waves.reduce((a,w)=>a+w.critical,0),
    notPicked: waves.reduce((a,w)=>a+w.notPicked,0),
  }), [waves]);

  return (
    <>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div>
            <h3 style={{marginBottom:3}}>Lead-Time Control</h3>
            <div className="muted" style={{fontSize:12.5}}>
              Prioritize material availability inbound and protect the next outbound departure.
            </div>
          </div>
          <div className="lt-toggle">
            <button className={dir==="inbound"?"on":""} onClick={()=>setDir("inbound")}>Inbound · material availability</button>
            <button className={dir==="outbound"?"on":""} onClick={()=>setDir("outbound")}>Outbound · departure waves</button>
          </div>
        </div>
      </div>

      {dir === "inbound" ? (
        <>
          <div className="kpis">
            <KpiCard label="Inbound articles" value={inboundAgg.articles} sub="articles in current inbound scope" />
            <KpiCard label="Zero-stock articles" value={inboundAgg.zeroStock} sub="no available stock before receipt" tone={inboundAgg.zeroStock>20?"bad":"warn"} />
            <KpiCard label="Open customer orders" value={inboundAgg.openOrders} sub="dependent on these material groups" tone="warn" />
            <KpiCard label="Orders exposed to late inbound" value={inboundAgg.lateOrders} sub="highest operational priority" tone="bad" />
          </div>

          <div className="status-summary">
            {statusCounts.map(s => <div className="status-box" key={s.status}>
              <span className={`status-chip ${statusSlug(s.status)}`}>{s.status}</span>
              <b>{s.articles}</b>
              <span>articles · {s.orders} open orders</span>
            </div>)}
          </div>

          <div className="priority-callout">
            <b>Priority rule:</b> Material groups are ranked first by late inbound, then by zero-stock exposure and the number of open customer orders. A late group with zero stock should be processed before a larger receipt that already has available stock.
          </div>

          <div className="card">
            <h3>Inbound material-group priority queue <small>arrival → final storage location</small></h3>
            <table className="data">
              <thead><tr>
                <th>Priority</th><th>Material group</th><th>WH</th><th>Status</th><th className="num">Articles</th>
                <th className="num">Zero stock</th><th className="num">Open orders</th><th className="num">Arrival</th>
                <th className="num">Elapsed / SLA</th><th style={{minWidth:130}}>Progress</th>
              </tr></thead>
              <tbody>{inboundRows.map((r,i) => {
                const pClass=i<3?"p1":i<7?"p2":"p3";
                return <tr key={`${r.wh}-${r.group}`}>
                  <td><span className={`priority-score ${pClass}`}>P{i+1}</span></td>
                  <td><b>{r.group}</b></td><td className="mono">{r.wh}</td>
                  <td><span className={`status-chip ${statusSlug(r.status)}`}>{r.status}</span></td>
                  <td className="num">{r.articles}</td>
                  <td className={`num ${r.zeroStock>0?"stock-zero":"stock-ok"}`}>{r.zeroStock>0?r.zeroStock:"Covered"}</td>
                  <td className="num"><b>{r.openOrders}</b></td><td className="num mono">{r.arrival}</td>
                  <td className="num mono" style={{color:r.age>r.sla?"var(--stop)":undefined}}>{r.age} / {r.sla} min</td>
                  <td><div className="bar" style={{height:7,background:"#edf0f4",borderRadius:4,overflow:"hidden"}}><i style={{display:"block",height:"100%",width:`${r.completion}%`,background:r.status==="Late Inbound"?"var(--stop)":r.status==="Arrived at storage location"?"var(--go)":"var(--sys)"}} /></div></td>
                </tr>})}</tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="kpis">
            <KpiCard label="Orders in departure scope" value={outboundAgg.total} sub="across five truck departures" />
            <KpiCard label="Loaded" value={outboundAgg.loaded} sub={`${Math.round(outboundAgg.loaded/outboundAgg.total*100)}% physically on truck`} tone="good" />
            <KpiCard label="Packed, waiting to load" value={outboundAgg.packed} sub="ready for loading" tone="warn" />
            <KpiCard label="Open & critical" value={outboundAgg.critical} sub="cannot meet departure without action" tone="bad" />
            <KpiCard label="Not picked" value={outboundAgg.notPicked} sub="still before first physical handling" tone={outboundAgg.notPicked>150?"bad":"warn"} />
          </div>

          <div className="priority-callout">
            <b>Control logic:</b> “Open & critical” contains orders whose remaining pick, pack and loading time is longer than the time left to the assigned truck departure. These orders require immediate escalation or reassignment to a later departure.
          </div>

          <div className="card">
            <h3>Outbound departure waves <small>two departures at 18:00, followed by 18:30, 20:00 and 22:00</small></h3>
            <div className="wave-grid">{waves.map(w => <div className={`wave-card ${w.risk}`} key={w.key}>
              <div className="wave-head"><div><div className="wave-time">{w.time}</div><div className="wave-name">{w.name}</div></div><div className="wave-total"><b>{w.total}</b><br/>orders</div></div>
              <div className="stack" title="Process-status distribution">
                <i className="loaded" style={{width:`${w.loaded/w.total*100}%`}}/><i className="packed" style={{width:`${w.packed/w.total*100}%`}}/>
                <i className="not-packed" style={{width:`${w.notPacked/w.total*100}%`}}/><i className="not-picked" style={{width:`${w.notPicked/w.total*100}%`}}/>
                <i className="critical-open" style={{width:`${w.critical/w.total*100}%`}}/>
              </div>
              <div className="wave-status">
                <span>Loaded</span><b>{w.loaded}</b><span>Packed, waiting to load</span><b>{w.packed}</b>
                <span>Not packed</span><b>{w.notPacked}</b><span>Not picked</span><b>{w.notPicked}</b>
                <span className="critical-text">Open & critical</span><b className="critical-text">{w.critical}</b>
              </div>
            </div>)}</div>
          </div>

          <div className="card">
            <h3>Departure readiness table <small>prioritize the earliest critical wave</small></h3>
            <table className="data"><thead><tr><th>Departure</th><th>Truck / wave</th><th className="num">Total</th><th className="num">Loaded</th><th className="num">Packed waiting</th><th className="num">Not packed</th><th className="num">Not picked</th><th className="num">Open & critical</th><th className="num">Loaded share</th></tr></thead>
            <tbody>{waves.map(w=><tr key={w.key}><td className="mono"><b>{w.time}</b></td><td>{w.name}</td><td className="num">{w.total}</td><td className="num stock-ok">{w.loaded}</td><td className="num">{w.packed}</td><td className="num">{w.notPacked}</td><td className="num">{w.notPicked}</td><td className="num stock-zero">{w.critical}</td><td className="num"><b>{w.readiness}%</b></td></tr>)}</tbody></table>
          </div>
        </>
      )}
    </>
  );
}

function Productivity({ rows, f }) {
  const agg = useMemo(() => aggregate(rows), [rows]);

  const paidHours = Math.round(agg.volumeOut / Math.max(1, agg.lph));
  const productiveHours = Math.round(paidHours * (agg.attendance / 100) * 0.88);
  const otHours = Math.round(paidHours * (agg.overtime / 100));
  const tempShare = 14;

  const trend = useMemo(
    () =>
      DAYS.map((d) => {
        const a = aggregate(rows.filter((r) => r.day === d.key));
        return { day: d.label, "Lines/h": +a.lph.toFixed(1), "€/Line": +a.cpl.toFixed(2) };
      }),
    [rows]
  );

  const byShift = useMemo(
    () =>
      SHIFTS.map((s) => {
        const a = aggregate(rows.filter((r) => r.shift === s));
        return { name: s, "Lines/h": +a.lph.toFixed(1), "€/Line": +a.cpl.toFixed(2) };
      }),
    [rows]
  );

  const byProcess = useMemo(() => {
    /* simple modeled split of cost + productivity across processes */
    const split = [
      { name: "Inbound", cost: 0.16, prod: 0.9 },
      { name: "Put-Away", cost: 0.14, prod: 0.85 },
      { name: "Picking", cost: 0.34, prod: 1.1 },
      { name: "Packing", cost: 0.22, prod: 1.0 },
      { name: "Staging/Loading", cost: 0.14, prod: 0.95 },
    ];
    const totalCost = agg.volumeOut * agg.cpl;
    return split.map((s) => ({
      name: s.name,
      "Cost (€)": Math.round(totalCost * s.cost),
      "Lines/h": +(agg.lph * s.prod).toFixed(1),
    }));
  }, [agg]);

  const scatter = useMemo(
    () =>
      DAILY.filter((r) => (f.wh === "ALL" ? true : r.wh === f.wh)).map((r) => ({
        volume: r.volumeOut,
        lph: r.lph,
        wh: r.wh,
      })),
    [f.wh]
  );

  const wasteCost = useMemo(() => {
    const total = agg.volumeOut * agg.cpl;
    return [
      { name: "Overtime premium", value: Math.round(otHours * 9) },
      { name: "Waiting time", value: Math.round(total * 0.045) },
      { name: "Rework", value: Math.round(agg.rework * 38) },
      { name: "Low productivity vs target", value: Math.round(Math.max(0, TARGETS.lph - agg.lph) * paidHours * 0.02 * 10) },
    ];
  }, [agg, otHours, paidHours]);

  return (
    <>
      <div className="kpis">
        <KpiCard label="Lines per Hour" tip={KPI_DEFS.lph} value={agg.lph.toFixed(1)}
          sub={`target ${TARGETS.lph}`} tone={toneFor(agg.lph, TARGETS.lph)} />
        <KpiCard label="Cost per Line" tip={KPI_DEFS.cpl} value={`€${agg.cpl.toFixed(2)}`}
          sub={`target €${TARGETS.cpl.toFixed(2)}`} tone={toneFor(agg.cpl, TARGETS.cpl, false)} />
        <KpiCard label="Paid hours" value={paidHours.toLocaleString("en")} sub="period total" />
        <KpiCard label="Productive hours" value={productiveHours.toLocaleString("en")}
          sub={`${Math.round((productiveHours / paidHours) * 100)}% of paid`} />
        <KpiCard label="Attendance" tip={KPI_DEFS.attendance} value={`${agg.attendance.toFixed(1)}%`}
          sub={`absence ${(100 - agg.attendance).toFixed(1)}%`} tone={toneFor(agg.attendance, 94)} />
        <KpiCard label="Overtime" tip={KPI_DEFS.overtime} value={`${agg.overtime.toFixed(1)}%`}
          sub={`${otHours.toLocaleString("en")} h`} tone={agg.overtime > 10 ? "bad" : agg.overtime > 6 ? "warn" : "good"} />
        <KpiCard label="Temporary labor" value={`${tempShare}%`} sub="of productive hours" />
        <KpiCard label="Direct / indirect" value="78 / 22" sub="% of paid hours" />
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Productivity vs cost <small>14-day trend</small></h3>
          <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={trend} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="#edf0f4" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="l" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="c" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="€" />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <RLegend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine yAxisId="l" y={TARGETS.lph} stroke="#1e9e6a" strokeDasharray="4 3" />
              <Line yAxisId="l" dataKey="Lines/h" stroke="#1e9e6a" strokeWidth={2} dot={false} />
              <Line yAxisId="c" dataKey="€/Line" stroke="#d9483b" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="chart-note">When Lines/h drops, €/Line rises — the two curves mirror each other.</div>
        </div>

        <div className="card">
          <h3>Volume vs productivity <small>each dot = one warehouse-shift-day</small></h3>
          <ResponsiveContainer width="100%" height={230}>
            <ScatterChart margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="#edf0f4" />
              <XAxis dataKey="volume" name="Lines" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="lph" name="Lines/h" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <ZAxis range={[28, 28]} />
              <Tooltip contentStyle={{ fontSize: 12 }} cursor={{ strokeDasharray: "3 3" }} />
              <ReferenceLine y={TARGETS.lph} stroke="#1e9e6a" strokeDasharray="4 3" />
              <Scatter data={scatter} fill="#4c6fbf" fillOpacity={0.55} />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="chart-note">Very low-volume days are unproductive too — fixed effort spreads over fewer lines.</div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Cost & productivity by process</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={byProcess} margin={{ top: 6, right: 8, left: -6, bottom: 0 }}>
              <CartesianGrid stroke="#edf0f4" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="c" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="p" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <RLegend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="c" dataKey="Cost (€)" fill="#c6cfdd" radius={[3, 3, 0, 0]} />
              <Line yAxisId="p" dataKey="Lines/h" stroke="#1e9e6a" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Avoidable cost this period <small>modeled from current performance</small></h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={wasteCost} layout="vertical" margin={{ top: 4, right: 24, left: 60, bottom: 0 }}>
              <CartesianGrid stroke="#edf0f4" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} unit=" €" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="value" name="Cost impact (€)" fill="#e5a63b" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-note">
            Productivity by shift: {SHIFTS.map((s, i) => `${s} ${byShift[i]["Lines/h"]} l/h`).join(" · ")}.
          </div>
        </div>
      </div>
    </>
  );
}

function WarehouseApp() {
  const [page, setPage] = useState("mgmt");
  const [f, setF] = useState({
    day: "ALL",
    wh: "ALL",
    shift: "ALL",
    process: "All processes",
    region: "All regions",
    scope: "Today Must",
    view: "Management",
  });

  const rows = useMemo(() => {
    const regionIds =
      f.region === "All regions"
        ? null
        : WAREHOUSES.filter((w) => w.region === f.region).map((w) => w.id);
    return DAILY.filter(
      (r) =>
        (f.day === "ALL" || r.day === f.day) &&
        (f.wh === "ALL" || r.wh === f.wh) &&
        (f.shift === "ALL" || r.shift === f.shift) &&
        (!regionIds || regionIds.includes(r.wh))
    );
  }, [f]);

  const title = PAGES.find((p) => p.id === page)?.label;
  const subtitle = {
    mgmt: "Network performance, causes and financial impact",
    ops: "Live floor situation — workload, cutoff risk and required actions",
    lead: "End-to-end lead times — where waiting hides inside the process",
    prod: "Hours, productivity and what low performance really costs",
  }[page];

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />
      <div className="main">
        <div className="page">
          <div className="page-h">
            <h1>{title}</h1>
            <span>{subtitle}</span>
          </div>
          <FilterBar f={f} setF={setF} />
          {page === "mgmt" && <Management rows={rows} allRows={DAILY} f={f} />}
          {page === "ops" && <Operations f={f} />}
          {page === "lead" && <LeadTime f={f} />}
          {page === "prod" && <Productivity rows={rows} f={f} />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{STYLES}</style>
      <WarehouseApp />
    </>
  );
}
