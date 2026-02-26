import { LRUCache } from "lru-cache";

export const urlCache = new LRUCache({
  max: 5000,          // store hot URLs
  ttl: 1000 * 60 * 60 // 1 hour
});