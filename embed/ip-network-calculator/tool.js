import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.3';
mountGeneratedTool({
  "slug": "ip-network-calculator",
  "preset": "ip-network-calculator",
  "fields": [
    "mode",
    "ipCidr",
    "prefix",
    "startIp",
    "endIp",
    "mac",
    "ipValue",
    "targetIp"
  ]
});
document.querySelectorAll('.ip-prefix').forEach(button=>button.addEventListener('click',()=>{const prefix=button.dataset.prefix,mode=document.querySelector('#mode');mode.value='cidr';mode.dispatchEvent(new Event('change',{bubbles:true}));const input=document.querySelector('#ipCidr'),address=input.value.split('/')[0]||'192.168.10.25';input.value=`${address}/${prefix}`;document.querySelector('#sg-run').click();}));
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
function addressType(ip){
  const parts=ip.split('.').map(Number),[a,b,c,d]=parts;if(parts.length!==4||parts.some(value=>!Number.isInteger(value)||value<0||value>255))return null;
  if(a===10||a===172&&b>=16&&b<=31||a===192&&b===168)return tr('사설 IPv4','Private IPv4');
  if(a===127)return tr('루프백 주소','Loopback address');
  if(a===169&&b===254)return tr('링크 로컬 주소','Link-local address');
  if(a===100&&b>=64&&b<=127)return tr('통신사 공유 주소','Carrier-grade NAT address');
  if(a===192&&b===0&&c===2||a===198&&b===51&&c===100||a===203&&b===0&&c===113)return tr('문서 예시용 주소','Documentation address');
  if(a>=224&&a<=239)return tr('멀티캐스트 주소','Multicast address');
  if(a===0||a>=240||a===255&&b===255&&c===255&&d===255)return tr('특수·예약 주소','Special or reserved address');
  return tr('공인 IPv4 후보','Public IPv4 candidate');
}
function updateAddressType(){
  const output=document.querySelector('#sg-output');output.querySelector('#ip-address-type')?.remove();
  if(document.querySelector('#sg-result').hidden||document.querySelector('#mode').value!=='cidr')return;
  const value=addressType(document.querySelector('#ipCidr').value.split('/')[0].trim());if(!value)return;
  const wrap=document.createElement('dl');wrap.className='sg-result-row';wrap.id='ip-address-type';const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=tr('입력 주소 용도','Input address type');dd.textContent=value;wrap.append(dt,dd);output.append(wrap);
}
const queueAddressType=()=>queueMicrotask(updateAddressType);document.querySelector('#sg-run').addEventListener('click',queueAddressType);document.querySelector('#ipCidr').addEventListener('input',queueAddressType);document.querySelector('#sg-reset').addEventListener('click',queueAddressType);addEventListener('toolbox-language-change',queueAddressType);queueAddressType();
