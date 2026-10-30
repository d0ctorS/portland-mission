import Phaser from 'phaser';
import './style.css';
import {Boot,Menu,Select,Victory} from './scenes/screens';
import {World} from './scenes/world';
import {Finale} from './scenes/finale';
new Phaser.Game({type:Phaser.AUTO,parent:'game',backgroundColor:'#14283a',pixelArt:true,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,width:window.innerWidth,height:window.innerHeight},physics:{default:'arcade',arcade:{debug:false}},scene:[Boot,Menu,Select,World,Finale,Victory],input:{activePointers:3},render:{antialias:false,powerPreference:'high-performance'}});
