// Common constants and enums
export const POST_CATEGORIES = {
  TRENDING: 'trending',
  BOLLYWOOD: 'bollywood',
  HOLLYWOOD: 'hollywood',
  NEWS: 'news',
  ENTERTAINMENT: 'entertainment',
  SPORTS: 'sports',
  POLITICS: 'politics',
  TECHNOLOGY: 'technology',
  LIFESTYLE: 'lifestyle',
  BUSINESS: 'business',
  HEALTH: 'health',
  SCIENCE: 'science',
  TRAVEL: 'travel',
  FOOD: 'food',
  FASHION: 'fashion',
  ART: 'art',
  MUSIC: 'music',
  EDUCATION: 'education',
  ENVIRONMENT: 'environment'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user'
};

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const SORT_OPTIONS = {
  NEWEST: { createdAt: -1 },
  OLDEST: { createdAt: 1 },
  UPDATED: { updatedAt: -1 },
  TITLE_ASC: { title: 1 },
  TITLE_DESC: { title: -1 }
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
};