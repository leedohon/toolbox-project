import {setupEmbedHeight} from '../../assets/play-tools.js?v=0.3.2';

const $=selector=>document.querySelector(selector),tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
let source=null,sourceUrl='',outputUrl='',outputBlob=null,ratio=1,originalSize=0,sourceName='toolbox-image';

const size=bytes=>bytes<1024?`${bytes} B`:bytes<1048576?`${(bytes/1024).toFixed(1)} KB`:`${(bytes/1048576).toFixed(2)} MB`;
function status(message,error=false){$('#img-status').textContent=message;$('#img-status').className=`st-status ${error?'is-error':'is-good'}`;}
function cleanup(){if(sourceUrl)URL.revokeObjectURL(sourceUrl);if(outputUrl)URL.revokeObjectURL(outputUrl);sourceUrl=outputUrl='';outputBlob=null;}
function invalidateOutput(message=true){if(outputUrl)URL.revokeObjectURL(outputUrl);outputUrl='';outputBlob=null;$('#img-download').disabled=true;$('#img-output-stat').textContent='—';$('#img-saving-stat').textContent='—';if(source&&sourceUrl)$('#img-preview-image').src=sourceUrl;if(message&&source)status(tr('설정이 바뀌었습니다. 다시 변환해 주세요.','Settings changed. Convert again.'));}
function openFilePicker(){const input=$('#img-file');try{if(typeof input.showPicker==='function'){input.showPicker();return;}}catch{}input.click();}

async function load(file){
  cleanup();
  if(!file||!/^image\/(png|jpeg|webp)$/.test(file.type))return status(tr('PNG, JPEG, WebP 이미지를 선택해 주세요.','Choose a PNG, JPEG, or WebP image.'),true);
  if(file.size>20*1048576)return status(tr('파일 크기는 20MB 이하로 선택해 주세요.','Choose a file no larger than 20MB.'),true);
  sourceName=(file.name.replace(/\.[^.]+$/,'').replace(/[<>:"/\\|?*\u0000-\u001f]/g,'-').trim()||'toolbox-image').slice(0,120);
  sourceUrl=URL.createObjectURL(file);
  const image=new Image();image.src=sourceUrl;
  try{await image.decode();}catch{return status(tr('이미지를 불러오지 못했습니다.','Could not load the image.'),true);}
  if(image.width>8000||image.height>8000||image.width*image.height>32e6)return status(tr('이미지는 한 변 8,000px, 전체 3,200만 픽셀 이하로 선택해 주세요.','Choose an image up to 8,000px per side and 32 million pixels total.'),true);
  source=image;ratio=image.width/image.height;originalSize=file.size;
  $('#img-width').value=image.width;$('#img-height').value=image.height;$('#img-scale').value='100';$('#img-settings').hidden=false;$('#img-preview').hidden=false;$('#img-preview-image').src=sourceUrl;
  $('#img-original-stat').textContent=`${image.width}×${image.height} · ${size(file.size)}`;$('#img-output-stat').textContent='—';$('#img-saving-stat').textContent='—';$('#img-stats').hidden=false;$('#img-download').disabled=true;
  status(tr('이미지를 불러왔습니다. 원하는 크기와 형식을 선택하세요.','Image loaded. Choose the target size and format.'));
}

function sync(from){if(!$('#img-ratio').checked||!source)return;if(from==='width')$('#img-height').value=Math.max(1,Math.round(Number($('#img-width').value)/ratio));else $('#img-width').value=Math.max(1,Math.round(Number($('#img-height').value)*ratio));}
async function process(){
  if(!source)return status(tr('먼저 이미지를 선택해 주세요.','Choose an image first.'),true);
  const width=Number($('#img-width').value),height=Number($('#img-height').value);
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>8000||height>8000||width*height>32e6)return status(tr('가로·세로는 1~8,000px, 전체 3,200만 픽셀 이하로 입력해 주세요.','Use 1–8,000px per side and no more than 32 million pixels.'),true);
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d',{alpha:$('#img-type').value==='image/png'});ctx.imageSmoothingQuality='high';
  if($('#img-type').value==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);}ctx.drawImage(source,0,0,width,height);
  const type=$('#img-type').value,quality=Number($('#img-quality').value)/100;
  outputBlob=await new Promise(resolve=>canvas.toBlob(resolve,type,quality));
  if(!outputBlob)return status(tr('변환 이미지를 만들지 못했습니다.','Could not create the converted image.'),true);
  if(outputUrl)URL.revokeObjectURL(outputUrl);outputUrl=URL.createObjectURL(outputBlob);$('#img-preview-image').src=outputUrl;
  $('#img-output-stat').textContent=`${width}×${height} · ${size(outputBlob.size)}`;
  const change=Math.round((1-outputBlob.size/originalSize)*100);$('#img-saving-stat').textContent=change>=0?tr(`${change}% 감소`,`${change}% smaller`):tr(`${Math.abs(change)}% 증가`,`${Math.abs(change)}% larger`);
  $('#img-download').disabled=false;status(tr('이미지 변환을 완료했습니다.','Image conversion complete.'));
}

$('#img-file').addEventListener('change',event=>load(event.target.files[0]));
const emailPreset=document.createElement('button');emailPreset.className='st-secondary';emailPreset.id='img-email-preset';emailPreset.type='button';emailPreset.dataset.ko='이메일 첨부 설정';emailPreset.dataset.en='Email attachment preset';emailPreset.textContent=tr('이메일 첨부 설정','Email attachment preset');$('#img-web-preset').after(emailPreset);
const imageSample=document.createElement('button');imageSample.className='st-secondary';imageSample.id='img-sample';imageSample.type='button';imageSample.dataset.ko='샘플 이미지';imageSample.dataset.en='Sample image';imageSample.textContent=tr('샘플 이미지','Sample image');$('#img-choose').after(imageSample);imageSample.addEventListener('click',()=>{const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=1200;const context=canvas.getContext('2d');const gradient=context.createLinearGradient(0,0,1800,1200);gradient.addColorStop(0,'#dff5ff');gradient.addColorStop(1,'#8fd3f4');context.fillStyle=gradient;context.fillRect(0,0,1800,1200);context.fillStyle='#075985';context.font='700 120px sans-serif';context.fillText('TOOLBOX SAMPLE',220,640);canvas.toBlob(blob=>blob&&load(new File([blob],'toolbox-sample.png',{type:'image/png'})),'image/png');});
$('#img-choose').addEventListener('click',openFilePicker);
['dragenter','dragover'].forEach(name=>$('#img-drop').addEventListener(name,event=>{event.preventDefault();$('#img-drop').classList.add('is-over');}));
['dragleave','drop'].forEach(name=>$('#img-drop').addEventListener(name,event=>{event.preventDefault();$('#img-drop').classList.remove('is-over');if(name==='drop')load(event.dataTransfer.files[0]);}));
$('#img-scale').addEventListener('change',()=>{if(!source||$('#img-scale').value==='custom')return;const selected=$('#img-scale').value;if(selected.startsWith('long-')){const edge=Number(selected.slice(5)),scale=Math.min(1,edge/Math.max(source.width,source.height));$('#img-width').value=Math.max(1,Math.round(source.width*scale));$('#img-height').value=Math.max(1,Math.round(source.height*scale));}else{const scale=Number(selected)/100;$('#img-width').value=Math.max(1,Math.round(source.width*scale));$('#img-height').value=Math.max(1,Math.round(source.height*scale));}invalidateOutput();});
$('#img-width').addEventListener('input',()=>{$('#img-scale').value='custom';sync('width');invalidateOutput();});$('#img-height').addEventListener('input',()=>{$('#img-scale').value='custom';sync('height');invalidateOutput();});$('#img-quality').addEventListener('input',()=>{$('#img-quality-value').textContent=`${$('#img-quality').value}%`;invalidateOutput();});$('#img-type').addEventListener('change',()=>{$('#img-quality-wrap').hidden=$('#img-type').value==='image/png';invalidateOutput();});$('#img-process').addEventListener('click',process);
$('#img-web-preset').addEventListener('click',()=>{if(!source)return status(tr('먼저 이미지를 선택해 주세요.','Choose an image first.'),true);const scale=Math.min(1,1280/Math.max(source.width,source.height));$('#img-scale').value='long-1280';$('#img-width').value=Math.max(1,Math.round(source.width*scale));$('#img-height').value=Math.max(1,Math.round(source.height*scale));$('#img-type').value='image/webp';$('#img-quality').value='80';$('#img-quality-value').textContent='80%';$('#img-quality-wrap').hidden=false;invalidateOutput(false);status(tr('긴 변 1280px·WebP 80% 설정을 적용했습니다.','Applied long edge 1280px, WebP, and 80% quality.'));});
emailPreset.addEventListener('click',()=>{if(!source)return status(tr('먼저 이미지를 선택해 주세요.','Choose an image first.'),true);const scale=Math.min(1,1600/Math.max(source.width,source.height));$('#img-scale').value='custom';$('#img-width').value=Math.max(1,Math.round(source.width*scale));$('#img-height').value=Math.max(1,Math.round(source.height*scale));$('#img-type').value='image/jpeg';$('#img-quality').value='75';$('#img-quality-value').textContent='75%';$('#img-quality-wrap').hidden=false;invalidateOutput(false);status(tr('긴 변 1600px·JPEG 75% 이메일 설정을 적용했습니다.','Applied 1600px long edge, JPEG, and 75% quality for email.'));});
$('#img-download').addEventListener('click',()=>{if(!outputBlob)return;const ext={'image/jpeg':'jpg','image/webp':'webp','image/png':'png'}[outputBlob.type]||'png',link=document.createElement('a');link.href=outputUrl;link.download=`${sourceName}.${ext}`;link.click();status(tr('변환 이미지를 저장했습니다.','Saved the converted image.'));});
$('#img-reset').addEventListener('click',()=>{cleanup();source=null;sourceName='toolbox-image';$('#img-file').value='';$('#img-preview-image').removeAttribute('src');$('#img-settings').hidden=true;$('#img-preview').hidden=true;$('#img-stats').hidden=true;status(tr('초기화했습니다. 새 이미지를 선택하세요.','Reset. Choose a new image.'));});
setupEmbedHeight('image-resizer-compressor',{content:true});
