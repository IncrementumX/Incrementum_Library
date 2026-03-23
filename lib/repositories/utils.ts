export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createUniqueSlug(base: string) {
  const normalizedBase = slugify(base) || "file";
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
  return {
    baseSlug: normalizedBase,
    finalSlug: `${normalizedBase}-${suffix}`
  };
}
