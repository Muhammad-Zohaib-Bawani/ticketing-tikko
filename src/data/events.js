// Mock event catalog. Images use SVG data-URIs to keep the prototype offline-friendly.

const grad = (a, b, label) => `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${a}'/>
        <stop offset='1' stop-color='${b}'/>
      </linearGradient>
      <pattern id='dots' width='20' height='20' patternUnits='userSpaceOnUse'>
        <circle cx='2' cy='2' r='1.4' fill='rgba(255,255,255,0.18)'/>
      </pattern>
    </defs>
    <rect width='800' height='500' fill='url(#g)'/>
    <rect width='800' height='500' fill='url(#dots)'/>
    <text x='40' y='460' font-family='Inter,Arial' font-size='34' font-weight='800' fill='rgba(255,255,255,0.92)'>${label}</text>
  </svg>`
)}`;

// Build a 4-image gallery from a base palette and label.
const gallery = (a, b, label) => [
  grad(a, b, `${label} · 01`),
  grad('#0f172a', a, `${label} · 02`),
  grad(b, '#7c3aed', `${label} · 03`),
  grad('#1e1b4b', b, `${label} · 04`),
];

// --- Real photos via Picsum (always returns a real photo for any seed string) ---
// Reliable, no API key required, deterministic per seed.
const picsum = (seed, w = 1600, h = 1000) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const PHOTO_SETS = {
  'riyadh-season':   ['riyadh-stage-a',  'riyadh-stage-b',  'riyadh-stage-c',  'riyadh-stage-d'],
  spl:               ['spl-stadium-a',   'spl-stadium-b',   'spl-stadium-c',   'spl-stadium-d'],
  brunch:            ['brunch-dxb-a',    'brunch-dxb-b',    'brunch-dxb-c',    'brunch-dxb-d'],
  comedy:            ['comedy-night-a',  'comedy-night-b',  'comedy-night-c',  'comedy-night-d'],
  alula:             ['alula-skies-a',   'alula-skies-b',   'alula-skies-c',   'alula-skies-d'],
  family:            ['family-show-a',   'family-show-b',   'family-show-c',   'family-show-d'],
  nightlife:         ['soho-night-a',    'soho-night-b',    'soho-night-c',    'soho-night-d'],
  soundstorm:        ['soundstorm-a',    'soundstorm-b',    'soundstorm-c',    'soundstorm-d'],
  janadriyah:        ['janadriyah-a',    'janadriyah-b',    'janadriyah-c',    'janadriyah-d'],
  'tech-forum':      ['tech-forum-a',    'tech-forum-b',    'tech-forum-c',    'tech-forum-d'],
  'founders-summit': ['founders-a',      'founders-b',      'founders-c',      'founders-d'],
  wellness:          ['wellness-a',      'wellness-b',      'wellness-c',      'wellness-d'],
};

const pset = (slug) => {
  const seeds = PHOTO_SETS[slug] || PHOTO_SETS['riyadh-season'];
  return seeds.map((s) => picsum(s));
};

export const CATEGORIES = [
  { id: 'concerts', en: 'Concerts', ar: 'حفلات', icon: '🎤' },
  { id: 'sports', en: 'Sports', ar: 'رياضة', icon: '⚽' },
  { id: 'theater', en: 'Theater', ar: 'مسرح', icon: '🎭' },
  { id: 'family', en: 'Family', ar: 'عائلي', icon: '🎡' },
  { id: 'comedy', en: 'Comedy', ar: 'كوميديا', icon: '🎙️' },
  { id: 'festivals', en: 'Festivals', ar: 'مهرجانات', icon: '🎉' },
  { id: 'nightlife', en: 'Nightlife', ar: 'الحياة الليلية', icon: '🪩' },
  { id: 'brunches', en: 'Brunches', ar: 'برانش', icon: '🥂' },
  { id: 'kids', en: 'Kids', ar: 'أطفال', icon: '🧸' },
  { id: 'attractions', en: 'Attractions', ar: 'معالم', icon: '🎢' },
  { id: 'experiences', en: 'Experiences', ar: 'تجارب', icon: '✨' },
  { id: 'dining', en: 'Dining', ar: 'مطاعم', icon: '🍽️' },
];

export const EVENTS = [
  {
    id: 'evt-1',
    title: { en: 'Riyadh Season Mainstage: Global Live', ar: 'موسم الرياض: ليلة عالمية مباشرة' },
    subtitle: { en: 'A showcase of headlining international artists', ar: 'حفل لكبار النجوم العالميين' },
    category: 'concerts',
    venue: { en: 'Boulevard City Arena', ar: 'بوليفارد سيتي أرينا' },
    city: 'Riyadh',
    date: '2026-06-12T20:30:00',
    image: pset('riyadh-season')[0],
    images: pset('riyadh-season'),
    priceFrom: 250,
    rating: 4.8,
    viewing: 1380,
    capacity: 28000,
    sold: 19420,
    salesOpenAt: '2026-05-28T10:00:00',
    flags: { verifiedFan: true, queue: true, rotating: true, accessible: true, ageRestricted: '12+' },
    tags: { en: ['Concert', 'International', 'Reserved seating'], ar: ['حفل', 'عالمي', 'مقاعد مخصصة'] },
    description: {
      en: 'A landmark night under the Riyadh sky featuring three headline international acts and a rotating cast of regional openers. Reserved seating across all tiers, premium VIP experience and accessible-seating provisions.',
      ar: 'ليلة استثنائية في أجواء الرياض مع ثلاثة نجوم عالميين ومجموعة من الفنانين الإقليميين. مقاعد محجوزة بجميع الفئات وتجربة VIP وخيارات للوصول الميسر.',
    },
    seating: 'reserved',
    tiers: [
      { id: 'vip', name: { en: 'VIP Hospitality', ar: 'ضيافة VIP' }, price: 1850, color: '#f59e0b' },
      { id: 'p1', name: { en: 'Premium Lower', ar: 'بريميوم سفلي' }, price: 950, color: '#a855f7' },
      { id: 'p2', name: { en: 'Lower Bowl', ar: 'الصف السفلي' }, price: 550, color: '#7c3aed' },
      { id: 'p3', name: { en: 'Upper Bowl', ar: 'الصف العلوي' }, price: 250, color: '#3b82f6' },
    ],
    layout: {
      width: 800, height: 520,
      stage: { x: 280, y: 30, w: 240, h: 50, label: { en: 'STAGE', ar: 'المسرح' } },
      blocks: [
        { id: 'b-vip', tierId: 'vip', name: { en: 'VIP Pit', ar: 'VIP أمامي' }, shape: { x: 280, y: 100, w: 240, h: 60 }, rows: ['A','B','C'], perRow: 16 },
        { id: 'b-p1l', tierId: 'p1', name: { en: 'Premium L', ar: 'بريميوم يسار' }, shape: { x: 100, y: 100, w: 160, h: 80 }, rows: ['A','B','C','D'], perRow: 10 },
        { id: 'b-p1r', tierId: 'p1', name: { en: 'Premium R', ar: 'بريميوم يمين' }, shape: { x: 540, y: 100, w: 160, h: 80 }, rows: ['A','B','C','D'], perRow: 10 },
        { id: 'b-p2l', tierId: 'p2', name: { en: 'Lower Bowl L', ar: 'الصف السفلي يسار' }, shape: { x: 60, y: 200, w: 220, h: 100 }, rows: ['E','F','G','H','I'], perRow: 14 },
        { id: 'b-p2c', tierId: 'p2', name: { en: 'Lower Bowl C', ar: 'الصف السفلي وسط' }, shape: { x: 290, y: 200, w: 220, h: 100 }, rows: ['E','F','G','H','I'], perRow: 14 },
        { id: 'b-p2r', tierId: 'p2', name: { en: 'Lower Bowl R', ar: 'الصف السفلي يمين' }, shape: { x: 520, y: 200, w: 220, h: 100 }, rows: ['E','F','G','H','I'], perRow: 14 },
        { id: 'b-p3', tierId: 'p3', name: { en: 'Upper Bowl', ar: 'الصف العلوي' }, shape: { x: 80, y: 320, w: 640, h: 90 }, rows: ['J','K','L','M','N','O'], perRow: 24 },
      ],
    },
    addons: [
      { id: 'h-stay', kind: 'hotel', label: { en: 'Two Seasons Hotel — 1 night', ar: 'فندق توو سيزونز — ليلة واحدة' }, price: 720 },
      { id: 'd-reso', kind: 'dining', label: { en: 'Pre-show tasting menu', ar: 'قائمة تذوق قبل العرض' }, price: 285 },
      { id: 't-park', kind: 'parking', label: { en: 'Premium parking', ar: 'موقف مميز' }, price: 60 },
    ],
  },
  {
    id: 'evt-2',
    title: { en: 'Al Hilal vs. Al Ittihad — Saudi Pro League', ar: 'الهلال × الاتحاد — دوري روشن' },
    subtitle: { en: 'Round 22 Clásico fixture', ar: 'كلاسيكو الجولة 22' },
    category: 'sports',
    venue: { en: 'Kingdom Arena', ar: 'كينغدوم أرينا' },
    city: 'Riyadh',
    date: '2026-05-23T21:00:00',
    image: pset('spl')[0],
    images: pset('spl'),
    priceFrom: 90,
    rating: 4.7,
    viewing: 2210,
    capacity: 22500,
    sold: 18130,
    flags: { queue: true, accessible: true },
    tags: { en: ['Football', 'Reserved', 'Family-friendly'], ar: ['كرة قدم', 'مقاعد مخصصة', 'عائلي'] },
    description: {
      en: 'Premier fixture in the Saudi Pro League season. Reserved seating with family stands, accessibility provisions and concession redemption via the Tikko app.',
      ar: 'مباراة قمة في موسم دوري روشن. مقاعد محجوزة مع مدرجات عائلية وخيارات الوصول واستلام الأطعمة عبر التطبيق.',
    },
    seating: 'reserved',
    tiers: [
      { id: 'vvip', name: { en: 'Royal Box', ar: 'المقصورة الملكية' }, price: 2400, color: '#f59e0b' },
      { id: 'cat1', name: { en: 'Cat 1', ar: 'الفئة 1' }, price: 480, color: '#a855f7' },
      { id: 'cat2', name: { en: 'Cat 2', ar: 'الفئة 2' }, price: 240, color: '#7c3aed' },
      { id: 'cat3', name: { en: 'Family stand', ar: 'مدرج العائلة' }, price: 90, color: '#10b981' },
    ],
    layout: {
      width: 800, height: 520,
      stage: { x: 280, y: 200, w: 240, h: 110, label: { en: 'PITCH', ar: 'الملعب' } },
      blocks: [
        { id: 'b-royal', tierId: 'vvip', name: { en: 'Royal Box', ar: 'المقصورة الملكية' }, shape: { x: 320, y: 70, w: 160, h: 50 }, rows: ['A','B','C'], perRow: 12 },
        { id: 'b-c1n', tierId: 'cat1', name: { en: 'Cat 1 North', ar: 'الفئة 1 شمال' }, shape: { x: 100, y: 70, w: 200, h: 90 }, rows: ['A','B','C','D'], perRow: 14 },
        { id: 'b-c1s', tierId: 'cat1', name: { en: 'Cat 1 South', ar: 'الفئة 1 جنوب' }, shape: { x: 500, y: 70, w: 200, h: 90 }, rows: ['A','B','C','D'], perRow: 14 },
        { id: 'b-c2w', tierId: 'cat2', name: { en: 'Cat 2 West', ar: 'الفئة 2 غرب' }, shape: { x: 50, y: 200, w: 200, h: 110 }, rows: ['E','F','G','H','I'], perRow: 14 },
        { id: 'b-c2e', tierId: 'cat2', name: { en: 'Cat 2 East', ar: 'الفئة 2 شرق' }, shape: { x: 550, y: 200, w: 200, h: 110 }, rows: ['E','F','G','H','I'], perRow: 14 },
        { id: 'b-fam-w', tierId: 'cat3', name: { en: 'Family West', ar: 'العائلة غرب' }, shape: { x: 100, y: 350, w: 280, h: 80 }, rows: ['J','K','L','M'], perRow: 18 },
        { id: 'b-fam-e', tierId: 'cat3', name: { en: 'Family East', ar: 'العائلة شرق' }, shape: { x: 420, y: 350, w: 280, h: 80 }, rows: ['J','K','L','M'], perRow: 18 },
      ],
    },
    addons: [
      { id: 'p-park', kind: 'parking', label: { en: 'On-site parking', ar: 'موقف داخل الملعب' }, price: 50 },
    ],
  },
  {
    id: 'evt-3',
    title: { en: 'White Marquee Brunch at Address', ar: 'وايت مركيه برانش — العنوان' },
    subtitle: { en: 'Beats, bites and bottomless bubbly', ar: 'موسيقى وأطباق وفقاعات بلا حدود' },
    category: 'brunches',
    venue: { en: 'Address Beach Resort', ar: 'العنوان بيتش ريزورت' },
    city: 'Dubai',
    date: '2026-05-10T13:00:00',
    image: pset('brunch')[0],
    images: pset('brunch'),
    priceFrom: 395,
    rating: 4.6,
    viewing: 412,
    capacity: 480,
    sold: 305,
    flags: { ageRestricted: '21+' },
    tags: { en: ['Brunch', 'Beachfront', '21+'], ar: ['برانش', 'على الشاطئ', '+21'] },
    description: {
      en: 'A Saturday brunch institution. Five-hour beachfront session with live DJ, hosted bar packages and reserved sun-loungers.',
      ar: 'برانش السبت الشهير. خمس ساعات على الشاطئ مع DJ مباشر وباقات مشروبات وكراسي محجوزة.',
    },
    seating: 'ga',
    tiers: [
      { id: 'house', name: { en: 'House package', ar: 'الباقة العادية' }, price: 395, color: '#7c3aed' },
      { id: 'bubbly', name: { en: 'Bubbly package', ar: 'باقة الفقاعات' }, price: 595, color: '#a855f7' },
      { id: 'cabana', name: { en: 'Cabana (4 pax)', ar: 'كابانا (4 أشخاص)' }, price: 2400, color: '#f59e0b' },
    ],
    addons: [
      { id: 'h-beach', kind: 'hotel', label: { en: 'Stay & brunch — 1 night', ar: 'إقامة وبرانش — ليلة' }, price: 1450 },
    ],
  },
  {
    id: 'evt-4',
    title: { en: 'Stand-Up Night with Mo Amer', ar: 'ستاند أب مع مو عامر' },
    subtitle: { en: 'Two-night residency at King Fahd Cultural Centre', ar: 'ليلتان في مركز الملك فهد الثقافي' },
    category: 'comedy',
    venue: { en: 'King Fahd Cultural Centre', ar: 'مركز الملك فهد الثقافي' },
    city: 'Riyadh',
    date: '2026-07-04T21:30:00',
    image: pset('comedy')[0],
    images: pset('comedy'),
    priceFrom: 180,
    rating: 4.9,
    viewing: 612,
    capacity: 1800,
    sold: 1755,
    flags: { ageRestricted: '16+', multiDay: true },
    tags: { en: ['Comedy', 'English', 'Multi-day'], ar: ['كوميديا', 'إنجليزي', 'متعدد الأيام'] },
    description: {
      en: 'A fast-selling stand-up residency over two nights, each with its own seat-map and inventory. Theater seating reserved across orchestra, mezzanine and balcony.',
      ar: 'ليلتان من الستاند أب سريعتا النفاد، لكل ليلة خريطة مقاعد ومخزون مستقل. جلوس مسرحي محجوز في الصالة والميزانين والشرفة.',
    },
    seating: 'reserved',
    multiDay: true,
    days: [
      { id: 'm1', date: '2026-07-04', label: { en: 'Friday night', ar: 'ليلة الجمعة' }, headline: { en: '9:30 PM show', ar: 'عرض 9:30 مساءً' } },
      { id: 'm2', date: '2026-07-05', label: { en: 'Saturday night', ar: 'ليلة السبت' }, headline: { en: '9:30 PM show', ar: 'عرض 9:30 مساءً' } },
    ],
    tiers: [
      { id: 'orch', name: { en: 'Orchestra', ar: 'الصالة' }, price: 380, color: '#a855f7' },
      { id: 'mez', name: { en: 'Mezzanine', ar: 'الميزانين' }, price: 260, color: '#7c3aed' },
      { id: 'bal', name: { en: 'Balcony', ar: 'الشرفة' }, price: 180, color: '#3b82f6' },
    ],
    layout: {
      width: 700, height: 480,
      stage: { x: 230, y: 30, w: 240, h: 30, label: { en: 'STAGE', ar: 'المسرح' } },
      blocks: [
        { id: 'b-orch-c', tierId: 'orch', name: { en: 'Orch. Center', ar: 'الصالة وسط' }, shape: { x: 240, y: 90, w: 220, h: 70 }, rows: ['A','B','C','D','E'], perRow: 14 },
        { id: 'b-orch-l', tierId: 'orch', name: { en: 'Orch. Left', ar: 'الصالة يسار' }, shape: { x: 60, y: 90, w: 160, h: 70 }, rows: ['A','B','C','D'], perRow: 8 },
        { id: 'b-orch-r', tierId: 'orch', name: { en: 'Orch. Right', ar: 'الصالة يمين' }, shape: { x: 480, y: 90, w: 160, h: 70 }, rows: ['A','B','C','D'], perRow: 8 },
        { id: 'b-mez-l', tierId: 'mez', name: { en: 'Mezzanine L', ar: 'ميزانين يسار' }, shape: { x: 80, y: 200, w: 280, h: 70 }, rows: ['F','G','H','I'], perRow: 12 },
        { id: 'b-mez-r', tierId: 'mez', name: { en: 'Mezzanine R', ar: 'ميزانين يمين' }, shape: { x: 380, y: 200, w: 280, h: 70 }, rows: ['F','G','H','I'], perRow: 12 },
        { id: 'b-bal', tierId: 'bal', name: { en: 'Balcony', ar: 'الشرفة' }, shape: { x: 100, y: 310, w: 540, h: 70 }, rows: ['J','K','L'], perRow: 18 },
      ],
    },
    addons: [
      { id: 'd-bites', kind: 'dining', label: { en: 'Pre-show bites & drinks', ar: 'مأكولات قبل العرض' }, price: 120 },
      { id: 'p-park', kind: 'parking', label: { en: 'Reserved parking', ar: 'موقف محجوز' }, price: 40 },
    ],
  },
  {
    id: 'evt-5',
    title: { en: 'AlUla Skies — Hot air balloon experience', ar: 'سماء العلا — منطاد هواء ساخن' },
    subtitle: { en: '60-minute sunrise flight with breakfast', ar: 'رحلة شروق 60 دقيقة مع إفطار' },
    category: 'experiences',
    venue: { en: 'AlUla Heritage Park', ar: 'حديقة العلا التراثية' },
    city: 'Riyadh',
    date: '2026-09-02T05:30:00',
    image: pset('alula')[0],
    images: pset('alula'),
    priceFrom: 650,
    rating: 4.95,
    viewing: 198,
    capacity: 80,
    sold: 71,
    flags: { accessible: false },
    tags: { en: ['Experience', 'Timed entry', 'Outdoor'], ar: ['تجربة', 'دخول محدد الوقت', 'خارجي'] },
    description: {
      en: 'A bucket-list flight over AlUla\'s sandstone canyons at sunrise, finishing with a heritage breakfast at the launch site.',
      ar: 'رحلة لا تُنسى فوق وديان العلا عند الشروق تنتهي بإفطار تراثي في موقع الإطلاق.',
    },
    seating: 'ga',
    tiers: [
      { id: 'classic', name: { en: 'Sunrise flight', ar: 'رحلة الشروق' }, price: 650, color: '#7c3aed' },
      { id: 'private', name: { en: 'Private basket (4 pax)', ar: 'منطاد خاص (4 أشخاص)' }, price: 4800, color: '#f59e0b' },
    ],
    addons: [
      { id: 'h-alula', kind: 'hotel', label: { en: 'Heritage tent — 1 night', ar: 'خيمة تراثية — ليلة' }, price: 980 },
    ],
  },
  {
    id: 'evt-6',
    title: { en: 'Kids Theatre — Adventures of Saif', ar: 'مسرح الأطفال — مغامرات سيف' },
    subtitle: { en: 'A family-friendly Arabic musical', ar: 'مسرحية موسيقية عربية للعائلة' },
    category: 'family',
    venue: { en: 'Cultural Boulevard', ar: 'بوليفارد الثقافة' },
    city: 'Jeddah',
    date: '2026-04-18T17:00:00',
    image: pset('family')[0],
    images: pset('family'),
    priceFrom: 95,
    rating: 4.6,
    viewing: 89,
    capacity: 1500,
    sold: 540,
    flags: { accessible: true },
    tags: { en: ['Family', 'Arabic', 'All ages'], ar: ['عائلي', 'عربي', 'لكل الأعمار'] },
    description: {
      en: 'A 75-minute Arabic-language musical for kids 4+ and their families, with audio-described performances on Sundays.',
      ar: 'مسرحية موسيقية بالعربية لمدة 75 دقيقة للأطفال من 4 سنوات وعائلاتهم، مع وصف صوتي يوم الأحد.',
    },
    seating: 'ga',
    tiers: [
      { id: 'adult', name: { en: 'Adult', ar: 'بالغ' }, price: 145, color: '#7c3aed' },
      { id: 'child', name: { en: 'Child (4–12)', ar: 'طفل (4–12)' }, price: 95, color: '#a855f7' },
      { id: 'family', name: { en: 'Family pack (2+2)', ar: 'باقة عائلية (2+2)' }, price: 420, color: '#f59e0b' },
    ],
    addons: [],
  },
  {
    id: 'evt-7',
    title: { en: 'Soho Garden Saturdays', ar: 'سوهو جاردن السبت' },
    subtitle: { en: 'Resident DJs all night', ar: 'دي جي مقيم طوال الليل' },
    category: 'nightlife',
    venue: { en: 'Soho Garden Meydan', ar: 'سوهو جاردن ميدان' },
    city: 'Dubai',
    date: '2026-06-06T23:00:00',
    image: pset('nightlife')[0],
    images: pset('nightlife'),
    priceFrom: 150,
    rating: 4.4,
    viewing: 980,
    capacity: 1200,
    sold: 720,
    flags: { ageRestricted: '21+', tableMin: true },
    tags: { en: ['Club', 'Tables', '21+'], ar: ['نادي', 'طاولات', '+21'] },
    description: {
      en: 'A flagship nightlife venue with reserved tables, GA standing and a curated guest-DJ rotation. Tables include minimum-spend rules per the venue.',
      ar: 'مكان نوادي فاخر مع طاولات محجوزة ودخول عام واختيار من DJ ضيوف. الطاولات تشمل حد أدنى للإنفاق.',
    },
    seating: 'ga',
    tiers: [
      { id: 'ga', name: { en: 'GA Standing', ar: 'دخول عام' }, price: 150, color: '#7c3aed' },
      { id: 'tbl-s', name: { en: 'Table — small (min 2,500)', ar: 'طاولة صغيرة (حد 2,500)' }, price: 2500, color: '#a855f7' },
      { id: 'tbl-l', name: { en: 'Table — large (min 6,000)', ar: 'طاولة كبيرة (حد 6,000)' }, price: 6000, color: '#f59e0b' },
    ],
    addons: [
    ],
  },
  {
    id: 'evt-8',
    title: { en: 'MDLBeast Soundstorm Festival', ar: 'مهرجان ساوند ستورم MDLBeast' },
    subtitle: { en: 'Three-day festival across six stages', ar: 'مهرجان لثلاثة أيام على ست خشبات' },
    category: 'festivals',
    venue: { en: 'Banban Festival Grounds', ar: 'أرض مهرجانات بان بان' },
    city: 'Riyadh',
    date: '2026-12-04T18:00:00',
    image: pset('soundstorm')[0],
    images: pset('soundstorm'),
    priceFrom: 200,
    rating: 4.8,
    viewing: 5400,
    capacity: 200000,
    sold: 84300,
    salesOpenAt: '2026-09-15T12:00:00',
    flags: { verifiedFan: true, queue: true, rotating: true, ageRestricted: '18+', multiDay: true },
    tags: { en: ['Festival', 'Multi-day', '18+'], ar: ['مهرجان', 'متعدد الأيام', '+18'] },
    description: {
      en: 'The region\'s largest electronic music festival across three days and six stages. Pick a single day or save on a 3-day pass. Verified Fan presale and rotating-barcode tickets to combat resale fraud.',
      ar: 'أكبر مهرجان موسيقى إلكترونية في المنطقة على مدى ثلاثة أيام وست خشبات. اختر يومًا واحدًا أو وفر مع تذكرة 3 أيام. بيع مسبق Verified Fan وباركود متغير لمنع الاحتيال.',
    },
    seating: 'ga',
    multiDay: true,
    days: [
      { id: 'd1', date: '2026-12-04', label: { en: 'Day 1 — Thursday', ar: 'اليوم الأول — الخميس' }, headline: { en: 'House & Techno', ar: 'هاوس وتكنو' } },
      { id: 'd2', date: '2026-12-05', label: { en: 'Day 2 — Friday', ar: 'اليوم الثاني — الجمعة' }, headline: { en: 'Bass & Drum', ar: 'باس ودرام' } },
      { id: 'd3', date: '2026-12-06', label: { en: 'Day 3 — Saturday', ar: 'اليوم الثالث — السبت' }, headline: { en: 'Mainstage Headliners', ar: 'نجوم الخشبة الرئيسية' } },
    ],
    tiers: [
      { id: 'd1-ga', dayId: 'd1', name: { en: 'Day 1 GA', ar: 'دخول عام — يوم 1' }, price: 200, color: '#7c3aed' },
      { id: 'd1-vip', dayId: 'd1', name: { en: 'Day 1 VIP', ar: 'VIP — يوم 1' }, price: 600, color: '#a855f7' },
      { id: 'd2-ga', dayId: 'd2', name: { en: 'Day 2 GA', ar: 'دخول عام — يوم 2' }, price: 200, color: '#7c3aed' },
      { id: 'd2-vip', dayId: 'd2', name: { en: 'Day 2 VIP', ar: 'VIP — يوم 2' }, price: 600, color: '#a855f7' },
      { id: 'd3-ga', dayId: 'd3', name: { en: 'Day 3 GA', ar: 'دخول عام — يوم 3' }, price: 240, color: '#7c3aed' },
      { id: 'd3-vip', dayId: 'd3', name: { en: 'Day 3 VIP', ar: 'VIP — يوم 3' }, price: 720, color: '#a855f7' },
      { id: 'pass-ga', dayId: 'all', name: { en: '3-Day GA Pass', ar: 'تذكرة 3 أيام', save: { en: 'Save 25%', ar: 'وفر 25%' } }, price: 480, color: '#7c3aed' },
      { id: 'pass-vip', dayId: 'all', name: { en: '3-Day VIP', ar: 'VIP 3 أيام', save: { en: 'Save 25%', ar: 'وفر 25%' } }, price: 1450, color: '#a855f7' },
      { id: 'pass-pl', dayId: 'all', name: { en: 'Platinum (Hospitality)', ar: 'بلاتينيوم (ضيافة)' }, price: 4200, color: '#f59e0b' },
    ],
    addons: [
      { id: 'h-fest', kind: 'hotel', label: { en: 'Festival hotel package', ar: 'باقة فندقية للمهرجان' }, price: 2200 },
      { id: 'p-fest', kind: 'parking', label: { en: 'Festival parking', ar: 'موقف المهرجان' }, price: 90 },
    ],
  },
  {
    id: 'evt-9',
    title: { en: 'Janadriyah Heritage Festival', ar: 'مهرجان الجنادرية التراثي' },
    subtitle: { en: 'A six-day showcase of Saudi heritage and culture', ar: 'ستة أيام من التراث والثقافة السعودية' },
    category: 'festivals',
    venue: { en: 'Janadriyah Grounds', ar: 'أرض الجنادرية' },
    city: 'Riyadh',
    date: '2026-11-01T16:00:00',
    image: pset('janadriyah')[0],
    images: pset('janadriyah'),
    priceFrom: 50,
    rating: 4.7,
    viewing: 1840,
    capacity: 60000,
    sold: 18900,
    flags: { multiDay: true, accessible: true },
    tags: { en: ['Festival', 'Heritage', 'Multi-day', 'Family'], ar: ['مهرجان', 'تراث', 'متعدد الأيام', 'عائلي'] },
    description: {
      en: 'Six days of folk performances, falconry, traditional crafts and regional cuisine. Pick a single day or grab a heritage pass that covers the full festival.',
      ar: 'ستة أيام من العروض الشعبية والصقارة والحرف التقليدية والمأكولات. اختر يومًا واحدًا أو احصل على باقة تراثية للمهرجان كاملًا.',
    },
    seating: 'ga',
    multiDay: true,
    days: [
      { id: 'jd1', date: '2026-11-01', label: { en: 'Opening day', ar: 'يوم الافتتاح' }, headline: { en: 'Royal opening ceremony', ar: 'حفل الافتتاح الملكي' } },
      { id: 'jd2', date: '2026-11-02', label: { en: 'Folk arts day', ar: 'يوم الفنون الشعبية' }, headline: { en: 'Ardha & traditional dance', ar: 'العرضة والرقص الشعبي' } },
      { id: 'jd3', date: '2026-11-03', label: { en: 'Falconry day', ar: 'يوم الصقارة' }, headline: { en: 'Falcon competitions', ar: 'مسابقات الصقور' } },
      { id: 'jd4', date: '2026-11-04', label: { en: 'Crafts day', ar: 'يوم الحرف' }, headline: { en: 'Regional crafts village', ar: 'قرية الحرف الإقليمية' } },
      { id: 'jd5', date: '2026-11-05', label: { en: 'Cuisine day', ar: 'يوم الطعام' }, headline: { en: 'Regional cuisine pavilions', ar: 'أجنحة المأكولات الإقليمية' } },
      { id: 'jd6', date: '2026-11-06', label: { en: 'Closing day', ar: 'يوم الختام' }, headline: { en: 'Camel race & closing show', ar: 'سباق الهجن وعرض الختام' } },
    ],
    tiers: [
      { id: 'jd1-ga', dayId: 'jd1', name: { en: 'Opening day pass', ar: 'تذكرة الافتتاح' }, price: 80, color: '#a16207' },
      { id: 'jd2-ga', dayId: 'jd2', name: { en: 'Folk arts day', ar: 'يوم الفنون الشعبية' }, price: 50, color: '#a16207' },
      { id: 'jd3-ga', dayId: 'jd3', name: { en: 'Falconry day', ar: 'يوم الصقارة' }, price: 60, color: '#a16207' },
      { id: 'jd4-ga', dayId: 'jd4', name: { en: 'Crafts day', ar: 'يوم الحرف' }, price: 50, color: '#a16207' },
      { id: 'jd5-ga', dayId: 'jd5', name: { en: 'Cuisine day', ar: 'يوم الطعام' }, price: 60, color: '#a16207' },
      { id: 'jd6-ga', dayId: 'jd6', name: { en: 'Closing day pass', ar: 'تذكرة الختام' }, price: 90, color: '#a16207' },
      { id: 'jall', dayId: 'all', name: { en: '6-Day Heritage Pass', ar: 'تذكرة التراث 6 أيام', save: { en: 'Save 30%', ar: 'وفر 30%' } }, price: 280, color: '#f59e0b' },
      { id: 'jall-fam', dayId: 'all', name: { en: 'Family Heritage Pass (4 pax)', ar: 'تذكرة عائلية تراثية (4)', save: { en: 'Save 35%', ar: 'وفر 35%' } }, price: 920, color: '#10b981' },
    ],
    addons: [
      { id: 'jp', kind: 'parking', label: { en: 'On-site parking (per day)', ar: 'موقف داخل الموقع (لكل يوم)' }, price: 30 },
    ],
  },
  {
    id: 'evt-10',
    title: { en: 'Riyadh Tech Forum 2026', ar: 'منتدى الرياض التقني 2026' },
    subtitle: { en: 'Free registration · two-day conference for builders', ar: 'تسجيل مجاني · مؤتمر يومين للمطورين' },
    category: 'experiences',
    venue: { en: 'King Abdullah Financial District', ar: 'مركز الملك عبدالله المالي' },
    city: 'Riyadh',
    date: '2026-10-12T09:00:00',
    image: pset('tech-forum')[0],
    images: pset('tech-forum'),
    priceFrom: 0,
    rating: 4.6,
    viewing: 720,
    capacity: 4000,
    sold: 2640,
    salesOpenAt: '2026-06-20T09:00:00',
    flags: { multiDay: true, registration: true, free: true, accessible: true },
    tags: { en: ['Conference', 'Free registration', 'Multi-day', 'Tech'], ar: ['مؤتمر', 'تسجيل مجاني', 'متعدد الأيام', 'تقنية'] },
    description: {
      en: 'A two-day conference covering AI, fintech, gaming and infrastructure. Free registration with seat capping; an Insider pass adds the gala dinner and roundtables.',
      ar: 'مؤتمر يومين يغطي الذكاء الاصطناعي والتمويل والألعاب والبنية التحتية. تسجيل مجاني بسعة محدودة؛ تذكرة Insider تضيف العشاء والطاولات المغلقة.',
    },
    seating: 'ga',
    multiDay: true,
    days: [
      { id: 'rt1', date: '2026-10-12', label: { en: 'Day 1 — AI & Cloud', ar: 'اليوم 1 — الذكاء الاصطناعي والسحابة' }, headline: { en: 'Builder track', ar: 'مسار المطورين' } },
      { id: 'rt2', date: '2026-10-13', label: { en: 'Day 2 — Fintech & Gaming', ar: 'اليوم 2 — التمويل والألعاب' }, headline: { en: 'Founder track', ar: 'مسار المؤسسين' } },
    ],
    tiers: [
      { id: 'rt-att', dayId: 'all', registration: true, name: { en: 'Attendee pass · 2 days', ar: 'تذكرة حضور · يومين' }, price: 0, color: '#10b981' },
      { id: 'rt-ins', dayId: 'all', registration: true, name: { en: 'Insider pass · gala + roundtables', ar: 'تذكرة Insider · عشاء وطاولات' }, price: 1200, color: '#a855f7' },
      { id: 'rt-vip', dayId: 'all', registration: true, name: { en: 'VIP pass · all rooms + lounge', ar: 'تذكرة VIP · كل القاعات' }, price: 2400, color: '#f59e0b' },
    ],
    addons: [],
  },
  {
    id: 'evt-11',
    title: { en: 'GCC Founders Summit', ar: 'قمة المؤسسين الخليجيين' },
    subtitle: { en: 'Curated invitation-only summit for early-stage founders', ar: 'قمة مغلقة لمؤسسي الشركات الناشئة' },
    category: 'experiences',
    venue: { en: 'Bujairi Terrace', ar: 'تراس البجيري' },
    city: 'Riyadh',
    date: '2026-09-18T17:00:00',
    image: pset('founders-summit')[0],
    images: pset('founders-summit'),
    priceFrom: 0,
    rating: 4.9,
    viewing: 240,
    capacity: 250,
    sold: 198,
    flags: { registration: true, free: true, requiresApproval: true, accessible: true },
    tags: { en: ['Summit', 'Free with approval', 'Network'], ar: ['قمة', 'مجاني بالموافقة', 'شبكة'] },
    description: {
      en: 'A curated, invitation-style summit for early-stage GCC founders. Submit an application to register — the partner team reviews each profile and confirms within 48 hours.',
      ar: 'قمة مغلقة لمؤسسي الشركات الناشئة في الخليج. قدّم طلب التسجيل وسيتم الرد خلال 48 ساعة.',
    },
    seating: 'ga',
    tiers: [
      { id: 'fs-att', registration: true, name: { en: 'Founder application', ar: 'طلب مؤسس' }, price: 0, color: '#10b981' },
      { id: 'fs-press', registration: true, name: { en: 'Press / media application', ar: 'طلب إعلام' }, price: 0, color: '#3b82f6' },
    ],
    addons: [],
  },
  {
    id: 'evt-12',
    title: { en: 'AlUla Wellness Retreat — 4-day pass', ar: 'منتجع العلا للعافية — 4 أيام' },
    subtitle: { en: 'Yoga, breathwork and desert silence', ar: 'يوغا، تنفس، وصمت الصحراء' },
    category: 'experiences',
    venue: { en: 'Maraya Concert Hall', ar: 'قاعة مرايا' },
    city: 'AlUla',
    date: '2026-11-20T07:00:00',
    image: pset('wellness')[0],
    images: pset('wellness'),
    priceFrom: 1800,
    rating: 4.85,
    viewing: 312,
    capacity: 60,
    sold: 28,
    flags: { multiDay: true, accessible: false },
    tags: { en: ['Retreat', 'Multi-day', 'Wellness'], ar: ['منتجع', 'متعدد الأيام', 'عافية'] },
    description: {
      en: 'A four-day desert wellness retreat with daily yoga and breathwork, sound baths and an off-grid silent night. Single-day passes available for nearby guests.',
      ar: 'منتجع عافية صحراوي لأربعة أيام مع يوغا وتنفس وحمامات صوتية وليلة صمت خارج الشبكة. تذاكر يومية متاحة للضيوف القريبين.',
    },
    seating: 'ga',
    multiDay: true,
    days: [
      { id: 'w1', date: '2026-11-20', label: { en: 'Arrival & alignment', ar: 'الوصول والتركيز' } },
      { id: 'w2', date: '2026-11-21', label: { en: 'Breathwork day', ar: 'يوم التنفس' } },
      { id: 'w3', date: '2026-11-22', label: { en: 'Silent canyon', ar: 'وادي الصمت' } },
      { id: 'w4', date: '2026-11-23', label: { en: 'Integration & close', ar: 'الاندماج والختام' } },
    ],
    tiers: [
      { id: 'w-day', dayId: 'd-any', name: { en: 'Single-day session', ar: 'جلسة يومية' }, price: 1800, color: '#10b981' },
      { id: 'w-all', dayId: 'all', name: { en: '4-Day retreat (lodging)', ar: 'منتجع 4 أيام (إقامة)', save: { en: 'Save 18%', ar: 'وفر 18%' } }, price: 5900, color: '#0ea5e9' },
      { id: 'w-vip', dayId: 'all', name: { en: '4-Day retreat (private suite)', ar: 'منتجع 4 أيام (جناح خاص)' }, price: 9800, color: '#f59e0b' },
    ],
    addons: [
      { id: 'w-park', kind: 'parking', label: { en: 'Resort parking (4-day)', ar: 'موقف المنتجع (4 أيام)' }, price: 120 },
    ],
  },
];

export const getEvent = (id) => EVENTS.find((e) => e.id === id);

// Build a deterministic seat map for an event tier (rows × seats per row).
// dayId — when the event is multi-day reserved, vary availability per day.
export function buildSeatMap(event, dayId) {
  if (event.seating !== 'reserved') return null;
  const dayHash = dayId
    ? Array.from(dayId).reduce((acc, c) => acc + c.charCodeAt(0), 0)
    : 0;
  const sections = event.tiers.map((tier, ti) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const perRow = 12;
    const seats = [];
    for (let r = 0; r < rows.length; r++) {
      for (let s = 1; s <= perRow; s++) {
        // deterministic pseudo-random "sold", seeded by event + tier + row + seat + day
        const seed = (event.id.charCodeAt(0) + ti * 17 + r * 13 + s * 7 + dayHash * 5) % 11;
        const sold = seed < 3;
        const accessible = r === 0 && (s === 1 || s === perRow);
        seats.push({
          id: `${tier.id}-${rows[r]}${s}${dayId ? '-' + dayId : ''}`,
          row: rows[r],
          num: s,
          tierId: tier.id,
          dayId: dayId || null,
          status: sold ? 'sold' : 'available',
          accessible,
        });
      }
    }
    return { tier, rows, perRow, seats };
  });
  return sections;
}
