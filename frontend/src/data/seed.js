const day = (offset, hour = 9) => {
  const date = new Date()
  date.setDate(date.getDate() - offset)
  date.setHours(hour, offset * 7 % 60, 0, 0)
  return date.toISOString()
}

export const SEED = {
  profile: {
    id: 'you',
    name: 'Alex Nova',
    handle: 'alex',
    country: 'Canada',
    countryCode: 'CA',
    level: 12,
    stardust: 2450,
    stardustMax: 3000,
    streak: 7,
    badges: ['Supernova', 'Transit Ace', 'Plant Week'],
    weeklyTarget: 28,
  },
  logs: [
    { id: 'l1', name: 'Bike to work', kg: -3.2, category: 'transport', type: 'green', at: day(0, 8) },
    { id: 'l2', name: 'Team standup (virtual)', kg: 0.5, category: 'digital', type: 'virtual', at: day(0, 10) },
    { id: 'l3', name: 'Grocery run — local market', kg: 8.4, category: 'food', type: 'shopping', at: day(0, 17) },
    { id: 'l4', name: 'Grid / apartment energy', kg: 18.1, category: 'energy', type: 'energy', at: day(1, 7) },
    { id: 'l5', name: 'Oat-bowl lunch', kg: 0.4, category: 'food', type: 'green', at: day(1, 12) },
    { id: 'l6', name: 'Metro home', kg: -1.5, category: 'transport', type: 'green', at: day(2, 18) },
    { id: 'l7', name: 'Skip beef dinner', kg: -2.1, category: 'food', type: 'green', at: day(2, 19) },
    { id: 'l8', name: 'Rideshare downtown', kg: 1.8, category: 'transport', type: 'car', at: day(3, 21) },
    { id: 'l9', name: 'Used-book pickup', kg: -0.6, category: 'shopping', type: 'green', at: day(4, 16) },
    { id: 'l10', name: 'Restaurant dinner', kg: 6.4, category: 'food', type: 'food', at: day(5, 19) },
    { id: 'l11', name: 'Parcel delivery', kg: 4.2, category: 'shopping', type: 'shopping', at: day(5, 11) },
    { id: 'l12', name: 'Transit commute', kg: -1.4, category: 'transport', type: 'green', at: day(6, 8) },
    { id: 'l13', name: 'Coffee + pastry', kg: 1.4, category: 'food', type: 'food', at: day(6, 9) },
  ],
  missions: [
    { id: 'm1', text: 'Bike to work', value: '-3.2 kg', kg: -3.2, done: true },
    { id: 'm2', text: 'Skip meat dinner', value: '-2.1 kg', kg: -2.1, done: false },
    { id: 'm3', text: 'Public transit once', value: '-1.5 kg', kg: -1.5, done: false },
  ],
  events: [
    { id: 'e1', name: 'Team Meeting', time: '10:00', kg: 0.5, type: 'virtual' },
    { id: 'e2', name: 'Flight to NYC', time: '14:00', kg: 150, type: 'flight' },
    { id: 'e3', name: 'Grocery shopping', time: '17:00', kg: 2.1, type: 'shopping' },
    { id: 'e4', name: 'Bike to work', time: '08:00', kg: -3.2, type: 'green' },
  ],
  friends: [
    { id: 'f1', name: 'Mara', ecoScore: 92, weeklyKg: 18.4, isFocusing: true, x: 22, y: 28, country: 'Canada' },
    { id: 'f2', name: 'Emily', ecoScore: 78, weeklyKg: 38.0, isFocusing: false, x: 68, y: 24, country: 'USA' },
    { id: 'f3', name: 'Jennifer', ecoScore: 88, weeklyKg: 21.6, isFocusing: true, x: 46, y: 62, country: 'Canada' },
    { id: 'f4', name: 'Sydney', ecoScore: 65, weeklyKg: 41.2, isFocusing: false, x: 78, y: 66, country: 'UK' },
    { id: 'f5', name: 'An', ecoScore: 95, weeklyKg: 14.8, isFocusing: false, x: 32, y: 78, country: 'Vietnam' },
  ],
  racers: [
    { id: 'r1', name: 'An Vu', country: 'Vietnam', weeklyKg: 14.8, ecoScore: 95, circle: false },
    { id: 'r2', name: 'Mara Chen', country: 'Canada', weeklyKg: 18.4, ecoScore: 92, circle: true },
    { id: 'r3', name: 'Jennifer Park', country: 'Canada', weeklyKg: 21.6, ecoScore: 88, circle: true },
    { id: 'you', name: 'Alex Nova', country: 'Canada', weeklyKg: 32.4, ecoScore: 85, circle: true },
    { id: 'r4', name: 'Emily Ross', country: 'USA', weeklyKg: 38.0, ecoScore: 78, circle: true },
    { id: 'r5', name: 'Leo Okonkwo', country: 'Nigeria', weeklyKg: 44.0, ecoScore: 72, circle: false },
    { id: 'r6', name: 'Sydney Hale', country: 'UK', weeklyKg: 41.2, ecoScore: 65, circle: true },
    { id: 'r7', name: 'Priya Shah', country: 'India', weeklyKg: 36.0, ecoScore: 80, circle: false },
  ],
  feed: [
    { id: 'fd1', name: 'An', text: 'logged a bike commute', kg: -3.2, at: day(0, 8) },
    { id: 'fd2', name: 'Alex', text: 'skipped logging a NYC flight for now', kg: 0, at: day(1, 14) },
    { id: 'fd3', name: 'Mara', text: 'swapped beef for lentils', kg: -6.8, at: day(1, 19) },
    { id: 'fd4', name: 'Jennifer', text: 'is competing in the same friend group as Mara', kg: 0, at: day(0, 11) },
    { id: 'fd5', name: 'Emily', text: 'took transit instead of a rideshare', kg: -1.6, at: day(2, 9) },
  ],
  sparkline: [36.8, 35.2, 34.1, 33.8, 33.0, 32.9, 32.4],
}
