/**
 * East African region options used across the app (signup, profile, onboarding).
 *
 * The storage field is a free-text string, so this list is only used to
 * *suggest* consistent values via <datalist> autocomplete. Farmers can still
 * type any location that isn't listed — the goal is to accommodate every
 * farmer across the wider East African region, not to restrict them.
 */
export const EAST_AFRICA_REGIONS: string[] = [
  // East African Community (EAC) partner states
  'Burundi',
  'Kenya',
  'Rwanda',
  'South Sudan',
  'Tanzania',
  'Uganda',
  'Democratic Republic of the Congo',
  // Wider East Africa & Horn of Africa
  'Ethiopia',
  'Somalia',
  'Eritrea',
  'Djibouti',
  'Sudan',
  'Comoros',
  'Mauritius',
  'Seychelles',
  // Major Kenyan regions (for farmers who want sub-national specificity)
  'Western Kenya',
  'Rift Valley',
  'Central Kenya',
  'Eastern Kenya',
  'Coast (Kenya)',
  'Nyanza',
  'Nairobi',
  // Major cities / regions across the wider region
  'Kampala, Uganda',
  'Kigali, Rwanda',
  'Dodoma, Tanzania',
  'Dar es Salaam, Tanzania',
  'Bujumbura, Burundi',
  'Juba, South Sudan',
  'Addis Ababa, Ethiopia',
  'Mogadishu, Somalia',
  'Kinshasa, DRC',
  'Goma, DRC',
  // ── Major Kenyan agricultural regions / counties ──────────────────────
  // Breadbasket & highland zones
  'Uasin Gishu',
  'Trans-Nzoia',
  'Nakuru',
  'Nandi',
  'Kericho',
  'Bomet',
  'Laikipia',
  'Nyandarua',
  'Nyeri',
  'Kirinyaga',
  'Murang’a',
  'Kiambu',
  'Meru',
  'Embu',
  'Tharaka Nithi',
  'Nyandarua',
  // Eastern / semi-arid agricultural zones
  'Machakos',
  'Makueni',
  'Kitui',
  // Western Kenya (sugar, maize, dairy)
  'Kakamega',
  'Bungoma',
  'Busia',
  'Vihiga',
  // Nyanza (lake basin)
  'Kisumu',
  'Siaya',
  'Homa Bay',
  'Migori',
  'Kisii',
  'Nyamira',
  // Coastal agriculture
  'Kilifi',
  'Kwale',
  'Taita Taveta',
];

/**
 * Major East African locations used as one-tap quick-picks on onboarding.
 * Coordinates are real capital / principal-city positions (used only to centre
 * the map) — not invented farm-level climate or soil data.
 */
export const EAST_AFRICA_COUNTRY_CENTERS: { name: string; lat: number; lng: number }[] = [
  { name: 'Kenya', lat: -1.2921, lng: 36.8219 },
  { name: 'Uganda', lat: 0.3476, lng: 32.5825 },
  { name: 'Tanzania', lat: -6.163, lng: 35.7516 },
  { name: 'Rwanda', lat: -1.9706, lng: 30.1044 },
  { name: 'Burundi', lat: -3.3614, lng: 29.3599 },
  { name: 'South Sudan', lat: 4.85, lng: 31.6 },
  { name: 'DR Congo', lat: -4.4419, lng: 15.2663 },
  { name: 'Ethiopia', lat: 9.025, lng: 38.7469 },
  { name: 'Somalia', lat: 2.0469, lng: 45.3182 },
  { name: 'Eritrea', lat: 15.1794, lng: 38.812 },
  { name: 'Djibouti', lat: 11.5721, lng: 43.1456 },
  { name: 'Sudan', lat: 15.5007, lng: 32.5599 },
];

/**
 * The major agricultural regions of Kenya, shown as quick-picks on onboarding.
 * Coordinates are real representative city positions (used only to centre the
 * map) — not invented farm-level climate or soil data.
 */
export const MAJOR_KENYA_REGIONS: { name: string; lat: number; lng: number }[] = [
  { name: 'Rift Valley', lat: 0.5143, lng: 35.2698 },
  { name: 'Western Kenya', lat: 0.2827, lng: 34.7519 },
  { name: 'Nyanza', lat: -0.1021, lng: 34.7617 },
  { name: 'Central Kenya', lat: -0.7167, lng: 37.0833 },
  { name: 'Eastern Kenya', lat: 0.0476, lng: 37.6583 },
  { name: 'Coast', lat: -4.0435, lng: 39.6682 },
  { name: 'Nairobi', lat: -1.2864, lng: 36.8172 },
  { name: 'North Eastern Kenya', lat: -0.4536, lng: 39.6461 },
];
