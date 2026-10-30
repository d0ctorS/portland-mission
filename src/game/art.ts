import Phaser from 'phaser';
export function createArt(scene:Phaser.Scene) {
  const texture=(key:string,w:number,h:number,draw:(c:CanvasRenderingContext2D)=>void)=>{
    const t=scene.textures.createCanvas(key,w,h)!;const c=t.context;c.imageSmoothingEnabled=false;draw(c);t.refresh();
  };
  for(const [name,coat,hat] of [['sanya','#ce6553','#e5b45b'],['mark','#639e9d','#df6b52'],['owner','#826caa','#d8d9c3'],['den','#e8ae50','#934d4c'],['courier','#69a66a','#304c49']]) {
    for(let f=0;f<4;f++) texture(`${name}${f}`,24,36,c=>{
      const r=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
      c.fillStyle='#0c182b55';c.beginPath();c.ellipse(12,33,10,3,0,0,7);c.fill();
      const bob=f===0?0:1, leg=f===1?2:f===3?-2:0;
      r(6,24+bob,5,8+leg,'#23374e');r(13,24+bob,5,8-leg,'#23374e');
      r(4,31+leg,7,3,'#172439');r(13,31-leg,7,3,'#172439');
      r(5,14+bob,14,13,coat);r(3,17+bob,3,9,coat);r(18,17+bob,3,9,coat);
      r(7,6+bob,11,10,'#e5bba2');r(6,3+bob,12,5,hat);r(4,6+bob,16,3,hat);r(10,0+bob,5,3,hat);
      r(8,10+bob,2,2,'#243344');r(15,10+bob,2,2,'#243344');r(11,14+bob,4,1,'#a8665d');
      r(5,16+bob,14,3,'#ead8a0');r(14,18+bob,3,7,'#ead8a0');r(10,21+bob,1,4,'#ffffff55');
    });
    scene.anims.create({key:`${name}-walk`,frames:[0,1,2,3].map(f=>({key:`${name}${f}`})),frameRate:9,repeat:-1});
    scene.anims.create({key:`${name}-idle`,frames:[{key:`${name}0`},{key:`${name}2`}],frameRate:2,repeat:-1});
  }
  texture('shirt',40,38,c=>{c.fillStyle='#182534';c.fillRect(9,4,22,30);c.fillStyle='#cf4d50';c.fillRect(10,5,9,28);c.fillRect(22,5,8,28);c.fillRect(1,5,10,12);c.fillRect(30,5,9,12);c.fillStyle='#e7e8dc';c.fillRect(16,2,8,5);c.font='bold 6px monospace';c.fillText('PORTLAND',5,22);});
  texture('chocolate',28,38,c=>{c.fillStyle='#e2b86c';c.fillRect(2,2,24,34);c.fillStyle='#713f3e';c.fillRect(4,4,20,17);c.fillStyle='#a16949';for(let y=5;y<20;y+=7)for(let x=5;x<24;x+=7)c.fillRect(x,y,5,5);c.fillStyle='#9d5267';c.fillRect(3,22,22,12);c.fillStyle='#ffe5ac';c.font='7px monospace';c.fillText('ДРУГ',5,30);});
  texture('building',96,112,c=>{
    const r=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
    r(8,14,85,97,'#14253755');r(5,21,78,80,'#536581');r(5,45,78,3,'#3d506c');r(5,73,78,3,'#3d506c');
    for(let y=31;y<90;y+=22)for(let x=13;x<78;x+=16){r(x-2,y-2,11,15,'#34475f');r(x,y,7,10,(x+y)%3?'#e4ba77':'#8aa8b8');r(x+3,y,1,10,'#577086');}
    r(2,9,84,20,'#afbfce');r(2,7,84,8,'#e2eced');r(8,15,72,8,'#cad8df');r(61,0,12,12,'#7c8c9e');r(59,0,16,3,'#e5edef');r(36,84,15,17,'#2c4059');r(38,86,10,13,'#dfbb7b');
  });
  texture('tree',40,64,c=>{c.fillStyle='#8e6c6d';c.fillRect(18,19,5,41);c.fillRect(8,27,12,4);c.fillRect(6,12,4,18);c.fillRect(23,17,11,4);c.fillRect(31,7,3,14);c.fillRect(18,5,4,23);c.fillStyle='#e4eff0';c.fillRect(5,10,9,3);c.fillRect(17,3,10,3);c.fillRect(28,5,9,3);});
  texture('car',28,52,c=>{c.fillStyle='#1a293d55';c.fillRect(3,3,25,49);c.fillStyle='#b56e76';c.fillRect(2,2,22,46);c.fillStyle='#d7e6e9';c.fillRect(3,1,20,9);c.fillRect(5,19,16,17);c.fillStyle='#34485e';c.fillRect(4,11,18,8);c.fillRect(4,36,18,6);c.fillStyle='#ffe0a1';c.fillRect(3,3,4,2);c.fillRect(19,3,4,2);});
  texture('lamp',24,70,c=>{c.fillStyle='#34465c';c.fillRect(11,14,3,54);c.fillRect(7,65,11,4);c.fillRect(5,10,17,3);c.fillRect(5,3,3,12);c.fillStyle='#ffe0a2';c.fillRect(2,8,11,6);c.fillStyle='#e6eff0';c.fillRect(1,5,13,3);});
  texture('snow',3,3,c=>{c.fillStyle='#f5fbff';c.fillRect(0,0,2,2);});
  texture('spark',6,6,c=>{c.fillStyle='#f8d57f';c.fillRect(2,0,2,6);c.fillRect(0,2,6,2);});
}
