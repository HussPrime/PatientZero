/* Patient Zero — Epidemic Simulator
   Original dashboard design. Dark scientific aesthetic. */

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ---------- Color tokens ----------
const C = {
  bg: '#0F172A',
  panel: '#1E293B',
  panelHi: '#243348',
  panelLo: '#172033',
  border: 'rgba(148, 163, 184, 0.14)',
  borderHi: 'rgba(148, 163, 184, 0.28)',
  text: '#F5F5F5',
  text2: '#B0B0B0',
  text3: '#7B8699',
  healthy: '#43A047',
  infected: '#E53935',
  recovered: '#1E88E5',
  accent: '#FDD835',
};

// ---------- Tiny inline icons ----------
const Icon = ({ d, size = 16, stroke = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IconPlay      = (p) => <Icon {...p} d="M6 4l14 8-14 8V4z" fill="currentColor" stroke="none" />;
const IconPause     = (p) => <Icon {...p} d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor" stroke="none" />;
const IconReset     = (p) => <Icon {...p} d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />;
const IconStop      = (p) => <Icon {...p} d="M6 6h12v12H6z" fill="currentColor" stroke="none" />;
const IconChip      = (p) => <Icon {...p} d="M9 3h6M9 21h6M3 9v6M21 9v6M5 5h14v14H5z M9 9h6v6H9z" />;
const IconBolt      = (p) => <Icon {...p} d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />;
const IconUsers     = (p) => <Icon {...p} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />;
const IconActivity  = (p) => <Icon {...p} d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const IconSettings  = (p) => <Icon {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />;
const IconClose     = (p) => <Icon {...p} d="M18 6 6 18M6 6l12 12" />;
const IconDot       = (p) => <Icon {...p} d="M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0" fill="currentColor" stroke="none" />;
const IconRadius    = (p) => <Icon {...p} d="M12 12L20 6 M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0 M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />;
const IconShield    = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IconWave      = (p) => <Icon {...p} d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />;
const IconClock     = (p) => <Icon {...p} d="M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0 M12 7v5l3 2" />;

// ---------- Logo (original biohazard-inspired mark, generic) ----------
const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="19" stroke={C.infected} strokeWidth="1.2" opacity="0.4" />
    <circle cx="20" cy="20" r="13" stroke={C.infected} strokeWidth="1" opacity="0.25" strokeDasharray="2 3" />
    <circle cx="20" cy="20" r="3.2" fill={C.infected} />
    <g stroke={C.infected} strokeWidth="2" strokeLinecap="round">
      <line x1="20" y1="20" x2="20" y2="6" />
      <line x1="20" y1="20" x2="32.1" y2="27" />
      <line x1="20" y1="20" x2="7.9" y2="27" />
    </g>
    <g fill={C.infected}>
      <circle cx="20" cy="6" r="2.2" />
      <circle cx="32.1" cy="27" r="2.2" />
      <circle cx="7.9" cy="27" r="2.2" />
    </g>
  </svg>
);

// ---------- Slider primitive ----------
function Slider({ label, value, min, max, step = 1, onChange, suffix = '', hint, disabled = false }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: disabled ? 0.55 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 12, color: C.text2, letterSpacing: 0.2 }}>{label}</span>
        <span style={{ fontSize: 13, color: C.text, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {value}{suffix}
        </span>
      </div>
      <div style={{ position: 'relative', height: 18, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', inset: '50% 0', height: 4, transform: 'translateY(-50%)',
          background: 'rgba(148,163,184,0.12)', borderRadius: 2,
        }} />
        <div style={{
          position: 'absolute', left: 0, height: 4, top: '50%', transform: 'translateY(-50%)',
          width: `${pct}%`, background: `linear-gradient(90deg, ${C.recovered}, ${C.healthy})`,
          borderRadius: 2,
        }} />
        <input type="range" min={min} max={max} step={step} value={value} disabled={disabled}
               onChange={(e) => onChange(Number(e.target.value))}
               style={{
                 position: 'absolute', inset: 0, width: '100%', appearance: 'none',
                 background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer', margin: 0,
               }} />
      </div>
      {hint && <div style={{ fontSize: 11, color: C.text3 }}>{hint}</div>}
    </div>
  );
}

// ---------- Toggle ----------
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button onClick={() => !disabled && onChange(!checked)} disabled={disabled}
            style={{
              width: 36, height: 20, borderRadius: 10, border: 'none', padding: 2,
              background: checked ? C.healthy : 'rgba(148,163,184,0.2)',
              cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background .15s', display: 'flex',
              justifyContent: checked ? 'flex-end' : 'flex-start',
              opacity: disabled ? 0.55 : 1,
            }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }} />
    </button>
  );
}

// ---------- Configuration panel ----------
function ConfigPanel({ params, setParams, onStart, onReset, onClose, disabled = false }) {
  const set = (k) => (v) => setParams({ ...params, [k]: v });
  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      opacity: disabled ? 0.62 : 1, filter: disabled ? 'grayscale(0.25)' : 'none',
    }}>
      {/* Header */}
      <div style={{
          padding: '14px 16px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 14,
          background: `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(229, 57, 53, 0.12)', border: '1px solid rgba(229, 57, 53, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.infected,
          }}>
            <IconSettings size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, letterSpacing: 0.1 }}>
              Configuration de la simulation
            </div>
            <div style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>
              Paramétrez la population et les variables épidémiologiques avant lancement.
            </div>
          </div>
          <button onClick={onClose} disabled={disabled}
                  style={{ background: 'transparent', border: `1px solid ${C.border}`,
                           color: C.text2, width: 32, height: 32, borderRadius: 8,
                           cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                           opacity: disabled ? 0.5 : 1 }}>
            <IconClose size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, overflow: 'auto' }}>
          <SectionLabel>Population</SectionLabel>
          <SectionLabel>Épidémiologie</SectionLabel>

          <Slider label="Taille de la population" value={params.population}
                  min={50} max={800} step={10} onChange={set('population')}
                  suffix=" individus" hint="Nombre total de personnes simulées" disabled={disabled} />

          <Slider label="Probabilité de transmission" value={params.transmission}
                  min={0} max={100} step={1} onChange={set('transmission')}
                  suffix=" %" hint="Chance d'infection par contact" disabled={disabled} />

          <Slider label="Patients zéro" value={params.initialInfected}
                  min={1} max={20} step={1} onChange={set('initialInfected')}
                  suffix="" hint="Infectés au lancement" disabled={disabled} />

          <Slider label="Taux de guérison" value={params.recovery}
                  min={0} max={100} step={1} onChange={set('recovery')}
                  suffix=" %" hint="Probabilité de guérison après infection" disabled={disabled} />

          <Slider label="Durée moyenne de l'infection" value={params.duration}
                  min={20} max={400} step={10} onChange={set('duration')}
                  suffix=" pas" hint="Pas de simulation avant issue" disabled={disabled} />

          <Slider label="Rayon d'infection" value={params.radius}
                  min={4} max={40} step={1} onChange={set('radius')}
                  suffix=" px" hint="Distance de contagion entre individus" disabled={disabled} />

          <Slider label="Vitesse initiale" value={params.speed}
                  min={1} max={5} step={1} onChange={set('speed')}
                  suffix="×" hint="Multiplicateur de pas de temps" disabled={disabled} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: C.text2 }}>Déplacement aléatoire</span>
              <Toggle checked={params.random} onChange={set('random')} disabled={disabled} />
            </div>
            <div style={{ fontSize: 11, color: C.text3 }}>
              Mouvement brownien des individus dans la zone
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 16px', borderTop: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: C.panelLo,
        }}>
          <div style={{ fontSize: 11, color: C.text3, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconShield size={12} /> Modèle SIR — données locales, simulation côté client
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onReset}
                    disabled={disabled}
                    style={{
                      padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      background: 'transparent', border: `1px solid ${C.border}`,
                      color: C.text2, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
                    }}>
              Réinitialiser les paramètres
            </button>
            <button onClick={onStart}
                    disabled={disabled}
                    style={{
                      padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: C.infected, border: '1px solid rgba(229, 57, 53, 0.5)',
                      color: '#fff', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
                      boxShadow: '0 4px 14px rgba(229, 57, 53, 0.35)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
          <IconPlay size={13} /> Démarrer la simulation
        </button>
      </div>
    </div>
  </div>
  );
}

const SectionLabel = ({ children }) => (
  <div style={{
    gridColumn: 'span 1', fontSize: 11, color: C.text3, letterSpacing: 1.4,
    textTransform: 'uppercase', fontWeight: 600, marginTop: -4,
  }}>{children}</div>
);

// ---------- Stat card ----------
function StatCard({ label, value, color, total, icon }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{
      flex: 1, padding: '14px 16px', borderRadius: 10,
      background: C.panelLo, border: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: color,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.text2 }}>
        <div style={{ color }}>{icon}</div>
        <span style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 26, color: C.text, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </span>
        <span style={{ fontSize: 12, color: C.text3, fontVariantNumeric: 'tabular-nums' }}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div style={{ height: 3, background: 'rgba(148,163,184,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width .4s' }} />
      </div>
    </div>
  );
}

// ---------- Simulation canvas ----------
function SimCanvas({ agents, radius, width, height, showRadius, paused }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background grid
    ctx.fillStyle = '#0B1424';
    ctx.fillRect(0, 0, width, height);
    // Subtle grid
    ctx.strokeStyle = 'rgba(148,163,184,0.05)';
    ctx.lineWidth = 1;
    const gs = 40;
    for (let x = 0; x <= width; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Halos around infected
    if (showRadius) {
      ctx.fillStyle = 'rgba(229, 57, 53, 0.06)';
      for (const a of agents) {
        if (a.state === 1) {
          ctx.beginPath();
          ctx.arc(a.x, a.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Agents
    for (const a of agents) {
      const color = a.state === 0 ? C.healthy : a.state === 1 ? C.infected : C.recovered;
      // glow on infected
      if (a.state === 1) {
        const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 8);
        grad.addColorStop(0, 'rgba(229, 57, 53, 0.6)');
        grad.addColorStop(1, 'rgba(229, 57, 53, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(a.x, a.y, 8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Paused overlay
    if (paused) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.fillRect(0, 0, width, height);
    }
  }, [agents, radius, width, height, showRadius, paused]);

  return <canvas ref={canvasRef} style={{ display: 'block', borderRadius: 10 }} />;
}

// ---------- Line chart ----------
function LineChart({ history, width, height }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = C.panelLo;
    ctx.fillRect(0, 0, width, height);

    const padL = 36, padR = 12, padT = 12, padB = 22;
    const W = width - padL - padR;
    const H = height - padT - padB;

    if (history.length === 0) return;
    const total = history[0].h + history[0].i + history[0].r;
    const maxX = Math.max(60, history.length - 1);

    // Grid
    ctx.strokeStyle = 'rgba(148,163,184,0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#7B8699';
    ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
    for (let i = 0; i <= 4; i++) {
      const y = padT + (H * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padL, y); ctx.lineTo(padL + W, y); ctx.stroke();
      const v = Math.round(total - (total * i) / 4);
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(String(v), padL - 6, y);
    }
    // X axis ticks
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let i = 0; i <= 5; i++) {
      const x = padL + (W * i) / 5;
      const t = Math.round((maxX * i) / 5);
      ctx.fillText(`t${t}`, x, padT + H + 6);
    }

    const draw = (key, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      history.forEach((p, idx) => {
        const x = padL + (W * idx) / maxX;
        const y = padT + H - (H * p[key]) / total;
        if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      // fill
      const last = history[history.length - 1];
      const lx = padL + (W * (history.length - 1)) / maxX;
      const ly = padT + H - (H * last[key]) / total;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(lx, ly, 2.5, 0, Math.PI * 2); ctx.fill();
    };
    draw('h', C.healthy);
    draw('r', C.recovered);
    draw('i', C.infected);

    // Axis lines
    ctx.strokeStyle = 'rgba(148,163,184,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + H); ctx.lineTo(padL + W, padT + H);
    ctx.stroke();
  }, [history, width, height]);

  return <canvas ref={ref} style={{ display: 'block' }} />;
}

function ResponsiveLineChart({ history, height = 378 }) {
  const boxRef = useRef(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => setWidth(Math.max(240, Math.floor(box.clientWidth)));
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={boxRef} style={{ width: '100%', minWidth: 0 }}>
      <LineChart history={history} width={width} height={height} />
    </div>
  );
}

// ---------- Main App ----------
const DEFAULTS = {
  population: 320,
  initialInfected: 3,
  transmission: 35,
  recovery: 75,
  duration: 160,
  radius: 18,
  speed: 2,
  random: true,
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHue": "red",
  "showHalos": true,
  "density": "comfortable",
  "chartArea": false
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  const [params, setParams] = useState(DEFAULTS);
  const [showConfig, setShowConfig] = useState(true);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);

  const SIM_W = 740, SIM_H = 460;

  const [agents, setAgents] = useState([]);
  const [history, setHistory] = useState([]);

  const createAgent = useCallback((state = 0) => ({
    x: 20 + Math.random() * (SIM_W - 40),
    y: 20 + Math.random() * (SIM_H - 40),
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    state,
    timer: 0,
  }), []);

  // initialise on (re)start
  const initSimulation = useCallback(() => {
    const arr = [];
    const N = params.population;
    for (let i = 0; i < N; i++) {
      arr.push(createAgent(i < params.initialInfected ? 1 : 0));
    }
    setAgents(arr);
    setHistory([{ h: N - params.initialInfected, i: params.initialInfected, r: 0 }]);
    setTick(0);
  }, [createAgent, params]);

  useEffect(() => {
    if (running) return;
    setAgents((prev) => {
      const next = prev.slice(0, params.population).map((a, i) => ({
        ...a,
        state: i < params.initialInfected ? 1 : 0,
        timer: i < params.initialInfected ? 0 : a.timer,
      }));
      while (next.length < params.population) {
        next.push(createAgent(next.length < params.initialInfected ? 1 : 0));
      }
      return next;
    });
    setHistory([{ h: params.population - params.initialInfected, i: params.initialInfected, r: 0 }]);
  }, [createAgent, params.initialInfected, params.population, running]);

  // step the simulation
  useEffect(() => {
    if (!running || paused) return;
    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = now - last;
      const interval = 1000 / (30 * params.speed); // pas par sec
      if (dt >= interval) {
        last = now;
        setAgents((prev) => {
          const next = prev.map(a => ({ ...a }));
          // move
          for (const a of next) {
            if (params.random) {
              a.vx += (Math.random() - 0.5) * 0.15;
              a.vy += (Math.random() - 0.5) * 0.15;
              a.vx = Math.max(-1.6, Math.min(1.6, a.vx));
              a.vy = Math.max(-1.6, Math.min(1.6, a.vy));
            }
            a.x += a.vx; a.y += a.vy;
            if (a.x < 6) { a.x = 6; a.vx = -a.vx; }
            if (a.x > SIM_W - 6) { a.x = SIM_W - 6; a.vx = -a.vx; }
            if (a.y < 6) { a.y = 6; a.vy = -a.vy; }
            if (a.y > SIM_H - 6) { a.y = SIM_H - 6; a.vy = -a.vy; }
            if (a.state === 1) a.timer += 1;
          }
          // infection (radius squared)
          const r2 = params.radius * params.radius;
          for (let i = 0; i < next.length; i++) {
            const a = next[i];
            if (a.state !== 1) continue;
            for (let j = 0; j < next.length; j++) {
              if (i === j) continue;
              const b = next[j];
              if (b.state !== 0) continue;
              const dx = a.x - b.x, dy = a.y - b.y;
              if (dx * dx + dy * dy <= r2) {
                if (Math.random() < params.transmission / 100 / 8) {
                  b.state = 1; b.timer = 0;
                }
              }
            }
          }
          // recovery
          for (const a of next) {
            if (a.state === 1 && a.timer >= params.duration) {
              if (Math.random() < params.recovery / 100) {
                a.state = 2;
              } else {
                a.timer = params.duration / 2; // reset, still infected
              }
            }
          }
          return next;
        });
        setTick(t => {
          const newT = t + 1;
          return newT;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, params]);

  // log to history when agents change
  useEffect(() => {
    if (!running) return;
    const counts = agents.reduce((acc, a) => {
      if (a.state === 0) acc.h++;
      else if (a.state === 1) acc.i++;
      else acc.r++;
      return acc;
    }, { h: 0, i: 0, r: 0 });
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.h === counts.h && last.i === counts.i && last.r === counts.r) return prev;
      const next = [...prev, counts];
      return next;
    });
  }, [agents, running]);

  const counts = useMemo(() => agents.reduce((acc, a) => {
    if (a.state === 0) acc.h++;
    else if (a.state === 1) acc.i++;
    else acc.r++;
    return acc;
  }, { h: 0, i: 0, r: 0 }), [agents]);
  const total = counts.h + counts.i + counts.r;

  const handleStart = () => {
    initSimulation();
    setShowConfig(true);
    setRunning(true);
    setPaused(false);
  };
  const handleResetParams = () => setParams(DEFAULTS);
  const handlePauseResume = () => setPaused(p => !p);
  const handleReset = () => {
    setRunning(false);
    setPaused(false);
    setShowConfig(true);
    setAgents([]);
    setHistory([]);
    setTick(0);
  };
  const handleStop = () => {
    setRunning(false);
    setPaused(false);
  };

  const status = !running ? 'Prêt' : paused ? 'Pause' : 'Simulation en cours';
  const statusColor = !running ? C.text2 : paused ? C.accent : C.healthy;

  return (
    <div data-screen-label="01 Patient Zero Dashboard" style={{
      minHeight: '100vh', background: C.bg, color: C.text,
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      {/* HEADER */}
      <header style={{
        height: 60, padding: '0 24px',
        display: 'flex', alignItems: 'center', gap: 16,
        borderBottom: `1px solid ${C.border}`, background: C.panelLo,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <img src="./logo.png" style={{height: 30 }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: 0.5 }}>Patient Zero</div>
          <div style={{ fontSize: 10.5, color: C.text3, letterSpacing: 1.4, textTransform: 'uppercase' }}>
            Epidemic Simulator · v0.0
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'rgba(148,163,184,0.06)', border: `1px solid ${C.border}`,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: statusColor,
            boxShadow: `0 0 0 3px ${statusColor}22`,
            animation: running && !paused ? 'pulse 1.6s infinite' : 'none',
          }} />
          <span style={{ fontSize: 11.5, color: C.text2, fontWeight: 500 }}>{status}</span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8,
          background: 'rgba(148,163,184,0.06)', border: `1px solid ${C.border}`,
          fontSize: 11.5, color: C.text2, fontVariantNumeric: 'tabular-nums',
        }}>
          <IconClock size={12} />
          t = {tick}
        </div>

        <button onClick={() => setShowConfig(true)}
                style={{
                  padding: '7px 12px', borderRadius: 8, fontSize: 12,
                  background: 'transparent', border: `1px solid ${C.border}`,
                  color: C.text2, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
        </button>
      </header>

      {/* MAIN */}
      <main style={{
        flex: 1, padding: 20, display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 20,
        gridTemplateRows: 'auto auto', alignItems: 'start',
      }}>
        {/* Stat cards */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
          <StatCard label="Population" value={total || params.population} color={C.text}
                    total={total || params.population} icon={<IconUsers size={14} />} />
          <StatCard label="Sains" value={counts.h} color={C.healthy}
                    total={total} icon={<IconDot size={10} />} />
          <StatCard label="Infectés" value={counts.i} color={C.infected}
                    total={total} icon={<IconDot size={10} />} />
          <StatCard label="Guéris" value={counts.r} color={C.recovered}
                    total={total} icon={<IconDot size={10} />} />
        </div>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Sim canvas */}
          <div style={{
            background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px', borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <IconChip size={14} />
              <span style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: 0.3 }}>
                Zone de simulation
              </span>
              <span style={{ fontSize: 10.5, color: C.text3, padding: '2px 7px',
                            background: 'rgba(148,163,184,0.08)', borderRadius: 4,
                            fontFamily: 'ui-monospace, monospace' }}>
                {SIM_W}×{SIM_H}
              </span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: C.text3 }}>
                Rendu canvas · 30 fps
              </span>
            </div>
            <div style={{
              padding: 12, display: 'grid',
              gridTemplateColumns: `${SIM_W}px minmax(320px, 1fr)`, gap: 12,
              alignItems: 'stretch',
            }}>
              <div style={{ position: 'relative' }}>
                <SimCanvas agents={agents} radius={params.radius}
                           width={SIM_W} height={SIM_H}
                           showRadius={tweaks.showHalos !== false} paused={paused} />
                {/* Legend overlay */}
                <div style={{
                  position: 'absolute', left: 10, bottom: 10, display: 'flex', gap: 14,
                  padding: '8px 12px', background: 'rgba(15, 23, 42, 0.78)',
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  backdropFilter: 'blur(6px)',
                }}>
                  <Legend color={C.healthy} label="Sain" />
                  <Legend color={C.infected} label="Infecté" />
                  <Legend color={C.recovered} label="Guéri" />
                </div>
              </div>

              <div style={{
                minWidth: 0, height: SIM_H, background: C.panelLo,
                border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  padding: '12px 14px', borderBottom: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                }}>
                  <IconActivity size={14} />
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>
                    Évolution dans le temps
                  </span>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Legend color={C.healthy} label="Sains" />
                    <Legend color={C.infected} label="Infectés" />
                    <Legend color={C.recovered} label="Guéris" />
                  </div>
                </div>
                <div style={{ padding: 12, flex: 1, minHeight: 0 }}>
                  <ResponsiveLineChart
                    history={history.length ? history : [{ h: params.population, i: 0, r: 0 }]}
                    height={SIM_H - 70}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configuration panel */}
          {showConfig && (
            <ConfigPanel params={params} setParams={setParams}
                         onStart={handleStart} onReset={handleResetParams}
                         onClose={() => setShowConfig(false)}
                         disabled={running} />
          )}
        </div>

        {/* RIGHT COLUMN — control panel */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Controls */}
          <Panel title="Contrôles" icon={<IconBolt size={13} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {!running ? (
                <button onClick={handleStart} style={primaryBtn(C.healthy)}>
                  <IconPlay size={12} /> Démarrer
                </button>
              ) : (
                <button onClick={handlePauseResume}
                        style={primaryBtn(paused ? C.healthy : C.accent, paused ? '#fff' : '#0F172A')}>
                  {paused ? <><IconPlay size={12} /> Reprendre</> : <><IconPause size={12} /> Pause</>}
                </button>
              )}
              <button onClick={handleStop} disabled={!running} style={ghostBtn(!running)}>
                <IconStop size={11} /> Stop
              </button>
              <button onClick={handleReset} style={{ ...ghostBtn(false), gridColumn: 'span 2' }}>
                <IconReset size={12} /> Réinitialiser
              </button>
            </div>

            <div style={{
              marginTop: 14, padding: 10, borderRadius: 8,
              background: C.panelLo, border: `1px solid ${C.border}`,
            }}>
              <div style={{ fontSize: 11, color: C.text3, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Vitesse
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s}
                          onClick={() => setParams({ ...params, speed: s })}
                          style={{
                            padding: '7px 0', borderRadius: 6, fontSize: 12, fontWeight: 600,
                            background: params.speed === s ? 'rgba(229, 57, 53, 0.18)' : 'transparent',
                            border: `1px solid ${params.speed === s ? 'rgba(229, 57, 53, 0.4)' : C.border}`,
                            color: params.speed === s ? C.infected : C.text2, cursor: 'pointer',
                          }}>
                    ×{s}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          {/* Live params */}
          <Panel title="Paramètres en direct" icon={<IconSettings size={13} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Slider label="Probabilité de transmission" value={params.transmission}
                      min={0} max={100} onChange={(v) => setParams({ ...params, transmission: v })}
                      suffix=" %" />
              <Slider label="Taux de guérison" value={params.recovery}
                      min={0} max={100} onChange={(v) => setParams({ ...params, recovery: v })}
                      suffix=" %" />
              <Slider label="Rayon d'infection" value={params.radius}
                      min={4} max={40} onChange={(v) => setParams({ ...params, radius: v })}
                      suffix=" px" />
            </div>
          </Panel>

          {/* Run info */}
          <Panel title="Session" icon={<IconWave size={13} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Row k="Modèle" v="SIR (susceptible–infected–recovered)" />
              <Row k="R₀ estimé" v={(params.transmission / Math.max(1, 100 - params.recovery) * 1.4).toFixed(2)} mono />
              <Row k="Durée écoulée" v={`${tick} pas`} mono />
            </div>
          </Panel>
        </aside>
      </main>

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Visualisation">
            <window.TweakToggle label="Halos d'infection"
                                value={tweaks.showHalos !== false}
                                onChange={(v) => setTweak('showHalos', v)} />
            <window.TweakToggle label="Configuration ouverte"
                                value={showConfig}
                                onChange={setShowConfig} />
          </window.TweakSection>
          <window.TweakSection label="Simulation">
            <window.TweakButton label={running ? 'Réinitialiser' : 'Démarrer'}
                                onClick={running ? handleReset : handleStart} />
          </window.TweakSection>
        </window.TweaksPanel>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px ${statusColor}22; }
          50%      { box-shadow: 0 0 0 6px ${statusColor}11; }
        }
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 14px; height: 14px; border-radius: 50%;
          background: #fff; border: 2px solid ${C.recovered};
          box-shadow: 0 1px 3px rgba(0,0,0,.3);
        }
        input[type=range]::-moz-range-thumb {
          width: 14px; height: 14px; border-radius: 50%;
          background: #fff; border: 2px solid ${C.recovered};
        }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
}

// ---------- Helpers ----------
const Legend = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.text2 }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 0 2px ${color}22` }} />
    {label}
  </div>
);

const Row = ({ k, v, mono }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
    <span style={{ color: C.text3 }}>{k}</span>
    <span style={{ color: C.text, fontFamily: mono ? 'ui-monospace, monospace' : 'inherit' }}>{v}</span>
  </div>
);

const Panel = ({ title, icon, children }) => (
  <section style={{
    background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12,
    padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.text2 }}>
      {icon}
      <span style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600 }}>
        {title}
      </span>
    </div>
    {children}
  </section>
);

const primaryBtn = (bg, color = '#fff') => ({
  padding: '9px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
  background: bg, border: `1px solid ${bg}`, color, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
});

const ghostBtn = (disabled) => ({
  padding: '9px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 500,
  background: 'transparent', border: `1px solid ${C.border}`,
  color: disabled ? C.text3 : C.text2, cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
