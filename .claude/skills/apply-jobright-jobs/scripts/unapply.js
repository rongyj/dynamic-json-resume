#!/usr/bin/env node
/**
 * Reverses a JobRight "applied" mark so the job returns to recommendations.
 *   node .claude/skills/apply-jobright-jobs/scripts/unapply.js <jobId> [<jobId> ...]
 *   node .claude/skills/apply-jobright-jobs/scripts/unapply.js --all-unsubmitted
 *
 * --all-unsubmitted reverses every record in applications/applied.json whose
 * actuallySubmitted is still null. Endpoint: POST /swan/job/unapply {jobId}
 */
const fs=require('fs'),path=require('path'),os=require('os');
const ROOT=path.resolve(__dirname,'..','..','..','..');
(async()=>{
  let ids=process.argv.slice(2).filter(a=>!a.startsWith('--'));
  if(process.argv.includes('--all-unsubmitted')){
    const f=path.join(ROOT,'applications','applied.json');
    ids=JSON.parse(fs.readFileSync(f,'utf8')).filter(r=>!r.actuallySubmitted).map(r=>r.jobId);
  }
  if(!ids.length){console.log('usage: unapply.js <jobId>... | --all-unsubmitted');process.exit(1);}
  const pup=require(path.join(ROOT,'node_modules','puppeteer'));
  const b=await pup.launch({headless:true,userDataDir:path.join(os.homedir(),'.jobright-chrome')});
  const p=(await b.pages())[0]||await b.newPage();
  await p.goto('https://jobright.ai/jobs/recommend',{waitUntil:'domcontentloaded',timeout:120000});
  await new Promise(r=>setTimeout(r,3000));
  const res=await p.evaluate(async list=>{
    const out=[];
    for(const jobId of list){
      try{const r=await fetch('https://jobright.ai/swan/job/unapply',{method:'POST',credentials:'include',
        headers:{'content-type':'application/json'},body:JSON.stringify({jobId})});
        const j=await r.json(); out.push({jobId,ok:!!j.success,err:j.errorMsg||null});
      }catch(e){out.push({jobId,ok:false,err:String(e)});}
      await new Promise(r=>setTimeout(r,1000));
    }
    return out;
  },ids);
  res.forEach(r=>console.log(`  ${r.ok?'OK  ':'FAIL'} ${r.jobId}${r.err?' | '+r.err:''}`));
  console.log(`unapplied ${res.filter(r=>r.ok).length}/${res.length}`);
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
