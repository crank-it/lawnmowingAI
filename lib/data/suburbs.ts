export interface Suburb {
  name: string;
  postcode: string;
  zone: "central" | "north" | "south" | "hill";
  travelMultiplier: number; // affects pricing slightly
}

export const suburbs: Suburb[] = [
  // Central Dunedin
  { name: "Dunedin Central", postcode: "9016", zone: "central", travelMultiplier: 1.0 },
  { name: "South Dunedin", postcode: "9012", zone: "central", travelMultiplier: 1.0 },
  { name: "St Kilda", postcode: "9012", zone: "central", travelMultiplier: 1.0 },
  { name: "St Clair", postcode: "9012", zone: "central", travelMultiplier: 1.0 },
  { name: "Caversham", postcode: "9012", zone: "central", travelMultiplier: 1.0 },
  { name: "Forbury", postcode: "9012", zone: "central", travelMultiplier: 1.0 },

  // North Dunedin
  { name: "North Dunedin", postcode: "9016", zone: "north", travelMultiplier: 1.0 },
  { name: "Opoho", postcode: "9010", zone: "north", travelMultiplier: 1.05 },
  { name: "Dalmore", postcode: "9010", zone: "north", travelMultiplier: 1.05 },
  { name: "Normanby", postcode: "9010", zone: "north", travelMultiplier: 1.0 },
  { name: "Pine Hill", postcode: "9010", zone: "north", travelMultiplier: 1.1 },
  { name: "Ravensbourne", postcode: "9022", zone: "north", travelMultiplier: 1.15 },
  { name: "Roseneath", postcode: "9010", zone: "north", travelMultiplier: 1.05 },
  { name: "Sawyers Bay", postcode: "9023", zone: "north", travelMultiplier: 1.2 },
  { name: "Port Chalmers", postcode: "9023", zone: "north", travelMultiplier: 1.25 },

  // South of city
  { name: "Corstorphine", postcode: "9013", zone: "south", travelMultiplier: 1.05 },
  { name: "Kenmure", postcode: "9011", zone: "south", travelMultiplier: 1.0 },
  { name: "Mornington", postcode: "9011", zone: "south", travelMultiplier: 1.0 },
  { name: "Kew", postcode: "9011", zone: "south", travelMultiplier: 1.0 },
  { name: "Musselburgh", postcode: "9013", zone: "south", travelMultiplier: 1.0 },
  { name: "Andersons Bay", postcode: "9013", zone: "south", travelMultiplier: 1.0 },
  { name: "Waverley", postcode: "9013", zone: "south", travelMultiplier: 1.0 },
  { name: "Shiel Hill", postcode: "9013", zone: "south", travelMultiplier: 1.05 },
  { name: "Green Island", postcode: "9018", zone: "south", travelMultiplier: 1.1 },
  { name: "Abbotsford", postcode: "9018", zone: "south", travelMultiplier: 1.1 },
  { name: "Concord", postcode: "9018", zone: "south", travelMultiplier: 1.1 },
  { name: "Fairfield", postcode: "9018", zone: "south", travelMultiplier: 1.1 },
  { name: "Mosgiel", postcode: "9024", zone: "south", travelMultiplier: 1.2 },

  // Hill suburbs
  { name: "Maori Hill", postcode: "9010", zone: "hill", travelMultiplier: 1.1 },
  { name: "Roslyn", postcode: "9010", zone: "hill", travelMultiplier: 1.05 },
  { name: "Belleknowes", postcode: "9010", zone: "hill", travelMultiplier: 1.1 },
  { name: "Wakari", postcode: "9010", zone: "hill", travelMultiplier: 1.1 },
  { name: "Halfway Bush", postcode: "9010", zone: "hill", travelMultiplier: 1.15 },
  { name: "Helensburgh", postcode: "9010", zone: "hill", travelMultiplier: 1.1 },
  { name: "Brockville", postcode: "9010", zone: "hill", travelMultiplier: 1.15 },
];

export const getSuburbByName = (name: string): Suburb | undefined => {
  return suburbs.find((s) => s.name.toLowerCase() === name.toLowerCase());
};

export const getSuburbsByZone = (zone: Suburb["zone"]): Suburb[] => {
  return suburbs.filter((s) => s.zone === zone);
};

export const popularSuburbs = [
  "St Clair",
  "South Dunedin",
  "Mornington",
  "Andersons Bay",
  "Roslyn",
  "Green Island",
  "Mosgiel",
];
