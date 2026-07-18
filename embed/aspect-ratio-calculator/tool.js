import {copyText,setupEmbedHeight} from '../../assets/play-tools.js?v=0.3.2';

const $=selector=>document.querySelector(selector),tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
let copyValue='';
function gcd(a,b){while(b)[a,b]=[b,a%b];return a;}
function read(selector){const value=Number($(selector).value);if(!Number.isInteger(value)||value<1||value>1000000)throw new Error(tr('크기는 1부터 1,000,000 사이의 정수로 입력해 주세요.','Enter whole-number dimensions from 1 to 1,000,000.'));return value;}
function basis(){return document.querySelector('[name="ratio-basis"]:checked').value;}
function setStatus(ko,en,error=false){const status=$('#ratio-status');status.textContent=tr(ko,en);status.className=`st-status ${error?'is-error':'is-good'}`;}
function syncLabel(){const width=basis()==='width';$('#ratio-target-label').textContent=tr(width?'목표 가로':'목표 세로',width?'Target width':'Target height');}
function calculate(){try{const width=read('#ratio-width'),height=read('#ratio-height'),target=read('#ratio-target'),divisor=gcd(width,height),simpleWidth=width/divisor,simpleHeight=height/divisor,isWidth=basis()==='width',targetWidth=isWidth?target:Math.round(target*width/height),targetHeight=isWidth?Math.round(target*height/width):target;$('#ratio-value').textContent=`${simpleWidth}:${simpleHeight}`;$('#ratio-detail').textContent=tr(`원본 ${width} × ${height}px → 목표 ${targetWidth} × ${targetHeight}px · 소수 비율 ${(width/height).toFixed(4)}`,`Original ${width} × ${height}px → Target ${targetWidth} × ${targetHeight}px · Decimal ratio ${(width/height).toFixed(4)}`);copyValue=`${simpleWidth}:${simpleHeight} | ${width}x${height} -> ${targetWidth}x${targetHeight}`;$('#ratio-result').hidden=false;setStatus('화면 비율과 목표 크기를 계산했습니다.','Aspect ratio and target dimensions calculated.');}catch(error){copyValue='';$('#ratio-result').hidden=true;setStatus(error.message,error.message,true);}}
['#ratio-width','#ratio-height','#ratio-target'].forEach(selector=>$(selector).addEventListener('input',calculate));
document.querySelectorAll('[name="ratio-basis"]').forEach(input=>input.addEventListener('change',()=>{syncLabel();calculate();}));
$('#ratio-calculate').addEventListener('click',calculate);
$('#ratio-copy').addEventListener('click',async()=>{if(!copyValue){setStatus('복사할 계산 결과가 없습니다.','There is no calculation result to copy.',true);return;}if(await copyText(copyValue)){setStatus('계산 결과를 복사했습니다.','Calculation result copied.');$('#ratio-fallback').hidden=true;}else{$('#ratio-fallback').value=copyValue;$('#ratio-fallback').hidden=false;setStatus('자동 복사가 차단되어 직접 복사할 결과를 표시했습니다.','Automatic copying was blocked. A manual copy field is shown.',true);}});
$('#ratio-swap').addEventListener('click',()=>{const width=$('#ratio-width').value;$('#ratio-width').value=$('#ratio-height').value;$('#ratio-height').value=width;calculate();});
addEventListener('toolbox-language-change',()=>{syncLabel();calculate();});
syncLabel();calculate();setupEmbedHeight('aspect-ratio-calculator',{content:true});
