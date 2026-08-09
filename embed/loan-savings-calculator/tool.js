import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.1';
mountGeneratedTool({
  "slug": "loan-savings-calculator",
  "preset": "loan-savings-calculator",
  "fields": [
    "mode",
    "loanAmount",
    "startAmount",
    "targetAmount",
    "monthlyDeposit",
    "annualRate",
    "months"
  ]
});
const termActions=document.createElement('div');termActions.className='st-actions';termActions.setAttribute('aria-label','기간 빠른 설정');termActions.innerHTML='<button class="st-secondary term-preset" type="button" data-months="12" data-ko="1년" data-en="1 year">1년</button><button class="st-secondary term-preset" type="button" data-months="60" data-ko="5년" data-en="5 years">5년</button><button class="st-secondary term-preset" type="button" data-months="120" data-ko="10년" data-en="10 years">10년</button><button class="st-secondary term-preset" type="button" data-months="360" data-ko="30년" data-en="30 years">30년</button>';if(window.ToolboxI18n?.language==='en')termActions.querySelectorAll('button').forEach(button=>{button.textContent=button.dataset.en;});document.querySelector('.st-actions').before(termActions);
document.querySelectorAll('.term-preset').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#months').value=button.dataset.months;document.querySelector('#sg-run').click();}));
