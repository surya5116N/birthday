const CONFIG={
  userName:"sameeha",
  userDates:["04-10-2005","4-10-2005"],
  answer:"hehaa",

  // User unlock: October 4 at 12:00 AM.
  unlockMonth:9,
  unlockDay:4,
  unlockHour:0,
  unlockMinute:0,
};

let isAdmin=false;
let attempts=0;
let timer=null;

const $=id=>document.getElementById(id);

function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  $(id).classList.add("active");
}

/* USER LOGIN */
$("loginBtn").onclick=()=>{
  const name=$("username").value.trim().toLowerCase();
  const date=$("password").value.trim();

  if(name===CONFIG.userName && CONFIG.userDates.includes(date)){
    $("loginError").textContent="";
    showPage("questionPage");
  }else{
    $("loginError").textContent="Name or date correct illa 😌 Try again.";
  }
};

/* ADMIN PAGE */
$("adminBtn").onclick=()=>{
  $("adminKey").value="";
  $("adminError").textContent="";
  showPage("adminPage");
};

$("adminBackBtn").onclick=()=>{
  showPage("loginPage");
};

$("adminLoginBtn").onclick=()=>{
  const key=$("adminKey").value.trim();
  if(!key){
    $("adminError").textContent="Enter the admin key.";
    return;
  }

  // GitHub Pages is static, so admin verification happens in the browser.
  // NOTE: this key is visible to anyone who inspects the site source.
  if(key === "SAMEEHA-ADMIN-2026"){
    isAdmin=true;
    $("adminError").textContent="";
    showPage("questionPage");
    $("questionMessage").textContent="Admin mode enabled 🔐";
    $("questionMessage").style.color="#ffd86b";
  }else{
    $("adminError").textContent="Wrong admin key.";
  }
};
$("adminKey").addEventListener("keydown",e=>{
  if(e.key==="Enter") $("adminLoginBtn").click();
});

/* QUESTION */
$("answerBtn").onclick=()=>{
  const answer=$("answer").value.trim().toLowerCase();

  if(answer===CONFIG.answer){
    $("questionMessage").textContent="Awww... correct! ❤️";
    $("questionMessage").style.color="#ffb9d9";

    setTimeout(()=>{
      showPage("giftPage");
      startCountdown();
    },700);

    return;
  }

  attempts++;
  $("attemptText").textContent=`Attempts: ${attempts} / 5`;
  $("questionMessage").textContent="Hmm... that's not it 😏";
  $("questionMessage").style.color="#ff9ec5";

  if(attempts>=5){
    $("helpBtn").classList.remove("hidden");
  }
};

/* HELP ME */
$("helpBtn").onclick=()=>{
  showHelpClue();
};

function showHelpClue(){
  const letters=["H","E","H","A","A"];

  const positions=[
    {top:"12%",right:"10%"},
    {top:"16%",left:"10%"},
    {top:"48%",right:"8%"},
    {top:"66%",left:"12%"},
    {top:"78%",right:"18%"}
  ];

  document.querySelectorAll(".help-letter,.help-clue").forEach(e=>e.remove());

  const clue=document.createElement("div");
  clue.className="help-clue";
  clue.textContent="See the letters around you 👀";
  document.body.appendChild(clue);

  letters.forEach((letter,i)=>{
    setTimeout(()=>{
      const el=document.createElement("div");
      el.className="help-letter";
      el.textContent=letter;
      el.style.position="fixed";
      el.style.zIndex="100";
      el.style.fontSize="80px";
      el.style.fontWeight="900";
      el.style.color="white";
      el.style.textShadow="0 0 30px #ff4f9a";
      Object.assign(el.style,positions[i]);
      document.body.appendChild(el);

      setTimeout(()=>el.remove(),1800);
    },i*650);
  });

  setTimeout(()=>{
    $("questionMessage").textContent="Now look carefully and find the answer 👀❤️";
    $("questionMessage").style.color="#ffd0e5";
    clue.remove();
  },3600);
}

/* GIFT DATE */
function getUnlockDate(){
  const now=new Date();

  return new Date(
    now.getFullYear(),
    CONFIG.unlockMonth,
    CONFIG.unlockDay,
    CONFIG.unlockHour,
    CONFIG.unlockMinute,
    0
  );
}

function startCountdown(){
  updateCountdown();
  clearInterval(timer);
  timer=setInterval(updateCountdown,1000);
}

function updateCountdown(){
  if(isAdmin){
    $("countdown").textContent="ADMIN ACCESS — READY 🔓";
    $("giftLocked").classList.add("hidden");
    $("openGiftBtn").classList.remove("hidden");
    $("adminModeText").textContent="Admin can open the gift anytime.";
    return;
  }

  const now=new Date();
  const unlock=getUnlockDate();
  const diff=unlock-now;

  if(diff<=0){
    $("countdown").textContent="IT'S TIME! 🎉";
    $("giftLocked").classList.add("hidden");
    $("openGiftBtn").classList.remove("hidden");
    clearInterval(timer);
    return;
  }

  const seconds=Math.floor(diff/1000);
  const days=Math.floor(seconds/86400);
  const hours=Math.floor((seconds%86400)/3600);
  const mins=Math.floor((seconds%3600)/60);
  const secs=seconds%60;

  $("countdown").textContent=
    `${String(days).padStart(2,"0")} : ${String(hours).padStart(2,"0")} : ${String(mins).padStart(2,"0")} : ${String(secs).padStart(2,"0")}`;
}

/* Celebration audio generated in-browser */
let audioCtx=null;
let soundEnabled=true;

function getAudioContext(){
  if(!audioCtx){
    audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  }
  if(audioCtx.state==="suspended") audioCtx.resume();
  return audioCtx;
}

function tone(freq,duration,type="sine",volume=.08,delay=0){
  if(!soundEnabled) return;
  const ctx=getAudioContext();
  const osc=ctx.createOscillator();
  const gain=ctx.createGain();
  osc.type=type;
  osc.frequency.setValueAtTime(freq,ctx.currentTime+delay);
  gain.gain.setValueAtTime(.0001,ctx.currentTime+delay);
  gain.gain.exponentialRampToValueAtTime(volume,ctx.currentTime+delay+.015);
  gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+delay+duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime+delay);
  osc.stop(ctx.currentTime+delay+duration+.03);
}

function playGiftOpenSound(){
  if(!soundEnabled) return;
  tone(220,.10,"triangle",.10,0);
  tone(330,.10,"triangle",.10,.08);
  tone(440,.12,"triangle",.11,.16);
  tone(660,.16,"sine",.10,.27);
  tone(880,.20,"sine",.08,.40);
  tone(1320,.35,"sine",.06,.56);
}

function playCrackerSound(){
  if(!soundEnabled) return;
  const ctx=getAudioContext();
  const buffer=ctx.createBuffer(1,ctx.sampleRate*.14,ctx.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++){
    data[i]=(Math.random()*2-1)*(1-i/data.length);
  }
  const src=ctx.createBufferSource();
  const gain=ctx.createGain();
  gain.gain.value=.15;
  src.buffer=buffer;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

/* OPEN */
$("openGiftBtn").onclick=()=>{
  openBirthday();
};

function openBirthday(){
  getAudioContext();
  playGiftOpenSound();

  showPage("birthdayPage");

  const song=$("birthdaySong");
  song.volume=.75;
  song.play().catch(()=>{
    $("musicBtn").textContent="🔊 Sound ON";
  });

  launchGiftWrap();

  startFireworks();
  setTimeout(()=>{playCrackerSound();startFireworks();},450);
  setTimeout(()=>{playCrackerSound();startFireworks();},950);
  setTimeout(()=>{playCrackerSound();startFireworks();},1450);
  setTimeout(()=>{playCrackerSound();startFireworks();},2050);
  setTimeout(()=>{playCrackerSound();startFireworks();},2800);
  setTimeout(()=>startFireworks(),3700);
}

/* MUSIC */
$("musicBtn").onclick=()=>{
  const song=$("birthdaySong");
  soundEnabled=!soundEnabled;

  if(soundEnabled){
    getAudioContext();
    song.play().catch(()=>{});
    $("musicBtn").textContent="🔊 Sound ON";
  }else{
    song.pause();
    $("musicBtn").textContent="🔇 Sound OFF";
  }
};

/* GIFT WRAP */
function launchGiftWrap(){
  for(let i=0;i<180;i++){
    const p=document.createElement("div");
    p.className="piece";
    p.style.left="50%";
    p.style.top="50%";
    p.style.setProperty("--x",`${(Math.random()-.5)*110}vw`);
    p.style.background=[
      "#ff4f9a","#ffd66b","#8c6cff","#72e5ff","#fff"
    ][Math.floor(Math.random()*5)];
    p.style.transform=`rotate(${Math.random()*360}deg)`;
    p.style.animationDelay=`${Math.random()*.7}s`;

    document.body.appendChild(p);
    setTimeout(()=>p.remove(),2600);
  }

  for(let i=0;i<90;i++){
    const c=document.createElement("div");
    c.className="cracker";
    c.textContent=["✨","💥","⭐","🎉"][Math.floor(Math.random()*4)];
    c.style.left="50%";
    c.style.top="50%";
    c.style.setProperty("--dx",`${(Math.random()-.5)*90}vw`);
    c.style.setProperty("--dy",`${(Math.random()-.5)*75}vh`);
    c.style.animationDelay=`${Math.random()*.3}s`;

    document.body.appendChild(c);
    setTimeout(()=>c.remove(),1600);
  }
}

/* FIREWORKS */
function startFireworks(){
  const canvas=$("fireworks");
  const ctx=canvas.getContext("2d");

  canvas.width=innerWidth*devicePixelRatio;
  canvas.height=innerHeight*devicePixelRatio;

  ctx.scale(devicePixelRatio,devicePixelRatio);

  const w=innerWidth;
  const h=innerHeight;
  const particles=[];

  const x=Math.random()*w;
  const y=80+Math.random()*h*.45;

  for(let i=0;i<100;i++){
    const angle=Math.PI*2*i/100;
    const speed=2+Math.random()*5;

    particles.push({
      x,y,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      life:1,
      hue:Math.random()*360
    });
  }

  function frame(){
    ctx.fillStyle="rgba(0,0,0,.12)";
    ctx.fillRect(0,0,w,h);

    particles.forEach(p=>{
      p.x+=p.vx;
      p.y+=p.vy;
      p.vy+=.035;
      p.life-=.014;

      ctx.beginPath();
      ctx.arc(p.x,p.y,2.2,0,Math.PI*2);
      ctx.fillStyle=
        `hsla(${p.hue},100%,70%,${Math.max(p.life,0)})`;
      ctx.fill();
    });

    if(particles.some(p=>p.life>0)){
      requestAnimationFrame(frame);
    }
  }

  frame();
}
