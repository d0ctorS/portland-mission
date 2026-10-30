export const CELL = 96, COLS = 39, ROWS = 31;
export const locations = { start:{x:1,y:29}, cdek:{x:5,y:25}, owner:{x:35,y:3}, station:{x:33,y:27} };
export type Point = {x:number,y:number};
export const center = (p:Point) => ({x:p.x*CELL+CELL/2,y:p.y*CELL+CELL/2});
export function createMaze() {
  const grid = Array.from({length:ROWS},()=>Array(COLS).fill(1) as number[]);
  // A small, readable street network: three avenues, three connecting streets,
  // and a few short courtyards. Keep the existing world and all story locations.
  const street = (x1:number,y1:number,x2:number,y2:number) => {
    for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)
      for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) grid[y][x]=0;
  };
  street(7,5,35,5);
  street(7,15,33,15);
  street(3,25,35,25);
  street(7,5,7,29);
  street(21,5,21,25);
  street(33,5,33,27);
  street(1,29,7,29);
  street(35,3,35,5);
  // Optional courtyards end after 2–3 cells, so a wrong turn costs seconds.
  street(11,5,11,8);
  street(13,15,13,17);
  street(27,22,27,25);
  street(4,19,7,19);
  for(const p of Object.values(locations))
    for(let y=p.y-1;y<=p.y+1;y++)
      for(let x=p.x-1;x<=p.x+1;x++)
        if(y>0&&y<ROWS-1&&x>0&&x<COLS-1) grid[y][x]=0;
  for(let y=25;y<=29;y++) for(let x=29;x<=37;x++) grid[y][x]=0;
  return grid;
}
export function pathBetween(grid:number[][],start:Point,end:Point):Point[] {
  const queue=[start], prev=new Map<string,Point|null>([[`${start.x},${start.y}`,null]]);
  for(let i=0;i<queue.length;i++) {
    const p=queue[i];
    if(p.x===end.x&&p.y===end.y) {
      const path:Point[]=[]; let at:Point|null=p;
      while(at) { path.unshift(at); at=prev.get(`${at.x},${at.y}`)??null; } return path;
    }
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const q={x:p.x+dx,y:p.y+dy}, k=`${q.x},${q.y}`;
      if(grid[q.y]?.[q.x]===0&&!prev.has(k)) {prev.set(k,p);queue.push(q);}
    }
  } return [];
}
