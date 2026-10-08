/* PSM · How Information Creates Value: scroll reveal + five flip circles.
   Desktop: hover or keyboard focus flips the circle (pure CSS); JS only keeps the enlarged back inside the viewport.
   Touch / phones: tap toggles .is-flipped (on phones the circle turns into a readable card). */
(function(){
  var d=document;

  /* Scroll reveal */
  var rev=[].slice.call(d.querySelectorAll('.iv-reveal'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rev.forEach(function(el){io.observe(el);});
  }else{
    rev.forEach(function(el){el.classList.add('in');});
  }

  /* Flip circles */
  var flips=[].slice.call(d.querySelectorAll('.iv-flip'));
  if(!flips.length){return;}
  var mobile=window.matchMedia('(max-width:760px)');
  var lastType='mouse';
  function place(f){
    var inner=f.querySelector('.iv-flip-inner'), dx=0;
    if(!mobile.matches){
      var r=f.getBoundingClientRect(), cx=r.left+r.width/2, half=inner.offsetWidth/2, vw=d.documentElement.clientWidth;
      if(cx-half<8){dx=8-(cx-half);}else if(cx+half>vw-8){dx=(vw-8)-(cx+half);}
    }
    f.style.setProperty('--dx',Math.round(dx)+'px');
  }
  function closeAll(except){flips.forEach(function(f){if(f!==except){f.classList.remove('is-flipped');}});}
  function toggleFlip(f){
    var on=!f.classList.contains('is-flipped');
    closeAll(f);
    if(on){place(f);}
    f.classList.toggle('is-flipped',on);
    if(on&&mobile.matches&&f.scrollIntoView){f.scrollIntoView({block:'nearest',behavior:'smooth'});}
  }
  flips.forEach(function(f){
    var inner=f.querySelector('.iv-flip-inner');
    inner.addEventListener('pointerenter',function(){place(f);});
    inner.addEventListener('focus',function(){place(f);});
    inner.addEventListener('pointerdown',function(e){lastType=e.pointerType||'mouse';});
    inner.addEventListener('click',function(e){
      if(lastType==='mouse'&&!mobile.matches){return;}
      e.stopPropagation();
      toggleFlip(f);
    });
    inner.addEventListener('keydown',function(e){
      if((e.key==='Enter'||e.key===' ')&&mobile.matches){e.preventDefault();toggleFlip(f);}
      if(e.key==='Escape'){f.classList.remove('is-flipped');}
    });
  });
  d.addEventListener('click',function(e){if(!e.target.closest('.iv-flip')){closeAll(null);}});
  var onChange=function(){closeAll(null);};
  if(mobile.addEventListener){mobile.addEventListener('change',onChange);}else if(mobile.addListener){mobile.addListener(onChange);}
})();
