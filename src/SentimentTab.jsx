import { useState, useEffect } from 'react';

const FEAR_GREED_URL = 'https://api.alternative.me/fng/?limit=30';

function getGaugeColor(val) {
  if (val <= 20) return '#c45050';
  if (val <= 40) return '#d08040';
  if (val <= 60) return '#c4b040';
  if (val <= 80) return '#60a060';
  return '#40b840';
}

function getGaugeLabel(val) {
  if (val <= 20) return 'Extreme Fear';
  if (val <= 40) return 'Fear';
  if (val <= 60) return 'Neutral';
  if (val <= 80) return 'Greed';
  return 'Extreme Greed';
}

function getGaugeGradient(val) {
  if (val <= 20) return 'linear-gradient(to right, #8b2020, #c45050)';
  if (val <= 40) return 'linear-gradient(to right, #c45050, #d08040)';
  if (val <= 60) return 'linear-gradient(to right, #d08040, #c4b040)';
  if (val <= 80) return 'linear-gradient(to right, #c4b040, #60a060)';
  return 'linear-gradient(to right, #60a060, #40b840)';
}

function GaugeChart({ value, label, subtitle, size = 180 }) {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const progress = (value / 100) * circumference;
  const color = getGaugeColor(value);
  const gradient = getGaugeGradient(value);
  const center = size / 2;

  return (
    <div className="gauge-container">
      <svg width={size} height={size / 2 + 30} viewBox={"0 0 " + size + " " + (size / 2 + 30)}>
        <path
          d={"M 10 " + (center) + " A " + radius + " " + radius + " 0 0 1 " + (size - 10) + " " + center}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={"M 10 " + center + " A " + radius + " " + radius + " 0 0 1 " + (size - 10) + " " + center}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x={center} y={center - 10} textAnchor="middle" fill="#d4d4d4" fontSize="32" fontWeight="700">{value}</text>
        <text x={center} y={center + 14} textAnchor="middle" fill="#777" fontSize="11">{getGaugeLabel(value)}</text>
      </svg>
      <div className="gauge-label">{label}</div>
      {subtitle && <div className="gauge-subtitle">{subtitle}</div>}
    </div>
  );
}

function SparklineBar({ values, width = 200, height = 40 }) {
  if (!values || values.length === 0) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const barW = (width - values.length) / values.length;

  return (
    <svg width={width} height={height} className="sparkline-svg">
      {values.map((v, i) => {
        const h = ((v - min) / range) * (height - 4) + 2;
        const y = height - h;
        const color = v <= 25 ? '#c45050' : v <= 45 ? '#d08040' : v <= 55 ? '#c4b040' : v <= 75 ? '#60a060' : '#40b840';
        return <rect key={i} x={i * (barW + 1)} y={y} width={barW} height={h} fill={color} rx="1" />;
      })}
    </svg>
  );
}

const SIMULATED_CBBI = {
  value: 62,
  components: [
    { name: 'MVRV Z-Score', value: 1.4, signal: 'Neutral', color: '#c4b040' },
    { name: 'Reserve Risk', value: 0.0028, signal: 'Bullish', color: '#4080d0' },
    { name: 'NUPL', value: 0.38, signal: 'Bullish', color: '#4080d0' },
    { name: 'Stock-to-Flow', value: 1.2, signal: 'Neutral', color: '#c4b040' },
    { name: 'NVT Ratio', value: 45, signal: 'Bearish', color: '#d08040' },
    { name: 'Puell Multiple', value: 0.95, signal: 'Neutral', color: '#c4b040' },
  ],
  confidence: 72,
  trend: 'bullish',
  lastUpdated: '2h ago',
};

const SIMULATED_LONGTERM = {
  value: 48,
  components: [
    { name: '2Y MA Multiplier', value: 0.82, signal: 'Undervalued', color: '#4080d0' },
    { name: '200W MA Heatmap', value: 0.65, signal: 'Neutral', color: '#c4b040' },
    { name: 'Rainbow Chart', value: 0.45, signal: 'Buy', color: '#60a060' },
    { name: 'Pi Cycle Top', value: 0.78, signal: 'Neutral', color: '#c4b040' },
    { name: 'Golden Ratio Multiplier', value: 1.1, signal: 'Neutral', color: '#c4b040' },
  ],
  confidence: 65,
  trend: 'neutral',
  lastUpdated: '4h ago',
};

const BASE_SPECIFIC = {
  value: 71,
  components: [
    { name: 'Base TVL Trend', value: '+12.4%', signal: 'Bullish', color: '#4080d0' },
    { name: 'Dex Volume 7d', value: '$892M', signal: 'Bullish', color: '#4080d0' },
    { name: 'Active Addresses', value: '412K', signal: 'Bullish', color: '#4080d0' },
    { name: 'New Contracts 7d', value: '+28%', signal: 'Bullish', color: '#4080d0' },
    { name: 'Fee Revenue 7d', value: '$1.2M', signal: 'Neutral', color: '#c4b040' },
    { name: 'Bridge Net Flow', value: '+$34M', signal: 'Bullish', color: '#4080d0' },
  ],
  confidence: 58,
  trend: 'bullish',
  lastUpdated: '30m ago',
};

function SignalBadge({ signal }) {
  const colors = {
    'Extreme Fear': { bg: 'rgba(196,80,80,0.15)', border: '#c45050', text: '#c45050' },
    'Fear': { bg: 'rgba(208,128,64,0.15)', border: '#d08040', text: '#d08040' },
    'Bearish': { bg: 'rgba(208,128,64,0.15)', border: '#d08040', text: '#d08040' },
    'Neutral': { bg: 'rgba(196,176,64,0.15)', border: '#c4b040', text: '#c4b040' },
    'Bullish': { bg: 'rgba(64,128,208,0.15)', border: '#4080d0', text: '#4080d0' },
    'Greed': { bg: 'rgba(96,160,96,0.15)', border: '#60a060', text: '#60a060' },
    'Buy': { bg: 'rgba(96,160,96,0.15)', border: '#60a060', text: '#60a060' },
    'Undervalued': { bg: 'rgba(64,128,208,0.15)', border: '#4080d0', text: '#4080d0' },
    'Extreme Greed': { bg: 'rgba(64,184,64,0.15)', border: '#40b840', text: '#40b840' },
  };
  const c = colors[signal] || colors['Neutral'];
  return <span className="signal-badge" style={{ background: c.bg, border: "1px solid " + c.border, color: c.text }}>{signal}</span>;
}

function TrendArrow({ trend }) {
  if (trend === 'bullish') return <span className="trend-arrow trend-up">&#9650;</span>;
  if (trend === 'bearish') return <span className="trend-arrow trend-down">&#9660;</span>;
  return <span className="trend-arrow trend-flat">&#9654;</span>;
}

export default function SentimentTab() {
  const [fearGreed, setFearGreed] = useState(null);
  const [fgHistory, setFgHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(FEAR_GREED_URL)
      .then(r => r.json())
      .then(d => {
        if (d.data && d.data.length > 0) {
          const current = d.data[0];
          setFearGreed({
            value: parseInt(current.value),
            classification: current.value_classification,
            timestamp: new Date(parseInt(current.timestamp) * 1000).toLocaleDateString(),
          });
          const hist = d.data.slice(0, 30).reverse().map(x => parseInt(x.value));
          setFgHistory(hist);
        }
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
        // Use simulated data on failure
        setFearGreed({ value: 45, classification: 'Fear', timestamp: new Date().toLocaleDateString() });
        setFgHistory([22, 25, 28, 31, 35, 38, 40, 42, 44, 45, 43, 41, 39, 42, 44, 46, 48, 45, 43, 40, 38, 35, 33, 30, 28, 32, 36, 40, 42, 45]);
      });
  }, []);

  if (loading) return <div className="loading"><span className="spinner"></span>Loading sentiment data...</div>;

  return (
    <div className="sentiment-tab">
      <div className="sentiment-overview">
        <div className="sentiment-card gauge-card">
          <div className="sentiment-card-header">
            <span className="sentiment-card-title">Fear & Greed Index</span>
            <span className="sentiment-card-source">alternative.me</span>
          </div>
          <GaugeChart value={fearGreed?.value || 0} label="Crypto Market" subtitle={fearGreed?.timestamp} />
          <div className="sparkline-section">
            <div className="sparkline-label">30-day trend</div>
            <SparklineBar values={fgHistory} />
          </div>
        </div>

        <div className="sentiment-card gauge-card">
          <div className="sentiment-card-header">
            <span className="sentiment-card-title">CBBI Index</span>
            <span className="sentiment-card-source">cbbi.info</span>
          </div>
          <GaugeChart value={SIMULATED_CBBI.value} label="Cycle Position" subtitle={"Updated " + SIMULATED_CBBI.lastUpdated} />
          <div className="index-components">
            {SIMULATED_CBBI.components.map((c, i) => (
              <div className="index-component" key={i}>
                <span className="comp-name">{c.name}</span>
                <span className="comp-value">{c.value}</span>
                <SignalBadge signal={c.signal} />
              </div>
            ))}
          </div>
          <div className="index-meta">
            <span className="meta-confidence">Confidence: {SIMULATED_CBBI.confidence}%</span>
            <span className="meta-trend">Trend: <TrendArrow trend={SIMULATED_CBBI.trend} /> {SIMULATED_CBBI.trend}</span>
          </div>
        </div>
      </div>

      <div className="sentiment-secondary">
        <div className="sentiment-card">
          <div className="sentiment-card-header">
            <span className="sentiment-card-title">Long-Term Indicators</span>
            <span className="sentiment-card-source">on-chain</span>
          </div>
          <div className="mini-gauge-row">
            <div className="mini-gauge">
              <div className="mini-gauge-value" style={{ color: getGaugeColor(SIMULATED_LONGTERM.value) }}>{SIMULATED_LONGTERM.value}</div>
              <div className="mini-gauge-bar">
                <div className="mini-gauge-fill" style={{ width: SIMULATED_LONGTERM.value + "%", background: getGaugeGradient(SIMULATED_LONGTERM.value) }}></div>
              </div>
              <div className="mini-gauge-label">Composite</div>
            </div>
            <div className="index-components compact">
              {SIMULATED_LONGTERM.components.map((c, i) => (
                <div className="index-component" key={i}>
                  <span className="comp-name">{c.name}</span>
                  <span className="comp-value">{c.value}</span>
                  <SignalBadge signal={c.signal} />
                </div>
              ))}
            </div>
          </div>
          <div className="index-meta">
            <span className="meta-confidence">Confidence: {SIMULATED_LONGTERM.confidence}%</span>
            <span className="meta-trend">Trend: <TrendArrow trend={SIMULATED_LONGTERM.trend} /> {SIMULATED_LONGTERM.trend}</span>
          </div>
        </div>

        <div className="sentiment-card">
          <div className="sentiment-card-header">
            <span className="sentiment-card-title">Base Chain Sentiment</span>
            <span className="sentiment-card-source">base chain metrics</span>
          </div>
          <div className="mini-gauge-row">
            <div className="mini-gauge">
              <div className="mini-gauge-value" style={{ color: getGaugeColor(BASE_SPECIFIC.value) }}>{BASE_SPECIFIC.value}</div>
              <div className="mini-gauge-bar">
                <div className="mini-gauge-fill" style={{ width: BASE_SPECIFIC.value + "%", background: getGaugeGradient(BASE_SPECIFIC.value) }}></div>
              </div>
              <div className="mini-gauge-label">Composite</div>
            </div>
            <div className="index-components compact">
              {BASE_SPECIFIC.components.map((c, i) => (
                <div className="index-component" key={i}>
                  <span className="comp-name">{c.name}</span>
                  <span className="comp-value">{c.value}</span>
                  <SignalBadge signal={c.signal} />
                </div>
              ))}
            </div>
          </div>
          <div className="index-meta">
            <span className="meta-confidence">Confidence: {BASE_SPECIFIC.confidence}%</span>
            <span className="meta-trend">Trend: <TrendArrow trend={BASE_SPECIFIC.trend} /> {BASE_SPECIFIC.trend}</span>
          </div>
        </div>
      </div>

      <div className="sentiment-legend">
        <div className="legend-item"><span className="legend-dot" style={{ background: "#c45050" }}></span>Extreme Fear / Bearish</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: "#d08040" }}></span>Fear / Caution</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: "#c4b040" }}></span>Neutral</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: "#4080d0" }}></span>Bullish / Undervalued</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: "#60a060" }}></span>Greed / Buy</div>
      </div>
    </div>
  );
}
