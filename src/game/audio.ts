// Original synthesized soundtrack. No external audio files or samples.
class AudioManager {
  context?: AudioContext; muted = false; timer?: ReturnType<typeof setInterval>; step=0; theme='menu';
  unlock() { this.context ??= new AudioContext(); void this.context.resume(); if(!this.timer) this.timer=setInterval(()=>this.tick(),270); }
  toggle() { this.unlock(); this.muted=!this.muted; return this.muted; }
  note(freq:number,duration=.16,volume=.035,type:OscillatorType='triangle',delay=0) {
    if(this.muted||!this.context) return;
    const c=this.context,o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;
    o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+duration+.02);
  }
  tick() { const notes=this.theme==='victory'?[523,659,784,1047,784,659,880,784]:this.theme==='game'?[293,0,440,349,0,392,330,0,261,0,392,330,0,349,293,0]:[261,392,523,392,329,440,523,440]; const n=notes[this.step%notes.length];if(n)this.note(n,.35,.016);if(this.step%4===0)this.note(130.8,.7,.025,'sine');this.step++; }
  effect(kind='talk') { const ns=kind==='train'?[110,147,220]:kind==='reward'?[523,659,784,1047]:[440,660]; ns.forEach((n,i)=>this.note(n,kind==='train'?1.8:.25,.06,kind==='train'?'sawtooth':'triangle',i*.12)); }
}
export const audio = new AudioManager();
