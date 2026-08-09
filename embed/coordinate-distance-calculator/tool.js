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
