import Phaser from 'phaser';
import {City,snow} from '../game/city';
import {center,locations} from '../game/map';
import {Player,NPC} from '../game/player';
import {run,saveBest} from '../game/state';
import {screen} from '../game/ui';
import {audio} from '../game/audio';
export class Finale extends Phaser.Scene {
  constructor(){super('Finale');}
  update(_time:number,delta:number){if(!run.inventory.chocolate)run.elapsed+=delta;}
  create(){
    // Guard also applies if a scene is started directly from developer tools.
    if(!run.inventory.deliver()){this.scene.start('World');return;}
    const city=new City(this),p=center(locations.station);this.cameras.main.setZoom(this.scale.width<600?1.2:2).centerOn(p.x,p.y+30);snow(this);run.quest.stage='reward';
    const hero=new Player(this,p.x-45,p.y,run.hero),den=new NPC(this,p.x+35,p.y,'den','Денчик');
    screen('<div class="cinema-top">ФИНАЛЬНАЯ ОСТАНОВКА / РОСТОВ БЛИЖЕ, ЧЕМ КАЖЕТСЯ</div><div class="cinema-caption"><span id="finalSpeaker">ДРУЖБА • БЕСПЛАТНАЯ ДОСТАВКА</span><h2 id="finalText">Особо важная посылка прибыла.</h2><p id="finalSub">Футболка прошла через всю Москву.</p></div>');
    const caption=(speaker:string,text:string,sub='')=>{document.getElementById('finalSpeaker')!.textContent=speaker;document.getElementById('finalText')!.textContent=text;document.getElementById('finalSub')!.textContent=sub;};
    const shirt=this.add.image(hero.x,hero.y-27,'shirt').setScale(1.2).setDepth(9992);
    this.tweens.add({targets:shirt,x:den.x,y:den.y-30,duration:1700,ease:'Sine.inOut',onComplete:()=>shirt.destroy()});audio.effect('reward');
    this.time.delayedCall(1900,()=>{caption('ДЕНЧИК','ЛЕГЕНДА! Ты реально привёз футболку!','ДРУЖБА ПОБЕДИЛА!');this.tweens.add({targets:den,y:den.y-16,duration:240,yoyo:true,repeat:10});this.add.particles(p.x,p.y-80,'spark',{speed:{min:25,max:130},angle:{min:200,max:340},gravityY:70,lifespan:2600,frequency:45,tint:[0xf5d48a,0xc9e8a7,0xef9ba4],scale:{start:1.8,end:0}}).setDepth(9991);});
    this.time.delayedCall(5200,()=>{caption('ДЕНЧИК','За такое полагается награда!','Распаковываем самую вкусную часть приключения.');const choc=this.add.image(den.x,den.y-28,'chocolate').setDepth(9993).setScale(1.5);this.tweens.add({targets:choc,x:hero.x,y:hero.y-57,duration:1500,ease:'Sine.inOut',onComplete:()=>{run.inventory.chocolate=true;run.quest.stage='done';saveBest();audio.effect('reward');caption('ШОКОЛАДКА ПОЛУЧЕНА!','Вот она — валюта настоящей дружбы.','СЭКОНОМЛЕНО: 300 ₽ • ЗАРАБОТАНО: 1 ШОКОЛАДКА');const glow=this.add.circle(hero.x,hero.y-57,38,0xf8d47e,.2).setDepth(9992).setBlendMode(Phaser.BlendModes.ADD);this.tweens.add({targets:[glow,choc],y:'-=5',duration:700,yoyo:true,repeat:-1});}});});
    this.time.delayedCall(9200,()=>{audio.effect('train');caption('МОСКВА — РОСТОВ','Осторожно, двери закрываются.','Футболка у друга. Шоколадка у героя. Всё на своих местах.');this.tweens.add({targets:city.train,x:city.train.x+1700,duration:6200,ease:'Quad.in'});this.add.particles(p.x-230,p.y+75,'snow',{speedX:{min:-60,max:-15},speedY:{min:-65,max:-20},lifespan:1800,frequency:70,scale:{start:6,end:18},alpha:{start:.3,end:0}}).setDepth(9991);});
    this.time.delayedCall(15300,()=>{this.cameras.main.fadeOut(700);this.time.delayedCall(700,()=>this.scene.start('Victory'));});
  }
}
