export type OrderSnapshot = { ids: string[]; checkedAt: string };

// The timestamp belongs to a completed authenticated read, never router.refresh().
export class OrderMonitor {
 readonly seen: Set<string>;
 visible = true;
 paused = false;
 pending = false;
 failed = false;
 checkedAt: string | null = null;
 private generation = 0;
 constructor(ids: string[]) { this.seen = new Set(ids); }
 edit() { this.paused = true; this.generation++; }
 resume() { this.paused = false; }
 async check(read: () => Promise<OrderSnapshot>, formFocused = false): Promise<string[]> {
  if (!this.visible || this.paused || formFocused || this.pending) return [];
  this.pending = true;
  const generation = this.generation;
  try {
   const result = await read();
   if (!result || !Array.isArray(result.ids) || !result.ids.every(id => typeof id === 'string') || !Number.isFinite(Date.parse(result.checkedAt))) throw new Error('Invalid snapshot');
   if (generation !== this.generation || !this.visible) return [];
   const fresh = result.ids.filter(id => !this.seen.has(id));
   result.ids.forEach(id => this.seen.add(id));
   this.checkedAt = result.checkedAt;
   this.failed = false;
   return fresh;
  } catch {
   this.failed = true;
   return [];
  } finally { this.pending = false; }
 }
}
