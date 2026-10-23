const seedExercises=[
  {id:"leg-press",name:"Жим ногами",group:"Ноги · тренажёр",tip:"Поясница плотно прижата к спинке; колени следуют за носками.",video:""},
  {id:"chest-press",name:"Жим от груди",group:"Грудь · тренажёр",tip:"Сведи лопатки и не выводи плечи вперёд в верхней точке.",video:""},
  {id:"lat-pulldown",name:"Тяга верхнего блока",group:"Спина · блок",tip:"Тяни локтями вниз, корпус держи устойчиво, не запрокидывайся.",video:""},
  {id:"leg-curl",name:"Сгибание ног лёжа",group:"Бёдра · тренажёр",tip:"Не отрывай таз от подушки; движение плавное и подконтрольное.",video:""},
  {id:"shoulder-press",name:"Жим на плечи",group:"Плечи · тренажёр",tip:"Держи нейтральную спину и не выпрямляй локти до щелчка.",video:""}
];
const key="gymbro-data-v1";
const data=JSON.parse(localStorage.getItem(key)||"null")||{exercises:seedExercises,sets:[]};
const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem(key,JSON.stringify(data));
const today=new Date().toISOString().slice(0,10);
function dateLabel(date){return new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"short"}).format(new Date(date+"T12:00:00"))}
function esc(text){return String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function getSets(id){return data.sets.filter(s=>s.exerciseId===id).sort((a,b)=>b.date.localeCompare(a.date)||b.created-a.created)}
function summary(){
 const todaySets=data.sets.filter(s=>s.date===today); const volume=todaySets.reduce((n,s)=>n+s.weight*s.reps,0);
 $("#summary").innerHTML=`<div class="stat"><b>${todaySets.length}</b><small>подходов сегодня</small></div><div class="stat"><b>${volume.toLocaleString("ru-RU")}</b><small>кг объёма</small></div><div class="stat"><b>${data.exercises.length}</b><small>упражнений</small></div>`;
}
function renderToday(){
 const html=data.exercises.map(e=>{const sets=getSets(e.id).filter(s=>s.date===today);
 return `<article class="exercise-card"><div class="exercise-top"><div><h3>${esc(e.name)}</h3><p>${esc(e.group)}</p></div><span class="pill">${sets.length?sets.length+" подх.":"ещё нет"}</span></div><div class="set-list">${sets.length?sets.map((s,i)=>`<span class="set">${i+1}: <b>${s.weight} кг × ${s.reps}</b></span>`).join(""):'<span class="set">Добавь первый подход</span>'}</div><button class="secondary add-set" data-id="${e.id}">+ Записать подход</button></article>`}).join("");
 $("#today").innerHTML=`<div class="section-title"><div><p class="eyebrow">СЕГОДНЯ · ${dateLabel(today)}</p><h2>Текущая тренировка</h2></div><button class="secondary" id="addExercise">+ Упражнение</button></div>${html}`;
 document.querySelectorAll(".add-set").forEach(b=>b.onclick=()=>openSet(b.dataset.id)); $("#addExercise").onclick=()=>$("#exerciseDialog").showModal();
}
function chart(points){
 if(!points.length)return '<div class="empty">Пока нет записей для графика.</div>';
 const max=Math.max(...points.map(p=>p.weight),1),min=Math.min(...points.map(p=>p.weight),0),range=Math.max(max-min,1);
 const coords=points.map((p,i)=>({x:points.length===1?50:i/(points.length-1)*100,y:112-(p.weight-min)/range*90}));
 const line=coords.map(p=>p.x+","+p.y).join(" ");
 return `<div class="chart"><svg viewBox="0 0 100 130" preserveAspectRatio="none"><line class="axis" x1="0" y1="112" x2="100" y2="112"/><polyline class="line" points="${line}"/>${coords.map((p,i)=>`<circle class="dot" cx="${p.x}" cy="${p.y}" r="3"/><text x="${p.x}" y="127" text-anchor="middle" fill="#9ba7ae" font-size="7">${dateLabel(points[i].date)}</text>`).join("")}</svg></div>`;
}
function renderProgress(){
 const cards=data.exercises.map(e=>{const sets=getSets(e.id).slice(0,12).reverse();const best=sets.length?Math.max(...sets.map(s=>s.weight)):0;
 return `<article class="progress-card"><header><div><h3>${esc(e.name)}</h3><p>${sets.length?"Лучший вес: "+best+" кг":"Запиши подход, чтобы увидеть динамику"}</p></div><span class="pill">${sets.length} записей</span></header>${chart(sets)}</article>`}).join("");
 $("#progress").innerHTML=`<div class="section-title"><div><p class="eyebrow">ТВОЯ ДИНАМИКА</p><h2>Прогресс по весу</h2></div></div>${cards}`;
}
function youtube(url){const match=url.match(/(?:youtu.be\/|v=|embed\/)([\w-]{11})/);return match?`<iframe class="video" loading="lazy" src="https://www.youtube-nocookie.com/embed/${match[1]}" title="Видео техники" allowfullscreen></iframe>`:""}
function renderLibrary(){
 $("#library").innerHTML=`<div class="section-title"><div><p class="eyebrow">ТРЕНИРУЙСЯ ОСОЗНАННО</p><h2>Техника</h2></div></div>${data.exercises.map(e=>`<article class="library-card"><h3>${esc(e.name)}</h3><p>${esc(e.group)}</p><div class="tip">${esc(e.tip||"Добавь подсказку по технике для этого упражнения.")}</div>${e.video?youtube(e.video):'<p class="empty">Для этого упражнения можно добавить видеоссылку при создании упражнения.</p>'}</article>`).join("")}`;
}
function render(){summary();renderToday();renderProgress();renderLibrary()}
function openSet(id){const e=data.exercises.find(x=>x.id===id);$("#exerciseId").value=id;$("#dialogTitle").textContent=e.name;$("#weight").value="";$("#reps").value="";$("#note").value="";$("#workoutDialog").showModal();$("#weight").focus()}
$("#setForm").addEventListener("submit",event=>{event.preventDefault();data.sets.push({exerciseId:$("#exerciseId").value,weight:Number($("#weight").value),reps:Number($("#reps").value),note:$("#note").value.trim(),date:today,created:Date.now()});save();$("#workoutDialog").close();render()});
$("#exerciseForm").addEventListener("submit",event=>{event.preventDefault();const name=$("#newName").value.trim();data.exercises.push({id:"custom-"+Date.now(),name,group:$("#newGroup").value.trim(),tip:"Выбери комфортный вес и контролируй движение без рывков.",video:$("#newVideo").value.trim()});save();$("#exerciseDialog").close();event.target.reset();render()});
document.querySelectorAll(".tab").forEach(tab=>tab.onclick=()=>{document.querySelectorAll(".tab,.view").forEach(x=>x.classList.remove("active"));tab.classList.add("active");$("#"+tab.dataset.view).classList.add("active")});
let deferred;window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();deferred=event;$("#installBtn").hidden=false});$("#installBtn").onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;$("#installBtn").hidden=true}};
if("serviceWorker" in navigator)navigator.serviceWorker.register("./service-worker.js");render();