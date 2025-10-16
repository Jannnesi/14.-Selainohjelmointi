import React, { useEffect, useMemo, useState } from 'react'
import SensorService from '../services/SensorService'

// Simple SVG line chart for today's temperatures fetched from SensorService
// Props:
// - width, height: chart size in px
// - title: optional heading text
// - className: optional container classes
export default function TemperatureTodayChart({
  width = 720,
  height = 300,
  title = "Temperature",
  className = "",
}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const todayStr = () => new Date().toISOString().slice(0, 10)
  const [dateStr, setDateStr] = useState(todayStr())

  useEffect(() => {
    let alive = true
    setLoading(true)
    SensorService
      .getByDate(dateStr)
      .then(res => {
        if (!alive) return
        const rows = Array.isArray(res.data) ? res.data : []
        rows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        setData(rows)
        setError(null)
      })
      .catch(err => {
        console.error('Failed to load data for date', dateStr, err)
        if (!alive) return
        setError("Failed to load data for the selected date")
        setData([])
      })
      .finally(() => alive && setLoading(false))

    return () => { alive = false }
  }, [dateStr])

  // Extra right margin to fit pressure (hPa) labels
  const margin = { top: 16, right: 56, bottom: 28, left: 44 }
  const innerW = Math.max(0, width - margin.left - margin.right)
  const innerH = Math.max(0, height - margin.top - margin.bottom)

  const series = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map(d => ({
      t: new Date(d.timestamp),
      yT: Number(d.temperature),
      yP: Number(d.pressure), // hPa
      raw: d,
    }))
  }, [data])

  const domains = useMemo(() => {
    if (series.length === 0) return null
    const tMin = series[0].t.getTime()
    const tMax = series[series.length - 1].t.getTime()

    // Temperature domain
    let tMinY = Infinity, tMaxY = -Infinity
    // Pressure domain (hPa)
    let pMinY = Infinity, pMaxY = -Infinity

    for (const p of series) {
      if (Number.isFinite(p.yT)) {
        tMinY = Math.min(tMinY, p.yT)
        tMaxY = Math.max(tMaxY, p.yT)
      }
      if (Number.isFinite(p.yP)) {
        pMinY = Math.min(pMinY, p.yP)
        pMaxY = Math.max(pMaxY, p.yP)
      }
    }
    if (!Number.isFinite(tMinY) || !Number.isFinite(tMaxY) || !Number.isFinite(pMinY) || !Number.isFinite(pMaxY)) return null

    const tPad = Math.max(0.5, (tMaxY - tMinY) * 0.1)
    const pPad = Math.max(1, (pMaxY - pMinY) * 0.1)
    return {
      tMin,
      tMax: tMax === tMin ? tMin + 1 : tMax,
      tYMin: tMinY - tPad,
      tYMax: tMaxY + tPad,
      pYMin: pMinY - pPad,
      pYMax: pMaxY + pPad,
    }
  }, [series])

  const toX = (tMs) => {
    if (!domains) return margin.left
    return margin.left + ((tMs - domains.tMin) / (domains.tMax - domains.tMin)) * innerW
  }
  const toYTemp = (y) => {
    if (!domains) return margin.top
    return margin.top + (1 - (y - domains.tYMin) / (domains.tYMax - domains.tYMin)) * innerH
  }
  const toYPres = (y) => {
    if (!domains) return margin.top
    return margin.top + (1 - (y - domains.pYMin) / (domains.pYMax - domains.pYMin)) * innerH
  }

  const pathTemp = useMemo(() => {
    if (!domains || series.length === 0) return ''
    const parts = []
    for (let i = 0; i < series.length; i++) {
      const p = series[i]
      const x = toX(p.t.getTime())
      const y = toYTemp(p.yT)
      parts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
    }
    return parts.join(' ')
  }, [series, domains])

  const pathPres = useMemo(() => {
    if (!domains || series.length === 0) return ''
    const parts = []
    for (let i = 0; i < series.length; i++) {
      const p = series[i]
      const x = toX(p.t.getTime())
      const y = toYPres(p.yP)
      parts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
    }
    return parts.join(' ')
  }, [series, domains])

  const xTicks = useMemo(() => {
    if (!domains) return []
    const count = 6
    const dt = (domains.tMax - domains.tMin) / (count - 1)
    const ticks = []
    for (let i = 0; i < count; i++) {
      const t = new Date(domains.tMin + dt * i)
      ticks.push({
        x: toX(t.getTime()),
        label: t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      })
    }
    return ticks
  }, [domains])

  const yTicksTemp = useMemo(() => {
    if (!domains) return []
    const count = 5
    const dy = (domains.tYMax - domains.tYMin) / (count - 1)
    const ticks = []
    for (let i = 0; i < count; i++) {
      const yv = domains.tYMin + dy * i
      ticks.push({ y: toYTemp(yv), label: yv.toFixed(0) })
    }
    return ticks
  }, [domains])

  const yTicksPres = useMemo(() => {
    if (!domains) return []
    const count = 5
    const dy = (domains.pYMax - domains.pYMin) / (count - 1)
    const ticks = []
    for (let i = 0; i < count; i++) {
      const yv = domains.pYMin + dy * i
      ticks.push({ y: toYPres(yv), label: yv.toFixed(0) })
    }
    return ticks
  }, [domains])

  // Gauge-like card styling
  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 12,
    boxShadow: '0 6px 18px rgba(0,0,0,0.18)'
  }

  // Controls: prev/datepicker/next — centered under chart
  const changeByDays = (delta) => {
    const d = new Date(dateStr + 'T00:00:00')
    d.setDate(d.getDate() + delta)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    setDateStr(`${yyyy}-${mm}-${dd}`)
  }

  const isFuture = (candidate) => {
    const today = new Date(todayStr() + 'T00:00:00').getTime()
    const c = new Date(candidate + 'T00:00:00').getTime()
    return c > today
  }

  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={cardStyle}>
        {title && (
          <div style={{ fontWeight: 800, marginBottom: 8, color: '#111827' }}>{title}</div>
        )}
        {loading && <div>Loading...</div>}
        {!loading && error && <div style={{ color: 'crimson' }}>{error}</div>}
        {!loading && !error && data && data.length === 0 && (
          <div>No data for selected date.</div>
        )}

        {!loading && !error && data && data.length > 0 && (
          <svg width={width} height={height} role="img" aria-label="Temperature and Pressure chart">
            {/* X and Y axes */}
            <line x1={margin.left} y1={margin.top + innerH} x2={margin.left + innerW} y2={margin.top + innerH} stroke="#111827" strokeWidth={1} />
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + innerH} stroke="#111827" strokeWidth={1} />
            {/* Right Y axis for pressure */}
            <line x1={margin.left + innerW} y1={margin.top} x2={margin.left + innerW} y2={margin.top + innerH} stroke="#0ea5e9" strokeWidth={1} />

            {/* Gridlines and tick labels */}
            {/* Y grid from temperature ticks */}
            {yTicksTemp.map((t, i) => (
              <g key={`y-${i}`}>
                <line x1={margin.left} y1={t.y} x2={margin.left + innerW} y2={t.y} stroke="#e5e7eb" />
                <text x={margin.left - 6} y={t.y} textAnchor="end" dominantBaseline="central" fontSize={11} fill="#374151">{t.label}°C</text>
              </g>
            ))}
            {/* Right Y labels for pressure */}
            {yTicksPres.map((t, i) => (
              <g key={`yr-${i}`}>
                <text x={margin.left + innerW + 6} y={t.y} textAnchor="start" dominantBaseline="central" fontSize={11} fill="#0ea5e9">{t.label} hPa</text>
              </g>
            ))}
            {/* X grid */}
            {xTicks.map((t, i) => (
              <g key={`x-${i}`}>
                <line x1={t.x} y1={margin.top} x2={t.x} y2={margin.top + innerH} stroke="#f3f4f6" />
                <text x={t.x} y={margin.top + innerH + 18} textAnchor="middle" fontSize={11} fill="#374151">{t.label}</text>
              </g>
            ))}

            {/* Data lines */}
            <path d={pathTemp} fill="none" stroke="#ef4444" strokeWidth={2} />
            <path d={pathPres} fill="none" stroke="#0ea5e9" strokeWidth={2} />

            {/* Points with native title tooltip */}
            {series.map((p, i) => (
              <g key={`pt-${i}`}>
                {/* Temp point */}
                <circle cx={toX(p.t.getTime())} cy={toYTemp(p.yT)} r={2.6} fill="#ef4444">
                  <title>{`${p.t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} — ${p.yT.toFixed(2)} °C`}</title>
                </circle>
                {/* Pressure point */}
                <circle cx={toX(p.t.getTime())} cy={toYPres(p.yP)} r={2.6} fill="#0ea5e9">
                  <title>{`${p.t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} — ${p.yP.toFixed(2)} hPa`}</title>
                </circle>
              </g>
            ))}
          </svg>
        )}

        {/* Bottom controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => changeByDays(-1)}
            style={{ color: '#374151', padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#f9fafb', cursor: 'pointer' }}
            aria-label="Previous day"
          >
            ◀ Prev
          </button>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            max={todayStr()}
            style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 8 }}
            aria-label="Select date"
          />
          <button
            type="button"
            onClick={() => !isFuture(dateStr) && changeByDays(1)}
            disabled={isFuture(dateStr)}
            style={{ color: '#374151',  padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#f9fafb', cursor: 'pointer', opacity: isFuture(dateStr) ? 0.5 : 1 }}
            aria-label="Next day"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  )
}
