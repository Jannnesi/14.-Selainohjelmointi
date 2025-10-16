import React, { useMemo } from "react";

/**
 * DualClimateGauge (Temperature + Pressure + Altitude)
 * - Top semicircle: Pressure (hPa)
 * - Bottom semicircle: Temperature (°C)
 * - Altitude (m) shown next to the center hub
 * - Digital readouts for Pressure & Temperature are shown BELOW the gauge
 *
 * Pure JSX (works in .jsx files)
 */

// Helpers --------------------------------------------------------------------
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const deg2rad = (d) => (Math.PI / 180) * d;

// 0° is 12 o'clock; angles grow clockwise
function angleForValue(value, min, max, startDeg, endDeg) {
  const v = clamp(value, min, max);
  const t = (v - min) / (max - min);
  return deg2rad(startDeg + (endDeg - startDeg) * t);
}

function polar(cx, cy, r, thetaRad) {
  const x = cx + r * Math.sin(thetaRad);
  const y = cy - r * Math.cos(thetaRad);
  return { x, y };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const a0 = deg2rad(startDeg);
  const a1 = deg2rad(endDeg);
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const sweep = 1; // clockwise
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${p1.x} ${p1.y}`;
}

function makeTicks({
  cx,
  cy,
  radius,
  startDeg,
  endDeg,
  min,
  max,
  majorStep,
  minorStep = majorStep / 2,
  labelRadius = radius - 18,
  format = (n) => `${n}`,
  lineProps = {},
  majorLineLength = 10,
  minorLineLength = 6,
  labelProps = {},
}) {
  const lines = [];
  const labels = [];
  const start = min;
  const end = max;

  for (let v = start; v <= end + 1e-9; v += minorStep) {
    const isMajor =
      Math.abs(((v - start) % majorStep)) < 1e-9 ||
      Math.abs(v - end) < 1e-9 ||
      Math.abs(v - start) < 1e-9;

    const theta = angleForValue(v, min, max, startDeg, endDeg);
    const pOuter = polar(cx, cy, radius, theta);
    const pInner = polar(
      cx,
      cy,
      radius - (isMajor ? majorLineLength : minorLineLength),
      theta
    );

    lines.push(
      <line
        key={`tick-${v.toFixed(5)}`}
        x1={pOuter.x}
        y1={pOuter.y}
        x2={pInner.x}
        y2={pInner.y}
        strokeWidth={isMajor ? 2 : 1}
        stroke="currentColor"
        {...lineProps}
      />
    );

    if (isMajor) {
      const lp = polar(cx, cy, labelRadius, theta);
      labels.push(
        <text
          key={`label-${v.toFixed(5)}`}
          x={lp.x}
          y={lp.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none"
          {...labelProps}
        >
          {format(v)}
        </text>
      );
    }
  }

  return { lines, labels };
}

export default function DualClimateGauge({
  temperature,
  pressure,
  altitude = 123,
  size = 420,
  className = "",
}) {
  const VB = 200;
  const cx = 100;
  const cy = 100;
  const rOuter = 94;

  // Scales
  // Pressure in hPa (typical sea-level range ~960–1040 hPa)
  const PRES = { min: 960, max: 1040, start: -160, end: -20 }; // top semicircle, hPa
  const TEMP = { min: -20, max: 80, start: 20, end: 160 }; // bottom semicircle, °C

  const presAngle = angleForValue(pressure, PRES.min, PRES.max, PRES.start, PRES.end);
  const tmpAngle = angleForValue(temperature, TEMP.min, TEMP.max, TEMP.start, TEMP.end);

  const { lines: presTicks, labels: presLabels } = useMemo(
    () =>
      makeTicks({
        cx,
        cy,
        radius: rOuter - 6,
        startDeg: PRES.start,
        endDeg: PRES.end,
        min: PRES.min,
        max: PRES.max,
        majorStep: 10,
        minorStep: 5,
        labelRadius: rOuter - 26,
        lineProps: { stroke: "#0ea5e9" },
        labelProps: { fontSize: 9, fill: "#0f172a", fontWeight: 600 },
        format: (n) => `${Math.round(n)}`,
      }),
    [cx, cy, rOuter]
  );

  const { lines: tempTicks, labels: tempLabels } = useMemo(
    () =>
      makeTicks({
        cx,
        cy,
        radius: rOuter - 6,
        startDeg: TEMP.start,
        endDeg: TEMP.end,
        min: TEMP.min,
        max: TEMP.max,
        majorStep: 20,
        minorStep: 10,
        labelRadius: rOuter - 26,
        lineProps: { stroke: "#ef4444" },
        labelProps: { fontSize: 9, fill: "#0f172a", fontWeight: 600 },
        majorLineLength: 10,
        minorLineLength: 6,
      }),
    [cx, cy, rOuter]
  );

  return (
    <div className={"flex flex-col items-center justify-center " + className}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${VB} ${VB}`}
        className="[filter:_drop-shadow(0_6px_18px_rgba(0,0,0,0.18))] bg-white rounded-full"
      >
        {/* Outer bezel */}
        <defs>
          <radialGradient id="bezel" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#9ca3af" />
          </radialGradient>
          <radialGradient id="hubGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fecaca" />
            <stop offset="100%" stopColor="#ef4444" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={rOuter + 4} fill="url(#bezel)" />
        <circle cx={cx} cy={cy} r={rOuter + 1.5} fill="#ffffff" stroke="#0f172a" strokeWidth={1.2} />

        {/* Colored arcs (top = pressure, bottom = temperature) */}
        <path d={arcPath(cx, cy, rOuter - 2, PRES.start, PRES.end)} stroke="#0ea5e9" strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d={arcPath(cx, cy, rOuter - 2, TEMP.start, TEMP.end)} stroke="#ef4444" strokeWidth={10} fill="none" strokeLinecap="round" />

        {/* Tick marks */}
        <g>{presTicks}</g>
        <g>{tempTicks}</g>

        {/* Numeric tick labels around the arcs */}
        <g>{presLabels}</g>
        <g>{tempLabels}</g>

        {/* Pressure needle (blue) */}
        <g transform={`rotate(${(presAngle * 180) / Math.PI}, ${cx}, ${cy})`} style={{ transition: "transform 400ms ease" }}>
          <line x1={cx} y1={cy + 10} x2={cx} y2={cy - (rOuter - 24)} stroke="#0ea5e9" strokeWidth={4} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={3} fill="#0ea5e9" />
        </g>

        {/* Temperature needle (red, triangular) */}
        <g transform={`rotate(${(tmpAngle * 180) / Math.PI}, ${cx}, ${cy})`} style={{ transition: "transform 400ms ease" }}>
          <polygon points={`${cx - 2},${cy + 10} ${cx + 2},${cy + 10} ${cx + 0},${cy - (rOuter - 12)}`} fill="#ef4444" />
          <circle cx={cx} cy={cy} r={7.8} fill="url(#hubGrad)" stroke="#991b1b" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={2} fill="#fff" />
        </g>

        {/* Altitude readout next to hub */}
        <g>
          <text x={cx + 24} y={cy - 2} textAnchor="start" fontSize={9} fontWeight={600} fill="#0f172a" opacity={0.7}>ALT</text>
          <text x={cx + 24} y={cy + 14} textAnchor="start" fontSize={16} fontWeight={800} fill="#111827">{Math.round(altitude)}<tspan dx={4} fontSize={10} fontWeight={700} fill="#6b7280">m</tspan></text>
        </g>

        {/* Decorative tiny text */}
        <text x={cx} y={cy + 34} textAnchor="middle" fontSize={7} fill="#6b7280">
          <tspan x={cx} dy="0">Seinäjoki</tspan>
          <tspan x={cx} dy="8">Finland</tspan>
        </text>

      </svg>

      {/* Digital readouts below the meter */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 12, alignItems: "center", textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: "#0ea5e9" }}>
          {Number(pressure).toFixed(2)} <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.7 }}>hPa</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 18, color: "#ef4444" }}>
          {temperature} <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.7 }}>°C</span>
        </div>
      </div>
    </div>
  );
}
