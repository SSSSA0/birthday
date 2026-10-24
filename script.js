/* ===== EDIT YOUR CONTENT HERE (the only place personal text lives) ===== */
const SENDER = "Your Future Husband, Boda ❤️";
const CONFIG = {
  recipientName: "My Favorite Person, Camilla",
  senderName: SENDER,
  openingTitle: "A little something special for you...",
  openingSubtitle: "Made with love, just for you.",
  openLabel: "Open Your Letter ♡",
  letterHeading: "To Someone Very Special ♡",
  letterText: [
    "Happy Birthday, my favorite person. ♡",
    "I hope today brings you as much happiness as you bring into the lives of the people around you.",
    "There are so many little things about you that make you special, and sometimes I wish words were enough to explain them all.",
    "I hope this new chapter of your life is filled with beautiful memories, peaceful days, unexpected happiness, and all the things your heart has been wishing for.",
    "No matter how busy life gets, I hope you always remember that you deserve kindness, happiness, and a thousand reasons to smile.",
    "Today is your day, and I hope it feels just as wonderful as you are.",
    "Happy Birthday, once again.",
    "With all my love,",
    SENDER
  ].join("\n\n"),
  closingTitle: "And one last thing...",
  wishLabel: "A Little Birthday Wish ♡",
  closingMessage: "I hope this year gives you countless reasons to smile, beautiful memories to look back on, and happiness that stays long after today. You deserve so much good in this world. ♡",
  songTitle: "Just the Way You Are – Bruno Mars",
  songSrc: "assets/just-the-way-you-are.mp3"
};
/* ======================================================================= */

const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll("[data-k]").forEach(el => el.textContent = CONFIG[el.dataset.k]);
$("for").textContent = "For " + CONFIG.recipientName;
$("hRest").textContent = CONFIG.letterHeading;
$("heading").setAttribute("aria-label", CONFIG.letterHeading);
document.title = "A Letter Just for You";

/* Decorations: CSS-driven, small counts */
(function(){
  const d = $("decor"), r = (a,b) => a + Math.random()*(b-a);
  const add = (cls, html, css) => { const e = document.createElement("span"); e.className = "d " + cls; if(html) e.textContent = html; e.style.cssText = css; d.appendChild(e); return e; };
  for(let i=0;i<12;i++) add("up","♥",`left:${r(2,96)}%;font-size:${r(10,22)}px;--o:${r(.25,.6)};--dx:${r(-40,40)}px;animation-duration:${r(16,28)}s;animation-delay:-${r(0,26)}s`);
  for(let i=0;i<10;i++) add("down petal","",`left:${r(2,96)}%;--dx:${r(-90,90)}px;--r:${r(200,520)}deg;animation-duration:${r(14,24)}s;animation-delay:-${r(0,24)}s;transform:scale(${r(.7,1.2)})`);
  for(let i=0;i<14;i++) add("sp","",`left:${r(0,100)}%;top:${r(0,100)}%;animation-duration:${r(3,7)}s;animation-delay:-${r(0,6)}s`);
  for(let i=0;i<4;i++) add("across petal","",`top:${r(8,60)}%;--dy:${r(-12,14)}vh;animation-duration:${r(34,52)}s;animation-delay:-${r(0,40)}s`);
  document.addEventListener("visibilitychange", () => d.classList.toggle("paused", document.hidden));
})();

/* Burst of hearts and petals */
function burst(x, y, n, up, mode){
  if(reduce) return;
  for(let i=0;i<n;i++){
    const e = document.createElement("span"), a = Math.random()*Math.PI*2, dist = 70 + Math.random()*150, petal = mode === "petal" ? 1 : mode === "heart" ? 0 : i%2;
    if(mode === "spark"){ e.className = "burst spark"; }
    else if(petal){ e.className = "burst petal"; } else { e.className = "burst"; e.textContent = "♥"; e.style.fontSize = (12 + Math.random()*14) + "px"; }
    e.style.left = x + "px"; e.style.top = y + "px";
    e.style.setProperty("--dx", Math.cos(a)*dist + "px");
    e.style.setProperty("--dy", (up ? -60 - Math.random()*220 : Math.sin(a)*dist - 40) + "px");
    e.style.setProperty("--r", (Math.random()*360 - 180) + "deg");
    e.addEventListener("animationend", () => e.remove());
    document.body.appendChild(e);
  }
}

/* Envelope opening (state guard prevents repeat clicks) */
let state = "idle";
function openEnvelope(){
  if(state !== "idle") return;
  state = "opening";
  $("openBtn").disabled = true;
  $("envWrap").classList.add("open");
  document.body.classList.add("lit");
  const k = reduce ? 0 : 1, rc = $("envWrap").getBoundingClientRect();
  setTimeout(() => burst(rc.left + rc.width/2, rc.top + rc.height/2, 14, true), 900*k);
  setTimeout(() => {
    $("stage").classList.add("leave");
    $("read").classList.add("show");
    window.scrollTo(0, 0);
    $("heading").focus({preventScroll:true});
    setTimeout(() => { burst(innerWidth/2, innerHeight*.35, 16, false, "spark"); glow(); }, 300*k);
    setTimeout(() => { $("stage").hidden = true; state = "open"; startTyping(); }, 900*k);
  }, 2300*k);
}
$("openBtn").addEventListener("click", openEnvelope);
$("envWrap").addEventListener("click", openEnvelope);

/* Typewriter */
let timer = null, typingDone = false;
function startTyping(){
  const text = CONFIG.letterText, typed = $("typed"), rest = $("rest"), cur = $("cursor");
  const head = CONFIG.letterHeading, hT = $("hTyped"), hR = $("hRest"), hC = $("hCursor"), hrts = document.querySelector(".heart-div");
  let h = 0;
  cur.classList.add("done");
  $("full").textContent = text;
  let i = 0;
  rest.textContent = text;
  const render = () => { typed.textContent = text.slice(0, i); rest.textContent = text.slice(i); };
  function finish(){
    if(typingDone) return;
    typingDone = true; clearTimeout(timer); i = text.length; render();
    cur.classList.add("done"); $("skip").hidden = true;
    hT.textContent = head; hR.textContent = ""; hC.classList.add("done"); hrts.classList.add("on");
    setTimeout(() => {
      $("closing").classList.add("show");
      const c = $("closing").getBoundingClientRect();
      burst(innerWidth/2, Math.min(Math.max(c.top, 120), innerHeight - 120), 14, true, "heart");
      glow();
    }, reduce ? 0 : 500);
  }
  function tick(){
    if(typingDone) return;
    i++; render();
    if(i >= text.length) return finish();
    const ch = text[i-1];
    if(i % 25 === 0 && cur.getBoundingClientRect().bottom > innerHeight*.8) cur.scrollIntoView({block:"center", behavior:"smooth"});
    const delay = ch === "\n" ? 10000 : /[.!?♡]/.test(ch) ? 10000 : /[,;]/.test(ch) ? 10000 : 1000 + Math.random()*1000;
    timer = setTimeout(tick, delay);
  }
  $("skip").onclick = finish;
  function typeHead(){
    if(typingDone) return;
    h++; hT.textContent = head.slice(0, h); hR.textContent = head.slice(h);
    if(h >= head.length){
      hC.classList.add("done"); hrts.classList.add("on");
      timer = setTimeout(() => { if(typingDone) return; cur.classList.remove("done"); tick(); }, 4000);
      return;
    }
    timer = setTimeout(typeHead, 4000 + Math.random()*4000);
  }
  if(reduce) finish(); else timer = setTimeout(typeHead, 5000);
  addEventListener("pagehide", () => clearTimeout(timer));
}

/* Interactive letter and hearts */
const paper = document.querySelector(".paper");
function glow(){
  if(reduce) return;
  const base = "0 2px 4px rgba(101,76,73,.12),0 24px 60px rgba(143,74,91,.22)";
  paper.animate([{boxShadow:base},{boxShadow:"0 0 0 6px rgba(246,221,227,.7),0 0 60px 18px rgba(255,214,160,.55)",offset:.35},{boxShadow:base}],{duration:1800,easing:"ease-in-out"});
}
let tapping = false;
paper.addEventListener("click", e => {
  if(e.target.closest("button") || String(getSelection())) return;
  burst(e.clientX, e.clientY, 9, true);
  if(reduce || tapping) return;
  tapping = true;
  const a = paper.animate([{transform:"translateY(0) rotate(0)"},{transform:"translateY(-8px) rotate(-.5deg)",offset:.4},{transform:"translateY(-3px) rotate(.3deg)",offset:.7},{transform:"translateY(0) rotate(0)"}],{duration:1100,easing:"ease-in-out",composite:"add"});
  glow();
  a.onfinish = a.oncancel = () => { tapping = false; };
});
document.querySelectorAll(".hrt").forEach(b => b.addEventListener("click", e => {
  e.stopPropagation();
  const r = b.getBoundingClientRect();
  burst(r.left + r.width/2, r.top + r.height/2, 7, true, "heart");
  if(!reduce) b.animate([{transform:"scale(1)"},{transform:"scale(1.7)",offset:.4},{transform:"scale(1)"}],{duration:450,easing:"ease-out"});
}));

/* Closing wish */
$("wishBtn").addEventListener("click", e => {
  const b = e.currentTarget, rc = b.getBoundingClientRect();
  burst(rc.left + rc.width/2, rc.top + rc.height/2, 22, false);
  $("final").classList.add("show");
  b.disabled = true;
  setTimeout(() => $("final").scrollIntoView({block:"center", behavior: reduce ? "auto" : "smooth"}), 150);
});

/* Music: plays only on request; the file is requested lazily so a missing file never breaks the page */
const audio = new Audio(); audio.preload = "none"; audio.volume = .5;
let srcSet = false, toastT;
function say(msg){ const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 4000); }
function sync(on){ $("player").classList.toggle("playing", on); $("playBtn").setAttribute("aria-pressed", on); $("playBtn").setAttribute("aria-label", on ? "Pause music" : "Play music"); $("ic").textContent = on ? "❚❚" : "▶"; }
function fail(){ srcSet = false; sync(false); say("The song couldn’t be played right now, but your letter is still here ♡"); }
audio.addEventListener("play", () => sync(true));
audio.addEventListener("pause", () => sync(false));
audio.addEventListener("ended", () => sync(false));
audio.addEventListener("error", fail);
$("playBtn").addEventListener("click", () => {
  if(!srcSet){ audio.src = CONFIG.songSrc; srcSet = true; }
  if(audio.paused){ const p = audio.play(); if(p) p.catch(fail); } else audio.pause();
});
