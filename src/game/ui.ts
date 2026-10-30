import {audio} from './audio';
export const root = document.querySelector<HTMLDivElement>('#ui')!;
export function screen(html:string) { root.innerHTML=html; }
export function button(id:string,action:()=>void) { document.getElementById(id)?.addEventListener('click',()=>{audio.unlock();audio.effect();action();}); }
export function toast(text:string) {
  document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.textContent=text;root.append(el);setTimeout(()=>el.remove(),4200);
}
export class DialogueManager {
  active=false; private lines:{name:string,text:string}[]=[];private done=()=>{};
  open(lines:{name:string,text:string}[],done=()=>{}) {if(this.active)return;this.active=true;this.lines=[...lines];this.done=done;this.next();}
  next() {
    document.querySelector('.dialogue')?.remove(); const line=this.lines.shift();
    if(!line){this.active=false;this.done();return;}
    audio.effect();const el=document.createElement('section');el.className='dialogue';el.innerHTML=`<div class="eyebrow">РАЗГОВОР • ${line.name}</div><p>${line.text}</p><button class="next">Дальше <span>E / ↵ →</span></button>`;root.append(el);el.querySelector('button')!.onclick=()=>this.next();
  }
  close(){document.querySelector('.dialogue')?.remove();this.active=false;this.lines=[];}
}
export function soundButton() { button('sound',()=>{ const muted=audio.toggle();document.getElementById('sound')!.textContent=muted?'♫ Звук выкл.':'♫ Звук вкл.'; }); }
