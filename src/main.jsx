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

const flightOptions = [
  { airline: 'United', route: 'SFO → EWR', departure: '7:25 AM', arrival: '3:58 PM', stops: 'Nonstop', duration: '5h 33m', price: '$428', tag: 'Strong reliability' },
  { airline: 'Delta', route: 'SFO → JFK', departure: '7:05 AM', arrival: '3:32 PM', stops: 'Nonstop', duration: '5h 27m', price: '$446', tag: 'Balanced option' },
  { airline: 'JetBlue', route: 'SFO → JFK', departure: '8:10 AM', arrival: '4:44 PM', stops: 'Nonstop', duration: '5h 34m', price: '$372', tag: 'Lower-cost' },
  { airline: 'American', route: 'SFO → JFK', departure: '6:00 AM', arrival: '2:29 PM', stops: 'Nonstop', duration: '5h 29m', price: '$512', tag: 'Premium friendly' },
  { airline: 'Alaska', route: 'SFO → JFK', departure: '8:45 AM', arrival: '5:15 PM', stops: 'Nonstop', duration: '5h 30m', price: '$398', tag: 'Flexible value' },
];

const hotelOptions = [
  { name: 'Hyatt Place New York / Chelsea', location: 'Chelsea', distance: '0.7 mi to Empire State Building', rate: '$289 / night', tag: 'Free cancellation', rating: 'High confidence' },
  { name: 'Moxy NYC Chelsea', location: 'Chelsea / NoMad', distance: '0.5 mi to Empire State Building', rate: '$302 / night', tag: 'Flexible rate', rating: 'Guest favorite' },
  { name: 'Moxy NYC Times Square', location: 'Times Square', distance: '0.6 mi to Empire State Building', rate: '$276 / night', tag: 'Semi-flexible', rating: 'Reliable pick' },
  { name: 'Hampton Inn Manhattan-35th St / Empire State Bldg', location: 'Midtown South', distance: '0.2 mi to Empire State Building', rate: '$261 / night', tag: 'Refundable', rating: 'Best proximity' },
  { name: 'Hilton Garden Inn New York / West 35th Street', location: 'Herald Square', distance: '0.2 mi to Empire State Building', rate: '$284 / night', tag: 'Flexible value', rating: 'High confidence' },
];

const formatFlight = (flight) => `${flight.airline} · ${flight.route} · ${flight.departure} · ${flight.stops}`;
const formatHotel = (hotel) => `${hotel.name} · ${hotel.distance}`;

const GROUND_TRANSPORT_ESTIMATE = 210;
const planDemoPrices = [
  { flight: 372, hotel: 260 },
  { flight: 428, hotel: 289 },
  { flight: 512, hotel: 302 },
];

const currencyValue = (value) => Number(value.match(/\$([\d,]+)/)?.[1].replace(',', '') ?? 0);
const formatCurrency = (value) => `$${Math.round(value).toLocaleString()}`;

const riskScores = {
  'Very Low': 1,
  Low: 2,
  Medium: 3,
  High: 4,
};
const riskLabels = ['Very Low', 'Low', 'Medium', 'High'];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const riskLabelFromScore = (score) => riskLabels[clamp(Math.round(score), 1, 4) - 1];

const flightRiskAdjustment = (flight) => {
  if (!flight) return 0;
  const text = `${flight.stops} ${flight.tag}`.toLowerCase();
  if (text.includes('strong reliability') || text.includes('premium') || text.includes('flexible')) return -0.45;
  if (text.includes('lower-cost')) return 0.45;
  return 0;
};

const hotelRiskAdjustment = (hotel) => {
  if (!hotel) return 0;
  const text = `${hotel.tag} ${hotel.rating}`.toLowerCase();
  if (text.includes('refundable') || text.includes('free cancellation') || text.includes('high confidence') || text.includes('best proximity')) return -0.4;
  if (text.includes('semi-flexible')) return 0.2;
  return -0.1;
};

const demoPlanFor = (item, planPosition, selectedFlights, selectedHotels) => {
  const selectedFlight = selectedFlights[planPosition];
  const selectedHotel = selectedHotels[planPosition];
  const changed = Boolean(selectedFlight || selectedHotel);
  if (!changed) return item;

  const base = planDemoPrices[planPosition];
  const flightPrice = selectedFlight ? currencyValue(selectedFlight.price) : base.flight;
  const hotelRate = selectedHotel ? currencyValue(selectedHotel.rate) : base.hotel;
  const total = flightPrice + hotelRate + GROUND_TRANSPORT_ESTIMATE;
  const baseRisk = riskScores[item.risk] ?? 3;
  const riskScore = clamp(baseRisk + flightRiskAdjustment(selectedFlight) + hotelRiskAdjustment(selectedHotel) + (total < 900 ? 0.25 : 0) - (total > 980 ? 0.15 : 0), 1, 4);
  const confidence = clamp(Number(item.confidence.replace('%', '')) - ((riskScore - baseRisk) * 5) + (selectedFlight?.tag.toLowerCase().includes('lower-cost') ? -1 : 0) + (selectedHotel?.tag.toLowerCase().includes('refundable') ? 2 : 0), 82, 99);

  return {
    ...item,
    cost: formatCurrency(total),
    risk: riskLabelFromScore(riskScore),
    confidence: `${Math.round(confidence)}%`,
    flight: selectedFlight ? formatFlight(selectedFlight) : item.flight,
    hotel: selectedHotel ? formatHotel(selectedHotel) : item.hotel,
  };
};


function App() {
  const [page, setPage] = useState('book');
  const [mode, setMode] = useState('guided');
  const [planIndex, setPlanIndex] = useState(1);
  const [mouse, setMouse] = useState({ x: 50, y: 35 });
  const [selectedFlights, setSelectedFlights] = useState({});
  const [selectedHotels, setSelectedHotels] = useState({});
  const plan = demoPlanFor(plans[planIndex], planIndex, selectedFlights, selectedHotels);

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
      {page === 'results' && <ResultsPage plan={plan} index={planIndex} setIndex={setPlanIndex} selectedFlights={selectedFlights} setSelectedFlights={setSelectedFlights} selectedHotels={selectedHotels} setSelectedHotels={setSelectedHotels} onConfirm={() => setPage('confirm')} />}
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

function ResultsPage({ index, setIndex, selectedFlights, setSelectedFlights, selectedHotels, setSelectedHotels, onConfirm }) {
  const [chooser, setChooser] = useState(null);
  const getPosition = (planPosition) => {
    if (planPosition === index) return 'active';
    if (planPosition === (index + 1) % plans.length) return 'next';
    return 'prev';
  };
  const planFor = (item, planPosition) => demoPlanFor(item, planPosition, selectedFlights, selectedHotels);
  const selectChoice = (choice) => {
    if (chooser === 'flight') setSelectedFlights((current) => ({ ...current, [index]: choice }));
    if (chooser === 'hotel') setSelectedHotels((current) => ({ ...current, [index]: choice }));
    setChooser(null);
  };

  return <div className="results appear"><button className="arrow" aria-label="Previous plan" onClick={()=>setIndex((index+plans.length-1)%plans.length)}><IconGlyph icon="‹"/></button><div className="plan-shell"><div className="plan-tabs">{plans.map((item, planPosition)=><button key={item.name} className={planPosition===index?'active':''} onClick={()=>setIndex(planPosition)}>Plan {planPosition+1}</button>)}</div><div className="carousel-stage">{plans.map((item, planPosition)=>{ const displayPlan = planFor(item, planPosition); return <article className={`card plan-card ${item.accent} ${getPosition(planPosition)}`} aria-hidden={planPosition!==index} key={item.name}><div className="plan-head"><IconGlyph icon={item.icon}/><div><p>Plan {planPosition+1} of 3</p><h1>{item.name}</h1></div></div><div className="metrics"><b>{displayPlan.cost}<span>Total cost</span></b><b>{displayPlan.risk}<span>Risk level</span></b><b>{displayPlan.confidence}<span>Confidence</span></b></div><Info icon={'✈'} label="Flight" value={displayPlan.flight} button onClick={()=>setChooser('flight')}/><Info icon={'▣'} label="Hotel" value={displayPlan.hotel} button onClick={()=>setChooser('hotel')}/><Info icon={'⌖'} label="Ground transport" value={item.ground}/><p className="explain"><IconGlyph icon="🤖"/>{item.explanation}</p>{planPosition===index && <button className="primary" onClick={onConfirm}>Confirm & Book</button>}</article>})}</div></div><button className="arrow" aria-label="Next plan" onClick={()=>setIndex((index+1)%plans.length)}><IconGlyph icon="›"/></button>{chooser && <ChoiceModal type={chooser} selected={chooser === 'flight' ? selectedFlights[index] : selectedHotels[index]} onSelect={selectChoice} onClose={()=>setChooser(null)} />}</div>;
}
function Info({icon:Icon,label,value,button,onClick}){const Tag=button?'button':'div';return <Tag type={button?'button':undefined} className={`info ${button?'clickable':''}`} onClick={onClick}><IconGlyph icon={Icon}/><span>{label}</span><strong>{value}</strong>{button && <em>Change</em>}</Tag>}

function ChoiceModal({ type, selected, onSelect, onClose }) {
  const isFlight = type === 'flight';
  const options = isFlight ? flightOptions : hotelOptions;
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="choice-modal" role="dialog" aria-modal="true" aria-label={isFlight ? 'Flight options' : 'Hotel options'} onClick={(event)=>event.stopPropagation()}><div className="modal-head"><div><span>{isFlight ? 'SFO → NYC demo flights' : 'NYC demo hotels'}</span><h2>{isFlight ? 'Choose a flight option' : 'Choose a hotel option'}</h2></div><button type="button" aria-label="Close options" onClick={onClose}>×</button></div><div className="choice-list">{options.map((option)=>{ const active = selected && (isFlight ? selected.airline === option.airline : selected.name === option.name); return <button type="button" className={`choice-card ${active ? 'selected' : ''}`} key={isFlight ? option.airline : option.name} onClick={()=>onSelect(option)}><div className="choice-title"><strong>{isFlight ? option.airline : option.name}</strong><span>{isFlight ? option.price : option.rate}</span></div><p>{isFlight ? option.route : option.location}</p><div className="choice-meta">{isFlight ? <><span>{option.departure} → {option.arrival}</span><span>{option.stops}</span><span>{option.duration}</span><em>{option.tag}</em></> : <><span>{option.distance}</span><span>{option.tag}</span><em>{option.rating}</em></>}</div></button>})}</div></section></div>;
}
function ConfirmPage({ plan, onConfirm, onEdit }) { return <div className="card confirm-card appear"><h1>Confirm & Book</h1><p className="notice"><IconGlyph icon="⬡"/>JustMove.AI never books without your approval. Review this mock trip summary, then explicitly confirm.</p><div className="summary"><div className="summary-hero"><IconGlyph icon={plan.icon}/><div><span>Selected plan</span><strong>{plan.name}</strong><p>{plan.explanation}</p></div></div><div className="summary-grid"><Info icon={'◫'} label="Mock total" value={plan.cost}/><Info icon={'▣'} label="Stay" value={plan.hotel}/><Info icon={'◴'} label="Meeting" value="Empire State Building · 10:00 AM"/></div></div><div className="actions"><button className="primary" onClick={onConfirm}>Confirm Booking</button><button onClick={onEdit}>Edit Plan</button><button>Ask AI Why</button></div></div>; }
function MonitorPage({ onReset }) { return <div className="card monitor-card appear"><div className="alert"><IconGlyph icon="🔔"/>Flight delay detected</div><h1>AI Travel Monitoring</h1><p>Your SFO → NYC flight is now estimated 48 minutes late. JustMove found a backup nonstop that protects your arrival buffer and keeps the trip under budget.</p><div className="backup"><Info icon={'✈'} label="Backup option" value="Earlier SFO → JFK nonstop · arrives 8:42 PM"/><Info icon={'◈'} label="Budget impact" value="+$96 · still under $1,800"/><Info icon={'⬡'} label="Reliability" value="Reduces meeting delay risk to Very Low"/></div><div className="actions"><button onClick={onReset}>Keep Current Plan</button><button className="primary" onClick={onReset}>Approve Backup</button></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
