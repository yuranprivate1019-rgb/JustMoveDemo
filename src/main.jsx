import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const guidedFields = [
  ['From', 'San Francisco / SFO', '✈'],
  ['To', 'New York / NYC', '⌖'],
  ['Dates', 'Tue, Jul 14 → Thu, Jul 16', '◷'],
  ['Travelers', '1 traveler', '◉'],
  ['Meeting location', 'Empire State Building', '⌖'],
  ['Meeting time', '10:00 AM', '◴'],
  ['Total budget', 'under $1,800', '◈'],
  ['Hotel nightly cap', '$320 / night', '▣'],
];

const steps = ['Reading trip details', 'Checking flight options', 'Comparing hotel distance', 'Calculating budget and delay risk', 'Building 3 smart plans'];

const plans = [
  { name: 'Lowest Cost Plan', icon: '◈', cost: '$1,342', risk: 'Medium', confidence: '88%', accent: 'teal', flight: 'SFO → JFK · 6:10 AM · 1 short layover', hotel: 'Pod Times Square · 1.1 mi from meeting', ground: 'AirTrain + rideshare buffer', explanation: 'Optimizes total spend while preserving a 90-minute arrival buffer before the client meeting.' },
  { name: 'Best Balance Plan', icon: '✦', cost: '$1,617', risk: 'Low', confidence: '94%', accent: 'purple', flight: 'SFO → EWR · 7:25 AM · nonstop', hotel: 'Hyatt Place Midtown · 0.5 mi from meeting', ground: 'Pre-scheduled rideshare', explanation: 'Balances nonstop reliability, hotel proximity, and a comfortable budget margin under $1,800.' },
  { name: 'Most Reliable Plan', icon: '⬡', cost: '$1,764', risk: 'Very Low', confidence: '97%', accent: 'cyan', flight: 'SFO → JFK · 6:00 AM · nonstop', hotel: 'Moxy NYC Times Square · 0.4 mi from meeting', ground: 'Black car pickup + subway backup', explanation: 'Prioritizes on-time arrival with the strongest flight history and the shortest morning transfer.' },
];

function App() {
  const [page, setPage] = useState('book');
  const [mode, setMode] = useState('guided');
  const [planIndex, setPlanIndex] = useState(1);
  const [mouse, setMouse] = useState({ x: 50, y: 35 });
  const plan = plans[planIndex];

  useEffect(() => {
    const onMove = (e) => setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (page !== 'processing') return;
    const timer = setTimeout(() => setPage('results'), 4200);
    return () => clearTimeout(timer);
  }, [page]);

  const currentStep = page === 'book' ? 0 : page === 'processing' ? 1 : page === 'results' ? 2 : page === 'confirm' ? 3 : 4;

  return <main className="app" style={{ '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }}>
    <Header />
    <Progress current={currentStep} />
    <section className="stage">
      {page === 'book' && <BookingPage mode={mode} setMode={setMode} onNext={() => setPage('processing')} />}
      {page === 'processing' && <ProcessingPage />}
      {page === 'results' && <ResultsPage plan={plan} index={planIndex} setIndex={setPlanIndex} onConfirm={() => setPage('confirm')} />}
      {page === 'confirm' && <ConfirmPage plan={plan} onConfirm={() => setPage('monitor')} onEdit={() => setPage('results')} />}
      {page === 'monitor' && <MonitorPage onReset={() => setPage('book')} />}
    </section>
  </main>;
}

function IconGlyph({ icon }) { return <span className="glyph">{icon}</span>; }
function Header() { return <header className="header"><div className="brand"><span className="logo-mark"><img src={`${import.meta.env.BASE_URL}justmove-logo.png`} alt="JustMove.AI logo" /></span>JustMove.AI</div><nav><button>Book</button><button>Trips</button><button>Alerts</button><span className="profile"><IconGlyph icon="◉"/></span></nav></header>; }
function Progress({ current }) { return <div className="progress">{['Input','AI Scan','Plans','Confirm','Monitor'].map((s,i)=><div className={`dot ${i<=current?'on':''}`} key={s}><span>{i+1}</span>{s}</div>)}</div>; }

function BookingPage({ mode, setMode, onNext }) { return <div className="card booking-card appear"><div className="switch"><button className={mode==='guided'?'active':''} onClick={()=>setMode('guided')}>Guided Booking</button><button className={mode==='describe'?'active':''} onClick={()=>setMode('describe')}>Describe Your Trip</button></div>{mode==='guided'?<><div className="grid">{guidedFields.map(([label,value,Icon])=><label className="field" key={label}><span><IconGlyph icon={Icon}/>{label}</span><input value={value} readOnly /></label>)}</div><details className="advanced"><summary>Advanced Preferences</summary><div>Avoid red-eye flights · prefer flexible fares · hotel rating 4★+ · low-layover risk</div></details></>:<div className="describe"><label>Tell JustMove what you need</label><textarea defaultValue="I need to travel from San Francisco to New York for a client meeting near the Empire State Building. Keep the total trip under $1,800, avoid risky layovers, and choose a hotel close to the meeting." /></div>}<button className="primary" onClick={onNext}><IconGlyph icon="⚡"/>Generate 3 Smart Plans</button></div>; }

function ProcessingPage() { const [active,setActive]=useState(0); useEffect(()=>{const id=setInterval(()=>setActive(v=>Math.min(v+1,4)),760); return()=>clearInterval(id)},[]); return <div className="card process-card appear"><div className="ai-core"><IconGlyph icon="✦"/><span/></div><h1>JustMove AI is planning your trip</h1><div className="steps">{steps.map((s,i)=><div className={`step ${i<=active?'done':''}`} key={s}><IconGlyph icon="✓"/>{s}</div>)}</div></div>; }

function ResultsPage({ plan, index, setIndex, onConfirm }) { const Icon=plan.icon; return <div className="results appear"><button className="arrow" onClick={()=>setIndex((index+2)%3)}><IconGlyph icon="‹"/></button><div className={`card plan-card ${plan.accent}`}><div className="plan-head"><IconGlyph icon={Icon}/><div><p>Plan {index+1} of 3</p><h1>{plan.name}</h1></div></div><div className="metrics"><b>{plan.cost}<span>Total cost</span></b><b>{plan.risk}<span>Risk level</span></b><b>{plan.confidence}<span>Confidence</span></b></div><Info icon={'✈'} label="Flight" value={plan.flight}/><Info icon={'▣'} label="Hotel" value={plan.hotel}/><Info icon={'⌖'} label="Ground transport" value={plan.ground}/><p className="explain"><IconGlyph icon="🤖"/>{plan.explanation}</p><button className="primary" onClick={onConfirm}>Confirm & Book</button></div><button className="arrow" onClick={()=>setIndex((index+1)%3)}><IconGlyph icon="›"/></button></div>; }
function Info({icon:Icon,label,value}){return <div className="info"><IconGlyph icon={Icon}/><span>{label}</span><strong>{value}</strong></div>}

function ConfirmPage({ plan, onConfirm, onEdit }) { return <div className="card confirm-card appear"><h1>Confirm & Book</h1><p className="notice"><IconGlyph icon="⬡"/>JustMove.AI never books without your approval. Review this mock trip summary, then explicitly confirm.</p><div className="summary"><Info icon={'✈'} label="Selected plan" value={plan.name}/><Info icon={'◫'} label="Mock total" value={plan.cost}/><Info icon={'▣'} label="Stay" value={plan.hotel}/><Info icon={'◴'} label="Meeting" value="Empire State Building · 10:00 AM"/></div><div className="actions"><button className="primary" onClick={onConfirm}>Confirm Booking</button><button onClick={onEdit}>Edit Plan</button><button>Ask AI Why</button></div></div>; }
function MonitorPage({ onReset }) { return <div className="card monitor-card appear"><div className="alert"><IconGlyph icon="🔔"/>Flight delay detected</div><h1>AI Travel Monitoring</h1><p>Your SFO → NYC flight is now estimated 48 minutes late. JustMove found a backup nonstop that protects your arrival buffer and keeps the trip under budget.</p><div className="backup"><Info icon={'✈'} label="Backup option" value="Earlier SFO → JFK nonstop · arrives 8:42 PM"/><Info icon={'◈'} label="Budget impact" value="+$96 · still under $1,800"/><Info icon={'⬡'} label="Reliability" value="Reduces meeting delay risk to Very Low"/></div><div className="actions"><button onClick={onReset}>Keep Current Plan</button><button className="primary" onClick={onReset}>Approve Backup</button></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
