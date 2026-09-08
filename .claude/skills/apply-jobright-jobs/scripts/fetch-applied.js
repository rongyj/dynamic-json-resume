#!/usr/bin/env node
/**
 * Captures every job already applied to on JobRight, so recommendations can be deduped.
 *
 *   node .claude/skills/apply-jobright-jobs/scripts/fetch-applied.js
 *
 * Writes applications/applied-jobright.json — the jobIds JobRight already considers applied.
 * This is separate from applications/applied.json, which tracks what this skill submitted.
 *
 * Endpoint: POST /swan/job/applied/jobs-v3 with {cursor, pageSize, applyStatus:0}; the
 * cursor comes back as result.cursor with result.hasMore
 * (not position/count like the recommendation feed). Each row carries displayScore and a
 * rankDesc label such as "Strong Match".
 */
const fs=require('fs'), path=require('path'), os=require('os');
const ROOT=path.resolve(__dirname,'..','..','..','..');
const PROFILE=path.join(os.homedir(),'.jobright-chrome');
const args=process.argv.slice(2);
const flag=(n,d)=>{const i=args.indexOf('--'+n);return i===-1?d:args[i+1];};
const DELAY=Number(flag('delay',1200));
const PAGE=Number(flag('page-size',20));   // the UI's own value; larger pages stop early

(async()=>{
 const pup=require(path.join(ROOT,'node_modules','puppeteer'));
 const b=await pup.launch({headless:true,userDataDir:PROFILE});
 const p=(await b.pages())[0]||await b.newPage();
 await p.goto('https://jobright.ai/jobs/applied',{waitUntil:'domcontentloaded',timeout:120000}).catch(()=>{});

 const rows=await p.evaluate(async(delay,pageSize)=>{
   const out=[]; let cursor=null, guard=0;
   while(guard++ < 200){
     // POST, not GET: {"cursor":null,"pageSize":20,"applyStatus":0}
     const u='https://jobright.ai/swan/job/applied/jobs-v3';
     let j=null;
     for(let a=0;a<3;a++){
       try{ j=await (await fetch(u,{credentials:'include',method:'POST',
              headers:{'content-type':'application/json'},
              body:JSON.stringify({cursor,pageSize,applyStatus:0})})).json(); }catch{ j=null; }
       if(j&&j.result&&typeof j.result!=='string') break;
       j=null; await new Promise(r=>setTimeout(r,10000*(a+1)));
     }
     if(!j) break;
     const r=j.result, list=r.list||[];
     for(const e of list){
       const job=e.jobResult||{}, co=e.companyResult||{};
       out.push({jobId:job.jobId,title:job.jobTitle,company:co.companyName,
                 score:e.displayScore,rankDesc:e.rankDesc,applyTime:e.applyTime,
                 applyStatus:e.applyStatus,source:e.source});
     }
     out.__pages=(out.__pages||0)+1;
     if(!r.hasMore||!r.cursor||!list.length){ out.__stop=`hasMore=${r.hasMore} cursor=${!!r.cursor} rows=${list.length}`; break; }
     cursor=r.cursor;
     await new Promise(r=>setTimeout(r,delay));
   }
   return {rows:out, pages:out.__pages, stop:out.__stop};
 },DELAY,PAGE).catch(e=>{console.error(e);return{rows:[]};});

 console.log(`pages=${rows.pages} stopped because: ${rows.stop||'guard/limit'}`);
 const list=rows.rows||[];
 const byId={}; list.forEach(r=>{if(r.jobId) byId[r.jobId]=r;});
 const out=path.join(ROOT,'applications','applied-jobright.json');
 fs.writeFileSync(out,JSON.stringify({capturedAt:new Date().toISOString(),count:Object.keys(byId).length,jobs:byId},null,1));
 console.log(`applied jobs captured: ${list.length} rows, ${Object.keys(byId).length} unique`);
 console.log(`-> ${path.relative(ROOT,out)}`);
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
