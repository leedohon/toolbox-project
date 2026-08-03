import {copyText,setupEmbedHeight} from './play-tools.js?v=0.3.2';

const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1;};
const number=(value,label)=>{const parsed=Number(value);if(!Number.isFinite(parsed))throw new Error(tr(`${label}에 올바른 숫자를 입력해 주세요.`,`Enter a valid number for ${label}.`));return parsed;};
const integer=(value,label)=>{const parsed=number(value,label);if(!Number.isInteger(parsed))throw new Error(tr(`${label}에는 정수를 입력해 주세요.`,`Enter an integer for ${label}.`));return parsed;};
const row=(ko,en,value)=>({ko,en,value:String(value)});
const romanMap=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
const toRoman=(value)=>{if(value<1||value>3999)throw new Error(tr('1부터 3999 사이의 정수를 입력해 주세요.','Enter an integer from 1 to 3999.'));let out='';for(const [n,s] of romanMap)while(value>=n){out+=s;value-=n;}return out;};
const fromRoman=(value)=>{const upper=value.trim().toUpperCase();if(!/^[IVXLCDM]+$/.test(upper))throw new Error(tr('올바른 로마 숫자를 입력해 주세요.','Enter a valid Roman numeral.'));let total=0,previous=0;for(let i=upper.length-1;i>=0;i--){const current={I:1,V:5,X:10,L:50,C:100,D:500,M:1000}[upper[i]];total+=current<previous?-current:current;previous=Math.max(previous,current);}if(toRoman(total)!==upper)throw new Error(tr('표준 로마 숫자 표기를 입력해 주세요.','Enter a canonical Roman numeral.'));return total;};
const cronPart=(value,unitKo,unitEn)=>{if(value==='*')return tr(`매 ${unitKo}`,`every ${unitEn}`);if(/^\*\/\d+$/.test(value))return tr(`${value.slice(2)}${unitKo}마다`,`every ${value.slice(2)} ${unitEn}`);if(/^\d+(,\d+)+$/.test(value))return tr(`${value.split(',').join(', ')} ${unitKo}`,`${unitEn} ${value.split(',').join(', ')}`);if(/^\d+$/.test(value))return tr(`${value} ${unitKo}`,`${unitEn} ${value}`);throw new Error(tr(`지원하지 않는 ${unitKo} 표현입니다.`,`Unsupported ${unitEn} expression.`));};
const statusMap={200:['성공','OK'],201:['생성됨','Created'],204:['내용 없음','No Content'],301:['영구 이동','Moved Permanently'],302:['임시 이동','Found'],304:['변경 없음','Not Modified'],400:['잘못된 요청','Bad Request'],401:['인증 필요','Unauthorized'],403:['접근 금지','Forbidden'],404:['찾을 수 없음','Not Found'],405:['허용되지 않은 메서드','Method Not Allowed'],409:['충돌','Conflict'],422:['처리할 수 없는 내용','Unprocessable Content'],429:['요청 과다','Too Many Requests'],500:['서버 내부 오류','Internal Server Error'],502:['잘못된 게이트웨이','Bad Gateway'],503:['서비스 이용 불가','Service Unavailable'],504:['게이트웨이 시간 초과','Gateway Timeout']};
const mimeMap={html:'text/html',htm:'text/html',css:'text/css',js:'text/javascript',mjs:'text/javascript',json:'application/json',xml:'application/xml',txt:'text/plain',csv:'text/csv',md:'text/markdown',pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',svg:'image/svg+xml',webp:'image/webp',ico:'image/x-icon',mp3:'audio/mpeg',mp4:'video/mp4',webm:'video/webm',zip:'application/zip',woff:'font/woff',woff2:'font/woff2'};
const chmodSymbols=(digit)=>`${digit&4?'r':'-'}${digit&2?'w':'-'}${digit&1?'x':'-'}`;
const isbnCheck=(raw)=>{const value=raw.toUpperCase().replace(/[^0-9X]/g,'');if(value.length===10){if(!/^\d{9}[\dX]$/.test(value))return false;return [...value].reduce((sum,ch,index)=>sum+(ch==='X'?10:Number(ch))*(10-index),0)%11===0;}if(value.length===13&&/^\d{13}$/.test(value))return [...value].reduce((sum,ch,index)=>sum+Number(ch)*(index%2?3:1),0)%10===0;return false;};
const requiredText=(value,labelKo,labelEn,maxLength=100000)=>{
  const text=String(value??'').trim();
  if(!text)throw new Error(tr(`${labelKo}을(를) 입력해 주세요.`,`Enter ${labelEn}.`));
  if([...text].length>maxLength)throw new Error(tr(`${labelKo}은(는) ${maxLength.toLocaleString()}자 이하로 입력해 주세요.`,`Keep ${labelEn} within ${maxLength.toLocaleString()} characters.`));
  return text;
};
const strictNumber=(value,labelKo,labelEn,{min=-Infinity,max=Infinity,whole=false,exclusiveMin=false}={})=>{
  const text=String(value??'').trim();
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text))throw new Error(tr(`${labelKo}에 올바른 숫자를 입력해 주세요.`,`Enter a valid number for ${labelEn}.`));
  const parsed=Number(text);
  if(!Number.isFinite(parsed)||whole&&!Number.isInteger(parsed)||(exclusiveMin?parsed<=min:parsed<min)||parsed>max){
    const boundary=exclusiveMin?tr(`${min} 초과 ${max} 이하`,`greater than ${min} and at most ${max}`):tr(`${min} 이상 ${max} 이하`,`between ${min} and ${max}`);
    throw new Error(tr(`${labelKo}은(는) ${boundary} 범위로 입력해 주세요.`,`Enter ${labelEn} ${boundary}.`));
  }
  return parsed;
};
const formatted=(value,digits=6)=>new Intl.NumberFormat(window.ToolboxI18n?.language==='en'?'en-US':'ko-KR',{maximumFractionDigits:digits}).format(Object.is(value,-0)?0:value);
const htmlEscape=(value)=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const uniqueSorted=(values)=>{
  const unique=new Map();
  values.forEach((value)=>{const clean=String(value).trim();if(clean){const key=clean.normalize('NFC').toLocaleLowerCase();if(!unique.has(key))unique.set(key,clean);}});
  return [...unique.values()].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}));
};
const httpUrl=(value,labelKo,labelEn,optional=false)=>{
  const text=String(value??'').trim();
  if(!text&&optional)return'';
  if(!text)throw new Error(tr(`${labelKo}을(를) 입력해 주세요.`,`Enter ${labelEn}.`));
  let parsed;
  try{parsed=new URL(text);}catch{throw new Error(tr(`${labelKo}에 http 또는 https 전체 주소를 입력해 주세요.`,`Enter a full http or https URL for ${labelEn}.`));}
  if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)throw new Error(tr(`${labelKo}에는 로그인 정보가 없는 http 또는 https 주소만 사용할 수 있습니다.`,`Use an http or https URL without sign-in information for ${labelEn}.`));
  return parsed.href;
};
const ipv4Number=(value,labelKo='IP 주소',labelEn='IP address')=>{
  const text=String(value??'').trim(),parts=text.split('.');
  if(parts.length!==4||parts.some((part)=>!/^\d{1,3}$/.test(part)||(part.length>1&&part.startsWith('0'))||Number(part)>255)){
    throw new Error(tr(`${labelKo}을(를) 0.0.0.0부터 255.255.255.255 사이의 점 4개 형식으로 입력해 주세요.`,`Enter ${labelEn} in four-part dotted form from 0.0.0.0 to 255.255.255.255.`));
  }
  return parts.reduce((total,part)=>total*256+Number(part),0);
};
const ipv4Text=(value)=>[24,16,8,0].map((shift)=>Math.floor(value/2**shift)%256).join('.');
const cidrPrefix=(value,labelKo='CIDR 접두사',labelEn='CIDR prefix')=>strictNumber(value,labelKo,labelEn,{min:0,max:32,whole:true});
const prefixMask=(prefix)=>prefix===0?0:2**32-2**(32-prefix);
const rangeCidrs=(start,end)=>{
  const blocks=[];
  let current=start;
  while(current<=end){
    let size=current===0?2**32:1;
    if(current!==0)while(size<2**32&&current%(size*2)===0)size*=2;
    const remaining=end-current+1;
    while(size>remaining)size/=2;
    blocks.push(`${ipv4Text(current)}/${32-Math.log2(size)}`);
    current+=size;
  }
  return blocks;
};
const coordinateAxis=(value)=>{
  const normalized=String(value??'').trim().toLowerCase();
  if(['lat','latitude'].includes(normalized))return'lat';
  if(['lon','lng','longitude'].includes(normalized))return'lon';
  throw new Error(tr('좌표 축은 위도 또는 경도를 선택해 주세요.','Choose latitude or longitude as the coordinate axis.'));
};
const coordinateNumber=(value,axis,labelKo,labelEn)=>strictNumber(value,labelKo,labelEn,{min:axis==='lat'?-90:-180,max:axis==='lat'?90:180});
const dmsValue=(decimal,axis)=>{
  const direction=axis==='lat'?(decimal<0?'S':'N'):(decimal<0?'W':'E');
  const total=Math.round(Math.abs(decimal)*3600000)/1000;
  const degrees=Math.floor(total/3600);
  const remainder=total-degrees*3600;
  const minutes=Math.floor(remainder/60);
  const seconds=Number((remainder-minutes*60).toFixed(3));
  return`${degrees}° ${minutes}′ ${formatted(seconds,3)}″ ${direction}`;
};
const compassPoint=(bearing)=>['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(bearing/22.5)%16];
const operations={
  'slug-generator':(v)=>{const separator=v.separator;const slug=v.text.trim().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,separator).replace(new RegExp(`^\\${separator}+|\\${separator}+$`,'g'),'').replace(new RegExp(`\\${separator}{2,}`,'g'),separator);if(!slug)throw new Error(tr('슬러그로 바꿀 문자를 입력해 주세요.','Enter text that can become a slug.'));return[row('슬러그','Slug',slug),row('단어 수','Word count',slug.split(separator).filter(Boolean).length),row('길이','Length',slug.length)];},
  'line-sort-deduplicator':(v)=>{let lines=v.lines.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!lines.length)throw new Error(tr('정리할 줄을 입력해 주세요.','Enter lines to organize.'));const before=lines.length;if(v.unique==='yes')lines=[...new Map(lines.map(x=>[x.toLocaleLowerCase(),x])).values()];lines.sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}));if(v.order==='desc')lines.reverse();return[row('정리 결과','Organized lines',lines.join('\n')),row('줄 수','Line count',`${before} → ${lines.length}`)];},
  'html-entity-converter':(v)=>{if(!v.text)throw new Error(tr('변환할 텍스트를 입력해 주세요.','Enter text to convert.'));if(v.mode==='encode'){const value=v.text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');return[row('인코딩 결과','Encoded result',value)];}const box=document.createElement('textarea');box.innerHTML=v.text;return[row('디코딩 결과','Decoded result',box.value)];},
  'roman-numeral-converter':(v)=>v.mode==='toRoman'?[row('로마 숫자','Roman numeral',toRoman(integer(v.value,tr('값','value'))))]:[row('아라비아 숫자','Arabic number',fromRoman(v.value))],
  'fraction-simplifier':(v)=>{let n=integer(v.numerator,tr('분자','numerator')),d=integer(v.denominator,tr('분모','denominator'));if(!d)throw new Error(tr('분모는 0이 될 수 없습니다.','The denominator cannot be zero.'));if(d<0){n=-n;d=-d;}const g=gcd(n,d);return[row('기약분수','Simplified fraction',`${n/g}/${d/g}`),row('최대공약수','Greatest common divisor',g),row('소수값','Decimal value',n/d)];},
  'average-median-calculator':(v)=>{const values=v.numbers.split(/[\s,]+/).filter(Boolean).map(x=>number(x,tr('숫자 목록','number list')));if(!values.length)throw new Error(tr('숫자를 하나 이상 입력해 주세요.','Enter at least one number.'));const sorted=[...values].sort((a,b)=>a-b),sum=values.reduce((a,b)=>a+b,0),middle=Math.floor(sorted.length/2),median=sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;return[row('평균','Average',sum/values.length),row('중앙값','Median',median),row('합계','Sum',sum),row('최솟값 / 최댓값','Minimum / maximum',`${sorted[0]} / ${sorted.at(-1)}`),row('개수','Count',values.length)];},
  'ratio-simplifier':(v)=>{let a=integer(v.left,tr('첫 번째 값','first value')),b=integer(v.right,tr('두 번째 값','second value'));if(!a&&!b)throw new Error(tr('둘 중 하나는 0이 아니어야 합니다.','At least one value must be non-zero.'));const g=gcd(a,b);return[row('간단한 비','Simplified ratio',`${a/g} : ${b/g}`),row('최대공약수','Greatest common divisor',g),row('첫째÷둘째','First ÷ second',b===0?tr('정의되지 않음','Undefined'):a/b)];},
  'css-unit-converter':(v)=>{const value=number(v.value,tr('값','value')),base=number(v.base,tr('기준 글자 크기','base font size'));if(base<=0)throw new Error(tr('기준 글자 크기는 0보다 커야 합니다.','Base font size must be greater than zero.'));const px=v.from==='px'?value:value*base,result=v.to==='px'?px:px/base;return[row('변환 결과','Converted value',`${Number(result.toFixed(6))}${v.to}`),row('기준','Base',`${base}px = 1rem = 1em`)];},
  'css-border-radius-generator':(v)=>{const values=['topLeft','topRight','bottomRight','bottomLeft'].map(id=>number(v[id],id));if(values.some(x=>x<0||x>999))throw new Error(tr('모서리 값은 0~999px로 입력해 주세요.','Enter corner values from 0 to 999px.'));return[row('CSS','CSS',`border-radius: ${values.map(x=>`${x}px`).join(' ')};`),row('순서','Order',tr('왼쪽 위 → 오른쪽 위 → 오른쪽 아래 → 왼쪽 아래','top-left → top-right → bottom-right → bottom-left'))];},
  'markdown-table-generator':(v)=>{const headers=v.headers.split(',').map(x=>x.trim()).filter(Boolean);if(!headers.length)throw new Error(tr('쉼표로 구분한 머리글을 입력해 주세요.','Enter comma-separated headers.'));const escapeCell=x=>x.trim().replaceAll('|','\\|');const rows=v.rows.split(/\r?\n/).filter(x=>x.trim()).map(line=>line.split(',').map(escapeCell));const width=headers.length;const normalize=cells=>Array.from({length:width},(_,i)=>cells[i]||'');const output=[`| ${normalize(headers).map(escapeCell).join(' | ')} |`,`| ${headers.map(()=> '---').join(' | ')} |`,...rows.map(cells=>`| ${normalize(cells).join(' | ')} |`)].join('\n');return[row('마크다운 표','Markdown table',output),row('크기','Size',`${rows.length} × ${width}`)];},
  'chmod-calculator':(v)=>{const digits=[v.owner,v.group,v.other].map(Number),numeric=digits.join(''),symbolic=digits.map(chmodSymbols).join('');return[row('숫자 권한','Numeric mode',numeric),row('기호 권한','Symbolic mode',symbolic),row('명령 예시','Command example',`chmod ${numeric} filename`)];},
  'cron-expression-explainer':(v)=>{const parts=v.expression.trim().split(/\s+/);if(parts.length!==5)throw new Error(tr('분·시·일·월·요일의 5개 항목을 입력해 주세요.','Enter five fields: minute, hour, day, month, weekday.'));const labels=[['분','minute'],['시','hour'],['일','day'],['월','month'],['요일','weekday']];return parts.map((part,i)=>row(labels[i][0],labels[i][1],cronPart(part,labels[i][0],labels[i][1])));},
  'http-status-lookup':(v)=>{const code=integer(v.code,tr('상태 코드','status code')),found=statusMap[code];if(!found)throw new Error(tr('지원 목록에 없는 상태 코드입니다.','That status code is not in the lookup list.'));const group=Math.floor(code/100);return[row('상태','Status',`${code} ${found[1]}`),row('한글 의미','Korean meaning',found[0]),row('분류','Class',group===2?'Success':group===3?'Redirection':group===4?'Client error':'Server error')];},
  'mime-type-lookup':(v)=>{const ext=v.extension.trim().toLowerCase().replace(/^.*\./,'');const mime=mimeMap[ext];if(!mime)throw new Error(tr('지원 목록에 없는 확장자입니다.','That extension is not in the lookup list.'));return[row('확장자','Extension',`.${ext}`),row('MIME 타입','MIME type',mime),row('Content-Type 예시','Content-Type example',`Content-Type: ${mime}`)];},
  'isbn-validator':(v)=>{const clean=v.isbn.toUpperCase().replace(/[^0-9X]/g,'');if(![10,13].includes(clean.length))throw new Error(tr('ISBN-10 또는 ISBN-13을 입력해 주세요.','Enter an ISBN-10 or ISBN-13.'));return[row('정리된 ISBN','Normalized ISBN',clean),row('형식','Format',`ISBN-${clean.length}`),row('검증 결과','Validation result',isbnCheck(clean)?tr('체크 숫자가 올바릅니다.','The check digit is valid.'):tr('체크 숫자가 올바르지 않습니다.','The check digit is invalid.'))];},
  'text-extractor-tool':(v)=>{
    const mode=String(v.mode??'').trim();
    const labels={
      email:['이메일 주소','Email addresses'],
      url:['웹 주소','Web URLs'],
      phone:['전화번호 후보','Phone number candidates'],
      social:['해시태그·계정 태그','Hashtags and account tags']
    };
    if(!labels[mode])throw new Error(tr('추출 종류를 선택해 주세요.','Choose an extraction type.'));
    const text=requiredText(v.text,'원본 텍스트','source text',100000);
    let matches=[];
    if(mode==='email')matches=text.match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/gi)||[];
    if(mode==='url'){
      const urlPattern=/https?:\/\/[^\s<>"'`]+/gi;
      const urls=(text.match(urlPattern)||[]).map((value)=>value.replace(/[),.;!?]+$/u,''));
      const withoutUrls=text.replace(urlPattern,' ');
      const domains=[...withoutUrls.matchAll(/(?:^|[^\p{L}\p{N}_@.-])((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}(?:\/[^\s<>"'`]*)?)/gimu)].map((match)=>match[1].replace(/[),.;!?]+$/u,''));
      matches=[...urls,...domains];
    }
    if(mode==='phone')matches=(text.match(/\+?\d[\d ().-]{5,}\d/g)||[]).map((value)=>value.trim()).filter((value)=>{const digits=value.replace(/\D/g,'');return digits.length>=7&&digits.length<=15;});
    if(mode==='social')matches=[...text.matchAll(/(?:^|[^\p{L}\p{N}_])([#@][\p{L}\p{N}_]+)/gu)].map((match)=>match[1]);
    const cleaned=uniqueSorted(matches);
    if(cleaned.length>2000)throw new Error(tr('추출 결과가 2,000개를 넘습니다. 입력 범위를 줄여 주세요.','More than 2,000 results were found. Narrow the input.'));
    return[
      row('추출 종류','Extraction type',tr(labels[mode][0],labels[mode][1])),
      row('고유 항목 수','Unique item count',cleaned.length),
      row('중복 제거·정렬 결과','Deduplicated and sorted results',cleaned.length?cleaned.join('\n'):tr('일치하는 항목 없음','No matching items'))
    ];
  },
  'web-meta-preview-builder':(v)=>{
    const title=requiredText(v.title,'페이지 제목','page title',200).replace(/\s+/g,' ');
    const description=requiredText(v.description,'페이지 설명','page description',500).replace(/\s+/g,' ');
    const url=httpUrl(v.url,'대표 URL','canonical URL');
    const image=httpUrl(v.image,'대표 이미지 URL','social image URL',true);
    const robots=String(v.robots??'').toLowerCase().replace(/\s+/g,'');
    if(!['index,follow','noindex,follow','index,nofollow','noindex,nofollow'].includes(robots))throw new Error(tr('검색 로봇 설정을 목록에서 선택해 주세요.','Choose a search robot setting from the list.'));
    const base=[
      `<title>${htmlEscape(title)}</title>`,
      `<meta name="description" content="${htmlEscape(description)}">`,
      `<meta name="robots" content="${htmlEscape(robots)}">`,
      `<link rel="canonical" href="${htmlEscape(url)}">`
    ];
    const social=[
      '<meta property="og:type" content="website">',
      `<meta property="og:title" content="${htmlEscape(title)}">`,
      `<meta property="og:description" content="${htmlEscape(description)}">`,
      `<meta property="og:url" content="${htmlEscape(url)}">`,
      ...(image?[`<meta property="og:image" content="${htmlEscape(image)}">`]:[]),
      `<meta name="twitter:card" content="${image?'summary_large_image':'summary'}">`,
      `<meta name="twitter:title" content="${htmlEscape(title)}">`,
      `<meta name="twitter:description" content="${htmlEscape(description)}">`,
      ...(image?[`<meta name="twitter:image" content="${htmlEscape(image)}">`]:[])
    ];
    const lengthCheck=tr(
      `제목 ${[...title].length}자 · 설명 ${[...description].length}자`,
      `Title ${[...title].length} chars · description ${[...description].length} chars`
    );
    return[
      row('검색 결과 미리보기','Search result preview',`${title}\n${url}\n${description}`),
      row('길이 확인','Length check',lengthCheck),
      row('기본 메타 태그','Base meta tags',base.join('\n')),
      row('Open Graph·Twitter 태그','Open Graph and Twitter tags',social.join('\n')),
      row('전체 HTML 조각','Full HTML snippet',[...base,...social].join('\n'))
    ];
  },
  'loan-savings-calculator':(v)=>{
    const mode=String(v.mode??'').trim();
    if(!['loan','lump','monthly','goal'].includes(mode))throw new Error(tr('계산 종류를 선택해 주세요.','Choose a calculation type.'));
    const months=strictNumber(v.months,'기간(개월)','term in months',{min:1,max:1200,whole:true});
    const annualRate=strictNumber(v.annualRate,'연 이율','annual rate',{min:0,max:100});
    const monthlyRate=annualRate/1200;
    const growth=monthlyRate===0?1:Math.exp(months*Math.log1p(monthlyRate));
    const annuity=monthlyRate===0?months:(growth-1)/monthlyRate;
    const amount=(value,labelKo,labelEn,positive=false)=>strictNumber(value,labelKo,labelEn,{min:0,max:1e15,exclusiveMin:positive});
    const money=(value)=>{
      if(!Number.isFinite(value))throw new Error(tr('계산 범위가 너무 큽니다. 금액·이율·기간을 줄여 주세요.','The result is too large. Reduce the amount, rate, or term.'));
      return formatted(value,2);
    };
    if(mode==='loan'){
      const principal=amount(v.loanAmount,'대출 원금','loan principal',true);
      const equalPayment=monthlyRate===0?principal/months:principal*monthlyRate/-Math.expm1(-months*Math.log1p(monthlyRate));
      const equalPaymentInterest=equalPayment*months-principal;
      const principalPart=principal/months;
      const equalPrincipalFirst=principalPart+principal*monthlyRate;
      const equalPrincipalLast=principalPart+principalPart*monthlyRate;
      const equalPrincipalInterest=principal*monthlyRate*(months+1)/2;
      return[
        row('원리금균등 월 납입액','Equal-payment monthly amount',money(equalPayment)),
        row('원리금균등 총 이자','Equal-payment total interest',money(equalPaymentInterest)),
        row('원금균등 첫 달 납입액','Equal-principal first payment',money(equalPrincipalFirst)),
        row('원금균등 마지막 달 납입액','Equal-principal last payment',money(equalPrincipalLast)),
        row('원금균등 총 이자','Equal-principal total interest',money(equalPrincipalInterest))
      ];
    }
    const start=amount(v.startAmount,'시작 금액','starting amount');
    if(mode==='lump'){
      if(start===0)throw new Error(tr('시작 금액은 0보다 크게 입력해 주세요.','Enter a starting amount greater than zero.'));
      const balance=start*growth;
      return[
        row('만기 예상 잔액','Estimated ending balance',money(balance)),
        row('예상 증가액','Estimated growth',money(balance-start)),
        row('계산 기간','Calculation term',tr(`${months}개월`,`${months} months`))
      ];
    }
    if(mode==='monthly'){
      const deposit=amount(v.monthlyDeposit,'월 납입액','monthly deposit');
      if(start===0&&deposit===0)throw new Error(tr('시작 금액이나 월 납입액 중 하나는 0보다 커야 합니다.','The starting amount or monthly deposit must be greater than zero.'));
      const balance=start*growth+deposit*annuity;
      const contributed=start+deposit*months;
      return[
        row('만기 예상 잔액','Estimated ending balance',money(balance)),
        row('총 납입 원금','Total contributions',money(contributed)),
        row('예상 증가액','Estimated growth',money(balance-contributed))
      ];
    }
    const target=amount(v.targetAmount,'목표 금액','target amount',true);
    const remaining=target-start*growth;
    const deposit=Math.max(0,remaining/annuity);
    const contributed=start+deposit*months;
    return[
      row('필요한 월 납입액','Required monthly deposit',money(deposit)),
      row('총 납입 원금','Total contributions',money(contributed)),
      row('목표 중 예상 증가액','Estimated growth toward target',money(Math.max(0,target-contributed)))
    ];
  },
  'ip-network-calculator':(v)=>{
    const mode=String(v.mode??'').trim();
    if(!['cidr','mask','range','mac'].includes(mode))throw new Error(tr('네트워크 계산 종류를 선택해 주세요.','Choose a network calculation type.'));
    if(mode==='cidr'){
      const input=requiredText(v.ipCidr,'CIDR 주소','CIDR address',50);
      const match=/^([^/]+)\/(\d{1,2})$/.exec(input);
      if(!match)throw new Error(tr('192.168.1.42/24처럼 IP 주소와 접두사를 함께 입력해 주세요.','Enter an IP address and prefix such as 192.168.1.42/24.'));
      const address=ipv4Number(match[1]),prefix=cidrPrefix(match[2]),size=2**(32-prefix);
      const network=Math.floor(address/size)*size,broadcast=network+size-1,mask=prefixMask(prefix);
      const usable=prefix>=31?size:Math.max(0,size-2);
      const first=prefix===32?network:prefix===31?network:network+1;
      const last=prefix===32?broadcast:prefix===31?broadcast:broadcast-1;
      return[
        row('네트워크 주소','Network address',`${ipv4Text(network)}/${prefix}`),
        row('서브넷 마스크','Subnet mask',ipv4Text(mask)),
        row('와일드카드 마스크','Wildcard mask',ipv4Text(2**32-1-mask)),
        row('브로드캐스트 주소','Broadcast address',ipv4Text(broadcast)),
        row('사용 가능 범위','Usable range',`${ipv4Text(first)} – ${ipv4Text(last)}`),
        row('전체 / 사용 가능 주소 수','Total / usable addresses',`${formatted(size,0)} / ${formatted(usable,0)}`)
      ];
    }
    if(mode==='mask'){
      const prefix=cidrPrefix(v.prefix),mask=prefixMask(prefix),size=2**(32-prefix);
      return[
        row('CIDR 접두사','CIDR prefix',`/${prefix}`),
        row('서브넷 마스크','Subnet mask',ipv4Text(mask)),
        row('와일드카드 마스크','Wildcard mask',ipv4Text(2**32-1-mask)),
        row('전체 주소 수','Total address count',formatted(size,0)),
        row('일반 사용 가능 주소 수','Typical usable address count',formatted(prefix>=31?size:Math.max(0,size-2),0))
      ];
    }
    if(mode==='range'){
      const start=ipv4Number(v.startIp,'시작 IP 주소','start IP address');
      const end=ipv4Number(v.endIp,'끝 IP 주소','end IP address');
      if(start>end)throw new Error(tr('시작 IP 주소는 끝 IP 주소보다 앞서거나 같아야 합니다.','The start IP address must be less than or equal to the end IP address.'));
      const blocks=rangeCidrs(start,end);
      return[
        row('정리된 범위','Normalized range',`${ipv4Text(start)} – ${ipv4Text(end)}`),
        row('주소 수','Address count',formatted(end-start+1,0)),
        row('최소 CIDR 블록','Minimal CIDR blocks',blocks.join('\n')),
        row('CIDR 블록 수','CIDR block count',blocks.length)
      ];
    }
    const raw=requiredText(v.mac,'MAC 주소','MAC address',40);
    const clean=raw.replace(/[:.\-\s]/g,'');
    if(!/^[0-9a-fA-F]{12}$/.test(clean))throw new Error(tr('MAC 주소를 12자리 16진수 형식으로 입력해 주세요.','Enter a MAC address as 12 hexadecimal digits.'));
    const upper=clean.toUpperCase(),pairs=upper.match(/.{2}/g),first=Number.parseInt(upper.slice(0,2),16);
    return[
      row('콜론 형식','Colon format',pairs.join(':')),
      row('하이픈 형식','Hyphen format',pairs.join('-')),
      row('점 형식','Dot format',`${upper.slice(0,4)}.${upper.slice(4,8)}.${upper.slice(8)}`),
      row('전송 방식','Transmission type',tr(first&1?'멀티캐스트':'유니캐스트',first&1?'Multicast':'Unicast')),
      row('관리 방식','Administration type',tr(first&2?'로컬 관리':'전역 관리',first&2?'Locally administered':'Universally administered'))
    ];
  },
  'coordinate-distance-calculator':(v)=>{
    const mode=String(v.mode??'').trim();
    if(!['route','toDms','fromDms'].includes(mode))throw new Error(tr('좌표 계산 종류를 선택해 주세요.','Choose a coordinate calculation type.'));
    if(mode==='route'){
      const lat1=coordinateNumber(v.lat1,'lat','첫 번째 위도','first latitude');
      const lon1=coordinateNumber(v.lon1,'lon','첫 번째 경도','first longitude');
      const lat2=coordinateNumber(v.lat2,'lat','두 번째 위도','second latitude');
      const lon2=coordinateNumber(v.lon2,'lon','두 번째 경도','second longitude');
      const radians=(degrees)=>degrees*Math.PI/180,degrees=(radiansValue)=>radiansValue*180/Math.PI;
      const phi1=radians(lat1),phi2=radians(lat2),deltaPhi=radians(lat2-lat1),deltaLambda=radians(lon2-lon1);
      const haversine=Math.sin(deltaPhi/2)**2+Math.cos(phi1)*Math.cos(phi2)*Math.sin(deltaLambda/2)**2;
      const distance=6371.0088*2*Math.atan2(Math.sqrt(Math.min(1,haversine)),Math.sqrt(Math.max(0,1-haversine)));
      const same=distance<1e-9;
      const bearing=same?null:(degrees(Math.atan2(Math.sin(deltaLambda)*Math.cos(phi2),Math.cos(phi1)*Math.sin(phi2)-Math.sin(phi1)*Math.cos(phi2)*Math.cos(deltaLambda)))+360)%360;
      const bx=Math.cos(phi2)*Math.cos(deltaLambda),by=Math.cos(phi2)*Math.sin(deltaLambda);
      const midpointDenominator=Math.hypot(Math.cos(phi1)+bx,by);
      const midpoint=midpointDenominator<1e-12?null:[
        degrees(Math.atan2(Math.sin(phi1)+Math.sin(phi2),midpointDenominator)),
        ((degrees(radians(lon1)+Math.atan2(by,Math.cos(phi1)+bx))+540)%360)-180
      ];
      return[
        row('구면 거리','Spherical distance',`${formatted(distance,3)} km · ${formatted(distance*0.621371192,3)} mi`),
        row('초기 방위각','Initial bearing',bearing===null?tr('동일 지점','Same point'):`${formatted(bearing,2)}° ${compassPoint(bearing)}`),
        row('중간점','Midpoint',midpoint?`${formatted(midpoint[0],6)}, ${formatted(midpoint[1],6)}`:tr('정의되지 않음(대척점)','Undefined for antipodal points'))
      ];
    }
    if(mode==='toDms'){
      const axis=coordinateAxis(v.axis);
      const decimal=coordinateNumber(v.decimal,axis,'십진 좌표','decimal coordinate');
      return[
        row('좌표 축','Coordinate axis',tr(axis==='lat'?'위도':'경도',axis==='lat'?'Latitude':'Longitude')),
        row('도·분·초','Degrees, minutes, seconds',dmsValue(decimal,axis)),
        row('십진 좌표','Decimal coordinate',formatted(decimal,8))
      ];
    }
    const direction=String(v.direction??'').trim().toUpperCase();
    if(!['N','S','E','W'].includes(direction))throw new Error(tr('방향은 N, S, E, W 중에서 선택해 주세요.','Choose N, S, E, or W as the direction.'));
    const axis=['N','S'].includes(direction)?'lat':'lon',maximum=axis==='lat'?90:180;
    const degreesValue=strictNumber(v.degrees,'도','degrees',{min:0,max:maximum,whole:true});
    const minutesValue=strictNumber(v.minutes,'분','minutes',{min:0,max:59.999999});
    const secondsValue=strictNumber(v.seconds,'초','seconds',{min:0,max:59.999999});
    if(degreesValue===maximum&&(minutesValue!==0||secondsValue!==0))throw new Error(tr(`${maximum}도에서는 분과 초를 0으로 입력해 주세요.`,`At ${maximum} degrees, enter zero minutes and seconds.`));
    const sign=['S','W'].includes(direction)?-1:1;
    const decimal=sign*(degreesValue+minutesValue/60+secondsValue/3600);
    return[
      row('좌표 축','Coordinate axis',tr(axis==='lat'?'위도':'경도',axis==='lat'?'Latitude':'Longitude')),
      row('십진 좌표','Decimal coordinate',formatted(decimal,8)),
      row('정리된 도·분·초','Normalized DMS',dmsValue(decimal,axis))
    ];
  }
};

export function mountGeneratedTool({slug,preset,fields}){
  const $=selector=>document.querySelector(selector);
  const controllerNodes=(key)=>{
    const byId=document.getElementById(key);
    if(byId&&['radio','checkbox'].includes(byId.type)&&byId.name)return[...document.getElementsByName(byId.name)];
    if(byId)return[byId];
    return[...document.getElementsByName(key)];
  };
  const controllerValue=(key)=>{
    const controls=controllerNodes(key);
    if(!controls.length)return'';
    if(controls[0].type==='radio')return controls.find((control)=>control.checked)?.value||'';
    if(controls[0].type==='checkbox')return controls[0].checked?(controls[0].value||'true'):'false';
    return controls[0].value;
  };
  const setControllerValue=(key,value)=>{
    const controls=controllerNodes(key);
    if(controls[0]?.type==='radio')controls.forEach((control)=>{control.checked=control.value===value;});
    else if(controls[0]?.type==='checkbox')controls[0].checked=value!=='false';
    else if(controls[0])controls[0].value=value;
  };
  const initial=Object.fromEntries(fields.map(id=>[id,controllerValue(id)]));
  const conditionalFields=[...document.querySelectorAll('.st-field[data-show-field][data-show-values]')];
  const initialDisabled=new WeakMap();
  conditionalFields.forEach((field)=>field.querySelectorAll('input,select,textarea,button').forEach((control)=>{
    if(!initialDisabled.has(control))initialDisabled.set(control,control.disabled);
  }));
  const syncVisibility=()=>{
    conditionalFields.forEach((field)=>{
      const allowed=field.dataset.showValues.split(/[,\s|]+/).filter(Boolean);
      field.hidden=!allowed.includes(controllerValue(field.dataset.showField));
    });
    conditionalFields.forEach((field)=>field.querySelectorAll('input,select,textarea,button').forEach((control)=>{
      control.disabled=Boolean(initialDisabled.get(control)||control.closest('.st-field[data-show-field][hidden]'));
    }));
  };
  let result=[];
  const status=(ko,en,error=false)=>{const el=$('#sg-status');el.textContent=tr(ko,en);el.className=`st-status ${error?'is-error':'is-good'}`;};
  const values=()=>Object.fromEntries(fields.map(id=>[id,controllerValue(id)]));
  const render=()=>{const output=$('#sg-output');output.className='sg-results';output.replaceChildren(...result.map(item=>{const wrap=document.createElement('dl');wrap.className='sg-result-row';const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=tr(item.ko,item.en);dd.textContent=item.value;wrap.append(dt,dd);return wrap;}));};
  const run=()=>{syncVisibility();try{result=operations[preset](values());render();$('#sg-result').hidden=false;$('#sg-fallback').hidden=true;status('결과를 만들었습니다.','Result created.');}catch(error){result=[];$('#sg-result').hidden=true;status(error.message,error.message,true);}};
  $('#sg-run').addEventListener('click',run);fields.forEach(id=>controllerNodes(id).forEach((control)=>control.addEventListener(control.tagName==='SELECT'||['radio','checkbox'].includes(control.type)?'change':'input',run)));
  $('#sg-copy').addEventListener('click',async()=>{if(!result.length)return status('먼저 결과를 만들어 주세요.','Create a result first.',true);const text=result.map(item=>`${tr(item.ko,item.en)}: ${item.value}`).join('\n');if(await copyText(text)){status('결과를 복사했습니다.','Result copied.');$('#sg-fallback').hidden=true;}else{$('#sg-fallback').value=text;$('#sg-fallback').hidden=false;status('직접 복사할 결과를 표시했습니다.','A manual copy field is shown.',true);}});
  $('#sg-reset').addEventListener('click',()=>{fields.forEach(id=>setControllerValue(id,initial[id]));syncVisibility();result=[];$('#sg-result').hidden=true;$('#sg-fallback').hidden=true;status('입력을 초기화했습니다.','Inputs reset.');});
  addEventListener('toolbox-language-change',run);
  syncVisibility();
  run();
  setupEmbedHeight(slug,{content:true});
}
