export type Hero = 'sanya' | 'mark';
export const heroName = (h: Hero) => h === 'sanya' ? 'Санёк' : 'Марк';
export class Inventory {
  shirt = false; chocolate = false;
  takeShirt() { if (this.shirt || this.chocolate) return false; this.shirt = true; return true; }
  deliver() { if (!this.shirt || this.chocolate) return false; this.shirt = false; return true; }
}
export class QuestManager {
  stage: 'shirt' | 'station' | 'reward' | 'done' = 'shirt';
  get text() { return {shirt:'Найди человека с футболкой ФК Портленд',station:'Доберись до поезда и передай футболку Денчику',reward:'Получи шоколадку от Денчика',done:'Друг счастлив. Миссия выполнена!'}[this.stage]; }
}
export const run = { hero: 'sanya' as Hero, inventory: new Inventory(), quest: new QuestManager(), elapsed: 0, best: 0, cdek: false };
export function resetRun(hero: Hero) { Object.assign(run, {hero, inventory:new Inventory(),quest:new QuestManager(),elapsed:0,cdek:false}); }
export function readBest() { try { return Number(localStorage.getItem('portland-best-v1')) || 0; } catch { return 0; } }
export function saveBest() { const old = readBest(); run.best = old ? Math.min(old,run.elapsed) : run.elapsed; try { localStorage.setItem('portland-best-v1',String(run.best)); } catch { /* private browsing: the run still works */ } }
export const clock = (ms: number) => `${Math.floor(ms / 60000).toString().padStart(2,'0')}:${Math.floor(ms / 1000 % 60).toString().padStart(2,'0')}`;
