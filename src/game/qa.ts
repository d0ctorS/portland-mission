// Developer-only test instrumentation, dynamically imported only with ?qa=1 in Vite dev.
import type { World } from '../scenes/world';
import { run } from './state';
export function attachQA(s:World){
  const el=document.createElement('details');el.id='qa';el.style.cssText='position:absolute;top:100px;left:8px;z-index:30;pointer-events:auto;background:#102338ef;border:1px solid #a9cc85;padding:8px;font:10px monospace;max-width:280px';
  el.innerHTML='<summary>DEV / QA</summary><button id="qa-owner">К футболке</button><button id="qa-courier">К СДЭК</button><button id="qa-den">К Денчику</button><button id="qa-talk">Говорить / дальше</button><button id="qa-physics">Тест ходьбы и стены</button><button id="qa-check">Проверить физическую карту</button><pre id="qa-result"></pre>';
  document.getElementById('ui')!.append(el);
  for(const kind of ['owner','courier','den'])document.getElementById(`qa-${kind}`)!.onclick=()=>{const n=s.npcs.find(n=>n.kind===kind)!;(s.player.body as Phaser.Physics.Arcade.Body).reset(n.x-35,n.y);s.near=n;};
  document.getElementById('qa-talk')!.onclick=()=>s.interact();
  document.getElementById('qa-physics')!.onclick=()=>{
    const tile=s.city.walls.getChildren().find(w=>{const b=(w as Phaser.GameObjects.Rectangle).body as Phaser.Physics.Arcade.StaticBody;const x=Math.floor((b.x+46)/96),y=Math.floor((b.y+46)/96);return b.width===92&&x>1&&y>1&&s.city.grid[y]?.[x-1]===0;}) as Phaser.GameObjects.Rectangle;
    const b=tile.body as Phaser.Physics.Arcade.StaticBody,old={x:s.player.x,y:s.player.y};const initial=b.x-40;
    (s.player.body as Phaser.Physics.Arcade.Body).reset(initial,b.y+23);s.keys.D.isDown=true;
    s.time.delayedCall(1200,()=>{s.keys.D.isDown=false;const actual=s.player.x;document.getElementById('qa-result')!.textContent=`Ходьба: ${actual>initial+5?'PASS':'FAIL'}\nСтена: ${actual+10<=b.x+1?'PASS':'FAIL'}\nX: ${initial.toFixed(1)} → ${actual.toFixed(1)}\nГраница стены: ${b.x}`;(s.player.body as Phaser.Physics.Arcade.Body).reset(old.x,old.y);});
  };
  document.getElementById('qa-check')!.onclick=()=>{
    const walls=s.city.walls.getChildren().map(w=>(w as Phaser.GameObjects.Rectangle).body as Phaser.Physics.Arcade.StaticBody);
    const step=12,cols=312,rows=248,start={x:12,y:236},q=[start],seen=new Set([`${start.x},${start.y}`]);
    const open=(x:number,y:number)=>{const px=x*step+6,py=y*step+6;return !walls.some(b=>px+11>b.x&&px-11<b.x+b.width&&py+5>b.y&&py-5<b.y+b.height);};
    for(let i=0;i<q.length;i++){const p=q[i];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy,k=`${x},${y}`;if(x>=0&&y>=0&&x<cols&&y<rows&&!seen.has(k)&&open(x,y)){seen.add(k);q.push({x,y});}}}
    const results=s.npcs.map(n=>`${n.kind}: ${seen.has(`${Math.floor((n.x-35)/step)},${Math.floor((n.y+23)/step)}`)?'PASS':'FAIL'}`);
    document.getElementById('qa-result')!.textContent=`Физические коллайдеры: ${walls.length}\nДоступных точек: ${seen.size}\n${results.join('\n')}\nГерой: ${run.hero}\nСтадия: ${run.quest.stage}\nФутболка: ${run.inventory.shirt}`;
  };
}
