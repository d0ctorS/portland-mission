import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CELL,createMaze,locations,pathBetween } from '../src/game/map.ts';
import { Inventory,resetRun,run,clock,saveBest,readBest } from '../src/game/state.ts';
test('all mandatory locations have traversable routes',()=>{const m=createMaze();for(const a of Object.values(locations))for(const b of Object.values(locations)){const path=pathBetween(m,a,b);assert.ok(path.length>0);for(const p of path)assert.equal(m[p.y][p.x],0);}});
test('maze contains branches, dead ends and alternate routes',()=>{const m=createMaze();let dead=0,branches=0,edges=0,nodes=0;for(let y=1;y<m.length-1;y++)for(let x=1;x<m[0].length-1;x++)if(!m[y][x]){nodes++;const n=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>!m[y+dy][x+dx]).length;edges+=n;if(n===1)dead++;if(n>=3)branches++;}assert.ok(dead>=2&&dead<=8,`short map should have few dead ends, got ${dead}`);assert.ok(branches>4);assert.ok(edges/2>=nodes);});
test('shirt is mandatory, cannot be duplicated, and cannot be reused',()=>{const inv=new Inventory();assert.equal(inv.deliver(),false);assert.equal(inv.takeShirt(),true);assert.equal(inv.takeShirt(),false);assert.equal(inv.deliver(),true);assert.equal(inv.shirt,false);assert.equal(inv.takeShirt(),false);assert.equal(inv.deliver(),false);inv.chocolate=true;assert.equal(inv.takeShirt(),false);});
test('a new run clears mission, inventory and timer for either hero',()=>{for(const h of ['sanya','mark'] as const){run.inventory.shirt=true;run.inventory.chocolate=true;run.elapsed=129009;run.cdek=true;run.quest.stage='done';resetRun(h);assert.equal(run.hero,h);assert.equal(run.inventory.shirt,false);assert.equal(run.inventory.chocolate,false);assert.equal(run.quest.stage,'shirt');assert.equal(run.cdek,false);assert.equal(run.elapsed,0);}});
test('timer formatting',()=>assert.equal(clock(125999),'02:05'));

test('best time persists, only improves, and blocked storage does not break victory',()=>{const data=new Map<string,string>();Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>data.set(k,v)}});run.elapsed=120000;saveBest();assert.equal(readBest(),120000);run.elapsed=180000;saveBest();assert.equal(readBest(),120000);run.elapsed=90000;saveBest();assert.equal(readBest(),90000);Object.defineProperty(globalThis,'localStorage',{configurable:true,get:()=>{throw new Error('denied');}});assert.doesNotThrow(()=>saveBest());delete (globalThis as any).localStorage;});

test('short mission leaves time for dialogue and finale within 1–2 minutes',()=>{
  const m=createMaze(),route=[locations.start,locations.cdek,locations.owner,locations.station];
  const steps=route.slice(1).reduce((sum,p,i)=>sum+pathBetween(m,route[i],p).length-1,0);
  const walkingSeconds=steps*CELL/172;
  assert.ok(walkingSeconds>=40&&walkingSeconds<=60,`walking including CDEK: ${walkingSeconds}s`);
});
