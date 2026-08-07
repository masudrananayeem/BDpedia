import slugify from 'slugify';

export function makeSlug(text) {
  return slugify(text || '', { lower: true, strict: true });
}
