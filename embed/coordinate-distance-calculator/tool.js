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
coordinateSwap.addEventListener('click',()=>{const lat=document.querySelector('#lat1').value,lon=document.querySelector('#lon1').value;document.querySelector('#lat1').value=document.querySelector('#lat2').value;document.querySelector('#lon1').value=document.querySelector('#lon2').value;document.querySelector('#lat2').value=lat;document.querySelector('#lon2').value=lon;document.querySelector('#sg-run').click();});
