// Curated slugs for the most-visited / most-searched districts and places in
// Bangladesh. Used to surface the "main" districts and places first on their
// listing pages, while the rest of the 64 districts / full place catalogue
// remain fully searchable and filterable below.

export const FEATURED_DISTRICT_SLUGS = [
  'dhaka',
  'chattogram',
  'cox-s-bazar',
  'sylhet',
  'rajshahi',
  'khulna',
  'barishal',
  'rangpur',
  'mymensingh',
  'cumilla',
  'bandarban',
  'rangamati',
  'khagrachari',
  'gazipur',
  'narayanganj',
  'bogura',
  'jashore',
  'tangail',
  'moulvibazar',
  'noakhali',
];

export const FEATURED_PLACE_SLUGS = [
  'cox-s-bazar-beach',
  'sundarbans',
  'saint-martin-s-island',
  'sajek-valley',
  'kuakata-beach',
  'kuakata-sunrise-point',
  'lalbagh-fort',
  'ahsan-manzil',
  'sonargaon',
  'sixty-dome-mosque',
  'jaflong',
  'ratargul-swamp-forest',
  'marine-drive-coxsbazar',
];

export const FEATURED_RIVER_SLUGS = [
  'padma',
  'jamuna',
  'meghna',
  'brahmaputra',
  'karnaphuli',
  'teesta',
  'surma',
  'buriganga',
  'madhumati',
  'atrai',
  'naf',
  'sangu',
  'halda',
];

/** Sorts a list so featured items appear first: any item with the admin-set
 * `featured` flag (DB) comes first, then the legacy curated slug list below
 * (for items seeded before the admin flag existed), then everything else in
 * its original order. */
export function withFeaturedFirst<T extends { id: string; featured?: boolean }>(items: T[], featuredSlugs: string[]): T[] {
  const rank = new Map(featuredSlugs.map((slug, i) => [slug, i]));
  return [...items].sort((a, b) => {
    const fa = a.featured ? 0 : 1;
    const fb = b.featured ? 0 : 1;
    if (fa !== fb) return fa - fb;
    const ra = rank.has(a.id) ? rank.get(a.id)! : Infinity;
    const rb = rank.has(b.id) ? rank.get(b.id)! : Infinity;
    if (ra !== rb) return ra - rb;
    return 0; // stable sort keeps original relative order otherwise
  });
}
