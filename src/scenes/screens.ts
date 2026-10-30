import Phaser from 'phaser';
import {createArt} from '../game/art';
import {City,snow} from '../game/city';
import {screen,button,soundButton,root} from '../game/ui';
import {audio} from '../game/audio';
import {Hero,heroName,resetRun,run,clock} from '../game/state';
export class Boot extends Phaser.Scene { constructor(){super('Boot');}create(){createArt(this);this.scene.start('Menu');} }
const footer='<footer><span>МОСКВА, ЗИМА. ДОСТАВКА — НОГАМИ.</span><span>маленькое приключение о большой дружбе</span></footer>';
export class Menu extends Phaser.Scene {
  constructor(){super('Menu');}
  create(){
    new City(this);this.cameras.main.setZoom(1.6).centerOn(900,900);this.tweens.add({targets:this.cameras.main,scrollX:'+=90',scrollY:'-=35',duration:16000,yoyo:true,repeat:-1,ease:'Sine.inOut'});snow(this);audio.theme='menu';
    screen(`<div class="menu-shade"></div><main class="menu"><div class="topline"><span class="brand">P / M <i>ИНДИ-ПРИКЛЮЧЕНИЕ</i></span><button id="sound" class="ghost">♫ Звук ${audio.muted?'выкл.':'вкл.'}</button></div><div class="hero-copy"><div class="eyebrow"><span class="dot"></span> МОСКВА • ЗИМНЯЯ МИССИЯ № 300</div><h1>МИССИЯ:<br>ФУТБОЛКА<br><em>ПОРТЛЕНДА</em><span class="title-star">✳</span></h1><p class="subtitle">Ради друга — хоть через всю Москву!</p><p class="intro">Одна футболка. Два друга. Целая Москва.<br>И 300 причин не пользоваться доставкой.</p><div class="actions"><button id="start" class="primary">Начать приключение <span>↗</span></button><button id="help" class="ghost">Как играть <span>?</span></button></div><div class="tags"><span>1–2 МИНУТЫ</span><span>БЕЗ РЕГИСТРАЦИИ</span><span>100% ДРУЖБА</span></div></div><div class="postcard"><span>ПОСЫЛКА ОСОБОЙ ВАЖНОСТИ</span><div class="big-shirt"><b>PORTLAND</b></div><p>МОСКВА <span>→</span> РОСТОВ</p><small>Стоимость доставки: <s>300 ₽</s> дружба</small></div>${footer}</main>`);
    button('start',()=>this.scene.start('Select'));button('help',()=>{
      const el=document.createElement('div');el.className='modal';el.innerHTML='<section class="paper"><div class="eyebrow">ПОЛЕВАЯ ИНСТРУКЦИЯ</div><h2>Друг ждёт. Идём?</h2><p><kbd>W A S D</kbd> или стрелки — ходьба<br><kbd>E</kbd> — поговорить и продолжить диалог<br><kbd>Esc</kbd> — пауза</p><p>На телефоне: джойстик слева, кнопка E справа. Мини-карта отмечает вас, футболку, СДЭК и вокзал. Светлые улицы проходимы, дома и заборы — нет.</p><p>Сначала заберите футболку у владельца на северо-востоке. Затем найдите Денчика у поезда на юго-востоке. СДЭК можно посетить исключительно ради возмущения.</p><button id="closeHelp" class="primary">Всё понятно →</button></section>';root.append(el);button('closeHelp',()=>el.remove());
    });soundButton();this.input.keyboard?.on('keydown-ENTER',()=>this.scene.start('Select'));
  }
}
export class Select extends Phaser.Scene {
  selected:Hero='sanya';
  constructor(){super('Select');}
  create(){
    this.selected='sanya';this.cameras.main.setBackgroundColor('#14283a');snow(this);
    screen(`<main class="selection"><div class="topline"><button id="back" class="ghost">← В меню</button><span class="brand">01 / ВЫБЕРИ ЛЕГЕНДУ</span></div><div class="select-heading"><div class="eyebrow">ОДНА МИССИЯ. ДВА ХАРАКТЕРА.</div><h2>Кто идёт за футболкой?</h2><p>Возможности одинаковые. Подход к доставке — тоже.</p></div><div class="cards"><button class="character selected" id="sanya"><span class="card-number">01 <span>СВОЙ ПАРЕНЬ</span></span><div class="portrait sanya"><div class="pixel-person"></div></div><h3>Санёк</h3><p>«Ради друга хоть через всю Москву!»</p><span class="chosen">ВЫБРАН ✓</span></button><button class="character" id="mark"><span class="card-number">02 <span>ЭКОНОМИСТ</span></span><div class="portrait mark"><div class="pixel-person"></div></div><h3>Марк</h3><p>«300 рублей за доставку? Я лучше сам!»</p><span class="chosen">ВЫБРАТЬ →</span></button></div><button id="play" class="primary play">Играть за Санька <span>→</span></button><p class="selection-foot">Тёплая куртка — есть. План — разберёмся по дороге.</p></main>`);
    for(const h of ['sanya','mark'] as Hero[]) { const img=document.createElement('img');img.src=this.textures.get(`${h}0`).getSourceImage() instanceof HTMLCanvasElement?(this.textures.get(`${h}0`).getSourceImage() as HTMLCanvasElement).toDataURL():'';img.className='hero-sprite';img.alt=h==='sanya'?'Санёк в красной куртке':'Марк в бирюзовой куртке';document.querySelector(`.portrait.${h}`)!.replaceChildren(img); }
    for(const h of ['sanya','mark'] as Hero[])button(h,()=>{this.selected=h;document.querySelectorAll('.character').forEach(c=>{const chosen=c.id===h;c.classList.toggle('selected',chosen);c.querySelector('.chosen')!.textContent=chosen?'ВЫБРАН ✓':'ВЫБРАТЬ →';});document.getElementById('play')!.innerHTML=`Играть за ${h==='sanya'?'Санька':'Марка'} <span>→</span>`;});
    button('play',()=>{resetRun(this.selected);audio.theme='game';this.scene.start('World');});button('back',()=>this.scene.start('Menu'));
  }
}
export class Victory extends Phaser.Scene {
  constructor(){super('Victory');}
  create(){
    this.cameras.main.setBackgroundColor('#142b39');snow(this);audio.theme='victory';
    this.add.particles(this.scale.width/2,-10,'spark',{x:{min:-this.scale.width/2,max:this.scale.width/2},speedY:{min:30,max:140},speedX:{min:-45,max:45},lifespan:8000,frequency:55,rotate:{min:0,max:360},tint:[0xc6ed94,0xf1c77c,0xe89081],scale:{start:1.5,end:.3}}).setDepth(9991);
    screen(`<main class="victory"><div class="eyebrow">✦ ДРУЖБА ПОБЕДИЛА ✦</div><div class="medal">★</div><h1>МИССИЯ<br><em>ВЫПОЛНЕНА!</em></h1><p>Футболка доставлена. Друг счастлив.<br>Шоколадка получена.</p><div class="saved">СЭКОНОМЛЕНО НА СДЭК <b>300 ₽</b></div><div class="stats"><div><span>ЛЕГЕНДА</span><strong>${heroName(run.hero)}</strong></div><div><span>ВРЕМЯ</span><strong>${clock(run.elapsed)}</strong></div><div><span>ЛУЧШЕЕ</span><strong>${clock(run.best)}</strong></div></div><div class="actions"><button class="primary" id="again">Ещё одна миссия ↗</button><button class="ghost" id="other">Выбрать другого героя</button></div><small>Некоторые вещи бесценны. Доставка к ним не относится.</small></main>`);
    button('again',()=>{resetRun(run.hero);audio.theme='game';this.scene.start('World');});button('other',()=>this.scene.start('Select'));
  }
}
