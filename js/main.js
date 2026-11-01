// DOEH BUHS shared JavaScript
// One file for every page: header menu, site search, safe image fallback.

/* Header menu (hamburger, dropdowns, Escape to close) */
(function(){
  var h=document.querySelector('.site-header'),t=document.getElementById('navToggle');
  if(!h||!t)return;
  var mq=window.matchMedia('(max-width:1240px)');
  function setOpen(o){h.classList.toggle('open',o);t.setAttribute('aria-expanded',o?'true':'false');t.setAttribute('aria-label',o?'Close menu':'Open menu');}
  function closeSubs(){h.querySelectorAll('.nav-item.open').forEach(function(i){i.classList.remove('open');});}
  t.addEventListener('click',function(){setOpen(!h.classList.contains('open'));});
  h.querySelectorAll('.nav-item').forEach(function(item){
    var a=item.children[0];
    if(!item.querySelector('.dropdown'))return;
    a.addEventListener('click',function(e){
      if(!mq.matches||item.classList.contains('open'))return;
      e.preventDefault();closeSubs();item.classList.add('open');
    });
  });
  h.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');
    if(a&&mq.matches&&!e.defaultPrevented){setOpen(false);closeSubs();}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){setOpen(false);closeSubs();}});
  var onChange=function(){if(!mq.matches){setOpen(false);closeSubs();}};
  if(mq.addEventListener)mq.addEventListener('change',onChange);
})();

/* Site search overlay */
(function(){
  var IDX=[
   ['Home','index.html','DOEH at BUHS: programs, news and how to apply','home department occupational environmental health buhs'],
   ['About DOEH','about.html','Who we are, our mission and how the department began','about mission vision department'],
   ['Why Study at DOEH','about.html#our-strengths-title','What sets the department apart','strengths why study choose'],
   ['IOSH Accreditation','about.html#iosh-accreditation','Internationally recognized standards in occupational safety and health','iosh accreditation certificate standards'],
   ['Department Leadership','about.html#leadership','Messages from the people who lead DOEH','leadership vice chancellor head message'],
   ['Our Journey and History','about.html#history','How the department has grown','history journey timeline'],
   ['Campus and Location','about.html#location','Address, phone and map','location address map mirpur campus'],
   ['Academics','academics.html','Programs, curriculum and intakes','academics programs courses'],
   ['BPH in Occupational & Environmental Health and Safety','academics.html#bph-body',"Bachelor's program",'bph bachelor undergraduate public health'],
   ['MPH in Occupational Health and Safety','academics.html#mph-ohs-body',"Master's program",'mph masters ohs occupational'],
   ['MPH in Environmental Health and Safety','academics.html#mph-ehs-body',"Master's program",'mph masters ehs environmental'],
   ['Faculty and Academic Staff','academics.html#faculty','Professors and adjunct faculty','faculty teachers professors staff'],
   ['Academic Calendar','academics.html#calendar','Spring and Fall intakes','calendar intake spring fall april october admission'],
   ['Research','research.html','Research themes, faculty expertise and publications','research publications themes faculty arsenic lead occupational garment safety'],
   ['News & Events','news.html','Updates, notices and events','news events notices seminars'],
   ['Gallery','gallery.html','Photos and videos from the department','gallery photos videos fieldwork'],
   ['Alumni','alumni.html','Alumni directory and success stories','alumni graduates directory'],
   ['Contact','contact.html','Reach the department','contact email phone whatsapp'],
   ['Apply Now','https://onlineapplication.buhs.ac.bd/admission/','Apply through the BUHS online portal','apply admission application']
  ];
  var box=document.getElementById('siteSearch'),inp=document.getElementById('ssrInput'),list=document.getElementById('ssrList'),emp=document.getElementById('ssrEmpty'),btn=document.getElementById('siteSearchBtn');
  if(!box||!inp||!btn)return;
  var sel=-1,last=null;
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function render(q){
    var t=q.toLowerCase().split(/\s+/).filter(Boolean),out=[];
    IDX.forEach(function(e){
      var T=e[0].toLowerCase(),R=(e[2]+' '+e[3]).toLowerCase(),s=0,ok=true;
      t.forEach(function(w){if(T.indexOf(w)>-1)s+=3;else if(R.indexOf(w)>-1)s+=1;else ok=false;});
      if(ok&&(t.length||true))out.push([s,e]);
    });
    out.sort(function(a,b){return b[0]-a[0]});
    if(!t.length)out=IDX.slice(0,6).map(function(e){return[0,e]});
    out=out.slice(0,8);sel=-1;
    list.innerHTML=out.map(function(o){var e=o[1];return '<li><a href="'+e[1]+'"'+(e[1].indexOf('http')===0?' target="_blank" rel="noopener"':'')+'><b>'+esc(e[0])+'</b><small>'+esc(e[2])+'</small></a></li>'}).join('');
    emp.hidden=out.length>0;
  }
  function open(){last=document.activeElement;box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';inp.value='';render('');setTimeout(function(){inp.focus()},30)}
  function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow='';if(last&&last.focus)last.focus()}
  function move(d){var a=list.querySelectorAll('a');if(!a.length)return;if(sel>-1)a[sel].classList.remove('sel');sel=(sel+d+a.length)%a.length;a[sel].classList.add('sel');a[sel].scrollIntoView({block:'nearest'})}
  btn.addEventListener('click',open);var btnM=document.getElementById('siteSearchBtnM');if(btnM)btnM.addEventListener('click',open);
  document.getElementById('ssrClose').addEventListener('click',close);
  box.addEventListener('click',function(e){if(e.target===box)close()});
  inp.addEventListener('input',function(){render(inp.value)});
  document.addEventListener('keydown',function(e){
    if(!box.classList.contains('open'))return;
    if(e.key==='Escape'){close()}
    else if(e.key==='ArrowDown'){e.preventDefault();move(1)}
    else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}
    else if(e.key==='Enter'){var a=list.querySelectorAll('a');var t=a[sel>-1?sel:0];if(t){e.preventDefault();t.click()}}
  });
  list.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(a&&a.getAttribute('href').indexOf('#')>-1&&a.getAttribute('href').split('#')[0]===location.pathname.split('/').pop())close()});
})();

/* If an optional image is missing, hide it without moving the layout. */
document.addEventListener('error', function(e){
  var img=e.target;
  if(!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied='true';
  img.setAttribute('aria-hidden','true');
  img.style.visibility='hidden';
}, true);

/* YouTube facade: shows a poster, loads the privacy-friendly player on demand.
   data-mode="loop" starts a muted loop on large screens when motion and data are allowed. */
(function(){
  var nodes=document.querySelectorAll('.yt[data-yt]');
  if(!nodes.length)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var saver=navigator.connection&&navigator.connection.saveData;
  var big=window.matchMedia&&window.matchMedia('(min-width:901px)').matches;
  function load(el,muted){
    if(el.querySelector('iframe'))return;
    var id=el.getAttribute('data-yt');
    var p='autoplay=1&rel=0&modestbranding=1&playsinline=1';
    if(muted)p+='&mute=1&loop=1&controls=0&playlist='+id;
    var f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+id+'?'+p;
    f.title=el.getAttribute('data-title')||'DOEH video';
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('allowfullscreen','');
    f.loading='lazy';
    el.appendChild(f);
    var b=el.querySelector('.yt-poster');if(b)b.style.display='none';
  }
  nodes.forEach(function(el){
    var b=el.querySelector('.yt-poster');
    if(b)b.addEventListener('click',function(){load(el,false);});
    if(el.getAttribute('data-mode')==='loop'&&big&&!reduce&&!saver){
      var start=function(){setTimeout(function(){load(el,true);},900);};
      if(document.readyState==='complete')start();else window.addEventListener('load',start);
    }
  });
})();

/* Photo rotator: crossfade every 6 seconds, pause on hover or focus, dots to jump. */
(function(){
  document.querySelectorAll('[data-rot]').forEach(function(root){
    var slides=[].slice.call(root.querySelectorAll('.rot-slide'));
    var dots=root.querySelector('.rot-dots');
    if(slides.length<2){if(dots)dots.hidden=true;return;}
    var i=0,timer=null,reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    var btns=slides.map(function(s,n){
      var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show photo '+(n+1));
      b.addEventListener('click',function(){go(n);restart();});
      dots.appendChild(b);return b;
    });
    function go(n){
      i=n;
      slides.forEach(function(s,k){s.classList.toggle('is-active',k===n);});
      btns.forEach(function(b,k){b.setAttribute('aria-current',k===n?'true':'false');});
    }
    function next(){go((i+1)%slides.length);}
    function restart(){stop();if(!reduce)timer=setInterval(next,6000);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',restart);
    root.addEventListener('focusin',stop);root.addEventListener('focusout',restart);
    document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else restart();});
    go(0);restart();
  });
})();
