import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.3';
import {copyText} from '../../assets/play-tools.js?v=0.3.2';
mountGeneratedTool({
  slug:'http-status-lookup',
  preset:'http-status-lookup',
  fields:['mode','code','query']
});
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
function guidance(code){
  if(code===429)return tr('요청 간격을 늘리고 Retry-After 응답 헤더가 있으면 그 시간 뒤에 다시 시도하세요.','Slow the request rate and retry after the Retry-After header when present.');
  if([502,503,504].includes(code))return tr('일시적인 상위 서버 문제일 수 있습니다. 짧은 지수 백오프를 적용해 제한적으로 재시도하세요.','This may be a temporary upstream issue. Retry a limited number of times with exponential backoff.');
  if(code>=500)return tr('서버 로그와 요청 추적 ID를 먼저 확인하고, 같은 요청의 무제한 자동 재시도는 피하세요.','Check server logs and request IDs first, and avoid unlimited automatic retries of the same request.');
  if(code>=400)return tr('재시도보다 요청 주소·인증·권한·입력값을 먼저 수정하세요.','Fix the request URL, authentication, permissions, or input before retrying.');
  if(code>=300)return tr('Location 헤더와 캐시 정책을 확인하고 리디렉션 반복이 없는지 점검하세요.','Check the Location header and cache policy, and make sure redirects do not loop.');
  return tr('요청이 처리됐습니다. 응답 본문과 캐시 헤더가 의도한 결과인지 함께 확인하세요.','The request was handled. Also verify that the response body and cache headers match the intended result.');
}
function updateGuidance(){const result=document.querySelector('#sg-result'),target=document.querySelector('#http-guidance'),mode=document.querySelector('input[name="mode"]:checked')?.value,code=Number(document.querySelector('#code').value);target.textContent=result.hidden||mode==='search'?'':guidance(code);}
async function copyChecklist(){
  const result=document.querySelector('#sg-result'),status=document.querySelector('#sg-status'),fallback=document.querySelector('#sg-fallback');
  if(result.hidden||document.querySelector('input[name="mode"]:checked')?.value!=='code'){
    status.textContent=tr('코드로 상태를 조회한 뒤 점검표를 복사해 주세요.','Look up a status by code before copying a checklist.');status.className='st-status is-error';return;
  }
  const code=document.querySelector('#code').value,summary=document.querySelector('#sg-output').innerText.trim(),next=guidance(Number(code));
  const text=tr(
    `## HTTP ${code} 응답 점검표\n\n- [ ] 조회 결과 확인\n${summary.split('\n').map(line=>`  - ${line}`).join('\n')}\n- [ ] 후속 조치: ${next}\n- [ ] 응답 본문과 주요 헤더를 실제 요청에서 재확인\n- [ ] 자동 재시도 횟수와 사용자 안내 확인`,
    `## HTTP ${code} response checklist\n\n- [ ] Verify lookup result\n${summary.split('\n').map(line=>`  - ${line}`).join('\n')}\n- [ ] Next action: ${next}\n- [ ] Recheck the response body and key headers in a real request\n- [ ] Review retry limits and user-facing guidance`
  );
  if(await copyText(text)){fallback.hidden=true;status.textContent=tr('HTTP 응답 점검표를 복사했습니다.','HTTP response checklist copied.');status.className='st-status is-good';}
  else{fallback.value=text;fallback.hidden=false;status.textContent=tr('직접 복사할 점검표를 표시했습니다.','The checklist is shown for manual copying.');status.className='st-status is-error';}
}
document.querySelector('#sg-run').addEventListener('click',()=>queueMicrotask(updateGuidance));
document.querySelector('#sg-reset').addEventListener('click',()=>queueMicrotask(updateGuidance));
document.querySelector('#http-copy-checklist').addEventListener('click',copyChecklist);
document.querySelectorAll('.http-preset').forEach(button=>button.addEventListener('click',()=>{document.querySelector('input[name="mode"][value="code"]').checked=true;document.querySelector('input[name="mode"][value="code"]').dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('#code').value=button.dataset.code;document.querySelector('#sg-run').click();queueMicrotask(updateGuidance);}));
addEventListener('toolbox-language-change',updateGuidance);
queueMicrotask(updateGuidance);
