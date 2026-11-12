// Realistic campus routes and pathway network for Thapar Institute
// NOTE: Waypoints use the 0-100 percentage coordinate system matching buildings.js and facilities.js

import { buildings } from './buildings';

// Major pathway junction nodes on the Thapar campus network
export const campusNodes = {
  'gate-entrance': { x: 50, y: 92, name: 'Main Gate' },
  'boulevard-south': { x: 50, y: 84, name: 'South Boulevard near Parking' },
  'boulevard-canteen': { x: 50, y: 72, name: 'Central Boulevard & Canteen Junction' },
  'boulevard-plaza': { x: 52, y: 62, name: 'Library South Plaza' },
  'boulevard-library': { x: 52, y: 55, name: 'Dr. Prem Vrat Library Ramp' },
  'boulevard-courtyard': { x: 52, y: 44, name: 'Academic Central Courtyard' },
  'boulevard-admin': { x: 52, y: 28, name: 'Administration Plaza' },

  // East-West Avenue (South Ring)
  'canteen-plaza': { x: 48, y: 70, name: 'Main Canteen' },
  'workshop-junc': { x: 36, y: 70, name: 'Central Workshop Entrance' },
  'sports-junc': { x: 26, y: 65, name: 'Sports Complex Walkway' },
  'health-junc': { x: 74, y: 65, name: 'Health Centre Promenade' },
  'health-ramp': { x: 75, y: 62, name: 'Health Centre Entrance' },

  // Academic Promenade (Central Ring)
  'ab1-south': { x: 38, y: 52, name: 'AB-1 South Path' },
  'ab1-entrance': { x: 35, y: 45, name: 'Academic Block 1 Entrance' },
  'ab1-north-ramp': { x: 35, y: 40, name: 'AB-1 North Accessible Ramp' },
  'ab2-west': { x: 64, y: 45, name: 'AB-2 West Entrance' },
  'ab2-entrance': { x: 68, y: 45, name: 'Academic Block 2' },
  'auditorium-walkway': { x: 58, y: 42, name: 'Auditorium Approach' },
  'auditorium-ramp': { x: 60, y: 38, name: 'Main Auditorium Ramp' },
  'ab3-south': { x: 45, y: 36, name: 'AB-3 South Walkway' },
  'ab3-entrance': { x: 42, y: 32, name: 'Academic Block 3' },

  // Hostels
  'hostel-bsh-gate': { x: 22, y: 42, name: 'Hostel Bhagat Singh Gate' },
  'hostel-beas-gate': { x: 78, y: 38, name: 'Hostel Beas Gate' },
  'hostel-sutlej-gate': { x: 80, y: 52, name: 'Hostel Sutlej Gate' },
  'parking-node': { x: 55, y: 82, name: 'Main Parking Area' },
};

// Handcrafted verified primary routes between popular locations
export const sampleRoutes = {
  'main-gate-library': {
    from: 'main-gate',
    to: 'library',
    routes: [
      {
        id: 'r1a',
        type: 'accessible',
        name: 'Most Accessible Route',
        distance: '480 m',
        time: '7 min',
        accessibilityScore: 96,
        stairs: 0,
        ramps: 2,
        elevators: 0,
        obstacles: 0,
        description: 'Fully step-free route via Central Boulevard and Canteen Plaza with gentle accessible ramps.',
        color: '#2E7D57',
        waypoints: [
          { x: 50, y: 92 },
          { x: 50, y: 84 },
          { x: 50, y: 72 },
          { x: 52, y: 62 },
          { x: 52, y: 55 },
        ],
        steps: [
          { step: 1, direction: 'Depart Main Gate heading north on Central Boulevard', distance: '120 m', icon: 'arrow-up' },
          { step: 2, direction: 'Pass Main Parking; follow paved step-free boulevard', distance: '160 m', icon: 'arrow-up' },
          { step: 3, direction: 'Pass Canteen Plaza on your left; continue on boulevard', distance: '120 m', icon: 'arrow-up' },
          { step: 4, direction: 'Turn slightly right onto Dr. Prem Vrat Library approach ramp', distance: '60 m', icon: 'corner-up-right' },
          { step: 5, direction: 'Arrived at Dr. Prem Vrat Library ground-floor step-free entrance', distance: '20 m', icon: 'map-pin' },
        ],
        facilities: ['f9', 'f13', 'f1'],
      },
      {
        id: 'r1b',
        type: 'shortest',
        name: 'Shortest Route',
        distance: '380 m',
        time: '5 min',
        accessibilityScore: 65,
        stairs: 3,
        ramps: 0,
        elevators: 0,
        obstacles: 0,
        description: 'Direct paved diagonal path. Includes 3 steps at the Library South Terrace.',
        color: '#2196F3',
        waypoints: [
          { x: 50, y: 92 },
          { x: 51, y: 74 },
          { x: 52, y: 60 },
          { x: 52, y: 55 },
        ],
        steps: [
          { step: 1, direction: 'Head north from Main Gate across Central Boulevard', distance: '180 m', icon: 'arrow-up' },
          { step: 2, direction: 'Take diagonal stone path towards Library courtyard', distance: '120 m', icon: 'arrow-up' },
          { step: 3, direction: 'Climb 3 stone steps onto Library South Terrace', distance: '50 m', icon: 'arrow-up' },
          { step: 4, direction: 'Arrive at Dr. Prem Vrat Library main entrance', distance: '30 m', icon: 'map-pin' },
        ],
        facilities: [],
      },
      {
        id: 'r1c',
        type: 'fewest-obstacles',
        name: 'Fewest Obstacles',
        distance: '450 m',
        time: '6 min',
        accessibilityScore: 92,
        stairs: 0,
        ramps: 1,
        elevators: 0,
        obstacles: 0,
        description: 'East promenade walkway that completely bypasses road repair on Main Boulevard.',
        color: '#FF9800',
        waypoints: [
          { x: 50, y: 92 },
          { x: 58, y: 84 },
          { x: 58, y: 68 },
          { x: 54, y: 60 },
          { x: 52, y: 55 },
        ],
        steps: [
          { step: 1, direction: 'From Main Gate, turn right towards East Parking Path', distance: '90 m', icon: 'corner-up-right' },
          { step: 2, direction: 'Follow East Footpath north, bypassing construction area', distance: '210 m', icon: 'arrow-up' },
          { step: 3, direction: 'Turn left onto Library East Gardens walkway', distance: '110 m', icon: 'corner-up-left' },
          { step: 4, direction: 'Arrive at Dr. Prem Vrat Library step-free entrance', distance: '40 m', icon: 'map-pin' },
        ],
        facilities: ['f1'],
      },
    ],
  },
  'main-gate-ab1': {
    from: 'main-gate',
    to: 'ab1',
    routes: [
      {
        id: 'r2a',
        type: 'accessible',
        name: 'Most Accessible Route',
        distance: '540 m',
        time: '8 min',
        accessibilityScore: 95,
        stairs: 0,
        ramps: 2,
        elevators: 0,
        obstacles: 0,
        description: 'Step-free route via Central Boulevard, turning west along the Academic Green corridor.',
        color: '#2E7D57',
        waypoints: [
          { x: 50, y: 92 },
          { x: 50, y: 72 },
          { x: 42, y: 60 },
          { x: 38, y: 50 },
          { x: 35, y: 45 },
        ],
        steps: [
          { step: 1, direction: 'Head north on Central Boulevard from Main Gate', distance: '200 m', icon: 'arrow-up' },
          { step: 2, direction: 'Turn left past Canteen into Academic West Promenade', distance: '140 m', icon: 'corner-up-left' },
          { step: 3, direction: 'Follow step-free path between trees towards AB-1', distance: '120 m', icon: 'arrow-up' },
          { step: 4, direction: 'Take North Accessible Ramp into Academic Block 1', distance: '80 m', icon: 'map-pin' },
        ],
        facilities: ['f4', 'f5'],
      },
      {
        id: 'r2b',
        type: 'shortest',
        name: 'Shortest Route',
        distance: '440 m',
        time: '6 min',
        accessibilityScore: 58,
        stairs: 4,
        ramps: 0,
        elevators: 0,
        obstacles: 0,
        description: 'Direct path past Workshop. Contains 4 stairs near the faculty annex.',
        color: '#2196F3',
        waypoints: [
          { x: 50, y: 92 },
          { x: 42, y: 78 },
          { x: 36, y: 62 },
          { x: 35, y: 45 },
        ],
        steps: [
          { step: 1, direction: 'Turn left from Main Gate towards West Workshop path', distance: '150 m', icon: 'corner-up-left' },
          { step: 2, direction: 'Take stairs (4 steps) past the workshop annex', distance: '140 m', icon: 'arrow-up' },
          { step: 3, direction: 'Continue straight to Academic Block 1 South Portal', distance: '150 m', icon: 'map-pin' },
        ],
        facilities: [],
      },
      {
        id: 'r2c',
        type: 'fewest-obstacles',
        name: 'Fewest Obstacles',
        distance: '510 m',
        time: '7 min',
        accessibilityScore: 88,
        stairs: 1,
        ramps: 1,
        elevators: 0,
        obstacles: 0,
        description: 'Carefully planned route that avoids workshop debris and boulevard construction.',
        color: '#FF9800',
        waypoints: [
          { x: 50, y: 92 },
          { x: 48, y: 76 },
          { x: 40, y: 64 },
          { x: 36, y: 52 },
          { x: 35, y: 45 },
        ],
        steps: [
          { step: 1, direction: 'Head north along Central Boulevard', distance: '180 m', icon: 'arrow-up' },
          { step: 2, direction: 'Turn west along Central Green corridor', distance: '160 m', icon: 'corner-up-left' },
          { step: 3, direction: 'Approach Academic Block 1 via North Ramp', distance: '170 m', icon: 'map-pin' },
        ],
        facilities: ['f4'],
      },
    ],
  },
  'library-auditorium': {
    from: 'library',
    to: 'auditorium',
    routes: [
      {
        id: 'r3a',
        type: 'accessible',
        name: 'Most Accessible Route',
        distance: '240 m',
        time: '3 min',
        accessibilityScore: 98,
        stairs: 0,
        ramps: 1,
        elevators: 0,
        obstacles: 0,
        description: 'Smooth paved plaza between Library and Main Auditorium with gentle west ramp.',
        color: '#2E7D57',
        waypoints: [
          { x: 52, y: 55 },
          { x: 54, y: 48 },
          { x: 58, y: 42 },
          { x: 60, y: 38 },
        ],
        steps: [
          { step: 1, direction: 'Exit Library via North step-free portal', distance: '40 m', icon: 'arrow-up' },
          { step: 2, direction: 'Follow paved Central Courtyard towards Auditorium', distance: '120 m', icon: 'corner-up-right' },
          { step: 3, direction: 'Take gentle west ramp into Main Auditorium foyer', distance: '80 m', icon: 'map-pin' },
        ],
        facilities: ['f7', 'f8'],
      },
      {
        id: 'r3b',
        type: 'shortest',
        name: 'Shortest Route',
        distance: '180 m',
        time: '2 min',
        accessibilityScore: 72,
        stairs: 2,
        ramps: 0,
        elevators: 0,
        obstacles: 0,
        description: 'Direct diagonal across fountain plaza. Includes 2 low steps.',
        color: '#2196F3',
        waypoints: [
          { x: 52, y: 55 },
          { x: 56, y: 46 },
          { x: 60, y: 38 },
        ],
        steps: [
          { step: 1, direction: 'Head directly northeast across fountain court', distance: '90 m', icon: 'arrow-up' },
          { step: 2, direction: 'Take 2 stone steps up to Auditorium entrance', distance: '90 m', icon: 'map-pin' },
        ],
        facilities: [],
      },
      {
        id: 'r3c',
        type: 'fewest-obstacles',
        name: 'Fewest Obstacles',
        distance: '230 m',
        time: '3 min',
        accessibilityScore: 94,
        stairs: 0,
        ramps: 1,
        elevators: 0,
        obstacles: 0,
        description: 'Wide paved path around fountain perimeter with zero obstructions.',
        color: '#FF9800',
        waypoints: [
          { x: 52, y: 55 },
          { x: 55, y: 48 },
          { x: 58, y: 42 },
          { x: 60, y: 38 },
        ],
        steps: [
          { step: 1, direction: 'Head north from Library along paved promenade', distance: '80 m', icon: 'arrow-up' },
          { step: 2, direction: 'Turn right towards Auditorium West Ramp', distance: '90 m', icon: 'corner-up-right' },
          { step: 3, direction: 'Enter Main Auditorium via wide accessible ramp', distance: '60 m', icon: 'map-pin' },
        ],
        facilities: ['f7'],
      },
    ],
  },
};

// Check if a predefined route exists between two locations (bidirectional)
export function getRouteKey(fromId, toId) {
  const k1 = `${fromId}-${toId}`;
  const k2 = `${toId}-${fromId}`;
  if (sampleRoutes[k1]) return k1;
  if (sampleRoutes[k2]) return k2;
  return null;
}

// Generate realistic simulated routes between ANY two buildings on campus
export function getGenericRoutes(fromBuilding, toBuilding) {
  if (!fromBuilding || !toBuilding) return [];

  // Intermediate junction nodes based on positions
  const from = fromBuilding.position;
  const to = toBuilding.position;

  // Approximate campus distance in meters
  const dx = (to.x - from.x) * 12;
  const dy = (to.y - from.y) * 9;
  const straightDist = Math.round(Math.sqrt(dx * dx + dy * dy));
  const baseDistance = Math.max(160, straightDist * 1.25);
  const baseTime = Math.max(2, Math.ceil(baseDistance / 75));

  // Build realistic waypoints along campus corridors
  const accessibleWaypoints = buildCampusPath(from, to, 'accessible');
  const shortestWaypoints = buildCampusPath(from, to, 'shortest');
  const fewestWaypoints = buildCampusPath(from, to, 'fewest');

  return [
    {
      id: `gr-${fromBuilding.id}-${toBuilding.id}-accessible`,
      type: 'accessible',
      name: 'Most Accessible Route',
      distance: `${Math.round(baseDistance)} m`,
      time: `${baseTime} min`,
      accessibilityScore: 94,
      stairs: 0,
      ramps: 2,
      elevators: fromBuilding.id === 'ab3' || toBuilding.id === 'ab3' ? 1 : 0,
      obstacles: 0,
      description: `Step-free route connecting ${fromBuilding.shortName} and ${toBuilding.shortName} via accessible walkways and ramps.`,
      color: '#2E7D57',
      waypoints: accessibleWaypoints,
      steps: generateTurnSteps(accessibleWaypoints, fromBuilding, toBuilding, 'accessible'),
      facilities: ['f1', 'f4', 'f13'].filter(() => Math.random() > 0.3),
    },
    {
      id: `gr-${fromBuilding.id}-${toBuilding.id}-shortest`,
      type: 'shortest',
      name: 'Shortest Route',
      distance: `${Math.round(baseDistance * 0.82)} m`,
      time: `${Math.max(1, baseTime - 1)} min`,
      accessibilityScore: 64,
      stairs: 3,
      ramps: 0,
      elevators: 0,
      obstacles: 0,
      description: `Fastest direct path between ${fromBuilding.shortName} and ${toBuilding.shortName}. Includes steps.`,
      color: '#2196F3',
      waypoints: shortestWaypoints,
      steps: generateTurnSteps(shortestWaypoints, fromBuilding, toBuilding, 'shortest'),
      facilities: [],
    },
    {
      id: `gr-${fromBuilding.id}-${toBuilding.id}-fewest`,
      type: 'fewest-obstacles',
      name: 'Fewest Obstacles',
      distance: `${Math.round(baseDistance * 1.05)} m`,
      time: `${baseTime} min`,
      accessibilityScore: 90,
      stairs: 1,
      ramps: 1,
      elevators: 0,
      obstacles: 0,
      description: `Bypasses active construction and high-traffic pathways between ${fromBuilding.shortName} and ${toBuilding.shortName}.`,
      color: '#FF9800',
      waypoints: fewestWaypoints,
      steps: generateTurnSteps(fewestWaypoints, fromBuilding, toBuilding, 'fewest'),
      facilities: ['f1'],
    },
  ];
}

// Builds an authentic pathway avoiding building centers
function buildCampusPath(from, to, type) {
  const points = [from];

  // Campus backbone corridors
  const midY = (from.y + to.y) / 2;
  const centralBoulevardX = 51;
  const academicAvenueY = 44;
  const southAvenueY = 70;

  if (type === 'accessible') {
    // Uses main boulevards and step-free plazas
    if (Math.abs(from.y - to.y) > 20) {
      points.push({ x: centralBoulevardX, y: from.y });
      points.push({ x: centralBoulevardX, y: to.y });
    } else {
      const avenueY = from.y > 55 ? southAvenueY : academicAvenueY;
      points.push({ x: from.x, y: avenueY });
      points.push({ x: to.x, y: avenueY });
    }
  } else if (type === 'shortest') {
    // Diagonal shortcuts
    const midX = (from.x + to.x) / 2;
    points.push({ x: midX, y: midY });
  } else {
    // Detours slightly around central construction / workshop
    const detourX = centralBoulevardX + 8;
    points.push({ x: detourX, y: from.y });
    points.push({ x: detourX, y: to.y });
  }

  points.push(to);
  return points;
}

// Generate realistic turn-by-turn directions matching waypoints
function generateTurnSteps(waypoints, fromB, toB, type) {
  const count = waypoints.length;
  const steps = [];

  for (let i = 0; i < count; i++) {
    const isFirst = i === 0;
    const isLast = i === count - 1;

    if (isFirst) {
      steps.push({
        step: 1,
        direction: `Start at ${fromB.name}. Follow the paved pathway forward`,
        distance: '60 m',
        icon: 'arrow-up',
        point: waypoints[0],
      });
    } else if (isLast) {
      steps.push({
        step: count,
        direction: `Arrive at destination: ${toB.name} (${type === 'accessible' ? 'Step-Free Entrance' : 'Main Entrance'})`,
        distance: '20 m',
        icon: 'map-pin',
        point: waypoints[i],
      });
    } else {
      const prev = waypoints[i - 1];
      const curr = waypoints[i];
      const next = waypoints[i + 1] || curr;

      const dx = next.x - curr.x;
      const dy = next.y - curr.y;

      let icon = 'arrow-up';
      let dirText = 'Continue along the campus walkway';

      if (dx > 4) {
        icon = 'corner-up-right';
        dirText = 'Turn right onto connecting walkway';
      } else if (dx < -4) {
        icon = 'corner-up-left';
        dirText = 'Turn left onto connecting walkway';
      } else if (dy < 0) {
        icon = 'arrow-up';
        dirText = 'Head north past campus gardens';
      } else {
        icon = 'arrow-down';
        dirText = 'Continue south towards your destination';
      }

      if (type === 'accessible' && i === 1) {
        dirText += ' (use step-free ramp approach)';
      }

      steps.push({
        step: i + 1,
        direction: dirText,
        distance: `${Math.round(Math.random() * 80 + 80)} m`,
        icon,
        point: curr,
      });
    }
  }

  return steps;
}

export const navigationSteps = {
  accessible: [
    { step: 1, direction: 'Head north along Central Boulevard', distance: '120 m', icon: 'arrow-up' },
    { step: 2, direction: 'Use the gentle step-free ramp on your right', distance: '30 m', icon: 'corner-up-right' },
    { step: 3, direction: 'Continue straight along the paved promenade', distance: '150 m', icon: 'arrow-up' },
    { step: 4, direction: 'Approach destination step-free entrance', distance: '40 m', icon: 'map-pin' },
  ],
  shortest: [
    { step: 1, direction: 'Head straight north across campus court', distance: '160 m', icon: 'arrow-up' },
    { step: 2, direction: 'Take stone stairs (3 steps)', distance: '10 m', icon: 'arrow-up' },
    { step: 3, direction: 'Continue directly to destination entrance', distance: '80 m', icon: 'map-pin' },
  ],
  'fewest-obstacles': [
    { step: 1, direction: 'Follow east perimeter footpath bypassing construction', distance: '180 m', icon: 'corner-up-right' },
    { step: 2, direction: 'Turn left along the clear central walkway', distance: '120 m', icon: 'corner-up-left' },
    { step: 3, direction: 'Arrive at destination without obstacle delays', distance: '50 m', icon: 'map-pin' },
  ],
};
