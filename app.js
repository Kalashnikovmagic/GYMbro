const catalog=[
["lower-row","Тяга снизу","Спина",[50,60]],["lat-pulldown","Тяга сверху","Спина",[50,60]],["wide-pullups","Подтягивания широким хватом","Спина",[21.88,18.75,15.63,12.5,9.38],"Доп. отметка: 47 → 40"],["back-row","Back Press (ROW)","Спина",[58.5,67.5,76.5]],
["incline-dumbbell","Жим гантелей на наклонной скамье","Грудь",[16,18,20,22,24]],["hammer-press","Жим в хаммере","Грудь",[30,35],"Вес указан для каждой стороны (×2)"],["chest-press","Chest Press","Грудь",[58.5,67.5,76.5]],["assisted-dips","Брусья в тренажёре","Грудь",[40.5,49.5,58.5,67.5]],["smith-bench","Жим штанги в Смите","Грудь",[45]],["machine-chest-press","Жим от груди в тренажёре","Грудь",[50,57.5]],["horizontal-chest","Горизонтальный жим от груди","Грудь",[35,40],"Вес указан для каждой стороны (×2)"],
["seated-dumbbell-press","Жим гантелей сидя","Плечи",[16,18]],["side-raise-support","Подъём гантели через сторону","Плечи",[8],"С опорой"],["machine-shoulder-press","Жим вверх в тренажёре","Плечи",[35]],["lateral-raise","Жим в стороны (Lateral Raise)","Плечи",[22.5,31.5,40.5,49.5]],["overhead-press","Overhead Press","Плечи",[40.5,49.5]],["cross-cable","Перекрёстная тяга в кроссовере","Плечи",[2.3,3.75]],["shoulder-press-new","Жим от плеч (NEW)","Плечи",[32,36,41,45]],["rear-delt","Дельта-машина","Плечи",[36,41]],
["hammer-curl","Молоты","Бицепс",[12,14]],["barbell-curl","Подъём штанги стоя","Бицепс",[20,25]],["preacher-curl","Скотт в тренажёре","Бицепс",[31.5,40.5]],["biceps-machine","Бицепс-машина (NEW)","Бицепс",[27,32,36,41]],
["triceps-pushdown","Разгибание с блоком стоя","Трицепс",[15,17.5,18.75,21.25,23.75]],["overhead-triceps","Разгибание с блоком из-за спины","Трицепс",[16.25,18.75]],
["leg-press","Жим ногами","Ноги",[150]],["leg-curl","Сгибание ног","Ноги",[57,70]],["leg-extension","Разгибание ног","Ноги",[57,70]],["hack-squat","Hack Squat","Ноги",[50]],["calf-raise","Икры (голень стоя)","Ноги",[65]]
];
const tips={Спина:"Сохраняй нейтральную спину и начинай тягу движением лопаток.",Грудь:"Лопатки собраны, плечи не уходят вперёд в верхней точке.",Плечи:"Держи корпус устойчиво и контролируй вес без рывков.",Бицепс:"Зафиксируй локти и не раскачивай корпус.",Трицепс:"Локти держи стабильно; разгибай руку плавно.",Ноги:"Колени направляй по линии носков, работай в комфортной амплитуде."};
const autoVideoUrls=new Set([
  "https://www.youtube.com/watch?v=KbINn6CNBfw","https://www.youtube.com/watch?v=uuCuDD73W20",
  "https://www.youtube.com/watch?v=GjVvFGSc-JM","https://www.youtube.com/watch?v=ZixeFw_iHVY",
  "https://www.youtube.com/watch?v=egmmkPdXV0g","https://www.youtube.com/watch?v=mjobtgEbAc4",
  "https://www.youtube.com/watch?v=Gkk-6q7Rq-s","https://www.youtube.com/watch?v=C64pUMkv0jQ",
  "https://www.youtube.com/watch?v=dnJ1vNlhzHY","https://www.youtube.com/watch?v=i14hrj7l7CI",
  "https://www.youtube.com/watch?v=BXXaYSW2Ozw","https://www.youtube.com/watch?v=LXEjArwexT4"
]);
const initialExercises=catalog.map(([id,name,group])=>({id,name,group,tip:tips[group],video:""}));
const key="gymbro-data-v1", stored=JSON.parse(localStorage.getItem(key)||"null");
const stageDate=n=>new Date(Date.now()-n*86400000).toISOString().slice(0,10);
const imported=catalog.flatMap(([id,,,[...weights],note])=>weights.map((weight,i)=>({exerciseId:id,weight,reps:null,note:note||"Импортированный результат",date:stageDate(weights.length-i),created:Date.now()-(weights.length-i)*86400000,imported:true})));
const data=stored||{exercises:initialExercises,sets:[],importVersion:0};
if((data.importVersion||0)<1){const ids=new Set(data.exercises.map(e=>e.id));data.exercises.push(...initialExercises.filter(e=>!ids.has(e.id)));data.sets.push(...imported);data.importVersion=1;localStorage.setItem(key,JSON.stringify(data))}
if(!data.removedAutoVideosV1){data.exercises.forEach(exercise=>{if(autoVideoUrls.has(exercise.video))exercise.video=""});data.removedAutoVideosV1=true;localStorage.setItem(key,JSON.stringify(data))}
let recordIdsChanged=false;data.sets.forEach((entry,index)=>{if(!entry.id){entry.id="record-"+(entry.created||Date.now())+"-"+index;recordIdsChanged=true}});if(recordIdsChanged)localStorage.setItem(key,JSON.stringify(data));
const $=s=>document.querySelector(s),save=()=>localStorage.setItem(key,JSON.stringify(data)),today=new Date().toISOString().slice(0,10);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dateLabel=d=>new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"short"}).format(new Date(d+"T12:00:00"));
const getSets=id=>data.sets.filter(s=>s.exerciseId===id).sort((a,b)=>b.date.localeCompare(a.date)||b.created-a.created);
function summary(){const sets=data.sets.filter(s=>s.date===today&&!s.imported),volume=sets.reduce((n,s)=>n+s.weight*s.reps,0);$("#summary").innerHTML=`<div class="stat"><b>${sets.length}</b><small>подходов сегодня</small></div><div class="stat"><b>${volume.toLocaleString("ru-RU")}</b><small>кг объёма</small></div><div class="stat"><b>${data.exercises.length}</b><small>упражнений</small></div>`}
function card(e){const sets=getSets(e.id).filter(s=>s.date===today&&!s.imported);return `<article class="exercise-card"><div class="exercise-top"><div><h3>${esc(e.name)}</h3><p>${esc(e.group)}</p></div><span class="pill">${sets.length?sets.length+" подх.":"ещё нет"}</span></div><div class="set-list">${sets.length?sets.map((s,i)=>`<span class="set">${i+1}: <b>${s.weight} кг × ${s.reps}</b></span>`).join(""):'<span class="set">Добавь первый подход</span>'}</div><button class="secondary add-set" data-id="${e.id}">+ Записать подход</button></article>`}
function renderToday(){const groups=[...new Set(data.exercises.map(e=>e.group))];$("#today").innerHTML=`<div class="section-title"><div><p class="eyebrow">СЕГОДНЯ · ${dateLabel(today)}</p><h2>Текущая тренировка</h2></div><button class="secondary" id="addExercise">+ Упражнение</button></div>${groups.map(g=>`<section><div class="section-title"><h2>${esc(g)}</h2></div>${data.exercises.filter(e=>e.group===g).map(card).join("")}</section>`).join("")}`;document.querySelectorAll(".add-set").forEach(b=>b.onclick=()=>openSet(b.dataset.id));$("#addExercise").onclick=()=>$("#exerciseDialog").showModal()}
function chart(points,exerciseId){
  if(!points.length)return '<div class="empty">Пока нет записей для графика.</div>';
  const max=Math.max(...points.map(p=>p.weight),1),min=Math.min(...points.map(p=>p.weight),0),range=Math.max(max-min,1);
  const coords=points.map((point,index)=>({x:18+index*29,y:43-(point.weight-min)/range*28}));
  const line=coords.map(point=>point.x+","+point.y).join(" ");
  return '<div class="chart"><svg viewBox="0 0 300 60" aria-label="Динамика веса"><polyline class="line" points="'+line+'"/>'+
    coords.map((point,index)=>'<circle class="dot chart-dot" data-record="'+points[index].id+'" data-exercise="'+exerciseId+'" cx="'+point.x+'" cy="'+point.y+'" r="5"/>').join("")+
    '</svg><p class="chart-value" id="chart-value-'+exerciseId+'">Нажмите на точку, чтобы увидеть вес</p></div>';
}
function recordChips(points){
  return '<div class="record-list">'+points.map(function(point,index){
    const label=point.imported?"этап "+(index+1):dateLabel(point.date);
    return '<button class="record-chip edit-record" data-id="'+point.id+'">'+label+' · '+point.weight+' кг <span>✎</span></button>';
  }).join("")+'</div>';
}
function renderProgress(){
  $("#progress").innerHTML='<div class="section-title"><div><p class="eyebrow">ИМПОРТИРОВАННАЯ ИСТОРИЯ + НОВЫЕ РЕЗУЛЬТАТЫ</p><h2>Прогресс по весу</h2></div></div>'+
  data.exercises.map(function(exercise){
    const points=getSets(exercise.id).slice(0,12).reverse(),best=points.length?Math.max(...points.map(function(item){return item.weight})):0;
    return '<article class="progress-card"><header><div><h3>'+esc(exercise.name)+'</h3><p>'+ (points.length?'Лучший вес: '+best+' кг':'Добавьте первый вес')+'</p></div><div class="card-actions"><span class="pill">'+points.length+' записей</span><button class="secondary add-record" data-id="'+exercise.id+'">+ Вес</button></div></header>'+chart(points,exercise.id)+recordChips(points)+'</article>';
  }).join("");
  document.querySelectorAll(".add-record").forEach(function(button){button.onclick=function(){openRecord(button.dataset.id)}});
  document.querySelectorAll(".chart-dot").forEach(dot=>dot.onclick=()=>{const point=data.sets.find(item=>item.id===dot.dataset.record);if(!point)return;const info=point.imported?"История":dateLabel(point.date);const reps=point.reps?" × "+point.reps:"";$("#chart-value-"+dot.dataset.exercise).textContent=info+": "+point.weight+" кг"+reps});
document.querySelectorAll(".edit-record").forEach(function(button){button.onclick=function(){openRecord(null,button.dataset.id)}});
}
function openRecord(exerciseId,recordId){
  const record=recordId?data.sets.find(function(item){return item.id===recordId}):null;
  const exercise=record?data.exercises.find(function(item){return item.id===record.exerciseId}):data.exercises.find(function(item){return item.id===exerciseId});
  $("#recordId").value=record?record.id:"";$("#deleteRecord").hidden=!record;$("#recordExerciseId").value=exercise.id;$("#recordTitle").textContent=record?"Редактировать результат":exercise.name;
  $("#recordWeight").value=record?record.weight:"";$("#recordDate").value=record?record.date:today;$("#recordReps").value=record&&record.reps?record.reps:"";$("#recordNote").value=record?record.note||"":"";$("#recordDialog").showModal();$("#recordWeight").focus();
}

const videoEmbed=url=>{const youtube=url.match(/(?:youtu.be\/|v=|embed\/|shorts\/)([\w-]{11})/);if(youtube)return `<iframe class="video" loading="lazy" src="https://www.youtube-nocookie.com/embed/${youtube[1]}" title="Видео техники с YouTube" allowfullscreen></iframe>`;const reel=url.match(/instagram\.com\/(?:reel|reels)\/([^/?#]+)/i);if(reel)return `<iframe class="video reel" loading="lazy" src="https://www.instagram.com/reel/${reel[1]}/embed/" title="Видео техники из Instagram" allowfullscreen></iframe>`;return '<p class="empty">Поддерживаются ссылки YouTube, Shorts и Instagram Reels.</p>'};
function renderLibrary(){
  $("#library").innerHTML='<div class="section-title"><div><p class="eyebrow">ТЕХНИКА И ВИДЕО</p><h2>Выполняй уверенно</h2></div></div>'+
  data.exercises.map(function(e){
    const video=e.video?videoEmbed(e.video):'<p class="empty">Видеоссылка пока не добавлена.</p>';
    return '<article class="library-card"><div class="exercise-top"><div><h3>'+esc(e.name)+'</h3><p>'+esc(e.group)+'</p></div><button class="secondary video-link" data-id="'+e.id+'">'+(e.video?'Изменить видео':'＋ Видео')+'</button></div><div class="tip">'+esc(e.tip||"Добавь подсказку по технике.")+'</div>'+video+'</article>';
  }).join("");
  document.querySelectorAll(".video-link").forEach(function(button){button.onclick=function(){openVideo(button.dataset.id)}});
}
function openVideo(id){const exercise=data.exercises.find(function(item){return item.id===id});$("#videoExerciseId").value=id;$("#videoTitle").textContent=exercise.name;$("#videoUrl").value=exercise.video||"";$("#videoDialog").showModal();$("#videoUrl").focus()}
function render(){renderProgress();renderLibrary()}function openSet(id){const e=data.exercises.find(x=>x.id===id);$("#exerciseId").value=id;$("#dialogTitle").textContent=e.name;$("#weight").value="";$("#reps").value="";$("#note").value="";$("#workoutDialog").showModal();$("#weight").focus()}
$("#recordForm").addEventListener("submit",event=>{event.preventDefault();const id=$("#recordId").value;const payload={exerciseId:$("#recordExerciseId").value,weight:Number($("#recordWeight").value),reps:$("#recordReps").value?Number($("#recordReps").value):null,note:$("#recordNote").value.trim(),date:$("#recordDate").value,created:Date.now(),imported:false};if(id){const old=data.sets.find(item=>item.id===id);Object.assign(old,payload,{id:old.id,created:old.created,imported:old.imported})}else{payload.id="record-"+Date.now();data.sets.push(payload)}save();$("#recordDialog").close();render()});
$("#deleteRecord").addEventListener("click",()=>{const id=$("#recordId").value;if(id&&window.confirm("Удалить этот результат?")){data.sets=data.sets.filter(item=>item.id!==id);save();$("#recordDialog").close();render()}});
$("#videoForm").addEventListener("submit",event=>{event.preventDefault();const exercise=data.exercises.find(item=>item.id===$("#videoExerciseId").value);exercise.video=$("#videoUrl").value.trim();save();$("#videoDialog").close();render()});
document.querySelectorAll(".close").forEach(button=>button.onclick=()=>button.closest("dialog").close());document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab,.view").forEach(x=>x.classList.remove("active"));t.classList.add("active");$("#"+t.dataset.view).classList.add("active")});let deferred;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;$("#installBtn").hidden=false});$("#installBtn").onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;$("#installBtn").hidden=true}};if("serviceWorker"in navigator)navigator.serviceWorker.register("./service-worker.js");render();