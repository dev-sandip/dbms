export const QUERY_KEYS = {
  auth: {
    session: () => ["auth", "session"],
    sessions: () => ["auth", "sessions"],
  },
  article: {
    list: () => ["article", "list"],
    breaking: () => ["article", "breaking"],
    featured: () => ["article", "featured"],
    detail: (id: string) => ["article", "detail", id],
  },
  category: {
    list: () => ["category", "list"],
  },
  
};