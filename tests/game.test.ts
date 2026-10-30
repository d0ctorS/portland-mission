import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMaze,locations,pathBetween } from '../src/game/map.ts';
import { Inventory,resetRun,run,clock } from '../src/game/state.ts';
test('all mandatory locations have traversable routes',()=>{const m=createMaze();for(const a of Object.values(locations))for(const b of Object.values(locations)){const path=pathBetween(m,a,b);assert.ok(path.length>0);for(const p of path)assert.equal(m[p.y][p.x],0);}});
test('maze contains branches, dead ends and alternate routes',()=>{const m=createMaze();let dead=0,branches=0,edges=0,nodes=0;for(let y=1;y<m.length-1;y++)for(let x=1;x<m[0].length-1;x++)if(!m[y][x]){nodes++;const n=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>!m[y+dy][x+dx]).length;edges+=n;if(n===1)dead++;if(n>=3)branches++;}assert.ok(dead>10);assert.ok(branches>20);assert.ok(edges/2>=nodes);});
test('shirt is mandatory, cannot be duplicated, and cannot be reused',()=>{const inv=new Inventory();assert.equal(inv.deliver(),false);assert.equal(inv.takeShirt(),true);assert.equal(inv.takeShirt(),false);assert.equal(inv.deliver(),true);assert.equal(inv.shirt,false);assert.equal(inv.deliver(),false);inv.chocolate=true;assert.equal(inv.takeShirt(),false);});
test('a new run clears mission, inventory and timer for either hero',()=>{for(const h of ['sanya','mark'] as const){run.inventory.shirt=true;run.inventory.chocolate=true;run.elapsed=129009;run.cdek=true;run.quest.stage='done';resetRun(h);assert.equal(run.hero,h);assert.equal(run.inventory.shirt,false);assert.equal(run.inventory.chocolate,false);assert.equal(run.quest.stage,'shirt');assert.equal(run.cdek,false);assert.equal(run.elapsed,0);}});
test('timer formatting',()=>assert.equal(clock(125999),'02:05'));
