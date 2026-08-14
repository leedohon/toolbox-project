import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.1';
mountGeneratedTool({
  "slug": "coordinate-distance-calculator",
  "preset": "coordinate-distance-calculator",
  "fields": [
    "mode",
    "lat1",
    "lon1",
    "lat2",
    "lon2",
    "decimal",
    "axis",
    "degrees",
    "minutes",
    "seconds",
    "direction"
  ]
});
const coordinateActions=document.querySelector('.st-actions');
const coordinateSwap=document.createElement('button');coordinateSwap.className='st-secondary';coordinateSwap.id='coordinate-swap';coordinateSwap.type='button';coordinateSwap.dataset.ko='출발·도착 바꾸기';coordinateSwap.dataset.en='Swap start and end';coordinateSwap.textContent=window.ToolboxI18n?.language==='en'?'Swap start and end':'출발·도착 바꾸기';coordinateActions.prepend(coordinateSwap);
const coordinateSample=document.createElement('button');coordinateSample.className='st-secondary';coordinateSample.id='coordinate-sample';coordinateSample.type='button';coordinateSample.dataset.ko='서울·제주 예제';coordinateSample.dataset.en='Seoul to Jeju example';coordinateSample.textContent=window.ToolboxI18n?.language==='en'?'Seoul to Jeju example':'서울·제주 예제';coordinateActions.prepend(coordinateSample);coordinateSample.addEventListener('click',()=>{document.querySelector('#lat1').value='37.5665';document.querySelector('#lon1').value='126.9780';document.querySelector('#lat2').value='33.4996';document.querySelector('#lon2').value='126.5312';document.querySelector('#sg-run').click();});
const coordinateTokyo=document.createElement('button');coordinateTokyo.className='st-secondary';coordinateTokyo.id='coordinate-tokyo-sample';coordinateTokyo.type='button';coordinateTokyo.dataset.ko='부산·도쿄 예제';coordinateTokyo.dataset.en='Busan to Tokyo example';coordinateTokyo.textContent=window.ToolboxI18n?.language==='en'?'Busan to Tokyo example':'부산·도쿄 예제';coordinateSample.after(coordinateTokyo);coordinateTokyo.addEventListener('click',()=>{document.querySelector('#lat1').value='35.1796';document.querySelector('#lon1').value='129.0756';document.querySelector('#lat2').value='35.6762';document.querySelector('#lon2').value='139.6503';document.querySelector('#sg-run').click();});
coordinateSwap.addEventListener('click',()=>{const lat=document.querySelector('#lat1').value,lon=document.querySelector('#lon1').value;document.querySelector('#lat1').value=document.querySelector('#lat2').value;document.querySelector('#lon1').value=document.querySelector('#lon2').value;document.querySelector('#lat2').value=lat;document.querySelector('#lon2').value=lon;document.querySelector('#sg-run').click();});
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
const syncInjectedLabels=()=>document.querySelectorAll('#coordinate-swap,#coordinate-sample,#coordinate-tokyo-sample').forEach(button=>{button.textContent=tr(button.dataset.ko,button.dataset.en);});
document.querySelector('#coordinate-map').addEventListener('click',()=>{
  const values=['lat1','lon1','lat2','lon2'].map(id=>Number(document.querySelector(`#${id}`).value)),status=document.querySelector('#sg-status');
  if(document.querySelector('input[name="mode"]:checked')?.value!=='route'||values.some(value=>!Number.isFinite(value))||Math.abs(values[0])>90||Math.abs(values[2])>90||Math.abs(values[1])>180||Math.abs(values[3])>180){status.textContent=tr('올바른 출발·도착 좌표를 먼저 입력해 주세요.','Enter valid start and end coordinates first.');status.className='st-status is-error';return;}
  const [lat1,lon1,lat2,lon2]=values,url=`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${lat1},${lon1}`)}&destination=${encodeURIComponent(`${lat2},${lon2}`)}`;
  const opened=window.open(url,'_blank','noopener,noreferrer');status.textContent=opened?tr('지도 경로를 새 창에서 열었습니다.','Map route opened in a new window.'):tr('새 창이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.','The new window was blocked. Allow pop-ups and try again.');status.className=`st-status ${opened?'is-good':'is-error'}`;
});
addEventListener('toolbox-language-change',syncInjectedLabels);syncInjectedLabels();
