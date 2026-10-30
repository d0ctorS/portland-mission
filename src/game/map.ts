export const CELL = 96, COLS = 39, ROWS = 31;
export const locations = { start:{x:1,y:29}, cdek:{x:5,y:25}, owner:{x:35,y:3}, station:{x:33,y:27} };
export type Point = {x:number,y:number};
export const center = (p:Point) => ({x:p.x*CELL+CELL/2,y:p.y*CELL+CELL/2});
export function createMaze() {
  let seed = 7417;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const grid = Array.from({length:ROWS},()=>Array(COLS).fill(1) as number[]);
  const visit = (x:number,y:number) => {
    grid[y][x]=0;
    const dirs = [[2,0],[-2,0],[0,2],[0,-2]].map(d=>({d,r:random()})).sort((a,b)=>a.r-b.r);
    for (const {d:[dx,dy]} of dirs) {
      const nx=x+dx,ny=y+dy;
      if(nx>0&&ny>0&&nx<COLS-1&&ny<ROWS-1&&grid[ny][nx]) { grid[y+dy/2][x+dx/2]=0; visit(nx,ny); }
    }
  };
  visit(1,29);
  for(let i=0;i<30;i++) {
    const x=2+Math.floor(random()*(COLS-4)), y=2+Math.floor(random()*(ROWS-4));
    if((grid[y][x-1]===0&&grid[y][x+1]===0)||(grid[y-1][x]===0&&grid[y+1][x]===0)) grid[y][x]=0;
  }
  for(const p of Object.values(locations)) for(let y=p.y-1;y<=p.y+1;y++) for(let x=p.x-1;x<=p.x+1;x++) if(y>0&&y<ROWS-1&&x>0&&x<COLS-1) grid[y][x]=0;
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
