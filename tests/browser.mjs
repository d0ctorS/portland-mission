// End-to-end checks of our own local app; Chrome runs with a fresh temporary profile.
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const out=new URL('../test-results/',import.meta.url).pathname;
await mkdir(out,{recursive:true});
const browser=await chromium.launch({...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900}});
const page=await context.newPage();const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
await page.goto('http://localhost:5173/portland-mission/?qa=1');
await page.getByRole('button',{name:/Начать приключение/}).waitFor();
await page.screenshot({path:out+'menu.png'});
await page.getByRole('button',{name:/Как играть/}).click();await page.getByRole('button',{name:/Всё понятно/}).click();
const completeDialogue=async()=>{for(let i=0;i<10;i++){const next=page.locator('.dialogue .next');if(!await next.count())break;await next.click();}};
const go=async(kind)=>{await page.evaluate(kind=>{const s=window.__mission,n=s.npcs.find(n=>n.kind===kind);s.player.body.reset(n.x-35,n.y);},kind);await page.waitForTimeout(100);await page.keyboard.press('e');};
for(const hero of ['sanya','mark']){
  if(hero==='sanya')await page.getByRole('button',{name:/Начать приключение/}).click();
  await page.locator('#'+hero).click();await page.locator('#play').click();await page.locator('#quest').waitFor();
  const start=await page.evaluate(()=>({x:window.__mission.player.x,y:window.__mission.player.y}));
  await page.keyboard.down('d');await page.waitForTimeout(450);await page.keyboard.up('d');
  const moved=await page.evaluate(()=>({x:window.__mission.player.x,y:window.__mission.player.y}));assert.ok(moved.x>start.x+20,'walking changes player position');
  // Place beside an actual solid building and walk into its physics body.
  await page.evaluate(()=>{const s=window.__mission;s.player.body.reset(155,144);});
  await page.keyboard.down('d');await page.waitForTimeout(1300);await page.keyboard.up('d');
  const collisionX=await page.evaluate(()=>window.__mission.player.x);assert.ok(collisionX<190,'building blocks player');
  // Collision-aware path validation at 12px sampling, with real wall body extents.
  const reachable=await page.evaluate(()=>{
    const s=window.__mission,blocked=s.city.walls.getChildren().map(w=>w.body);
    const cols=312,rows=248,step=12,start={x:12,y:236},q=[start],seen=new Set([`${start.x},${start.y}`]);
    const open=(x,y)=>{const px=x*step+6,py=y*step+6;return !blocked.some(b=>px+11>b.x&&px-11<b.x+b.width&&py+5>b.y&&py-5<b.y+b.height);};
    for(let i=0;i<q.length;i++){const p=q[i];for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy,k=`${x},${y}`;if(x>=0&&y>=0&&x<cols&&y<rows&&!seen.has(k)&&open(x,y)){seen.add(k);q.push({x,y});}}}
    return s.npcs.map(n=>{const x=Math.floor((n.x-35)/step),y=Math.floor((n.y+23)/step);return {kind:n.kind,reachable:seen.has(`${x},${y}`)};});
  });assert.ok(reachable.every(n=>n.reachable),JSON.stringify(reachable));
  await go('den');await page.getByText('А футболка где? Я тут вообще-то жду!').waitFor();await completeDialogue();assert.ok(!await page.locator('.victory').count());
  await go('courier');await completeDialogue();await page.getByRole('button',{name:/Лучше пешком/}).waitFor();await page.screenshot({path:out+hero+'-cdek.png'});await page.getByRole('button',{name:/Лучше пешком/}).click();assert.match(await page.locator('#item').innerText(),/пусто/);
  await go('courier');await completeDialogue();
  await go('owner');await completeDialogue();assert.match(await page.locator('#item').innerText(),/PORTLAND/);assert.match(await page.locator('#quest').innerText(),/Денчику/);
  await page.screenshot({path:out+hero+'-world.png'});
  await go('owner');await completeDialogue();
  await page.locator('#pause').click();const pausedTime=await page.locator('#timer').innerText();await page.waitForTimeout(1100);assert.equal(await page.locator('#timer').innerText(),pausedTime);await page.locator('#resume').click();
  await go('den');await completeDialogue();await page.locator('#finalText').waitFor();
  await page.getByText('Вот она — валюта настоящей дружбы.').waitFor({timeout:12000});await page.screenshot({path:out+hero+'-finale.png'});
  await page.locator('.victory').waitFor({timeout:15000});assert.match(await page.locator('.saved').innerText(),/300/);assert.match(await page.locator('.stats').innerText(),hero==='sanya'?/Санёк/:/Марк/);
  const best=await page.evaluate(()=>localStorage.getItem('portland-best-v1'));assert.ok(Number(best)>0);await page.screenshot({path:out+hero+'-victory.png'});
  if(hero==='sanya')await page.locator('#other').click();
}
await page.locator('#again').click();await page.locator('#quest').waitFor();assert.match(await page.locator('#item').innerText(),/пусто/);
// Phone viewport, real touchscreen pointer events, and no horizontal overflow.
const phone=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const mobile=await phone.newPage();mobile.on('pageerror',e=>errors.push(e.message));
await mobile.goto('http://localhost:5173/portland-mission/?qa=1');await mobile.locator('#start').click();await mobile.locator('#play').click();await mobile.locator('#joystick').waitFor({state:'visible'});await mobile.locator('#interact').waitFor({state:'visible'});
assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);
const joy=await mobile.locator('#joystick').boundingBox();const before=await mobile.evaluate(()=>window.__mission.player.x);
await mobile.dispatchEvent('#joystick','pointerdown',{pointerId:1,pointerType:'touch',clientX:joy.x+joy.width/2+30,clientY:joy.y+joy.height/2,bubbles:true});await mobile.waitForTimeout(400);await mobile.dispatchEvent('#joystick','pointerup',{pointerId:1,pointerType:'touch',bubbles:true});
assert.ok(await mobile.evaluate(()=>window.__mission.player.x)>before+10);await mobile.screenshot({path:out+'mobile.png'});
assert.deepEqual(errors,[]);await writeFile(out+'results.json',JSON.stringify({passed:true,heroes:['sanya','mark'],errors,checks:['menu','help','selection','movement','physics collision','physical reachability','Den without shirt','CDEK rejection and repeat','shirt and repeat protection','pause timer','finale','victory and best time','replay','touch joystick','mobile layout']},null,2));
console.log('Browser checks passed for both heroes and phone. No JS errors.');await browser.close();
