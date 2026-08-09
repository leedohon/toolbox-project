import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.2';
mountGeneratedTool({
  slug:'http-status-lookup',
  preset:'http-status-lookup',
  fields:['code']
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
function updateGuidance(){const result=document.querySelector('#sg-result'),target=document.querySelector('#http-guidance'),code=Number(document.querySelector('#code').value);target.textContent=result.hidden?'':guidance(code);}
document.querySelector('#sg-run').addEventListener('click',()=>queueMicrotask(updateGuidance));
document.querySelector('#sg-reset').addEventListener('click',()=>queueMicrotask(updateGuidance));
document.querySelectorAll('.http-preset').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#code').value=button.dataset.code;document.querySelector('#sg-run').click();queueMicrotask(updateGuidance);}));
addEventListener('toolbox-language-change',updateGuidance);
queueMicrotask(updateGuidance);
