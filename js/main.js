// ============================================================
// WORKS DATA
// ============================================================
var works = [
  {
    id:'medical-gun', title:'医疗枪械', date:'2026/04', folder:'医疗枪械',
    images:['1_Camera 1.jpg','1_Camera 1_001.jpg','1_Camera 1_002.jpg','1_Camera 1_003.jpg','1_Camera 1_004.jpg']
  },
  {
    id:'crystal-dagger', title:'水晶匕首', date:'2026/03', folder:'水晶匕首',
    main:'Untitled_002.jpg',
    images:['Untitled_002.jpg','Untitled.jpg','Untitled_001.jpg','Untitled_003.jpg','Untitled_004.jpg','tbrender.jpg','tbrender_001.jpg','tbrender_002.jpg','tbrender_003.jpg']
  },
  {
    id:'realistic-dagger', title:'写实匕首', date:'2026/02', folder:'写实匕首',
    images:['Untitled_002.jpg']
  },
  {
    id:'rapier', title:'花剑', date:'2025/12', folder:'花剑',
    main:'Untitled_Camera 1_001.jpg',
    images:['Untitled_Camera 1_001.jpg','Untitled_Camera 1.jpg','Untitled_Camera 1_002.jpg','Untitled_Camera 1_005.jpg']
  },
  {
    id:'stylized-table', title:'风格化桌子', date:'2025/06', folder:'风格化桌子',
    main:'Untitled_005.jpg',
    images:['Untitled_005.jpg','Untitled.jpg','Untitled_001.jpg','Untitled_002.jpg','Untitled_003.jpg','Untitled_004.jpg','Untitled_006.jpg','Untitled_007.jpg','Untitled_008.jpg','Untitled_009.jpg','Untitled_010.jpg','Untitled_011.jpg','Untitled_012.jpg','Untitled_013.jpg']
  },
  {
    id:'stylized-pistol', title:'风格化单手枪', date:'2025/06', folder:'风格化单手枪',
    images:['02.jpg','1cej8amo.jpg','1cej8amo_001.jpg','1cej8amo_002.jpg','1cej8amo_003.jpg','1cej8amo_004.jpg','541f39407831cc42f3a24bc8bce2a22.jpg']
  },
  {
    id:'stylized-smg', title:'风格化冲锋枪', date:'2025/04', folder:'风格化冲锋枪',
    images:['渲染图1.jpg','渲染图2.jpg','渲染图3.jpg','渲染图4.jpg','渲染图5.jpg','渲染图6.jpg','渲染图7.jpg']
  }
];

function enc(str){ return encodeURIComponent(str).replace(/%2F/g,'/'); }
function ipath(w,img){ return 'images/'+w.folder+'/'+enc(img); }
function mainImg(w){ return w.main||w.images[0]; }

// ============================================================
// PERF
// ============================================================
var perfTier='high';
function detectPerf(){
  var ram=navigator.deviceMemory||8, cores=navigator.hardwareConcurrency||8;
  var mobile=/Mobi|Android/i.test(navigator.userAgent);
  var c=document.createElement('canvas');var gl=c.getContext('webgl2');
  if(!gl){perfTier='low';return}
  if(mobile||ram<4||cores<4){perfTier='low';return}
  if(ram<8||cores<8){perfTier='medium';return}
  perfTier='high';
}

// ============================================================
// LOADER
// ============================================================
function initLoader(){
  var loader=document.getElementById('loader');
  var canvas=document.getElementById('loaderCanvas');
  if(!canvas)return;
  var r=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  r.setSize(160,160);r.setPixelRatio(Math.min(devicePixelRatio,2));
  var s=new THREE.Scene();
  var cam=new THREE.PerspectiveCamera(45,1,0.1,100);
  cam.position.set(2.5,2,3.5);cam.lookAt(0,0,0);
  var geo=new THREE.IcosahedronGeometry(0.9,1);
  var mat=new THREE.MeshBasicMaterial({color:0x7b8cff,wireframe:true,transparent:true,opacity:0.7});
  var mesh=new THREE.Mesh(geo,mat);s.add(mesh);
  var rg=new THREE.TorusGeometry(1.2,0.02,16,64);
  var rm=new THREE.MeshBasicMaterial({color:0x5ce0ff,transparent:true,opacity:0.4});
  var ring=new THREE.Mesh(rg,rm);ring.rotation.x=Math.PI/3;s.add(ring);
  var pg=new THREE.BufferGeometry();var pc=80,pa=new Float32Array(pc*3);
  for(var i=0;i<pc;i++){pa[i*3]=(Math.random()-0.5)*2.5;pa[i*3+1]=(Math.random()-0.5)*2.5;pa[i*3+2]=(Math.random()-0.5)*2.5}
  pg.setAttribute('position',new THREE.BufferAttribute(pa,3));
  var pm=new THREE.PointsMaterial({color:0xa478ff,size:0.03,transparent:true,opacity:0.6});
  var pts=new THREE.Points(pg,pm);s.add(pts);
  var st=performance.now();
  function anim(t){
    var e=(t-st)/1000,p=0.5+0.5*Math.sin(e*2);
    mesh.rotation.y+=0.012;mesh.rotation.x+=0.005;
    ring.rotation.z+=0.006;ring.rotation.y+=0.004;pts.rotation.y-=0.008;
    mat.opacity=0.35+p*0.35;ring.scale.setScalar(0.9+p*0.2);
    r.render(s,cam);requestAnimationFrame(anim);
  }
  requestAnimationFrame(anim);
  addEventListener('load',function(){setTimeout(function(){loader.classList.add('hidden');r.dispose()},600)});
  setTimeout(function(){loader.classList.add('hidden')},3000);
}

// ============================================================
// HERO PARTICLES
// ============================================================
var heroScene,heroRenderer,heroCamera,heroParticles,heroMX=0,heroMY=0;
function initHero(){
  var c=document.getElementById('heroCanvas');if(!c)return;
  heroRenderer=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:perfTier!=='low'});
  heroRenderer.setPixelRatio(Math.min(devicePixelRatio,perfTier==='low'?1:2));
  function sz(){var w=c.parentElement.clientWidth,h=c.parentElement.clientHeight;heroRenderer.setSize(w,h,false);if(heroCamera){heroCamera.aspect=w/Math.max(h,1);heroCamera.updateProjectionMatrix()}}
  sz();addEventListener('resize',sz);
  heroScene=new THREE.Scene();
  heroCamera=new THREE.PerspectiveCamera(60,c.clientWidth/Math.max(c.clientHeight,1),0.5,80);heroCamera.position.z=18;
  var cnt=perfTier==='low'?800:perfTier==='medium'?2000:3500;
  var pos=new Float32Array(cnt*3),cols=new Float32Array(cnt*3),sizes=new Float32Array(cnt),spds=new Float32Array(cnt);
  var pal=[new THREE.Color('#7b8cff'),new THREE.Color('#a478ff'),new THREE.Color('#5ce0ff'),new THREE.Color('#ff6b9d'),new THREE.Color('#6b7bff')];
  for(var i=0;i<cnt;i++){
    var rr=4+Math.random()*18,th=Math.random()*Math.PI*2,ph=Math.random()*Math.PI;
    pos[i*3]=rr*Math.sin(ph)*Math.cos(th);pos[i*3+1]=rr*Math.sin(ph)*Math.sin(th);pos[i*3+2]=rr*Math.cos(ph)-6;
    var cl=pal[Math.floor(Math.random()*pal.length)].clone();cl.multiplyScalar(0.4+Math.random()*0.6);
    cols[i*3]=cl.r;cols[i*3+1]=cl.g;cols[i*3+2]=cl.b;
    sizes[i]=Math.random()*2.5+0.5;spds[i]=0.002+Math.random()*0.015;
  }
  var geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(cols,3));
  geo.setAttribute('size',new THREE.BufferAttribute(sizes,1));
  var tcv=document.createElement('canvas');tcv.width=32;tcv.height=32;
  var ctx=tcv.getContext('2d');
  var g=ctx.createRadialGradient(16,16,0,16,16,16);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(0.2,'rgba(255,255,255,0.8)');g.addColorStop(0.5,'rgba(255,255,255,0.3)');g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,32,32);
  var tex=new THREE.CanvasTexture(tcv);
  var mat=new THREE.PointsMaterial({size:0.08,map:tex,vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.7});
  heroParticles=new THREE.Points(geo,mat);heroParticles.userData={spds:spds,cnt:cnt};heroScene.add(heroParticles);
  if(perfTier!=='low'){var rng=new THREE.Mesh(new THREE.TorusGeometry(8,0.02,16,120),new THREE.MeshBasicMaterial({color:0x7b8cff,transparent:true,opacity:0.15}));rng.rotation.x=Math.PI/2.5;rng.name='glowRing';heroScene.add(rng)}
  document.addEventListener('mousemove',function(e){heroMX=(e.clientX/innerWidth)*2-1;heroMY=-(e.clientY/innerHeight)*2+1});
  document.addEventListener('touchmove',function(e){heroMX=(e.touches[0].clientX/innerWidth)*2-1;heroMY=-(e.touches[0].clientY/innerHeight)*2+1},{passive:true});
  animHero();
}
function animHero(){
  if(!heroRenderer||!heroScene||!heroCamera)return;requestAnimationFrame(animHero);
  var t=performance.now()/1000;
  if(heroParticles){
    heroParticles.rotation.y+=0.0008+heroMX*0.001;heroParticles.rotation.x+=0.0003+heroMY*0.0005;
    var pos=heroParticles.geometry.attributes.position.array,spds=heroParticles.userData.spds,cnt=heroParticles.userData.cnt;
    for(var i=0;i<cnt;i++){pos[i*3+1]+=spds[i]*0.3;if(pos[i*3+1]>14)pos[i*3+1]=-14;if(pos[i*3+1]<-14)pos[i*3+1]=14}
    heroParticles.geometry.attributes.position.needsUpdate=true;
  }
  var ring=heroScene.getObjectByName('glowRing');if(ring){ring.rotation.z+=0.001;ring.scale.setScalar(1+Math.sin(t*0.5)*0.03)}
  heroRenderer.render(heroScene,heroCamera);
}

// ============================================================
// BUILD WORKS
// ============================================================
function buildWorks(){
  var list=document.getElementById('worksList');list.innerHTML='';
  works.forEach(function(w,i){
    var block=document.createElement('div');block.className='work-block';
    var row=document.createElement('div');row.className='work-row';
    row.setAttribute('tabindex','0');
    row.setAttribute('aria-label',w.title+'，创作时间：'+w.date);
    row.innerHTML=
      '<span class="work-row-index">0'+(i+1)+'</span>'+
      '<div class="work-row-info">'+
        '<div class="work-row-title">'+w.title+'</div>'+
        '<div class="work-row-date">创作时间：'+w.date+'</div>'+
      '</div>'+
      '<div class="work-row-img-wrap">'+
        '<img src="'+ipath(w,mainImg(w))+'" alt="'+w.title+'" class="work-row-img" loading="lazy">'+
      '</div>'+
      '<span class="work-row-count">'+w.images.length+' 张渲染图</span>'+
      '<span class="work-row-hint">点击查看</span>';
    row.addEventListener('click',function(){openFS(w,0)});
    row.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openFS(w,0)}});
    block.appendChild(row);list.appendChild(block);
  });
  revealRows();
}

function revealRows(){
  if(!('IntersectionObserver' in window))return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.style.opacity='1';entry.target.style.transform='translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.15});
  document.querySelectorAll('.work-row').forEach(function(row){
    row.style.opacity='0';row.style.transform='translateY(30px)';
    row.style.transition='opacity 0.7s cubic-bezier(0.22,0.61,0.36,1), transform 0.7s cubic-bezier(0.22,0.61,0.36,1)';
    obs.observe(row);
  });
}

// ============================================================
// FULLSCREEN VIEWER
// ============================================================
var fsViewer,fsImageWrap,fsImage,fsTitle,fsDate,fsZoomSlider,fsZoomLabel,fsThumbs;
var currentFS=null;
var fsPan={x:0,y:0, dragging:false, startX:0, startY:0};

function initFS(){
  fsViewer=document.getElementById('fsViewer');
  fsImageWrap=document.getElementById('fsImageWrap');
  fsImage=document.getElementById('fsImage');
  fsTitle=document.getElementById('fsTitle');
  fsDate=document.getElementById('fsDate');
  fsZoomSlider=document.getElementById('fsZoomSlider');
  fsZoomLabel=document.getElementById('fsZoomLabel');
  fsThumbs=document.getElementById('fsThumbs');

  // Close
  document.getElementById('fsClose').addEventListener('click',closeFS);
  document.querySelector('.fs-bg').addEventListener('click',closeFS);

  // Prev/Next
  document.getElementById('fsPrev').addEventListener('click',prevImage);
  document.getElementById('fsNext').addEventListener('click',nextImage);

  // Zoom slider
  fsZoomSlider.addEventListener('input',function(){
    setZoom(parseFloat(fsZoomSlider.value));
  });

  // Mouse wheel zoom
  fsViewer.addEventListener('wheel',function(e){
    if(!currentFS)return;
    e.preventDefault();
    var cur=parseFloat(fsZoomSlider.value);
    var delta=-e.deltaY*0.005;
    var next=Math.max(1,Math.min(5,cur+delta));
    setZoom(next);
  },{passive:false});

  // Pan with mouse drag (only when zoomed)
  fsViewer.addEventListener('mousedown',function(e){
    if(parseFloat(fsZoomSlider.value)<=1)return;
    // Don't start drag on buttons/slider
    if(e.target.closest('button')||e.target.closest('input')||e.target.closest('.fs-thumbs'))return;
    fsPan.dragging=true;
    fsPan.startX=e.clientX-fsPan.x;
    fsPan.startY=e.clientY-fsPan.y;
    fsImageWrap.classList.add('dragging');
    e.preventDefault();
  });
  window.addEventListener('mousemove',function(e){
    if(!fsPan.dragging)return;
    fsPan.x=e.clientX-fsPan.startX;
    fsPan.y=e.clientY-fsPan.startY;
    applyTransform();
  });
  window.addEventListener('mouseup',function(){
    fsPan.dragging=false;
    fsImageWrap.classList.remove('dragging');
  });

  // Touch pan (single finger when zoomed)
  fsViewer.addEventListener('touchstart',function(e){
    if(parseFloat(fsZoomSlider.value)<=1 || e.touches.length!==1)return;
    if(e.target.closest('button')||e.target.closest('input')||e.target.closest('.fs-thumbs'))return;
    fsPan.dragging=true;
    fsPan.startX=e.touches[0].clientX-fsPan.x;
    fsPan.startY=e.touches[0].clientY-fsPan.y;
  },{passive:false});
  window.addEventListener('touchmove',function(e){
    if(!fsPan.dragging)return;
    fsPan.x=e.touches[0].clientX-fsPan.startX;
    fsPan.y=e.touches[0].clientY-fsPan.startY;
    applyTransform();
  },{passive:false});
  window.addEventListener('touchend',function(){fsPan.dragging=false});

  // Keyboard
  document.addEventListener('keydown',function(e){
    if(!fsViewer.classList.contains('open'))return;
    if(e.key==='Escape')closeFS();
    if(e.key==='ArrowLeft')prevImage();
    if(e.key==='ArrowRight')nextImage();
  });

  // Touch swipe for prev/next (when not zoomed)
  var swipeX=0;
  fsViewer.addEventListener('touchstart',function(e){swipeX=e.touches[0].clientX});
  fsViewer.addEventListener('touchend',function(e){
    if(fsPan.dragging)return; // don't swipe while panning
    var dx=e.changedTouches[0].clientX-swipeX;
    if(Math.abs(dx)>60){if(dx<0)nextImage();else prevImage()}
  });
}

function setZoom(val){
  val=Math.max(1,Math.min(5,val));
  fsZoomSlider.value=val;
  fsZoomLabel.textContent=Math.round(val*100)+'%';

  if(val<=1.05){
    // Snap back to 1
    fsZoomSlider.value=1;
    fsZoomLabel.textContent='100%';
    fsPan.x=0;fsPan.y=0;
    fsImageWrap.classList.remove('zoomable','dragging');
    fsImage.style.cursor='default';
  }else{
    fsImageWrap.classList.add('zoomable');
    fsImage.style.cursor='grab';
  }
  applyTransform();
}

function applyTransform(){
  if(!currentFS)return;
  var val=parseFloat(fsZoomSlider.value);
  fsImage.style.transform='scale('+val+') translate('+fsPan.x+'px,'+fsPan.y+'px)';
}

function openFS(work, index){
  currentFS={work:work,index:index};
  updateFSImage(true);
  fsViewer.classList.add('open');
  fsViewer.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  // Reset zoom & pan
  fsZoomSlider.value=1;
  fsPan.x=0;fsPan.y=0;
  fsImage.style.transform='scale(1)';
  fsImage.style.cursor='default';
  fsZoomLabel.textContent='100%';
  fsImageWrap.classList.remove('zoomable','dragging');
  // Build thumbnails
  buildThumbs(work, index);
}

function closeFS(){
  fsViewer.classList.remove('open');
  fsViewer.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  currentFS=null;
}

// Crossfade transition between images
function updateFSImage(instant){
  if(!currentFS)return;
  var w=currentFS.work, idx=currentFS.index;
  var src=ipath(w,w.images[idx]);

  if(instant){
    // First load — no transition
    fsImage.src=src;
    fsImage.alt=w.title;
    fsImage.style.opacity='1';
  }else{
    // Crossfade: fade out → swap → fade in
    fsImage.style.transition='opacity 0.15s ease';
    fsImage.style.opacity='0';
    setTimeout(function(){
      fsImage.src=src;
      fsImage.alt=w.title;
      fsImage.style.opacity='1';
    },160);
  }

  fsTitle.textContent=w.title;
  fsDate.textContent='创作时间：'+w.date;

  // Update thumb active state
  if(fsThumbs){
    var imgs=fsThumbs.querySelectorAll('img');
    imgs.forEach(function(img,i){img.classList.toggle('active',i===idx)});
    // Scroll thumb into view
    if(imgs[idx]) imgs[idx].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }
}

function buildThumbs(work, activeIdx){
  fsThumbs.innerHTML='';
  work.images.forEach(function(img,i){
    var el=document.createElement('img');
    el.src=ipath(work,img);
    el.alt='缩略图 '+(i+1);
    el.loading='lazy';
    if(i===activeIdx)el.classList.add('active');
    el.addEventListener('click',function(){
      if(currentFS&&currentFS.work===work){
        currentFS.index=i;
        fsPan.x=0;fsPan.y=0;
        setZoom(1);
        updateFSImage(false);
      }
    });
    fsThumbs.appendChild(el);
  });
}

function nextImage(){
  if(!currentFS)return;
  currentFS.index=(currentFS.index+1)%currentFS.work.images.length;
  resetZoomAndSwitch();
}

function prevImage(){
  if(!currentFS)return;
  currentFS.index=(currentFS.index-1+currentFS.work.images.length)%currentFS.work.images.length;
  resetZoomAndSwitch();
}

function resetZoomAndSwitch(){
  fsPan.x=0;fsPan.y=0;
  setZoom(1);
  updateFSImage(false);
}

// ============================================================
// THEME
// ============================================================
function initTheme(){
  var btn=document.getElementById('themeToggle');
  var html=document.documentElement;
  var saved=localStorage.getItem('pbr-theme');
  if(saved)html.setAttribute('data-theme',saved);
  btn.addEventListener('click',function(){
    var cur=html.getAttribute('data-theme'),next=cur==='dark'?'light':'dark';
    html.setAttribute('data-theme',next);
    localStorage.setItem('pbr-theme',next);
    btn.setAttribute('aria-label','切换到'+(next==='dark'?'亮色':'暗色')+'模式');
  });
}

// ============================================================
// INIT
// ============================================================
function init(){
  detectPerf();
  initLoader();
  initHero();
  buildWorks();
  initFS();
  initTheme();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}
