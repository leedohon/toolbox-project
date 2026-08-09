import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.2';
mountGeneratedTool({
  "slug": "text-extractor-tool",
  "preset": "text-extractor-tool",
  "fields": [
    "mode",
    "text"
  ]
});
document.querySelector('#extract-save').addEventListener('click',()=>{const result=document.querySelector('#sg-result'),text=document.querySelector('#sg-output').innerText.trim();if(result.hidden||!text){document.querySelector('#sg-status').textContent=window.ToolboxI18n?.language==='en'?'Extract some information before saving.':'저장할 정보를 먼저 추출해 주세요.';return;}const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));link.download='extracted-information.txt';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);});
