import Phaser from 'phaser';
import {Hero} from './state';
export class Player extends Phaser.Physics.Arcade.Sprite {
  hero:Hero;
  constructor(scene:Phaser.Scene,x:number,y:number,hero:Hero) {super(scene,x,y,`${hero}0`);this.hero=hero;scene.add.existing(this);scene.physics.add.existing(this);this.setScale(1.7).setDepth(y+25).setCollideWorldBounds(true);(this.body as Phaser.Physics.Arcade.Body).setSize(12,9).setOffset(6,25);this.play(`${hero}-idle`);}
  move(x:number,y:number){const v=new Phaser.Math.Vector2(x,y);if(v.length()>1)v.normalize();this.setVelocity(v.x*172,v.y*172);if(x)this.setFlipX(x<0);this.play(`${this.hero}-${v.length()>.05?'walk':'idle'}`,true);this.setDepth(this.y+25);}
}
export class NPC extends Phaser.GameObjects.Sprite {
  label:Phaser.GameObjects.Text;
  constructor(scene:Phaser.Scene,x:number,y:number,public kind:string,name:string){super(scene,x,y,`${kind}0`);scene.add.existing(this);this.setScale(1.7).setDepth(y+25);this.play(`${kind}-idle`);this.label=scene.add.text(x,y-43,name,{fontFamily:'monospace',fontSize:'12px',color:'#fff4d3',backgroundColor:'#1b3048',padding:{x:8,y:5}}).setOrigin(.5).setDepth(y+26);scene.tweens.add({targets:this.label,y:y-48,duration:1100,yoyo:true,repeat:-1});}
}
