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

/* Home welcome: petals fall softly for about five seconds, once per visitor.
   Add ?welcome to the address to replay it. Skipped when reduced motion is on. */
(function(){
  var w=document.getElementById('welcome');if(!w)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var replay=/[?&]welcome\b/.test(location.search);
  try{if(!replay&&localStorage.getItem('doeh_welcomed'))return;}catch(e){}
  var shapes=['<svg viewBox="0 0 24 24"><path d="M12 2C16 8 18 13 12 22C6 13 8 8 12 2Z"/></svg>','<svg viewBox="0 0 24 24"><path d="M3 21C3 11 10 4 21 3C20 14 13 21 3 21Z"/></svg>'];
  var colors=['#ffffff','#e9fbef','#bff0cf','#8fdca9','#ffffff'];
  var h=(w.parentNode.offsetHeight||360)+60,n=16;
  w.style.setProperty('--fall',h+'px');
  for(var i=0;i<n;i++){
    var p=document.createElement('span');p.className='petal';
    p.style.setProperty('--x',(Math.random()*96+2)+'%');
    p.style.setProperty('--s',(14+Math.random()*16)+'px');
    p.style.setProperty('--c',colors[i%colors.length]);
    p.style.setProperty('--d',(3.6+Math.random()*1.8)+'s');
    p.style.setProperty('--delay',(Math.random()*1.4)+'s');
    p.style.setProperty('--dx',(Math.random()*120-60)+'px');
    p.style.setProperty('--r',(Math.random()*260-130)+'deg');
    p.innerHTML=shapes[i%2];
    w.appendChild(p);
  }
  setTimeout(function(){w.textContent='';},7200);
  try{localStorage.setItem('doeh_welcomed','1');}catch(e){}
})();

/* Home news: shows the three newest items from js/news-data.js. */
(function(){
  var root=document.querySelector('[data-home-news]');if(!root)return;
  var items=[];
  (window.DOEH_NEWS||[]).forEach(function(n){items.push({type:'news',tag:n.category||'News',title:n.title,date:n.date,sum:n.summary});});
  (window.DOEH_EVENTS||[]).forEach(function(e){items.push({type:'event',tag:'Event',title:e.title,date:e.date,sum:e.summary});});
  items.sort(function(a,b){return String(b.date).localeCompare(String(a.date));});
  items=items.slice(0,3);
  var fmt=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'});
  if(!items.length){
    var p=document.createElement('p');p.className='sec-sub';p.textContent='Updates will be posted here soon.';root.appendChild(p);return;
  }
  items.forEach(function(it){
    var a=document.createElement('a');a.className='news-card';a.href='news.html';
    var top=document.createElement('div');top.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;gap:.5rem';
    var tag=document.createElement('span');tag.className='news-tag';tag.textContent=it.tag;
    tag.style.cssText=it.type==='event'?'background:#e6f1fb;color:#185FA5':'background:var(--green-pale);color:var(--green2)';
    var d=document.createElement('span');d.className='news-date';var p=String(it.date).split('-');d.textContent=fmt.format(new Date(+p[0],(+p[1]||1)-1,+p[2]||1));
    top.appendChild(tag);top.appendChild(d);a.appendChild(top);
    var ti=document.createElement('div');ti.className='news-title';ti.textContent=it.title;a.appendChild(ti);
    if(it.sum){var s=document.createElement('p');s.className='news-sum';s.textContent=it.sum;a.appendChild(s);}
    root.appendChild(a);
  });
})();

/* Where graduates work: built only from verified alumni registrations (approved rows from the alumni Apps Script).
   The section stays hidden when there is no data, so nothing unconfirmed is ever shown. */
(function(){
  var sec=document.querySelector('[data-sectors]');if(!sec)return;
  var grid=sec.querySelector('[data-sectors-grid]');
  var URL='https://script.google.com/macros/s/AKfycbynlMTkFjWenAzP68HP4KTkO_4kMRqQJQnSsi8NTSk9mXTetpJpEaoaJKElCrFxk4xtTg/exec';
  function show(rows){
    var map={};
    rows.forEach(function(r){
      var s=String(r['Sector / Industry']||'').trim();if(!s)return;
      var k=s.toLowerCase();(map[k]=map[k]||{name:s,n:0,orgs:{}}).n++;
      var o=String(r['Current Organization']||'').trim();if(o){var ok=o.toLowerCase();(map[k].orgs[ok]=map[k].orgs[ok]||{name:o,n:0}).n++;}
    });
    var list=Object.keys(map).map(function(k){return map[k];}).sort(function(a,b){return b.n-a.n;}).slice(0,6);
    if(!list.length)return;
    list.forEach(function(s){
      var c=document.createElement('div');c.className='sector-card';
      var l=document.createElement('div');l.className='sector-label';l.textContent=s.name;
      var d=document.createElement('div');d.className='sector-desc';
      var orgs=Object.keys(s.orgs).map(function(k){return s.orgs[k];}).sort(function(a,b){return b.n-a.n;}).slice(0,3).map(function(o){return o.name;});
      d.textContent=s.n+(s.n===1?' alumnus':' alumni')+(orgs.length?' · '+orgs.join(', '):'');
      c.appendChild(l);c.appendChild(d);grid.appendChild(c);
    });
    sec.hidden=false;
  }
  try{var c=sessionStorage.getItem('doeh_sectors');if(c){var o=JSON.parse(c);if(Date.now()-o.t<900000){show(o.d);return;}}}catch(e){}
  var ctl=window.AbortController?new AbortController():null;
  var to=setTimeout(function(){if(ctl)ctl.abort();},7000);
  fetch(URL,ctl?{signal:ctl.signal}:{}).then(function(r){return r.json();}).then(function(j){
    clearTimeout(to);
    if(!j||j.result!=='success'||!Array.isArray(j.data))return;
    try{sessionStorage.setItem('doeh_sectors',JSON.stringify({t:Date.now(),d:j.data.map(function(r){return {'Sector / Industry':r['Sector / Industry'],'Current Organization':r['Current Organization']};})}));}catch(e){}
    show(j.data);
  }).catch(function(){});
})();
