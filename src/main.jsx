import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const cityProfiles = [
  { city: 'San Francisco', code: 'SFO', meetings: ['Salesforce Tower', 'Ferry Building', 'Moscone Center'], zones: ['SoMa', 'Financial District', 'Union Square'] },
  { city: 'New York', code: 'NYC', meetings: ['Empire State Building', 'Hudson Yards', 'World Trade Center'], zones: ['Midtown', 'Chelsea', 'Financial District'] },
  { city: 'Los Angeles', code: 'LAX', meetings: ['Century City Plaza', 'Downtown LA Arts District', 'Santa Monica Business Park'], zones: ['Century City', 'Downtown LA', 'Santa Monica'] },
  { city: 'Chicago', code: 'ORD', meetings: ['Willis Tower', 'River North Conference Center', 'Fulton Market Offices'], zones: ['Loop', 'River North', 'West Loop'] },
  { city: 'Seattle', code: 'SEA', meetings: ['South Lake Union Campus', 'Pike Place Market Offices', 'Bellevue Downtown Center'], zones: ['South Lake Union', 'Downtown', 'Bellevue'] },
  { city: 'Boston', code: 'BOS', meetings: ['Seaport Innovation Center', 'Kendall Square', 'Back Bay Conference Center'], zones: ['Seaport', 'Cambridge', 'Back Bay'] },
  { city: 'Washington DC', code: 'DCA', meetings: ['K Street Offices', 'Capitol Hill Conference Center', 'Navy Yard Business Center'], zones: ['Downtown', 'Capitol Hill', 'Navy Yard'] },
  { city: 'Miami', code: 'MIA', meetings: ['Brickell City Centre', 'Wynwood Business Hub', 'Downtown Miami Tower'], zones: ['Brickell', 'Downtown', 'Wynwood'] },
  { city: 'Dallas', code: 'DFW', meetings: ['Uptown Dallas Offices', 'Arts District Center', 'Las Colinas Campus'], zones: ['Uptown', 'Downtown', 'Las Colinas'] },
  { city: 'Atlanta', code: 'ATL', meetings: ['Midtown Tech Square', 'Buckhead Financial Center', 'Downtown Convention Center'], zones: ['Midtown', 'Buckhead', 'Downtown'] },
  { city: 'Denver', code: 'DEN', meetings: ['Union Station Offices', 'LoDo Conference Center', 'Cherry Creek Business Plaza'], zones: ['LoDo', 'Downtown', 'Cherry Creek'] },
  { city: 'Las Vegas', code: 'LAS', meetings: ['Convention Center West Hall', 'The Strip Business Suites', 'Downtown Vegas Offices'], zones: ['Convention Center', 'The Strip', 'Downtown'] },
  { city: 'Houston', code: 'IAH', meetings: ['Energy Corridor Campus', 'Downtown Houston Tower', 'Galleria Business Center'], zones: ['Downtown', 'Galleria', 'Energy Corridor'] },
  { city: 'Phoenix', code: 'PHX', meetings: ['Downtown Phoenix Offices', 'Tempe Town Lake Campus', 'Scottsdale Quarter'], zones: ['Downtown', 'Tempe', 'Scottsdale'] },
  { city: 'Orlando', code: 'MCO', meetings: ['Lake Nona Business Park', 'Downtown Orlando Center', 'Convention Center District'], zones: ['Downtown', 'Lake Nona', 'I-Drive'] },
  { city: 'Philadelphia', code: 'PHL', meetings: ['Center City Offices', 'University City Campus', 'Navy Yard Business Center'], zones: ['Center City', 'University City', 'Navy Yard'] },
];

const cityOptions = cityProfiles.map(({ city, code }) => `${city} / ${code}`);
const cityProfileByOption = Object.fromEntries(cityProfiles.map((profile) => [`${profile.city} / ${profile.code}`, profile]));
const routeKeyFor = (from, to) => `${cityProfileByOption[from]?.code}-${cityProfileByOption[to]?.code}`;


const bookingOptions = {
  Dates: ['Tue, Jul 14 → Thu, Jul 16', 'Mon, Aug 3 → Wed, Aug 5', 'Fri, Sep 11 → Sun, Sep 13'],
  Travelers: ['1 traveler', '2 travelers', '4 travelers'],
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

const RECOMMENDED_PLAN_INDEX = 1;

const priorityStrategies = [
  { id: 'cost', label: 'Optimize for lowest cost', planIndex: 0, alternateId: 'lowest-nearby' },
  { id: 'risk', label: 'Optimize for lowest risk', planIndex: 2, alternateId: 'reliable-fastest' },
  { id: 'arrival', label: 'Optimize for fastest arrival', planIndex: 2, alternateId: 'reliable-fastest' },
  { id: 'comfort', label: 'Optimize for business comfort', planIndex: 1, alternateId: 'balance-fastest' },
];

const decisionBriefs = [
  {
    goal: 'Get one traveler from San Francisco to a 10:00 AM Empire State Building meeting under $1,800 with enough arrival buffer to absorb disruption.',
    weights: { cost: 34, reliability: 22, convenience: 14, hotelDistance: 12, risk: 18 },
    why: 'Recommended when budget pressure is highest; it accepts a moderate connection risk to keep the full trip comfortably below the cap.',
    alternatives: [
      { label: 'Accepted', text: 'Nearby-airport nonstop lowered fare enough to remain a viable backup.' },
      { label: 'Rejected', text: 'Chicago connection improved coverage but arrived too late for the desired buffer.' },
    ],
  },
  {
    goal: 'Balance budget, nonstop reliability, and a hotel close to the client meeting without over-optimizing for any single factor.',
    weights: { cost: 22, reliability: 28, convenience: 18, hotelDistance: 16, risk: 16 },
    why: 'This is the recommended baseline because it keeps the traveler under budget, avoids layovers, and lands early enough for a calm evening arrival.',
    alternatives: [
      { label: 'Accepted', text: 'JFK nonstop was kept as a fast backup because it improves arrival time with a small fare increase.' },
      { label: 'Rejected', text: 'Denver connection was deprioritized because extra connection risk outweighed the closer hotel.' },
    ],
  },
  {
    goal: 'Protect the meeting above all else with the strongest nonstop, shortest transfer, and most resilient hotel/ground plan.',
    weights: { cost: 10, reliability: 34, convenience: 20, hotelDistance: 16, risk: 20 },
    why: 'Recommended when disruption tolerance is lowest; the higher spend buys stronger flight history and a closer meeting-day commute.',
    alternatives: [
      { label: 'Accepted', text: 'Earlier JFK nonstop strengthened the arrival buffer and kept risk at the lowest level.' },
      { label: 'Rejected', text: 'Atlanta backup added recovery choices but introduced a late arrival window.' },
    ],
  },
];

const plans = [
  { name: 'Lowest Cost Plan', icon: '◈', cost: '$1,342', risk: 'Medium', confidence: '88%', score: 86, arrival: '4:48 PM', route: 'SFO → JFK via MSP', hotelDistance: '1.1 mi from meeting', accent: 'teal', flight: 'SFO → JFK · 6:10 AM · 1 short layover', hotel: 'Pod Times Square · 1.1 mi from meeting', ground: 'AirTrain + rideshare buffer', explanation: 'Optimizes total spend while preserving a 90-minute arrival buffer before the client meeting.' },
  { name: 'Best Balance Plan', icon: '✦', cost: '$1,617', risk: 'Low', confidence: '94%', score: 94, arrival: '3:58 PM', route: 'SFO → EWR nonstop', hotelDistance: '0.5 mi from meeting', accent: 'purple', flight: 'SFO → EWR · 7:25 AM · nonstop', hotel: 'Hyatt Place Midtown · 0.5 mi from meeting', ground: 'Pre-scheduled rideshare', explanation: 'Balances nonstop reliability, hotel proximity, and a comfortable budget margin under $1,800.' },
  { name: 'Most Reliable Plan', icon: '⬡', cost: '$1,764', risk: 'Very Low', confidence: '97%', score: 97, arrival: '2:29 PM', route: 'SFO → JFK nonstop', hotelDistance: '0.4 mi from meeting', accent: 'cyan', flight: 'SFO → JFK · 6:00 AM · nonstop', hotel: 'Moxy NYC Times Square · 0.4 mi from meeting', ground: 'Black car pickup + subway backup', explanation: 'Prioritizes on-time arrival with the strongest flight history and the shortest morning transfer.' },
];

const flightOptions = [
  { airline: 'United', route: 'SFO → EWR', departure: '7:25 AM', arrival: '3:58 PM', stops: 'Nonstop', duration: '5h 33m', price: '$428', tag: 'Strong reliability' },
  { airline: 'Delta', route: 'SFO → JFK', departure: '7:05 AM', arrival: '3:32 PM', stops: 'Nonstop', duration: '5h 27m', price: '$446', tag: 'Balanced option' },
  { airline: 'JetBlue', route: 'SFO → JFK', departure: '8:10 AM', arrival: '4:44 PM', stops: 'Nonstop', duration: '5h 34m', price: '$372', tag: 'Lower-cost' },
  { airline: 'American', route: 'SFO → JFK', departure: '6:00 AM', arrival: '2:29 PM', stops: 'Nonstop', duration: '5h 29m', price: '$512', tag: 'Premium friendly' },
  { airline: 'Alaska', route: 'SFO → JFK', departure: '8:45 AM', arrival: '5:15 PM', stops: 'Nonstop', duration: '5h 30m', price: '$398', tag: 'Flexible value' },
];


const alternateRouteOptions = [
  [
    { id: 'lowest-fastest', label: 'Fastest direct route', route: 'OAK → EWR nonstop', arrival: '3:20 PM', flightPrice: 438, hotelDistance: '1.0 mi from meeting', scoreDelta: 4, confidenceDelta: 3, riskAdjustment: -0.35, explanation: 'Switches to an Oakland nonstop that arrives earlier and removes layover risk while keeping the lower-cost hotel profile.' },
    { id: 'lowest-nearby', label: 'Cheaper nearby airport', route: 'SJC → JFK nonstop', arrival: '4:10 PM', flightPrice: 318, hotelDistance: '1.2 mi from meeting', scoreDelta: 1, confidenceDelta: 1, riskAdjustment: 0.05, explanation: 'Uses San Jose for the fare savings and keeps enough buffer for the meeting, with a slightly longer airport transfer.' },
    { id: 'lowest-backup', label: 'Backup through Chicago', route: 'SFO → ORD → LGA', arrival: '5:05 PM', flightPrice: 346, hotelDistance: '0.9 mi from meeting', scoreDelta: -2, confidenceDelta: -2, riskAdjustment: 0.45, explanation: 'Adds a Chicago connection as a backup route with better rebooking coverage but a later arrival window.' },
    { id: 'lowest-flex', label: 'Flexible date option', route: 'SFO → JFK nonstop · Wed depart', arrival: '3:45 PM', flightPrice: 334, hotelDistance: '1.1 mi from meeting', scoreDelta: 3, confidenceDelta: 2, riskAdjustment: -0.1, explanation: 'Moves departure by one day to capture a cheaper nonstop and preserve the original hotel distance.' },
  ],
  [
    { id: 'balance-fastest', label: 'Fastest direct route', route: 'SFO → JFK nonstop', arrival: '3:32 PM', flightPrice: 446, hotelDistance: '0.5 mi from meeting', scoreDelta: 2, confidenceDelta: 1, riskAdjustment: -0.15, explanation: 'Chooses the quickest JFK nonstop while preserving the balanced hotel and comfortable meeting buffer.' },
    { id: 'balance-nearby', label: 'Cheaper nearby airport', route: 'OAK → EWR nonstop', arrival: '4:05 PM', flightPrice: 389, hotelDistance: '0.6 mi from meeting', scoreDelta: 1, confidenceDelta: 0, riskAdjustment: 0.05, explanation: 'Trades a nearby Bay Area departure for lower airfare with almost no change to hotel proximity.' },
    { id: 'balance-backup', label: 'Backup through Denver', route: 'SFO → DEN → LGA', arrival: '5:28 PM', flightPrice: 402, hotelDistance: '0.4 mi from meeting', scoreDelta: -3, confidenceDelta: -3, riskAdjustment: 0.5, explanation: 'Keeps a protected backup through Denver and offsets the later arrival with a closer hotel-to-meeting distance.' },
    { id: 'balance-flex', label: 'Flexible date option', route: 'SFO → EWR nonstop · Mon depart', arrival: '3:50 PM', flightPrice: 396, hotelDistance: '0.5 mi from meeting', scoreDelta: 3, confidenceDelta: 2, riskAdjustment: -0.2, explanation: 'Uses flexible dates to lower the fare while keeping the recommended nonstop route and hotel distance.' },
  ],
  [
    { id: 'reliable-fastest', label: 'Fastest direct route', route: 'SFO → JFK nonstop', arrival: '2:18 PM', flightPrice: 548, hotelDistance: '0.4 mi from meeting', scoreDelta: 1, confidenceDelta: 1, riskAdjustment: -0.2, explanation: 'Keeps the reliability-first nonstop and improves the arrival buffer with the earliest direct option.' },
    { id: 'reliable-nearby', label: 'Cheaper nearby airport', route: 'OAK → EWR nonstop', arrival: '3:42 PM', flightPrice: 468, hotelDistance: '0.5 mi from meeting', scoreDelta: -1, confidenceDelta: -1, riskAdjustment: 0.1, explanation: 'Reduces airfare through Oakland while retaining a nonstop itinerary and a close Midtown hotel.' },
    { id: 'reliable-backup', label: 'Backup through Atlanta', route: 'SFO → ATL → LGA', arrival: '5:12 PM', flightPrice: 492, hotelDistance: '0.3 mi from meeting', scoreDelta: -4, confidenceDelta: -4, riskAdjustment: 0.55, explanation: 'Adds a high-frequency Atlanta backup path; the closer hotel helps offset the later arrival risk.' },
    { id: 'reliable-flex', label: 'Flexible date option', route: 'SFO → JFK nonstop · Wed depart', arrival: '2:36 PM', flightPrice: 486, hotelDistance: '0.4 mi from meeting', scoreDelta: 2, confidenceDelta: 1, riskAdjustment: -0.15, explanation: 'Shifts dates to reduce premium fare while preserving the strongest nonstop and short hotel transfer.' },
  ],
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

const makeRouteData = ({ fromCode, toCode, destination, meeting, routeName, recommendedPlanIndex = RECOMMENDED_PLAN_INDEX, costShift = 0, arrival = '3:58 PM', risk = 'Low' }) => {
  const destinationFirstName = destination.split(' ')[0];
  const localPlans = plans.map((plan, index) => ({
    ...plan,
    name: index === recommendedPlanIndex ? `Best ${destinationFirstName} Plan` : plan.name,
    cost: formatCurrency(currencyValue(plan.cost) + costShift + index * 38),
    route: index === 0 ? `${fromCode} → ${toCode} value route` : index === 1 ? `${fromCode} → ${toCode} nonstop` : `${fromCode} → ${toCode} early nonstop`,
    arrival: index === recommendedPlanIndex ? arrival : plan.arrival,
    risk: index === recommendedPlanIndex ? risk : plan.risk,
    flight: `${fromCode} → ${toCode} · ${index === 2 ? '6:00 AM' : index === 1 ? '7:25 AM' : '8:10 AM'} · ${index === 0 ? '1 short layover' : 'nonstop'}`,
    hotel: `${cityProfileByOption[`${destination} / ${toCode}`]?.zones?.[0] ?? 'Central'} business hotel · ${plan.hotelDistance}`,
    explanation: `Builds a complete ${routeName} plan around the ${meeting} meeting, balancing airfare, arrival buffer, hotel proximity, and disruption recovery.`,
  }));
  const localAlternates = alternateRouteOptions.map((group) => group.map((option) => ({
    ...option,
    route: option.route.replace(/SFO|OAK|SJC/g, fromCode).replace(/JFK|EWR|LGA/g, toCode),
    explanation: option.explanation.replace(/New York|Midtown|JFK|EWR|LGA|SFO|Oakland|San Jose|Bay Area/g, destination),
  })));
  const localFlights = flightOptions.map((flight) => ({ ...flight, route: `${fromCode} → ${toCode}` }));
  const localHotels = hotelOptions.map((hotel, index) => ({
    ...hotel,
    name: `${destination} ${hotel.name.split(' ').slice(0, 2).join(' ')}`,
    location: cityProfileByOption[`${destination} / ${toCode}`]?.zones?.[index % 3] ?? hotel.location,
    distance: hotel.distance.replace('Empire State Building', meeting),
  }));
  return {
    recommendedPlanIndex,
    plans: localPlans,
    alternateRouteOptions: localAlternates,
    flightOptions: localFlights,
    hotelOptions: localHotels,
    decisionBriefs: decisionBriefs.map((brief) => ({
      ...brief,
      goal: `Get the traveler from ${fromCode} to a ${meeting} meeting in ${destination} under budget with enough arrival buffer to absorb disruption.`,
      why: `JustMove recommends this route because it packages the flight, hotel zone, ground buffer, and backup options into one approval-ready business trip plan.`,
    })),
    confirmDetails: { meeting: `${meeting} · 10:00 AM`, approvalCopy: `Approve the complete ${routeName} plan for flights, hotel, ground buffer, and monitoring.` },
    monitoringExample: { alert: `Sample ${destination} disruption alert`, backup: `JustMove found an earlier ${fromCode} → ${toCode} option that preserves the meeting buffer while keeping the hotel unchanged.` },
  };
};

const showcaseRouteDefinitions = [
  ['SFO-NYC', 'San Francisco', 'SFO', 'New York', 'NYC', 'Empire State Building', 'San Francisco → New York', 1, 0, '3:58 PM', 'Low'],
  ['LAX-NYC', 'Los Angeles', 'LAX', 'New York', 'NYC', 'Hudson Yards', 'Los Angeles → New York', 1, -80, '4:12 PM', 'Low'],
  ['ORD-BOS', 'Chicago', 'ORD', 'Boston', 'BOS', 'Seaport Innovation Center', 'Chicago → Boston', 1, -210, '2:55 PM', 'Low'],
  ['SEA-DCA', 'Seattle', 'SEA', 'Washington DC', 'DCA', 'K Street Offices', 'Seattle → Washington DC', 2, 110, '3:05 PM', 'Very Low'],
  ['DFW-ATL', 'Dallas', 'DFW', 'Atlanta', 'ATL', 'Midtown Tech Square', 'Dallas → Atlanta', 1, -260, '1:48 PM', 'Low'],
  ['DEN-LAS', 'Denver', 'DEN', 'Las Vegas', 'LAS', 'Convention Center West Hall', 'Denver → Las Vegas', 0, -340, '12:38 PM', 'Medium'],
  ['MIA-PHL', 'Miami', 'MIA', 'Philadelphia', 'PHL', 'Center City Offices', 'Miami → Philadelphia', 1, -120, '3:18 PM', 'Low'],
  ['IAH-PHX', 'Houston', 'IAH', 'Phoenix', 'PHX', 'Downtown Phoenix Offices', 'Houston → Phoenix', 1, -190, '2:44 PM', 'Low'],
  ['BOS-ORD', 'Boston', 'BOS', 'Chicago', 'ORD', 'Willis Tower', 'Boston → Chicago', 2, -160, '1:35 PM', 'Very Low'],
  ['ATL-MIA', 'Atlanta', 'ATL', 'Miami', 'MIA', 'Brickell City Centre', 'Atlanta → Miami', 1, -300, '12:50 PM', 'Low'],
  ['PHX-SFO', 'Phoenix', 'PHX', 'San Francisco', 'SFO', 'Salesforce Tower', 'Phoenix → San Francisco', 1, -220, '2:20 PM', 'Low'],
  ['DCA-SEA', 'Washington DC', 'DCA', 'Seattle', 'SEA', 'South Lake Union Campus', 'Washington DC → Seattle', 2, 140, '4:06 PM', 'Very Low'],
];

const showcaseRoutes = Object.fromEntries(showcaseRouteDefinitions.map(([key, , fromCode, destination, toCode, meeting, routeName, recommendedPlanIndex, costShift, arrival, risk]) => [key, makeRouteData({ fromCode, toCode, destination, meeting, routeName, recommendedPlanIndex, costShift, arrival, risk })]));


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

const timeToMinutes = (time) => {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 18 * 60;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(match[2]);
};

const distanceValue = (value) => Number(value.match(/([\d.]+)/)?.[1] ?? 1.5);

const planFitFor = ({ total, riskScore, confidence, distance, arrival, score }) => {
  const arrivalMinutes = timeToMinutes(arrival);
  const earlyArrivalBonus = clamp((18 * 60 - arrivalMinutes) / 180, 0, 1);
  const cost = clamp(100 - ((total - 900) / 900) * 42, 52, 99);
  const reliability = clamp(confidence - (riskScore - 1) * 2, 60, 99);
  const convenience = clamp(76 + earlyArrivalBonus * 18 - Math.max(0, distance - 0.6) * 7 - (riskScore > 2 ? 4 : 0), 58, 99);
  const hotelDistance = clamp(100 - distance * 24, 58, 99);
  const riskControl = clamp(104 - riskScore * 15 + earlyArrivalBonus * 6, 55, 99);
  return {
    cost: Math.round(cost),
    reliability: Math.round(reliability),
    convenience: Math.round(convenience),
    hotelDistance: Math.round(hotelDistance),
    riskControl: Math.round(riskControl),
    total: Math.round(score),
  };
};

const basePlanFit = (item, planPosition) => planFitFor({
  total: currencyValue(item.cost),
  riskScore: riskScores[item.risk] ?? 3,
  confidence: Number(item.confidence.replace('%', '')),
  distance: distanceValue(item.hotelDistance),
  arrival: item.arrival,
  score: item.score,
});

const alternativeReasonFor = (option, selected) => {
  if (selected?.id === option.id) return 'Accepted into current plan';
  if (option.scoreDelta > 0 && option.riskAdjustment <= 0) return 'Strong backup: improves score and controls risk';
  if (option.scoreDelta > 0) return 'Accepted as a backup candidate';
  if (option.riskAdjustment > 0.35) return 'Rejected: adds too much timing risk';
  return 'Rejected for this priority';
};

const demoPlanFor = (item, planPosition, selectedFlights, selectedHotels, selectedAlternateRoutes = {}) => {
  const selectedFlight = selectedFlights[planPosition];
  const selectedHotel = selectedHotels[planPosition];
  const selectedAlternateRoute = selectedAlternateRoutes[planPosition];
  const changed = Boolean(selectedFlight || selectedHotel || selectedAlternateRoute);
  if (!changed) return { ...item, planFit: basePlanFit(item, planPosition) };

  const base = planDemoPrices[planPosition];
  const flightPrice = selectedAlternateRoute?.flightPrice ?? (selectedFlight ? currencyValue(selectedFlight.price) : base.flight);
  const hotelRate = selectedHotel ? currencyValue(selectedHotel.rate) : base.hotel;
  const total = flightPrice + hotelRate + GROUND_TRANSPORT_ESTIMATE;
  const baseRisk = riskScores[item.risk] ?? 3;
  const riskScore = clamp(baseRisk + flightRiskAdjustment(selectedFlight) + hotelRiskAdjustment(selectedHotel) + (selectedAlternateRoute?.riskAdjustment ?? 0) + (total < 900 ? 0.25 : 0) - (total > 980 ? 0.15 : 0), 1, 4);
  const confidence = clamp(Number(item.confidence.replace('%', '')) - ((riskScore - baseRisk) * 5) + (selectedFlight?.tag.toLowerCase().includes('lower-cost') ? -1 : 0) + (selectedHotel?.tag.toLowerCase().includes('refundable') ? 2 : 0) + (selectedAlternateRoute?.confidenceDelta ?? 0), 82, 99);
  const score = clamp(item.score + (selectedAlternateRoute?.scoreDelta ?? 0) + (confidence - Number(item.confidence.replace('%', ''))) * 0.25, 70, 99);

  const hotelDistance = selectedAlternateRoute?.hotelDistance ?? selectedHotel?.distance?.replace(' to Empire State Building', ' from meeting') ?? item.hotelDistance;

  return {
    ...item,
    cost: formatCurrency(total),
    risk: riskLabelFromScore(riskScore),
    confidence: `${Math.round(confidence)}%`,
    flight: selectedAlternateRoute ? `${selectedAlternateRoute.route} · arrives ${selectedAlternateRoute.arrival}` : selectedFlight ? formatFlight(selectedFlight) : item.flight,
    hotel: selectedHotel ? formatHotel(selectedHotel) : selectedAlternateRoute ? `${item.hotel.split(' · ')[0]} · ${selectedAlternateRoute.hotelDistance}` : item.hotel,
    route: selectedAlternateRoute?.route ?? item.route,
    arrival: selectedAlternateRoute?.arrival ?? selectedFlight?.arrival ?? item.arrival,
    hotelDistance,
    score: Math.round(score),
    planFit: planFitFor({ total, riskScore, confidence, distance: distanceValue(hotelDistance), arrival: selectedAlternateRoute?.arrival ?? selectedFlight?.arrival ?? item.arrival, score }),
    explanation: selectedAlternateRoute?.explanation ?? item.explanation,
  };
};


function App() {
  const [page, setPage] = useState('book');
  const [mode, setMode] = useState('guided');
  const [planIndex, setPlanIndex] = useState(RECOMMENDED_PLAN_INDEX);
  const [mouse, setMouse] = useState({ x: 50, y: 35 });
  const [selectedFlights, setSelectedFlights] = useState({});
  const [selectedHotels, setSelectedHotels] = useState({});
  const [selectedAlternateRoutes, setSelectedAlternateRoutes] = useState({});
  const [selectedPriority, setSelectedPriority] = useState('comfort');
  const [booking, setBooking] = useState(defaultBookingValues);
  const [routeData, setRouteData] = useState(showcaseRoutes[routeKeyFor(defaultBookingValues.From, defaultBookingValues.To)]);
  const activePlans = routeData?.plans ?? [];
  const plan = routeData ? demoPlanFor(activePlans[planIndex], planIndex, selectedFlights, selectedHotels, selectedAlternateRoutes) : null;
  const resetGeneratedPlanState = () => {
    const nextRoute = showcaseRoutes[routeKeyFor(booking.From, booking.To)];
    setRouteData(nextRoute);
    setPlanIndex(nextRoute?.recommendedPlanIndex ?? RECOMMENDED_PLAN_INDEX);
    setSelectedFlights({});
    setSelectedHotels({});
    setSelectedAlternateRoutes({});
    setSelectedPriority('comfort');
    setPage('processing');
  };

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
      {page === 'book' && <BookingPage mode={mode} setMode={setMode} booking={booking} setBooking={setBooking} onNext={resetGeneratedPlanState} onRouteInputChange={() => { setPlanIndex(RECOMMENDED_PLAN_INDEX); setSelectedFlights({}); setSelectedHotels({}); setSelectedAlternateRoutes({}); }} />}
      {page === 'processing' && <ProcessingPage />}
      {page === 'results' && (routeData ? <ResultsPage routeData={routeData} plan={plan} index={planIndex} setIndex={setPlanIndex} selectedFlights={selectedFlights} setSelectedFlights={setSelectedFlights} selectedHotels={selectedHotels} setSelectedHotels={setSelectedHotels} selectedAlternateRoutes={selectedAlternateRoutes} setSelectedAlternateRoutes={setSelectedAlternateRoutes} selectedPriority={selectedPriority} setSelectedPriority={setSelectedPriority} onConfirm={() => setPage('confirm')} /> : <UnsupportedRouteMessage onBack={() => setPage('book')} />)}
      {page === 'confirm' && <ConfirmPage plan={plan} routeData={routeData} onConfirm={() => setPage('monitor')} onEdit={() => setPage('results')} />}
      {page === 'monitor' && <MonitorPage routeData={routeData} onReset={() => setPage('book')} />}
    </section>
  </main>;
}

function IconGlyph({ icon }) { return <span className="glyph">{icon}</span>; }
function TravelBackground() { return <div className="travel-bg" aria-hidden="true">{travelSlides.map((slide, index) => <span key={slide.label} style={{ backgroundImage: `url(${slide.image})`, animationDelay: `${index * 6}s` }} />)}</div>; }
function Header() { return <header className="header"><div className="brand"><span className="logo-mark"><img src={`${import.meta.env.BASE_URL}justmove-logo.png`} alt="JustMove.AI logo" /></span><span>JustMove.AI</span></div><nav aria-label="Secondary prototype navigation"><button>Book</button><button>Trips</button><button>Alerts</button></nav></header>; }
function Progress({ current }) { return <div className="progress">{['Input','Scan','Plans','Confirm','Monitor'].map((s,i)=><div className={`dot ${i<=current?'on':''}`} key={s}><span>{i+1}</span>{s}</div>)}</div>; }

function BookingPage({ mode, setMode, booking, setBooking, onNext, onRouteInputChange }) {
  const [openField, setOpenField] = useState(null);
  const [citySearch, setCitySearch] = useState('');
  const [preferences, setPreferences] = useState(['Nonstop', 'Near meeting location']);

  const filteredCities = useMemo(() => cityOptions.filter((option) => option.toLowerCase().includes(citySearch.toLowerCase())), [citySearch]);
  const selectOption = (label, value) => {
    setBooking((current) => {
      const next = { ...current, [label]: value };
      if (label === 'To') next['Meeting Location'] = cityProfileByOption[value]?.meetings[0] ?? next['Meeting Location'];
      return next;
    });
    if (label === 'To') onRouteInputChange();
    setOpenField(null);
    setCitySearch('');
  };
  const togglePreference = (preference) => setPreferences((current) => current.includes(preference) ? current.filter((item) => item !== preference) : [...current, preference]);

  return <div className="card booking-card appear"><div className="switch"><button className={mode==='guided'?'active':''} onClick={()=>setMode('guided')}>Guided Booking</button><button className={mode==='describe'?'active':''} onClick={()=>setMode('describe')}>Describe Your Trip</button></div>{mode==='guided'?<><div className="grid">{guidedFields.map(([label,Icon])=><div className="field-wrap" key={label}><button className={`field ${openField===label?'open':''}`} type="button" onClick={()=>setOpenField(openField===label?null:label)}><span><IconGlyph icon={Icon}/>{label}</span><strong>{booking[label]}</strong><em>{label === 'Dates' ? 'Open calendar' : 'Tap to change'}</em></button>{openField===label && <OptionPanel label={label} value={booking[label]} booking={booking} citySearch={citySearch} setCitySearch={setCitySearch} cityOptions={filteredCities} onSelect={(value)=>selectOption(label,value)} />}</div>)}</div><section className="advanced"><div className="advanced-head"><h2>Advanced Preferences</h2><p>Select what matters most for this trip.</p></div><div className="preference-grid">{advancedPreferenceOptions.map((preference)=><button className={`preference ${preferences.includes(preference)?'selected':''}`} type="button" key={preference} onClick={()=>togglePreference(preference)}><span className="check">✓</span>{preference}</button>)}</div></section></>:<div className="describe"><label>Tell JustMove what you need</label><textarea defaultValue="I need to travel from San Francisco to New York for a client meeting near the Empire State Building. Keep the total trip under $1,800, avoid risky layovers, and choose a hotel close to the meeting." /></div>}<button className="primary" onClick={onNext}><IconGlyph icon="⚡"/>Create Plan</button></div>;
}

function OptionPanel({ label, value, booking, citySearch, setCitySearch, cityOptions, onSelect }) {
  const isCity = label === 'From' || label === 'To';
  if (label === 'Dates') return <CalendarPanel value={value} onSelect={onSelect} />;
  const options = label === 'Meeting Location' ? cityProfileByOption[booking.To]?.meetings ?? [] : isCity ? cityOptions : bookingOptions[label];
  return <div className={`option-panel ${isCity ? 'search-panel' : ''}`}>
    {isCity && <input className="search-box" value={citySearch} onChange={(event)=>setCitySearch(event.target.value)} placeholder={`Search ${label.toLowerCase()} city or airport`} autoFocus />}
    <div className="option-list">{options.map((option)=><button className={option===value?'selected':''} type="button" key={option} onClick={()=>onSelect(option)}>{option}</button>)}</div>
  </div>;
}

function CalendarPanel({ value, onSelect }) {
  return <div className="option-panel calendar-panel"><div className="date-summary"><div><span>Depart</span><strong>Tue, Jul 14</strong></div><div><span>Return</span><strong>Thu, Jul 16</strong></div></div><div className="calendar-title"><button type="button" aria-label="Previous month">‹</button><strong>July 2026</strong><button type="button" aria-label="Next month">›</button></div><div className="weekdays">{['Su','Mo','Tu','We','Th','Fr','Sa'].map((day)=><span key={day}>{day}</span>)}</div><div className="calendar-grid">{calendarDays.map((day)=><button type="button" key={day} className={`${day===departDay?'depart':''} ${day===returnDay?'return':''} ${day>departDay && day<returnDay?'in-range':''}`}><span>{day}</span>{day===departDay && <em>Depart</em>}{day===returnDay && <em>Return</em>}</button>)}</div><button className="apply-date" type="button" onClick={()=>onSelect(value)}>Apply dates</button></div>;
}



function UnsupportedRouteMessage({ onBack }) { return <div className="card process-card unsupported-route appear"><h1>Route preview coming soon</h1><p>This demo route is not fully available yet. Try San Francisco → New York, Los Angeles → New York, or Chicago → Boston.</p><button className="primary" onClick={onBack}>Choose a supported demo route</button></div>; }

function ProcessingPage() { const [active,setActive]=useState(0); useEffect(()=>{const id=setInterval(()=>setActive(v=>Math.min(v+1,4)),760); return()=>clearInterval(id)},[]); return <div className="card process-card appear"><div className="ai-core"><IconGlyph icon="✦"/><span/></div><h1>JustMove AI is planning your trip</h1><p className="processing-copy">JustMove is comparing flight schedules, hotel proximity, meeting-time risk, total cost, and backup options before recommending three plans.</p><div className="steps">{steps.map((s,i)=><div className={`step ${i<=active?'done':''}`} key={s}><IconGlyph icon="✓"/>{s}</div>)}</div></div>; }

function ResultsPage({ routeData, index, setIndex, selectedFlights, setSelectedFlights, selectedHotels, setSelectedHotels, selectedAlternateRoutes, setSelectedAlternateRoutes, selectedPriority, setSelectedPriority, onConfirm }) {
  const [chooser, setChooser] = useState(null);
  const getPosition = (planPosition) => {
    if (planPosition === index) return 'active';
    if (planPosition === (index + 1) % routeData.plans.length) return 'next';
    return 'prev';
  };
  const planFor = (item, planPosition) => demoPlanFor(item, planPosition, selectedFlights, selectedHotels, selectedAlternateRoutes);
  const selectChoice = (choice) => {
    if (chooser === 'flight') setSelectedFlights((current) => ({ ...current, [index]: choice }));
    if (chooser === 'hotel') setSelectedHotels((current) => ({ ...current, [index]: choice }));
    setSelectedPriority('custom');
    setChooser(null);
  };
  const applyPriority = (strategy) => {
    const alternate = routeData.alternateRouteOptions[strategy.planIndex].find((option) => option.id === strategy.alternateId);
    setSelectedPriority(strategy.id);
    setIndex(strategy.planIndex);
    setSelectedAlternateRoutes((current) => ({ ...current, [strategy.planIndex]: alternate }));
  };

  return <div className="results appear"><button className="arrow" aria-label="Previous plan" onClick={()=>setIndex((index+routeData.plans.length-1)%routeData.plans.length)}><IconGlyph icon="‹"/></button><div className="plan-shell"><div className="priority-panel"><span>Plan priority</span><div>{priorityStrategies.map((strategy)=><button type="button" key={strategy.id} className={selectedPriority===strategy.id?'active':''} onClick={()=>applyPriority(strategy)}>{strategy.label}</button>)}</div></div><div className="plan-tabs">{routeData.plans.map((item, planPosition)=><button key={item.name} className={planPosition===index?'active':''} onClick={()=>setIndex(planPosition)}>Plan {planPosition+1}</button>)}</div><div className="carousel-stage">{routeData.plans.map((item, planPosition)=>{ const displayPlan = planFor(item, planPosition); return <article className={`card plan-card ${item.accent} ${getPosition(planPosition)}`} aria-hidden={planPosition!==index} key={item.name}><div className="plan-head"><IconGlyph icon={item.icon}/><div><p>{planPosition === routeData.recommendedPlanIndex ? <span className="ai-recommended">Recommended</span> : <span className="ai-recommended evidence">Checked</span>} Plan {planPosition+1} of 3</p><h1>{item.name}</h1></div></div><div className="metrics"><b>{displayPlan.cost}<span>Total cost</span></b><b>{displayPlan.arrival}<span>Arrival</span></b><b>{displayPlan.score}<span>Total score</span></b></div><Info icon={'✈'} label="Flight" value={displayPlan.flight} button onClick={()=>setChooser('flight')}/><Info icon={'▣'} label="Hotel" value={displayPlan.hotel} button onClick={()=>setChooser('hotel')}/><Info icon={'⌁'} label="Route" value={displayPlan.route}/><Info icon={'⌖'} label="Hotel distance" value={displayPlan.hotelDistance}/><Info icon={'⬡'} label="Risk" value={displayPlan.risk}/><DecisionBrief plan={displayPlan} brief={routeData.decisionBriefs[planPosition]} alternatives={routeData.alternateRouteOptions[planPosition]} selected={selectedAlternateRoutes[planPosition]} onSelect={(option)=>{setSelectedPriority('custom'); setSelectedAlternateRoutes((current)=>({ ...current, [planPosition]: current[planPosition]?.id === option.id ? undefined : option }));}}/><p className="explain"><IconGlyph icon="🤖"/>{displayPlan.explanation}</p>{planPosition===index && <button className="primary" onClick={onConfirm}>Approve Plan</button>}</article>})}</div></div><button className="arrow" aria-label="Next plan" onClick={()=>setIndex((index+1)%routeData.plans.length)}><IconGlyph icon="›"/></button>{chooser && <ChoiceModal type={chooser} routeData={routeData} selected={chooser === 'flight' ? selectedFlights[index] : selectedHotels[index]} onSelect={selectChoice} onClose={()=>setChooser(null)} />}</div>;
}
function DecisionBrief({ plan, brief, alternatives, selected, onSelect }) {
  const metrics = [
    ['cost', 'Cost score'],
    ['reliability', 'Reliability'],
    ['convenience', 'Convenience'],
    ['hotelDistance', 'Hotel distance'],
    ['riskControl', 'Risk Control'],
    ['total', 'Overall total'],
  ];

  return <section className="decision-brief"><div className="brief-head"><span>Decision Brief</span><strong>Recommended</strong></div><p><b>User goal:</b> {brief.goal}</p><div className="fit-title">Current Plan Scores</div><div className="weights plan-fit">{metrics.map(([key,label])=><AnimatedScore key={key} label={label} value={plan.planFit?.[key] ?? brief.weights[key] ?? plan.score} />)}</div><p><b>Why this plan:</b> {plan.explanation || brief.why}</p><div className="brief-alternatives"><span>Alternatives checked</span>{alternatives.map((option)=><button type="button" key={option.id} className={selected?.id === option.id ? 'selected' : ''} onClick={()=>onSelect(option)}><strong>{option.label}</strong><em>{option.route} · arrives {option.arrival}</em><small>{alternativeReasonFor(option, selected)}</small></button>)}</div><ul>{brief.alternatives.map((item)=><li key={`${item.label}-${item.text}`}><strong>{item.label}:</strong> {item.text}</li>)}</ul></section>;
}

function AnimatedScore({ label, value }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState('');
  const previousValue = useRef(value);

  useEffect(() => {
    const start = previousValue.current;
    if (start === value) return;
    const delta = value - start;
    previousValue.current = value;
    setDirection(delta > 0 ? 'improved' : 'worse');
    const steps = 10;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep += 1;
      setDisplayValue(Math.round(start + (delta * currentStep) / steps));
      if (currentStep >= steps) clearInterval(timer);
    }, 28);
    const clearFlash = setTimeout(() => setDirection(''), 720);
    return () => {
      clearInterval(timer);
      clearTimeout(clearFlash);
    };
  }, [value]);

  return <div className={direction}><span>{label}</span><strong>{displayValue}%</strong><i style={{ width: `${displayValue}%` }}/></div>;
}
function Info({icon:Icon,label,value,button,onClick}){const Tag=button?'button':'div';return <Tag type={button?'button':undefined} className={`info ${button?'clickable':''}`} onClick={onClick}><IconGlyph icon={Icon}/><span>{label}</span><strong>{value}</strong>{button && <em>Change</em>}</Tag>}

function ChoiceModal({ type, routeData, selected, onSelect, onClose }) {
  const isFlight = type === 'flight';
  const options = isFlight ? routeData.flightOptions : routeData.hotelOptions;
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="choice-modal" role="dialog" aria-modal="true" aria-label={isFlight ? 'Flight options' : 'Hotel options'} onClick={(event)=>event.stopPropagation()}><div className="modal-head"><div><span>{isFlight ? 'Curated demo flights' : 'Curated demo hotels'}</span><h2>{isFlight ? 'Choose a flight option' : 'Choose a hotel option'}</h2></div><button type="button" aria-label="Close options" onClick={onClose}>×</button></div><div className="choice-list">{options.map((option)=>{ const active = selected && (isFlight ? selected.airline === option.airline : selected.name === option.name); return <button type="button" className={`choice-card ${active ? 'selected' : ''}`} key={isFlight ? option.airline : option.name} onClick={()=>onSelect(option)}><div className="choice-title"><strong>{isFlight ? option.airline : option.name}</strong><span>{isFlight ? option.price : option.rate}</span></div><p>{isFlight ? option.route : option.location}</p><div className="choice-meta">{isFlight ? <><span>{option.departure} → {option.arrival}</span><span>{option.stops}</span><span>{option.duration}</span><em>{option.tag}</em></> : <><span>{option.distance}</span><span>{option.tag}</span><em>{option.rating}</em></>}</div></button>})}</div></section></div>;
}
function ConfirmPage({ plan, routeData, onConfirm, onEdit }) { if (!plan) return null; return <div className="card confirm-card appear"><h1>Approve Travel Plan</h1><p className="notice"><IconGlyph icon="⬡"/>{routeData.confirmDetails.approvalCopy} It will not book anything until you approve the plan below.</p><div className="summary"><div className="summary-hero"><IconGlyph icon={plan.icon}/><div><span>Recommended plan awaiting approval</span><strong>{plan.name}</strong><p>{plan.explanation}</p></div></div><div className="summary-grid"><Info icon={'◫'} label="Mock total" value={plan.cost}/><Info icon={'◴'} label="Arrival" value={plan.arrival}/><Info icon={'⬡'} label="Score" value={`${plan.score} / 100`}/><Info icon={'⬡'} label="Risk" value={plan.risk}/><Info icon={'⌁'} label="Route" value={plan.route}/><Info icon={'▣'} label="Stay" value={plan.hotel}/><Info icon={'◴'} label="Meeting" value={routeData.confirmDetails.meeting}/></div></div><div className="actions"><button className="primary" onClick={onConfirm}>Approve & Book Plan</button><button onClick={onEdit}>Refine Plan</button><button>Why this plan</button></div></div>; }
function MonitorPage({ routeData, onReset }) { return <div className="card monitor-card appear"><div className="alert"><IconGlyph icon="🔔"/>{routeData?.monitoringExample.alert ?? 'Sample disruption alert'}</div><h1>Trip Monitor</h1><p>JustMove is watching the approved plan for flight delays, fare and rebooking price changes, hotel availability or quality issues, ground-transfer risk, and backup route opportunities.</p><div className="watch-grid"><span>Delays: active</span><span>Price changes: active</span><span>Hotel issues: active</span><span>Backup routes: active</span></div><div className="backup disruption"><h2>Recommended backup plan</h2><p>{routeData?.monitoringExample.backup ?? 'Your original flight is projected late and would shrink the meeting buffer. JustMove recommends switching to an earlier nonstop and keeping the same hotel.'}</p><Info icon={'✈'} label="Backup route" value="Earlier SFO → JFK nonstop · arrives 8:42 PM"/><Info icon={'◈'} label="Budget impact" value="+$96 · still under $1,800"/><Info icon={'⬡'} label="Risk reduction" value="Meeting-delay risk drops to Very Low"/></div><div className="actions"><button onClick={onReset}>Keep Current Plan</button><button className="primary" onClick={onReset}>Approve Backup</button></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
