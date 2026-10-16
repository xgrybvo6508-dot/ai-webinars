import { chromium } from 'playwright-core';
const b = await chromium.launch({executablePath:'/usr/bin/google-chrome'});
const U='http://localhost:4400', W='/w/2026-claude-code-for-data-engineering/';
const shot = async (vp, name, mobile) => { const ctx = await b.newContext({viewport:vp, deviceScaleFactor:2, isMobile:mobile, hasTouch:mobile}); const p = await ctx.newPage();
  for (const [u,n] of [[U+'/',''],[U+W,'-page']]) { await p.goto(u); await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}scrollTo(0,0)}); await p.waitForTimeout(1300);
    await p.screenshot({path:`screens/${name}${n}.png`, fullPage:true}); } await ctx.close(); };
await shot({width:1440,height:900},'desktop',false); await shot({width:412,height:915},'mobile-pixel',true); await shot({width:820,height:1180},'ipad',true);
const ctx = await b.newContext({viewport:{width:1280,height:800}, recordVideo:{dir:'screens/rec',size:{width:1280,height:800}}}); const p = await ctx.newPage();
await p.goto(U+'/'); await p.waitForTimeout(1500); await p.mouse.move(300,300);
await p.evaluate(()=>scrollTo({top:500,behavior:'smooth'})); await p.waitForTimeout(1200);
const c = await p.$('.grid .card'); const bb = await c.boundingBox();
for(let i=0;i<=20;i++){ await p.mouse.move(bb.x+bb.width*i/20, bb.y+bb.height*(0.2+0.6*i/20)); await p.waitForTimeout(40); }
await p.waitForTimeout(500); await p.click('[data-filter=tag] .chip:nth-child(2)'); await p.waitForTimeout(900); await p.click('[data-filter=tag] .chip:nth-child(1)'); await p.waitForTimeout(900);
await p.click('.grid .card'); await p.waitForTimeout(1500); await p.evaluate(()=>scrollTo({top:900,behavior:'smooth'})); await p.waitForTimeout(1500);
await ctx.close(); await b.close();
