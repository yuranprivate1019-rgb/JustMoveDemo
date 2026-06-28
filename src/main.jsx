import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const cityOptions = [
  'San Francisco / SFO',
  'New York / NYC',
  'Los Angeles / LAX',
  'Chicago / ORD',
  'Seattle / SEA',
  'Boston / BOS',
  'Washington DC / DCA',
  'Miami / MIA',
  'Dallas / DFW',
  'Atlanta / ATL',
  'Denver / DEN',
  'Las Vegas / LAS',
  'Houston / IAH',
  'Phoenix / PHX',
  'Orlando / MCO',
  'Philadelphia / PHL',
];

const bookingOptions = {
  Dates: ['Tue, Jul 14 → Thu, Jul 16', 'Mon, Aug 3 → Wed, Aug 5', 'Fri, Sep 11 → Sun, Sep 13'],
  Travelers: ['1 traveler', '2 travelers', '4 travelers'],
  'Meeting Location': ['Empire State Building', 'Hudson Yards', 'World Trade Center'],
  'Meeting Time': ['9:00 AM', '10:00 AM', '2:00 PM'],
  Budget: ['under $1,500', 'under $1,800', 'under $2,200'],
  'Hotel Nightly Cap': ['$260 / night', '$320 / night', '$420 / night'],
};

const defaultBookingValues = {
  From: 'San Francisco / SFO',
  To: 'New York / NYC',
  Dates: 'Tue, Jul 14 → Thu, Jul 16',
  Travelers: '1 traveler',
  'Meeting Location': 'Empire State Building',
  'Meeting Time': '10:00 AM',
  Budget: 'under $1,800',
  'Hotel Nightly Cap': '$320 / night',
};

const guidedFields = [
  ['From', '✈'],
  ['To', '⌖'],
  ['Dates', '◷'],
  ['Travelers', '◉'],
  ['Meeting Location', '⌖'],
  ['Meeting Time', '◴'],
  ['Budget', '◈'],
  ['Hotel Nightly Cap', '▣'],
];


const travelSlides = [
  { label: 'Airport departure', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80' },
  { label: 'San Francisco aerial', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1800&q=80' },
  { label: 'New York aerial', image: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=1800&q=80' },
  { label: 'Hotel lobby', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80' },
  { label: 'Hotel room', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1800&q=80' },
];

const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);
const departDay = 14;
const returnDay = 16;

const advancedPreferenceOptions = [
  'Nonstop',
  'Morning departure',
  'Flexible hotel',
  'Refundable option',
  'Near meeting location',
  'Lower price priority',
];

const steps = ['Reading trip details', 'Comparing flights, hotels, and timing risk', 'Checking costs against your caps', 'Finding delay backups and commute buffers', 'Building 3 smart plans'];

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
    <TravelBackground />
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
function TravelBackground() { return <div className="travel-bg" aria-hidden="true">{travelSlides.map((slide, index) => <span key={slide.label} style={{ backgroundImage: `url(${slide.image})`, animationDelay: `${index * 6}s` }} />)}</div>; }
function Header() { return <header className="header"><div className="brand"><span className="logo-mark"><img src={`${import.meta.env.BASE_URL}justmove-logo.png`} alt="JustMove.AI logo" /></span><span>JustMove.AI</span></div><nav aria-label="Secondary prototype navigation"><button>Book</button><button>Trips</button><button>Alerts</button></nav></header>; }
function Progress({ current }) { return <div className="progress">{['Input','AI Scan','Plans','Confirm','Monitor'].map((s,i)=><div className={`dot ${i<=current?'on':''}`} key={s}><span>{i+1}</span>{s}</div>)}</div>; }

function BookingPage({ mode, setMode, onNext }) {
  const [booking, setBooking] = useState(defaultBookingValues);
  const [openField, setOpenField] = useState(null);
  const [citySearch, setCitySearch] = useState('');
  const [preferences, setPreferences] = useState(['Nonstop', 'Near meeting location']);

  const filteredCities = useMemo(() => cityOptions.filter((option) => option.toLowerCase().includes(citySearch.toLowerCase())), [citySearch]);
  const selectOption = (label, value) => {
    setBooking((current) => ({ ...current, [label]: value }));
    setOpenField(null);
    setCitySearch('');
  };
  const togglePreference = (preference) => setPreferences((current) => current.includes(preference) ? current.filter((item) => item !== preference) : [...current, preference]);

  return <div className="card booking-card appear"><div className="switch"><button className={mode==='guided'?'active':''} onClick={()=>setMode('guided')}>Guided Booking</button><button className={mode==='describe'?'active':''} onClick={()=>setMode('describe')}>Describe Your Trip</button></div>{mode==='guided'?<><div className="grid">{guidedFields.map(([label,Icon])=><div className="field-wrap" key={label}><button className={`field ${openField===label?'open':''}`} type="button" onClick={()=>setOpenField(openField===label?null:label)}><span><IconGlyph icon={Icon}/>{label}</span><strong>{booking[label]}</strong><em>{label === 'Dates' ? 'Open calendar' : 'Tap to change'}</em></button>{openField===label && <OptionPanel label={label} value={booking[label]} citySearch={citySearch} setCitySearch={setCitySearch} cityOptions={filteredCities} onSelect={(value)=>selectOption(label,value)} />}</div>)}</div><section className="advanced"><div className="advanced-head"><h2>Advanced Preferences</h2><p>Select what matters most for this trip.</p></div><div className="preference-grid">{advancedPreferenceOptions.map((preference)=><button className={`preference ${preferences.includes(preference)?'selected':''}`} type="button" key={preference} onClick={()=>togglePreference(preference)}><span className="check">✓</span>{preference}</button>)}</div></section></>:<div className="describe"><label>Tell JustMove what you need</label><textarea defaultValue="I need to travel from San Francisco to New York for a client meeting near the Empire State Building. Keep the total trip under $1,800, avoid risky layovers, and choose a hotel close to the meeting." /></div>}<button className="primary" onClick={onNext}><IconGlyph icon="⚡"/>Generate Plans</button></div>;
}

function OptionPanel({ label, value, citySearch, setCitySearch, cityOptions, onSelect }) {
  const isCity = label === 'From' || label === 'To';
  if (label === 'Dates') return <CalendarPanel value={value} onSelect={onSelect} />;
  const options = isCity ? cityOptions : bookingOptions[label];
  return <div className={`option-panel ${isCity ? 'search-panel' : ''}`}>
    {isCity && <input className="search-box" value={citySearch} onChange={(event)=>setCitySearch(event.target.value)} placeholder={`Search ${label.toLowerCase()} city or airport`} autoFocus />}
    <div className="option-list">{options.map((option)=><button className={option===value?'selected':''} type="button" key={option} onClick={()=>onSelect(option)}>{option}</button>)}</div>
  </div>;
}

function CalendarPanel({ value, onSelect }) {
  return <div className="option-panel calendar-panel"><div className="date-summary"><div><span>Depart</span><strong>Tue, Jul 14</strong></div><div><span>Return</span><strong>Thu, Jul 16</strong></div></div><div className="calendar-title"><button type="button" aria-label="Previous month">‹</button><strong>July 2026</strong><button type="button" aria-label="Next month">›</button></div><div className="weekdays">{['Su','Mo','Tu','We','Th','Fr','Sa'].map((day)=><span key={day}>{day}</span>)}</div><div className="calendar-grid">{calendarDays.map((day)=><button type="button" key={day} className={`${day===departDay?'depart':''} ${day===returnDay?'return':''} ${day>departDay && day<returnDay?'in-range':''}`}><span>{day}</span>{day===departDay && <em>Depart</em>}{day===returnDay && <em>Return</em>}</button>)}</div><button className="apply-date" type="button" onClick={()=>onSelect(value)}>Apply dates</button></div>;
}


function ProcessingPage() { const [active,setActive]=useState(0); useEffect(()=>{const id=setInterval(()=>setActive(v=>Math.min(v+1,4)),760); return()=>clearInterval(id)},[]); return <div className="card process-card appear"><div className="ai-core"><IconGlyph icon="✦"/><span/></div><h1>JustMove AI is planning your trip</h1><p className="processing-copy">The demo AI is comparing flight schedules, hotel proximity, meeting-time risk, total cost, and backup options before recommending three plans.</p><div className="steps">{steps.map((s,i)=><div className={`step ${i<=active?'done':''}`} key={s}><IconGlyph icon="✓"/>{s}</div>)}</div></div>; }

function ResultsPage({ plan, index, setIndex, onConfirm }) { const Icon=plan.icon; return <div className="results appear"><button className="arrow" aria-label="Previous plan" onClick={()=>setIndex((index+2)%3)}><IconGlyph icon="‹"/></button><div className="plan-shell"><div className="plan-tabs">{plans.map((item, planPosition)=><button key={item.name} className={planPosition===index?'active':''} onClick={()=>setIndex(planPosition)}>Plan {planPosition+1}</button>)}</div><div className={`card plan-card ${plan.accent}`} key={plan.name}><div className="plan-head"><IconGlyph icon={Icon}/><div><p>Plan {index+1} of 3</p><h1>{plan.name}</h1></div></div><div className="metrics"><b>{plan.cost}<span>Total cost</span></b><b>{plan.risk}<span>Risk level</span></b><b>{plan.confidence}<span>Confidence</span></b></div><Info icon={'✈'} label="Flight" value={plan.flight}/><Info icon={'▣'} label="Hotel" value={plan.hotel}/><Info icon={'⌖'} label="Ground transport" value={plan.ground}/><p className="explain"><IconGlyph icon="🤖"/>{plan.explanation}</p><button className="primary" onClick={onConfirm}>Confirm & Book</button></div></div><button className="arrow" aria-label="Next plan" onClick={()=>setIndex((index+1)%3)}><IconGlyph icon="›"/></button></div>; }
function Info({icon:Icon,label,value}){return <div className="info"><IconGlyph icon={Icon}/><span>{label}</span><strong>{value}</strong></div>}

function ConfirmPage({ plan, onConfirm, onEdit }) { return <div className="card confirm-card appear"><h1>Confirm & Book</h1><p className="notice"><IconGlyph icon="⬡"/>JustMove.AI never books without your approval. Review this mock trip summary, then explicitly confirm.</p><div className="summary"><div className="summary-hero"><IconGlyph icon={plan.icon}/><div><span>Selected plan</span><strong>{plan.name}</strong><p>{plan.explanation}</p></div></div><div className="summary-grid"><Info icon={'◫'} label="Mock total" value={plan.cost}/><Info icon={'▣'} label="Stay" value={plan.hotel}/><Info icon={'◴'} label="Meeting" value="Empire State Building · 10:00 AM"/></div></div><div className="actions"><button className="primary" onClick={onConfirm}>Confirm Booking</button><button onClick={onEdit}>Edit Plan</button><button>Ask AI Why</button></div></div>; }
function MonitorPage({ onReset }) { return <div className="card monitor-card appear"><div className="alert"><IconGlyph icon="🔔"/>Flight delay detected</div><h1>AI Travel Monitoring</h1><p>Your SFO → NYC flight is now estimated 48 minutes late. JustMove found a backup nonstop that protects your arrival buffer and keeps the trip under budget.</p><div className="backup"><Info icon={'✈'} label="Backup option" value="Earlier SFO → JFK nonstop · arrives 8:42 PM"/><Info icon={'◈'} label="Budget impact" value="+$96 · still under $1,800"/><Info icon={'⬡'} label="Reliability" value="Reduces meeting delay risk to Very Low"/></div><div className="actions"><button onClick={onReset}>Keep Current Plan</button><button className="primary" onClick={onReset}>Approve Backup</button></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
