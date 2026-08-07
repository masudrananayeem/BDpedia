// Adapters between the MongoDB-backed admin content and the shapes the
// existing frontend pages were already written against (name/image/id...),
// so pages keep working with minimal changes once wired to the backend.
import api from './api';

export type District = {
  id: string; name: string; image: string; history: string;
  tourist_places: string; wiki: string; division?: string;
  howToReach?: string; whereToStay?: string; whatToEat?: string; bestTimeToVisit?: string;
  featured?: boolean;
};
export type Place = {
  id: string; name: string; image: string; description: string;
  category?: string; district?: string; entryFee?: string; openingHours?: string;
  images?: { url: string; caption?: string }[];
  featured?: boolean; wiki?: string;
};
export type River = {
  id: string; name: string; localName?: string; length_km: number | null;
  origin: string; districts: string[]; description: string; image?: string; wiki?: string;
  featured?: boolean;
};
export type BlogPost = {
  id: string; title: string; author: string; category: string;
  image: string; excerpt: string; content?: string[];
};
export type HomeContent = {
  heroVideo?: string; heroImages?: { _id: string; url: string; caption?: string }[];
  headline?: string; subheadline?: string;
};

function shapeDistrict(d: any): District {
  return {
    id: d.slug, name: d.title, image: d.coverImage, history: d.history,
    tourist_places: d.touristPlacesSummary, wiki: d.wiki, division: d.division,
    howToReach: d.howToReach, whereToStay: d.whereToStay, whatToEat: d.whatToEat,
    bestTimeToVisit: d.bestTimeToVisit, featured: d.featured,
  };
}
function shapePlace(p: any): Place {
  return {
    id: p.slug, name: p.title, image: p.coverImage, description: p.description,
    category: p.category, district: p.district, entryFee: p.entryFee,
    openingHours: p.openingHours, images: p.images, featured: p.featured,
    wiki: p.wiki,
  };
}
function shapeRiver(r: any): River {
  return {
    id: r.slug, name: r.title, localName: r.localName, length_km: r.lengthKm,
    origin: r.origin, districts: r.districts || [], description: r.description, image: r.coverImage,
    wiki: r.wiki, featured: r.featured,
  };
}
function shapeBlog(b: any): BlogPost {
  return {
    id: b.slug, title: b.title, author: b.author, category: b.category,
    image: b.coverImage, excerpt: b.description, content: b.content,
  };
}

export const fetchDistricts = async (): Promise<District[]> => (await api.get('/districts')).map(shapeDistrict);
export const fetchDistrict = async (slug: string): Promise<District> => shapeDistrict(await api.get(`/districts/${slug}`));
export const fetchPlaces = async (): Promise<Place[]> => (await api.get('/places')).map(shapePlace);
export const fetchPlace = async (slug: string): Promise<Place> => shapePlace(await api.get(`/places/${slug}`));
export const fetchRivers = async (): Promise<River[]> => (await api.get('/rivers')).map(shapeRiver);
export const fetchBlogs = async (): Promise<BlogPost[]> => (await api.get('/blogs')).map(shapeBlog);
export const fetchBlog = async (slug: string): Promise<BlogPost> => shapeBlog(await api.get(`/blogs/${slug}`));
export const fetchHome = async (): Promise<HomeContent> => await api.get('/home');

export type SimpleItem = { _id: string; title: string; description: string; coverImage: string; category?: string };
export const fetchCulture = async (): Promise<SimpleItem[]> => await api.get('/culture');
export const fetchGallery = async (): Promise<SimpleItem[]> => await api.get('/gallery');
export const fetchHistory = async (): Promise<SimpleItem[]> => await api.get('/history');
