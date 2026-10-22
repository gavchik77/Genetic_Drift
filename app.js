'use strict';
// Independent classroom implementation of a diploid neutral-drift model.
const $=id=>document.getElementById(id);
const ALLELES=['Y','B','R'];
const PALETTE={YY:'#e8c73d',BB:'#3674c4',RR:'#d95551',YB:'#58a878',BY:'#58a878',YR:'#ee9654',RY:'#ee9654',BR:'#9667b7',RB:'#9667b7'};
const LINE=['#c3a018','#3674c4','#d95551'];
const LIMIT=2000;
let pop=[[],[],[]], generation=0, histories=[[],[],[]], timer=null, trials=[];
let rng=Math.random;let foundingEvent=0, lastRecordedEvent=-1, foundingSnapshot=null;const OBSERVATION_GENERATIONS=100;
const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
const num=(id,lo=1,hi=1000)=>{const val=Number($(id).value);return Number.isFinite(val)?clamp(Math.trunc(val),lo,hi):lo};
const randomInt=n=>Math.floor(rng()*n);
const genotypes=['YY','BB','RR','YB','YR','BR'];
function initialPop(n){return Array.from({length:n},()=>{let a=ALLELES[randomInt(3)],b=ALLELES[randomInt(3)];return a+b})}
function countAlleles(individuals){const counts=[0,0,0];for(const ind of individuals){for(const allele of ind){const index=ALLELES.indexOf(allele);if(index>=0) counts[index]++}}const total=counts.reduce((a,b)=>a+b,0);return total?counts.map(c=>c/total):[0,0,0]}
function richness(individuals){return countAlleles(individuals).filter(p=>p>0).length}
function sampleWithoutReplacement(source,n){const arr=source.slice();for(let i=0;i<n;i++){let j=i+randomInt(arr.length-i);[arr[i],arr[j]]=[arr[j],arr[i]];}return arr.slice(0,n)}
function reproduce(source,K){if(!source.length)return []; if(source.length===1)return Array(K).fill(source[0]);return Array.from({length:K},()=>{const m=source[randomInt(source.length)],f=source[randomInt(source.length)];return m[randomInt(2)]+f[randomInt(2)]})}
// Each generation uses random mating, Mendelian segregation, and constant K.
function tick(quiet=false){generation++; const keys=['mainK','isle1K','isle2K'];pop=pop.map((p,i)=>p.length?reproduce(p,num(keys[i])):[]);record();if(!quiet)draw();if($('fixation').checked&&pop[0].length&&countAlleles(pop[0]).some(x=>x===1)){stop();setStatus('Mainland allele fixation reached at generation '+generation+'.')}}
function record(){for(let i=0;i<3;i++)histories[i].push({g:generation,n:pop[i].length,p:countAlleles(pop[i])});}
function setStatus(s){$('status').textContent=s}
function stop(){if(timer!==null){clearInterval(timer);timer=null}$('go').textContent='▶ Start'}
function setup(){stop();foundingSnapshot=null;generation=0;pop=[initialPop(num('mainK')),[],[]];histories=[[],[],[]];record();draw();setStatus('Reset complete: mainland founded; islands are empty.')}
function colonize(destination,source,countId){const n=num(countId);if(pop[source].length<n){setStatus('Not enough individuals in source population to found Island '+destination+'.');return}pop[destination]=sampleWithoutReplacement(pop[source],n);if(destination===1){foundingEvent++;foundingSnapshot={event:foundingEvent,founders:n,m:countAlleles(pop[0]).slice(),p:countAlleles(pop[1]).slice(),generation};}histories[destination]=[{g:generation,n:pop[destination].length,p:countAlleles(pop[destination])}];draw();setStatus('Island '+destination+' founded with '+n+' individuals. The founders are copied; source population is unchanged.')}
function bottleneck(){const n=num('bottle');if(!pop[0].length){setStatus('Mainland is empty.');return}if(n>pop[0].length){setStatus('Bottleneck size exceeds mainland population size.');return}pop[0]=sampleWithoutReplacement(pop[0],n);record();draw();setStatus('Bottleneck: '+n+' mainland individuals survived by chance.')}
function clearIsland(i){if(i===1)foundingSnapshot=null;pop[i]=[];histories[i]=[];draw();setStatus('Island '+i+' cleared.')}
function drawDots(i){const c=$('world'+i),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);let a=pop[i],n=a.length;if(!n){ctx.fillStyle='#78909b';ctx.font='19px system-ui';ctx.textAlign='center';ctx.fillText('Uninhabited',c.width/2,c.height/2);return}const cols=Math.ceil(Math.sqrt(n*c.width/c.height)),rows=Math.ceil(n/cols);const dx=c.width/(cols+1),dy=c.height/(rows+1),r=clamp(Math.min(dx,dy)*.34,2,8);for(let j=0;j<n;j++){const x=(j%cols+1)*dx,y=(Math.floor(j/cols)+1)*dy;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=PALETTE[a[j]]||'#888';ctx.fill()}}
function showStats(i){const p=countAlleles(pop[i]),n=pop[i].length;const hetero=n?pop[i].filter(x=>x[0]!==x[1]).length/n:0;const richnessText=n?richness(pop[i])+'/3':'—';$('stats'+i).innerHTML='<div class="statrow"><span>Individuals</span><strong>'+n+'</strong></div>'+ALLELES.map((a,j)=>'<div class="statrow"><span><span class="swatch" style="background:'+LINE[j]+'"></span>'+a+' allele</span><strong>'+(n?p[j].toFixed(3):'—')+'</strong></div>').join('')+'<div class="statrow"><span>Alleles retained</span><strong>'+richnessText+'</strong></div><div class="statrow"><span>Observed heterozygotes</span><strong>'+(n?hetero.toFixed(3):'—')+'</strong></div>'}
function drawChart(){const c=$('chart'),ctx=c.getContext('2d'),w=c.width,h=c.height,L=65,R=26,T=22,B=50;ctx.clearRect(0,0,w,h);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);const i=Number($('graphPop').value),data=histories[i];const xmin=data.length?data[0].g:0,xmax=Math.max(xmin+1,data.length?data[data.length-1].g:1);ctx.font='13px system-ui';ctx.textAlign='right';for(let j=0;j<=4;j++){let p=j/4,y=T+(1-p)*(h-T-B);ctx.beginPath();ctx.moveTo(L,y);ctx.lineTo(w-R,y);ctx.strokeStyle='#e5eef2';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='#58737d';ctx.fillText(p.toFixed(2),L-12,y+4)}ctx.strokeStyle='#637985';ctx.beginPath();ctx.moveTo(L,T);ctx.lineTo(L,h-B);ctx.lineTo(w-R,h-B);ctx.stroke();ctx.textAlign='center';ctx.fillStyle='#58737d';for(let j=0;j<=5;j++){let val=xmin+(xmax-xmin)*j/5,x=L+(w-L-R)*j/5;ctx.fillText(Math.round(val),x,h-B+20)}ctx.fillText('Generation',w/2,h-9);if(!data.length){ctx.fillText('Island not yet colonised',w/2,h/2);return}for(let a=0;a<3;a++){ctx.beginPath();ctx.lineWidth=3;ctx.strokeStyle=LINE[a];data.forEach((item,j)=>{const x=L+(item.g-xmin)/(xmax-xmin)*(w-L-R),y=T+(1-item.p[a])*(h-T-B);if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.stroke()}ctx.textAlign='left';ALLELES.forEach((a,j)=>{ctx.fillStyle=LINE[j];ctx.fillRect(L+15+j*120,T+12,15,4);ctx.fillStyle='#304957';ctx.fillText(a+' allele',L+36+j*120,T+18)})}
function draw(){$('generation').textContent='Generation '+generation;for(let i=0;i<3;i++){drawDots(i);showStats(i)}drawChart()}
function exportCSV(filename,rows){let csv=rows.map(row=>row.map(value=>{let s=String(value??'');return /[",\n\r]/.test(s)?'"'+s.replaceAll('"','""')+'"':s}).join(',')).join('\r\n');let blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
function safeStudent(){return ($('studentId').value.trim()||'student').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,30)}
function hashSeed(s){let x=2166136261>>>0;for(let i=0;i<s.length;i++){x=Math.imul(x^s.charCodeAt(i),16777619)}return x>>>0}
function seededRandom(seed){let state=seed>>>0;return ()=>{state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
const recordedRuns=[];let classTrials=[];
function showRecorded(){
 const tbody=$('trialRows');
 // Build real table cells and visibly show the same data used in the CSV.
 const fragment=document.createDocumentFragment();
 for(const t of recordedRuns){
   const tr=document.createElement('tr');
   for(const value of [t.run,t.elapsed,...t.m,...t.p]){
     const td=document.createElement('td');
     td.textContent=tr.children.length>=2 && typeof value==='number' ? value.toFixed(3) : String(value);
     tr.appendChild(td);
   }
   fragment.appendChild(tr);
 }
 tbody.replaceChildren(fragment);
 $('downloadTrials').disabled=!recordedRuns.length;
 $('trialMessage').textContent=recordedRuns.length+' of 10 results recorded. '+(recordedRuns.length===10?'All ten runs recorded: download your data.':'Reset the simulation for the next independent run.');
 $('recordTrial').disabled=recordedRuns.length>=10;
 $('recordCount').textContent=recordedRuns.length+' / 10';
 $('recordTrial').textContent=recordedRuns.length<10?'＋ Record next run ('+(recordedRuns.length+1)+' of 10)':'All 10 runs recorded';
 try{localStorage.setItem('genetic-drift-student-records-v17',JSON.stringify(recordedRuns));}catch(e){}
}
function restoreRecorded(){
 try{
   const saved=JSON.parse(localStorage.getItem('genetic-drift-student-records-v17')||'[]');
   if(Array.isArray(saved)) for(const row of saved.slice(0,10)){
     if(Array.isArray(row.m)&&row.m.length===3&&Array.isArray(row.p)&&row.p.length===3&&[...row.m,...row.p].every(v=>typeof v==='number'&&Number.isFinite(v)))recordedRuns.push({run:recordedRuns.length+1,elapsed:row.elapsed??100,m:row.m,p:row.p});
   }
 }catch(e){}
 showRecorded();
}

function advanceToObservation(){
 if(!foundingSnapshot||!pop[1].length){$('trialMessage').textContent='Colonise Island 1 first.';return}
 if(foundingSnapshot.founders!==5){$('trialMessage').textContent='Set Founders → Island 1 to 5 and colonise again.';return}
 const elapsed=generation-foundingSnapshot.generation;
 if(elapsed>OBSERVATION_GENERATIONS){$('trialMessage').textContent='Already beyond 100 generations after founding. Reset and start a new run.';return}
 stop();for(let i=elapsed;i<OBSERVATION_GENERATIONS;i++)tick(true);draw();
 $('trialMessage').textContent='Ready to record: 100 generations after founding. Select Record result.';
}
function recordTrial(){
 // Each click creates one independent, controlled experiment.
 // This avoids confusing recording prerequisites while preserving the free-play simulation above.
 if(recordedRuns.length>=10){$('trialMessage').textContent='All ten runs recorded. Download your CSV or clear the table.';return;}
 stop();
 const mainlandSize=Math.max(5,num('mainK'));
 const islandSize=num('isle1K');
 let mainland=initialPop(mainlandSize);
 // Founder event: sample exactly five diploid individuals from a new mainland.
 let island=sampleWithoutReplacement(mainland,5);
 const foundingMain=countAlleles(mainland).slice();
 const foundingIsland=countAlleles(island).slice();
 for(let g=0;g<OBSERVATION_GENERATIONS;g++){
   mainland=reproduce(mainland,mainlandSize);
   island=reproduce(island,islandSize);
 }
 recordedRuns.push({run:recordedRuns.length+1,elapsed:OBSERVATION_GENERATIONS,
   m:countAlleles(mainland).slice(),p:countAlleles(island).slice(),
   foundingMain,foundingIsland});
 showRecorded();
 $('trialMessage').textContent='Run '+recordedRuns.length+' / 10 saved. Final mainland and Island 1 frequencies are shown below.';
 $('trialRows').lastElementChild?.scrollIntoView({block:'nearest',behavior:'instant'});
}
function rawRows(runs){return [['Student ID','Run','Generations after founding','Mainland Y','Mainland B','Mainland R','Island Y','Island B','Island R'],...runs.map(t=>[safeStudent(),t.run,t.elapsed,...t.m.map(x=>x.toFixed(6)),...t.p.map(x=>x.toFixed(6))])]}

function runClass(){stop();const previous=rng,seedText=$('seed').value.trim(),warmup=num('warmup',0,1000),K=num('mainK');if(K<5){setStatus('Mainland carrying capacity must be at least 5.');return}try{if(seedText)rng=seededRandom(hashSeed(seedText));classTrials=[];for(let i=1;i<=42;i++){let mainland=initialPop(K);for(let g=0;g<warmup;g++)mainland=reproduce(mainland,K);let island=sampleWithoutReplacement(mainland,5);for(let g=0;g<OBSERVATION_GENERATIONS;g++){mainland=reproduce(mainland,K);island=reproduce(island,num('isle1K'))}classTrials.push({run:i,elapsed:OBSERVATION_GENERATIONS,m:countAlleles(mainland),p:countAlleles(island)})}}finally{rng=previous}
 $('classRows').innerHTML=classTrials.map(t=>'<tr><td>'+t.run+'</td><td>'+t.elapsed+'</td>'+t.m.concat(t.p).map(v=>'<td>'+v.toFixed(3)+'</td>').join('')+'</tr>').join('');$('downloadClass').disabled=false;setStatus('Generated 42 independent populations evolved for 100 generations after founding (raw final frequencies only).')}
$('setup').addEventListener('click',setup);$('step').addEventListener('click',()=>{stop();tick()});$('go').addEventListener('click',()=>{if(timer!==null){stop();return}timer=setInterval(tick,Number($('speed').value));$('go').textContent='⏸ Pause';setStatus('Simulation running.')});$('speed').addEventListener('change',()=>{if(timer!==null){stop();timer=setInterval(tick,Number($('speed').value));$('go').textContent='⏸ Pause'}});$('colonize1').addEventListener('click',()=>colonize(1,0,'found1'));$('colonize2').addEventListener('click',()=>colonize(2,1,'found2'));$('bottleneck').addEventListener('click',bottleneck);$('clear1').addEventListener('click',()=>clearIsland(1));$('clear2').addEventListener('click',()=>clearIsland(2));$('graphPop').addEventListener('change',drawChart);$('recordTrial').addEventListener('click',recordTrial);$('undoTrial').addEventListener('click',()=>{recordedRuns.pop();showRecorded()});$('clearTrials').addEventListener('click',()=>{if(recordedRuns.length&&!confirm('Clear all recorded student results?'))return;recordedRuns.length=0;showRecorded()});$('downloadTrials').addEventListener('click',()=>{if(recordedRuns.length)exportCSV('founder_effect_'+safeStudent()+'_raw.csv',rawRows(recordedRuns))});$('runClass').addEventListener('click',runClass);$('downloadClass').addEventListener('click',()=>{if(classTrials.length)exportCSV('founder_effect_42_demo_raw.csv',rawRows(classTrials))});$('exportHistory').addEventListener('click',()=>{const rows=[['Generation','Population','Individuals','Y','B','R']];histories.forEach((h,i)=>h.forEach(t=>rows.push([t.g,['Mainland','Island 1','Island 2'][i],t.n,...t.p.map(x=>x.toFixed(6))])));exportCSV('allele_history_'+safeStudent()+'.csv',rows)});
setup();restoreRecorded();
