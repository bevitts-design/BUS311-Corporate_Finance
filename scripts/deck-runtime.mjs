export function deckRuntime() {
  return `(function(){
    if(customElements.get('deck-stage'))return;
    class DeckStage extends HTMLElement{
      connectedCallback(){
        if(this._ready)return;
        this._ready=true;
        const W=parseInt(this.getAttribute('width')||1920,10);
        const H=parseInt(this.getAttribute('height')||1080,10);
        this._slides=[...this.querySelectorAll('.slide')];
        this._idx=0;
        try{this._notes=JSON.parse(document.getElementById('speaker-notes')?.textContent||'[]')}catch(error){this._notes=[]}

        const stage=document.createElement('div');
        stage.style.cssText='position:absolute;transform-origin:top left;width:'+W+'px;height:'+H+'px;';
        this._slides.forEach(slide=>{
          slide.style.position='absolute';
          slide.style.top='0';
          slide.style.left='0';
          slide.style.width=W+'px';
          slide.style.height=H+'px';
          slide.style.display='none';
          slide.style.flexDirection='column';
          stage.appendChild(slide);
        });
        this.appendChild(stage);
        this._stage=stage;
        this.style.cssText='display:block;position:fixed;inset:0;width:100vw;height:100vh;overflow:hidden;background:var(--ink);';

        const counter=document.createElement('div');
        counter.setAttribute('aria-live','polite');
        counter.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.68);color:var(--white);font:500 24px/1 var(--font-mono);padding:10px 18px;border-radius:22px;pointer-events:none;z-index:9999';
        document.body.appendChild(counter);
        this._counter=counter;

        const buttonStyle='position:fixed;bottom:20px;z-index:9999;background:rgba(0,0,0,.64);border:1px solid rgba(255,255,255,.32);color:var(--white);font:600 24px/1 var(--font-body);width:52px;height:52px;border-radius:50%;cursor:pointer;';
        const makeButton=(label,html,right,action)=>{
          const button=document.createElement('button');
          button.type='button';
          button.innerHTML=html;
          button.setAttribute('aria-label',label);
          button.title=label;
          button.style.cssText=buttonStyle+'right:'+right+'px';
          button.addEventListener('click',event=>{event.stopPropagation();action()});
          document.body.appendChild(button);
          return button;
        };
        this._previous=makeButton('Previous slide','&#8592;',156,()=>this._go(this._idx-1));
        this._next=makeButton('Next slide','&#8594;',92,()=>this._go(this._idx+1));
        this._fullscreen=makeButton('Enter fullscreen','&#x26F6;',28,()=>this._toggleFullscreen());

        const notes=document.createElement('div');
        notes.style.cssText='position:fixed;bottom:88px;left:50%;transform:translateX(-50%);max-width:1100px;width:90%;background:rgba(10,10,20,.96);color:var(--white);font:400 24px/1.5 var(--font-body);padding:18px 22px;border-radius:10px;display:none;z-index:9998';
        notes.setAttribute('role','note');
        document.body.appendChild(notes);
        this._notesEl=notes;

        document.addEventListener('keydown',event=>{
          if(['ArrowRight','ArrowDown',' ','PageDown'].includes(event.key)){event.preventDefault();this._go(this._idx+1)}
          if(['ArrowLeft','ArrowUp','PageUp'].includes(event.key)){event.preventDefault();this._go(this._idx-1)}
          if(event.key==='Home'){event.preventDefault();this._go(0)}
          if(event.key==='End'){event.preventDefault();this._go(this._slides.length-1)}
          if(event.key==='n'||event.key==='N')this._toggleNotes();
          if(event.key==='f'||event.key==='F')this._toggleFullscreen();
        });
        this.addEventListener('click',event=>{
          if(event.target.closest('button,a,input,textarea,select,summary'))return;
          const x=event.clientX/window.innerWidth;
          if(x<.33)this._go(this._idx-1);
          else if(x>.67)this._go(this._idx+1);
        });
        window.addEventListener('resize',()=>this._scale());
        window.addEventListener('hashchange',()=>{
          const target=this._indexFromHash();
          if(target!==null&&target!==this._idx)this._go(target,{updateHash:false});
        });
        document.addEventListener('fullscreenchange',()=>this._syncFullscreenButton());

        this._scale();
        this._go(this._indexFromHash()??0,{updateHash:true});
      }
      _indexFromHash(){
        const match=location.hash.match(/^#slide-(\\d+)$/);
        if(!match)return null;
        const index=Number(match[1])-1;
        return Number.isInteger(index)&&index>=0&&index<this._slides.length?index:null;
      }
      _scale(){
        const W=parseInt(this.getAttribute('width')||1920,10);
        const H=parseInt(this.getAttribute('height')||1080,10);
        const scale=Math.min(window.innerWidth/W,window.innerHeight/H);
        const offsetX=(window.innerWidth-W*scale)/2;
        const offsetY=(window.innerHeight-H*scale)/2;
        this._stage.style.transform='translate('+offsetX+'px,'+offsetY+'px) scale('+scale+')';
      }
      _go(nextIndex,{updateHash=true}={}){
        const index=Math.max(0,Math.min(nextIndex,this._slides.length-1));
        if(this._slides[this._idx])this._slides[this._idx].style.display='none';
        this._idx=index;
        if(this._slides[index])this._slides[index].style.display='flex';
        this._counter.textContent=(index+1)+' / '+this._slides.length;
        this._previous.disabled=index===0;
        this._next.disabled=index===this._slides.length-1;
        this._previous.style.opacity=index===0?'.42':'1';
        this._next.style.opacity=index===this._slides.length-1?'.42':'1';
        if(this._notesEl.style.display==='block')this._notesEl.textContent=this._notes[index]||'No speaker note for this slide.';
        if(updateHash){
          const hash='#slide-'+(index+1);
          if(location.hash!==hash)history.replaceState(null,'',hash);
        }
        this.dispatchEvent(new CustomEvent('slideIndexChanged',{detail:{index,slide:index+1}}));
      }
      _toggleNotes(){
        const opening=this._notesEl.style.display!=='block';
        this._notesEl.style.display=opening?'block':'none';
        if(opening)this._notesEl.textContent=this._notes[this._idx]||'No speaker note for this slide.';
      }
      async _toggleFullscreen(){
        try{
          if(!document.fullscreenElement)await document.documentElement.requestFullscreen();
          else await document.exitFullscreen();
        }catch(error){
          console.warn('Fullscreen is unavailable in this browser context.',error);
        }
      }
      _syncFullscreenButton(){
        const active=Boolean(document.fullscreenElement);
        this._fullscreen.setAttribute('aria-label',active?'Exit fullscreen':'Enter fullscreen');
        this._fullscreen.title=active?'Exit fullscreen':'Enter fullscreen';
      }
    }
    customElements.define('deck-stage',DeckStage);
  })();`;
}
