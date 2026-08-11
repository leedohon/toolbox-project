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
