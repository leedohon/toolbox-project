import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.1';
mountGeneratedTool({
  "slug": "loan-savings-calculator",
  "preset": "loan-savings-calculator",
  "fields": [
    "mode",
    "loanAmount",
    "extraPayment",
    "startAmount",
    "targetAmount",
    "monthlyDeposit",
    "annualRate",
    "months"
  ]
});
const termActions=document.createElement('div');termActions.className='st-actions';termActions.setAttribute('aria-label','기간 빠른 설정');termActions.innerHTML='<button class="st-secondary term-preset" type="button" data-months="12" data-ko="1년" data-en="1 year">1년</button><button class="st-secondary term-preset" id="loan-36-preset" type="button" data-months="36" data-ko="3년" data-en="3 years">3년</button><button class="st-secondary term-preset" type="button" data-months="60" data-ko="5년" data-en="5 years">5년</button><button class="st-secondary term-preset" type="button" data-months="120" data-ko="10년" data-en="10 years">10년</button><button class="st-secondary term-preset" type="button" data-months="360" data-ko="30년" data-en="30 years">30년</button>';if(window.ToolboxI18n?.language==='en')termActions.querySelectorAll('button').forEach(button=>{button.textContent=button.dataset.en;});document.querySelector('.st-actions').before(termActions);
document.querySelectorAll('.term-preset').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#months').value=button.dataset.months;document.querySelector('#sg-run').click();}));
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
const money=value=>new Intl.NumberFormat(window.ToolboxI18n?.language==='en'?'en-US':'ko-KR',{maximumFractionDigits:0}).format(Math.max(0,value));
function updateExtraComparison(){
  const result=document.querySelector('#sg-result'),output=document.querySelector('#sg-output');output.querySelector('#loan-extra-result')?.remove();
  if(result.hidden||document.querySelector('input[name="mode"]:checked')?.value!=='loan')return;
  const principal=Number(document.querySelector('#loanAmount').value),annual=Number(document.querySelector('#annualRate').value),months=Number(document.querySelector('#months').value),extra=Number(document.querySelector('#extraPayment').value);
  if(!Number.isFinite(extra)||extra<=0||principal<=0||months<1)return;
  const rate=annual/1200,base=rate===0?principal/months:principal*rate/-Math.expm1(-months*Math.log1p(rate));
  let balance=principal,totalInterest=0,paidMonths=0;
  while(balance>0.005&&paidMonths<1200){const interest=balance*rate,payment=Math.min(balance+interest,base+extra);totalInterest+=interest;balance=Math.max(0,balance+interest-payment);paidMonths+=1;}
  const baselineInterest=base*months-principal,saved=Math.max(0,baselineInterest-totalInterest),shortened=Math.max(0,months-paidMonths);
  const wrap=document.createElement('dl');wrap.className='sg-result-row';wrap.id='loan-extra-result';
  const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=tr('추가 상환 예상','Extra-payment estimate');dd.textContent=tr(`${paidMonths}개월 상환 · ${shortened}개월 단축 · 이자 약 ${money(saved)} 절약`,`${paidMonths} months to repay · ${shortened} months shorter · about ${money(saved)} interest saved`);wrap.append(dt,dd);output.append(wrap);
}
const queueExtra=()=>queueMicrotask(updateExtraComparison);
document.querySelector('#sg-run').addEventListener('click',queueExtra);document.querySelector('#extraPayment').addEventListener('input',queueExtra);document.querySelector('#sg-reset').addEventListener('click',queueExtra);
addEventListener('toolbox-language-change',()=>{termActions.querySelectorAll('button').forEach(button=>{button.textContent=tr(button.dataset.ko,button.dataset.en);});queueExtra();});
queueExtra();
