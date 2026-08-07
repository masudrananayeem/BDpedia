// 'tags' = comma-separated list in the form, stored as a string array
// (e.g. River.districts: which districts a river flows through).
// 'boolean' = checkbox (e.g. `featured`: marks an item as "Popular").
export type FieldType = 'text' | 'textarea' | 'number' | 'tags' | 'boolean';

export interface FieldConfig {
  name: string;      // dot-path allowed for nested, e.g. "budget.dailyStayLow"
  label: string;
  type: FieldType;
}

export interface SectionConfig {
  key: string;
  label: string;
  apiPath: string; // e.g. /places
  fields: FieldConfig[];
  hasMultipleImages?: boolean;
}

// One entry per admin-manageable section (feature #1: home/explore/district/
// blog/river/culture/gallery/history — every section admin can add, edit,
// delete pictures and add brand-new elements/items).
export const sectionConfigs: SectionConfig[] = [
  {
    key: 'places',
    label: 'Explore (Places)',
    apiPath: '/places',
    hasMultipleImages: true,
    fields: [
      { name: 'title', label: 'Name', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'district', label: 'District', type: 'text' },
      { name: 'entryFee', label: 'Entry Fee', type: 'text' },
      { name: 'openingHours', label: 'Opening Hours', type: 'text' },
      { name: 'featured', label: 'Popular (show first, "Popular" badge)', type: 'boolean' },
    ],
  },
  {
    key: 'districts',
    label: 'Districts',
    apiPath: '/districts',
    hasMultipleImages: true,
    fields: [
      { name: 'title', label: 'Name', type: 'text' },
      { name: 'description', label: 'Short Description', type: 'textarea' },
      { name: 'division', label: 'Division', type: 'text' },
      { name: 'history', label: 'History', type: 'textarea' },
      { name: 'touristPlacesSummary', label: 'Tourist Places Summary', type: 'textarea' },
      { name: 'wiki', label: 'Wiki Link', type: 'text' },
      { name: 'howToReach', label: 'How To Reach', type: 'textarea' },
      { name: 'whereToStay', label: 'Where To Stay', type: 'textarea' },
      { name: 'whatToEat', label: 'What To Eat', type: 'textarea' },
      { name: 'bestTimeToVisit', label: 'Best Time To Visit', type: 'text' },
      { name: 'budget.dailyStayLow', label: 'Budget hotel / day (৳)', type: 'number' },
      { name: 'budget.dailyStayMid', label: 'Mid-range hotel / day (৳)', type: 'number' },
      { name: 'budget.dailyFood', label: 'Food / day (৳)', type: 'number' },
      { name: 'budget.dailyLocalTransport', label: 'Local transport / day (৳)', type: 'number' },
      { name: 'featured', label: 'Popular (show first, "Popular" badge)', type: 'boolean' },
    ],
  },
  {
    key: 'blogs',
    label: 'Blog',
    apiPath: '/blogs',
    hasMultipleImages: false,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Excerpt', type: 'textarea' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
    ],
  },
  {
    key: 'rivers',
    label: 'Rivers',
    apiPath: '/rivers',
    hasMultipleImages: false,
    fields: [
      { name: 'title', label: 'Name', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'localName', label: 'Local Name', type: 'text' },
      { name: 'lengthKm', label: 'Length (km)', type: 'number' },
      { name: 'origin', label: 'Origin', type: 'text' },
      { name: 'districts', label: 'Flows Through (districts, comma-separated)', type: 'tags' },
      { name: 'wiki', label: 'Wiki Link', type: 'text' },
      { name: 'featured', label: 'Popular (show first, "Popular" badge)', type: 'boolean' },
    ],
  },
  {
    key: 'culture',
    label: 'Culture',
    apiPath: '/culture',
    hasMultipleImages: true,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Category (food/festival/dress/music...)', type: 'text' },
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery',
    apiPath: '/gallery',
    hasMultipleImages: true,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Caption / Description', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'text' },
    ],
  },
  {
    key: 'history',
    label: 'History',
    apiPath: '/history',
    hasMultipleImages: false,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'era', label: 'Era', type: 'text' },
      { name: 'period', label: 'Period (e.g. 1600-1700)', type: 'text' },
    ],
  },
];
