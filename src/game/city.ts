import Phaser from 'phaser';
import {CELL,COLS,ROWS,createMaze,center,locations} from './map';
export class City {
  grid=createMaze(); walls:Phaser.Physics.Arcade.StaticGroup; train:Phaser.GameObjects.Container;
  constructor(public s:Phaser.Scene) {
    this.walls=s.physics.add.staticGroup();const g=s.add.graphics().setDepth(-100);
    g.fillStyle(0xb5c9d6);g.fillRect(0,0,COLS*CELL,ROWS*CELL);
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++) {
      const px=x*CELL,py=y*CELL,hash=(x*73+y*31)%100;
      if(this.grid[y][x]) {
        const wall=s.add.rectangle(px+48,py+48,92,92,0x7594a8,0);s.physics.add.existing(wall,true);this.walls.add(wall);
        if(hash<74){s.add.image(px+48,py+40,'building').setOrigin(.5,.5).setTint([0xffffff,0xc8d8e5,0xd9cadb][hash%3]).setDepth(py+86);}
        else {g.fillStyle(0x9bb6c1);g.fillRect(px+6,py+6,84,84);for(let i=0;i<3;i++)s.add.image(px+20+i*24,py+30+(i%2)*25,'tree').setDepth(py+65+i);g.lineStyle(3,0x647f94);g.strokeRect(px+6,py+6,84,84);}
      } else {
        g.fillStyle(0x849daf);g.fillRect(px+7,py+7,82,82);g.fillStyle(0x9eb5c5);g.fillRect(px+11,py+11,74,74);
        g.fillStyle(0xdce8eb,.65);g.fillRect(px+5,py+5,4,86);g.fillRect(px+6,py+6,84,3);
        for(let i=0;i<5;i++){g.fillStyle(0xe5edef,.25);g.fillRect(px+(hash+i*17)%80+9,py+(hash*3+i*23)%80+8,3,2);}
        if(hash<9&&!Object.values(locations).some(p=>Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)) {
          // Roadside decoration never occupies the 60px-wide navigable centre.
          s.add.image(px+16,py+29,'car').setDepth(py+53);const carBody=s.add.rectangle(px+16,py+29,24,46,0,0);s.physics.add.existing(carBody,true);this.walls.add(carBody);
        }
        if(x%6===1&&y%4===1){s.add.image(px+81,py+18,'lamp').setDepth(py+49);s.add.circle(px+80,py-8,35,0xffdf9b,.1).setDepth(py+51).setBlendMode(Phaser.BlendModes.ADD);}
        if(hash===15){for(let i=0;i<5;i++){g.fillStyle(0xdbe8e6,.7);g.fillRect(px+18+i*12,py+38,6,22);}}
      }
    }
    const label=(x:number,y:number,text:string,color='#f6e6c7')=>s.add.text(x,y,text,{fontFamily:'monospace',fontSize:'13px',color,backgroundColor:'#253d53',padding:{x:10,y:7},align:'center'}).setOrigin(.5).setDepth(y+80);
    const c=center(locations.cdek),o=center(locations.owner),st=center(locations.station);
    // Landmark façades are behind NPCs, leaving the street open.
    for(const [p,title,color] of [[c,'СДЭК',0x6d9b69],[o,'ФУТБОЛЬНЫЙ ДВОР',0x775e76],[st,'КАЗАНСКИЙ ВОКЗАЛ',0x6b819c]] as const){
      const block=s.add.rectangle(p.x,p.y-104,176,74,0,0);s.physics.add.existing(block,true);this.walls.add(block);
      const b=s.add.graphics().setDepth(p.y-60);b.fillStyle(0x253b50);b.fillRect(p.x-85,p.y-133,170,66);b.fillStyle(color);b.fillRect(p.x-88,p.y-137,176,24);b.fillStyle(0xe3edef);b.fillRect(p.x-91,p.y-141,182,7);for(let i=0;i<5;i++){b.fillStyle(0xe8c17b);b.fillRect(p.x-72+i*31,p.y-105,20,24);}label(p.x,p.y-125,title);
    }
    label(c.x+100,c.y+60,'300 ₽\nи никаких скидок');label(o.x-35,o.y+65,'ВСТРЕЧА ЗДЕСЬ ↓');
    label(st.x,st.y-45,'МОСКВА — РОСТОВ\nПуть 3 • друг уже ждёт', '#f2d596');
    g.fillStyle(0x687f92);g.fillRect(st.x-295,st.y+55,705,85);g.lineStyle(4,0x3c5069);for(let i=0;i<2;i++)g.lineBetween(st.x-290,st.y+90+i*25,st.x+410,st.y+90+i*25);
    for(let i=0;i<41;i++){g.fillStyle(0x566c80);g.fillRect(st.x-285+i*17,st.y+85,5,35);}
    const train=s.add.graphics();train.fillStyle(0x24384f);train.fillRect(-200,5,700,50);train.fillStyle(0xbccad1);train.fillRoundedRect(-200,-35,700,75,12);train.fillStyle(0xad5660);train.fillRect(-200,12,700,12);train.fillStyle(0xe4edf0);train.fillRect(-194,-35,685,9);
    for(let i=0;i<19;i++){train.fillStyle(0x425e77);train.fillRect(-180+i*35,-20,25,25);train.fillStyle(0xf4ce8d);train.fillRect(-177+i*35,-17,19,19);train.fillStyle(0x536778);train.fillCircle(-178+i*35,43,7);}
    this.train=s.add.container(st.x-90,st.y+108,[train]).setDepth(st.y+145);const railBody=s.add.rectangle(st.x+60,st.y+120,700,80,0,0);s.physics.add.existing(railBody,true);this.walls.add(railBody);
    s.add.particles(st.x-270,st.y+68,'snow',{speedX:{min:-20,max:10},speedY:{min:-45,max:-20},lifespan:2000,frequency:350,scale:{start:3,end:12},alpha:{start:.2,end:0}}).setDepth(st.y+146);
    label(st.x-125,st.y-12,'ОТПРАВЛЕНИЕ  •  23:40\nРОСТОВ-ГЛАВНЫЙ  •  ПУТЬ 3');
    label(center(locations.start).x+80,center(locations.start).y-90,'МОСКВА • −7 °C\nФутболка сама себя не доставит');
    for(const [x,y,txt] of [[11,23,'↗ Футбольный двор'],[23,13,'Вокзал где-то на юго-востоке ↘'],[15,5,'ТУПИК? Зато бесплатно.'],[29,25,'РОСТОВ — ТУДА →']] as const) if(!this.grid[y][x])label(x*CELL+48,y*CELL+10,txt);
  }
}
export function snow(s:Phaser.Scene) {
  const w=s.scale.width,h=s.scale.height;
  const flakes=Array.from({length:100},()=>s.add.image(Math.random()*w,Math.random()*h,'snow').setScrollFactor(0).setDepth(9990).setAlpha(.25+Math.random()*.6).setScale(.6+Math.random()));
  const update=(_t:number,delta:number)=>{for(const f of flakes){f.y+=delta*.025*f.scale;f.x+=delta*.008;if(f.y>s.scale.height){f.y=-4;f.x=Math.random()*s.scale.width;}if(f.x>s.scale.width)f.x=0;}};
  s.events.on('update',update);s.events.once('shutdown',()=>s.events.off('update',update));
}
