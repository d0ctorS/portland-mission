import Phaser from 'phaser';
import {City,snow} from '../game/city';
import {Player,NPC} from '../game/player';
import {CELL,COLS,ROWS,center,locations} from '../game/map';
import {run,heroName,clock} from '../game/state';
import {screen,button,soundButton,toast,DialogueManager,root} from '../game/ui';
import {audio} from '../game/audio';
export class World extends Phaser.Scene {
  city!:City;player!:Player;npcs:NPC[]=[];dialogue=new DialogueManager();paused=false;ending=false;keys!:Record<string,Phaser.Input.Keyboard.Key>;stick={x:0,y:0};near?:NPC;mini!:CanvasRenderingContext2D;lastJoke=0;foot=0;
  constructor(){super('World');}
  create(){
    this.paused=false;this.ending=false;this.near=undefined;this.stick={x:0,y:0};this.lastJoke=0;this.foot=0;this.dialogue=new DialogueManager();
    this.city=new City(this);this.physics.world.setBounds(0,0,COLS*CELL,ROWS*CELL);
    const p=center(locations.start);this.player=new Player(this,p.x,p.y,run.hero);this.physics.add.collider(this.player,this.city.walls);
    this.npcs=([['owner','owner','! Футболка'],['cdek','courier','СДЭК • 300 ₽'],['station','den','Денчик ♥']] as const).map(([l,k,n])=>{const p=center(locations[l]);return new NPC(this,p.x+25,p.y,k,n);});
    this.cameras.main.setBounds(0,0,COLS*CELL,ROWS*CELL).startFollow(this.player,true,.085,.085).setZoom(this.scale.width<650?1.05:1.55);this.cameras.main.fadeIn(600);snow(this);
    screen(`<div class="hud"><div class="quest"><div class="eyebrow" id="phase">01 / ДОСТАТЬ ФУТБОЛКУ</div><strong id="quest"></strong></div><div class="hud-right"><span id="timer">00:00</span><button id="sound" class="icon-button">♫ Звук ${audio.muted?'выкл.':'вкл.'}</button><button id="pause" class="icon-button" aria-label="Пауза">Ⅱ</button></div></div><aside class="map-panel"><div>МОСКВА <span>−7°</span></div><canvas id="minimap" width="195" height="155"></canvas><p>● Вы · <b>Ф</b> Футболка<br><b>С</b> СДЭК · <b>В</b> Вокзал</p></aside><div class="inventory"><span>РЮКЗАК</span><div id="item">— пусто —</div></div><div id="prompt" class="prompt"></div><div class="desktop-help">WASD / ↑↓←→ <span>идти</span> E <span>говорить</span> ESC <span>пауза</span></div><div id="joystick" class="joystick"><div id="knob"></div></div><button id="interact" class="interact">E<small>ГОВОРИТЬ</small></button>`);
    this.mini=document.querySelector<HTMLCanvasElement>('#minimap')!.getContext('2d')!;this.updateHud();soundButton();button('pause',()=>this.togglePause());button('interact',()=>this.interact());
    this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,ESC,ENTER') as Record<string,Phaser.Input.Keyboard.Key>;
    this.input.keyboard!.on('keydown-E',()=>this.interact());this.input.keyboard!.on('keydown-ENTER',()=>{if(this.dialogue.active)this.dialogue.next();});this.input.keyboard!.on('keydown-ESC',()=>this.togglePause());
    this.input.keyboard!.addCapture(['UP','DOWN','LEFT','RIGHT','SPACE']);
    const joy=document.getElementById('joystick')!,knob=document.getElementById('knob')!;
    const end=()=>{this.stick={x:0,y:0};knob.style.transform='translate(0,0)';};
    const move=(e:PointerEvent)=>{const r=joy.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;const d=Math.max(38,Math.hypot(dx,dy));this.stick={x:dx/d,y:dy/d};knob.style.transform=`translate(${this.stick.x*32}px,${this.stick.y*32}px)`;};
    joy.onpointerdown=e=>{audio.unlock();joy.setPointerCapture(e.pointerId);move(e);};joy.onpointermove=e=>{if(joy.hasPointerCapture(e.pointerId))move(e);};joy.onpointerup=end;joy.onpointercancel=end;
    const blur=()=>{end();if(!this.paused&&!this.ending)this.togglePause();};window.addEventListener('blur',blur);
    this.events.once('shutdown',()=>{window.removeEventListener('blur',blur);this.dialogue.close();});
    toast('Москва большая, а футболка одна. Начинаем!');
    if(import.meta.env.DEV&&(new URLSearchParams(location.search)).has('qa')) { (window as any).__mission=this;void import('../game/qa').then(m=>m.attachQA(this)); }
  }
  updateHud(){document.getElementById('quest')!.textContent=run.quest.text;document.getElementById('phase')!.textContent=run.quest.stage==='shirt'?'01 / ДОСТАТЬ ФУТБОЛКУ':run.quest.stage==='station'?'02 / ДОСТАВИТЬ ДРУГУ':'03 / ЗАСЛУЖЕННАЯ НАГРАДА';document.getElementById('item')!.innerHTML=run.inventory.shirt?'👕 <b>PORTLAND</b>':run.inventory.chocolate?'🍫 <b>Шоколадка</b>':'— пусто —';}
  update(_time:number,delta:number){
    if(!this.player)return;
    const locked=this.paused||this.dialogue.active||this.ending;
    if(!locked){run.elapsed+=delta;this.lastJoke+=delta;this.foot+=delta;}
    const axis=(positive:string[],negative:string[])=>positive.some(k=>this.keys[k].isDown)?1:negative.some(k=>this.keys[k].isDown)?-1:0;
    this.player.move(locked?0:axis(['D','RIGHT'],['A','LEFT'])+this.stick.x,locked?0:axis(['S','DOWN'],['W','UP'])+this.stick.y);
    this.near=this.npcs.find(n=>Phaser.Math.Distance.Between(n.x,n.y,this.player.x,this.player.y)<90);
    document.getElementById('prompt')!.textContent=!locked&&this.near?`E · Поговорить: ${this.near.kind==='den'?'Денчик':this.near.kind==='owner'?'владелец футболки':'СДЭК'}`:'';
    document.getElementById('timer')!.textContent=clock(run.elapsed);
    if(this.lastJoke>38000){this.lastJoke=0;toast(Phaser.Utils.Array.GetRandom(['Навигатор потерял сигнал. Дружба — нет.','До Ростова ещё далеко. Хорошо, что есть поезд.','300 рублей остались в кармане.','Сугробы не остановят настоящую дружбу.','Москва большая, а футболка одна.']));}
    if(!locked&&this.player.body!.velocity.length()>10&&this.foot>180){this.foot=0;const f=this.add.ellipse(this.player.x,this.player.y+23,4,7,0x647e92,.35).setDepth(-1);this.tweens.add({targets:f,alpha:0,duration:6500,onComplete:()=>f.destroy()});}
    const c=this.mini;c.fillStyle='#223a50';c.fillRect(0,0,195,155);for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(!this.city.grid[y][x]){c.fillStyle='#87a5b8';c.fillRect(x*5,y*5,5,5);}c.font='bold 9px monospace';c.textAlign='center';
    for(const [l,t] of [['owner','Ф'],['cdek','С'],['station','В']] as const){const p=locations[l];c.fillStyle=l==='owner'?'#e8ae6e':l==='cdek'?'#b6d18d':'#e3b4bf';c.fillRect(p.x*5-3,p.y*5-3,12,12);c.fillStyle='#172c40';c.fillText(t,p.x*5+3,p.y*5+6);}
    c.fillStyle='#e5ffb6';c.beginPath();c.arc(this.player.x/CELL*5,this.player.y/CELL*5,3.5,0,Math.PI*2);c.fill();
  }
  interact(){
    if(this.paused||this.ending)return;if(this.dialogue.active){this.dialogue.next();return;}if(!this.near)return;
    const hero=heroName(run.hero),line=(name:string,text:string)=>({name,text});
    if(this.near.kind==='owner'){
      if(run.inventory.shirt||run.quest.stage!=='shirt'){this.dialogue.open([line('Владелец','Футболка уже у тебя. Денчик на вокзале, юго-восток!')]);return;}
      this.dialogue.open([line('Владелец','Ты за футболкой Портленда?'),line(hero,'Да, мне нужно передать её другу!'),line('Владелец','Ну тогда держи. Только не потеряй!')],()=>{if(run.inventory.takeShirt()){run.quest.stage='station';this.updateHud();this.floatItem('shirt');audio.effect('reward');toast('Футболка ФК Портленд получена! Теперь — на вокзал.');}});
    }else if(this.near.kind==='courier'){
      if(run.cdek){this.dialogue.open([line('Сотрудник СДЭК',Phaser.Utils.Array.GetRandom(['СДЭК всё ещё хочет 300 рублей.','Доставка за 300 рублей? Пешком надёжнее.','Скидок нет. Зато сугробы бесплатные.','Мы бы доставили, но вы же сами не хотите платить.','Ваш заказ никуда не отправлен. И правильно.']))]);return;}
      this.dialogue.open([line('Сотрудник СДЭК','Доставка футболки — 300 рублей.'),line(hero,'300 РУБЛЕЙ?!'),line('Сотрудник СДЭК','Да, стандартный тариф.'),line(hero,'За такие деньги я лучше через всю Москву пешком пройду!')],()=>{
        run.cdek=true;this.paused=true;const msg=this.add.text(this.player.x,this.player.y-60,'̶3̶0̶0̶ ̶₽̶',{fontSize:'28px',color:'#f2a09a',backgroundColor:'#24364b'}).setOrigin(.5).setDepth(9992);this.tweens.add({targets:this.player,x:this.player.x+5,yoyo:true,repeat:5,duration:75});this.tweens.add({targets:msg,y:msg.y-50,alpha:0,duration:2200,onComplete:()=>msg.destroy()});
        const el=document.createElement('div');el.className='modal';el.innerHTML='<section class="paper cdek-modal"><div class="eyebrow">БЮДЖЕТ СОХРАНЁН</div><h2>КОМУ НУЖНЫ ЭТИ ДОСТАВКИ ЗА 300 РУБЛЕЙ?!</h2><p>Сугробы бесплатные. Дружба бесценна.</p><button id="walk" class="primary">Лучше пешком →</button></section>';root.append(el);button('walk',()=>{el.remove();this.paused=false;});
      });
    }else if(!run.inventory.shirt){this.dialogue.open([line('Денчик','А футболка где? Я тут вообще-то жду!'),line(hero,'Сейчас найду! Владелец на северо-востоке Москвы.')]);}
    else{this.dialogue.open([line(hero,'Денчик, футболка прибыла. Доставка — ноль рублей!')],()=>{this.ending=true;this.scene.start('Finale',{heroX:this.player.x,heroY:this.player.y});});}
  }
  floatItem(key:string){const item=this.add.image(this.player.x,this.player.y-50,key).setScale(1.7).setDepth(9993);this.tweens.add({targets:item,y:item.y-35,alpha:0,duration:2200,onComplete:()=>item.destroy()});}
  togglePause(){if(this.ending||document.querySelector('.cdek-modal'))return;if(this.paused){document.querySelector('.pause-modal')?.remove();this.paused=false;return;}this.paused=true;this.player.move(0,0);const el=document.createElement('div');el.className='modal pause-modal';el.innerHTML='<section class="paper"><div class="eyebrow">ТЕХНИЧЕСКИЙ ПЕРЕРЫВ</div><h2>Москва подождёт.</h2><p>Таймер остановлен. Можно согреть руки.</p><button id="resume" class="primary">Продолжить →</button><button id="exit" class="ghost">В главное меню</button></section>';root.append(el);button('resume',()=>this.togglePause());button('exit',()=>this.scene.start('Menu'));}
}
