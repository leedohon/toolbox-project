(function () {
  'use strict';

  const STORAGE_KEY = 'toolbox-language';
  const exact = new Map(Object.entries({
    'Language / 언어': 'Language', '텍스트 인코더·디코더': 'Text encoder / decoder', '변환 형식': 'Encoding format', '변환 모드': 'Conversion mode', 'Base64 인코딩': 'Base64 encode', 'Base64 디코딩': 'Base64 decode', 'URL 인코딩 문자열': 'URL-encoded input', 'URL 인코딩 결과': 'URL-encoded result',
    '텍스트 인코딩 결과를 URL-safe Base64 형식으로 만들기': 'Create URL-safe Base64 for encoded text',
    '원본 텍스트': 'Original text', 'Base64 입력': 'Base64 input', 'Base64 결과': 'Base64 result', '디코딩 결과': 'Decoded result',
    '입력': 'Input', '결과': 'Result', '텍스트나 파일을 이곳에 놓으세요': 'Drop text or a file here', '텍스트 또는 파일 드롭 영역': 'Text or file drop zone',
    'Base64로 인코딩': 'Encode to Base64', '입력·결과 바꾸기': 'Swap input and result', '바꿀 변환 결과가 없습니다.': 'There is no converted result to swap.', '입력과 결과를 바꾸고 반대 변환 모드로 전환했습니다.': 'Swapped the input and result and switched conversion mode.', '결과 복사': 'Copy result', '초기화': 'Reset',
    '파일을 Base64로 변환': 'Convert a file to Base64', '파일 선택': 'Choose file',
    'Base64 결과를 파일로 저장': 'Save Base64 result as a file', '다운로드 파일 이름': 'Download file name', '파일 다운로드': 'Download file',
    '모든 변환은 이 브라우저에서만 처리됩니다.': 'All conversions are processed only in this browser.',
    '텍스트와 파일을 브라우저 안에서 안전하게 Base64로 변환하세요.': 'Safely convert text and files to Base64 in your browser.',
    '여기에 텍스트를 입력하거나 붙여넣으세요.': 'Type or paste text here.', '변환 결과가 여기에 표시됩니다.': 'The converted result appears here.',
    'Base64 문자열 또는 data: URL을 입력하세요.': 'Enter a Base64 string or data: URL.', '디코딩된 텍스트가 여기에 표시됩니다.': 'Decoded text appears here.',
    '변환이 완료되었습니다.': 'Conversion complete.', '변환 중 오류가 발생했습니다.': 'An error occurred during conversion.',
    '모드를 변경했습니다.': 'Mode changed.', '입력과 결과를 비웠습니다.': 'Input and result cleared.',
    '복사할 결과가 없습니다.': 'There is no result to copy.', '결과를 클립보드에 복사했습니다.': 'Result copied to the clipboard.',
    '파일을 읽지 못했습니다.': 'Could not read the file.', '텍스트를 불러왔습니다. 변환 버튼을 눌러주세요.': 'Text loaded. Select the convert button.',
    '저장할 Base64 결과가 없습니다.': 'There is no Base64 result to save.', '파일 다운로드를 시작했습니다.': 'File download started.',
    '파일을 만들지 못했습니다.': 'Could not create the file.', '유효한 Base64 형식이 아닙니다.': 'This is not valid Base64.',

    '결과 방식': 'Output format', '보기 좋게 정리': 'Pretty print', '한 줄로 압축': 'Minify', '예: {"name":"toolbox","enabled":true}': 'e.g. {"name":"toolbox","enabled":true}',
    'JSON을 입력하면 실시간으로 검사합니다.': 'Enter JSON to validate it in real time.', 'JSON 입력': 'JSON input',
    '결과 및 오류 위치': 'Result and error location', '유효한 JSON을 입력하면 결과가 여기에 표시됩니다.': 'Enter valid JSON to display the result here.',
    '예제 JSON 불러오기': 'Load sample JSON', '예제 JSON을 불러왔습니다.': 'Sample JSON loaded.', 'JSON 파일 저장': 'Save JSON file', '전체 비우기': 'Clear all', 'Excel 표 미리보기': 'Excel table preview',
    '유효한 JSON을 입력하면 표를 만듭니다.': 'Enter valid JSON to build a table.', 'Excel 변환 표 미리보기': 'Excel conversion table preview',
    '표시할 데이터가 없습니다.': 'No data to display.', 'Excel 다운로드 (.xlsx)': 'Download Excel (.xlsx)', 'CSV 다운로드 (.csv)': 'Download CSV (.csv)',
    '유효한 JSON입니다. 결과가 자동으로 갱신되었습니다.': 'Valid JSON. The result was updated automatically.',
    'JSON 형식을 확인해 주세요.': 'Check the JSON format.', '복사할 유효한 JSON 결과가 없습니다.': 'There is no valid JSON result to copy.',
    '복사했습니다': 'Copied', '복사하지 못했습니다. 브라우저 권한을 확인해 주세요.': 'Could not copy. Check your browser permissions.',
    '저장할 유효한 JSON 결과가 없습니다.': 'There is no valid JSON result to save.',
    'Excel로 저장할 유효한 JSON 데이터가 없습니다.': 'There is no valid JSON data to save as Excel.',
    'Excel 생성 기능을 불러오지 못했습니다. 네트워크 연결 후 다시 시도해 주세요.': 'Could not load Excel export. Check your connection and try again.',
    'CSV로 저장할 유효한 JSON 데이터가 없습니다.': 'There is no valid JSON data to save as CSV.',
    '값': 'Value', '키': 'Key', 'JSON 데이터': 'JSON data', 'JSON 형식이 올바르지 않습니다.': 'The JSON format is invalid.',

    '텍스트 또는 URL': 'Text or URL', '예: https://bloggiedh.blogspot.com/': 'e.g. https://bloggiedh.blogspot.com/', '생성 유형': 'Output type', 'QR 코드': 'QR code', '바코드': 'Barcode',
    'QR 스타일': 'QR style', '기본형': 'Basic', '둥근형': 'Rounded', '크기': 'Size', '색상': 'Colors',
    '전경색': 'Foreground', '배경색': 'Background', '생성된 QR 코드': 'Generated QR code', '생성된 바코드': 'Generated barcode',
    '이미지 저장': 'Save image', '기본값으로 초기화': 'Reset defaults', '기본값으로 초기화했습니다.': 'Reset to the default settings.', '바코드 하단 텍스트 표시': 'Show text below barcode',
    '텍스트 또는 URL을 입력해 주세요.': 'Enter text or a URL.', '생성하지 못했습니다.': 'Could not generate the image.',

    '사다리게임': 'Ladder game', '참가자와 결과': 'Participants and outcomes', '번호': 'No.', '참가자': 'Participant', '삭제': 'Remove',
    '+ 참가자와 결과 추가': '+ Add participant and outcome', '2~12줄 · 참가자와 결과를 한 줄씩 함께 입력하세요.': '2–12 rows · Enter each participant and outcome together.',
    '사다리 만들기': 'Build ladder', '다시 섞기': 'Shuffle again', '각 줄의 참가자와 결과를 확인해 주세요.': 'Check the participant and outcome in each row.',
    '사다리 결과': 'Ladder result', '생성된 사다리': 'Generated ladder', '참가자와 결과를 모두 입력해 주세요.': 'Enter both the participant and outcome.',
    '예: 민수': 'e.g. Alex', '예: 커피 사기': 'e.g. Buy coffee',

    '돌림판 항목': 'Wheel items', '+ 항목 추가': '+ Add item', '2~20개 · 마지막 칸에서 Enter를 누르면 다음 항목이 추가됩니다.': '2–20 items · Press Enter in the last field to add another item.',
    '돌림판 돌리기': 'Spin wheel', '항목 반영': 'Apply items', '항목을 확인하고 돌림판을 돌려 보세요.': 'Check the items and spin the wheel.',
    '돌림판': 'Wheel spinner', '돌림판 그림': 'Wheel graphic', '어떤 항목이 나올까요?': 'What will it land on?',
    '돌아가는 중…': 'Spinning…', '돌림판이 돌아가고 있습니다.': 'The wheel is spinning.', '예: 치킨': 'e.g. Pizza',

    '숫자뽑기': 'Number picker', '최솟값': 'Minimum', '최댓값': 'Maximum', '뽑을 개수': 'How many', '중복 허용': 'Allow duplicates', '오름차순 정렬': 'Sort ascending',
    '빠른 설정': 'Quick presets', '로또 6/45': 'Lotto 6/45', '주사위 1~6': 'Dice 1–6', '숫자 뽑기': 'Pick numbers', '범위와 개수를 정해 주세요.': 'Set the range and quantity.', '뽑은 숫자': 'Picked numbers',
    '먼저 숫자를 뽑아 주세요.': 'Pick numbers first.', '결과를 복사했습니다.': 'Result copied.',
    '-1,000,000부터 1,000,000 사이의 올바른 범위를 입력해 주세요.': 'Enter a valid range from -1,000,000 to 1,000,000.',
    '뽑을 개수는 1~100으로 입력해 주세요.': 'Enter a quantity from 1 to 100.', '중복 없이 뽑으려면 개수를 숫자 범위보다 작게 입력해 주세요.': 'Without duplicates, the quantity cannot exceed the size of the range.',

    '다중팀 편가르기': 'Multi-team divider', '참가자 이름': 'Participant names', '+ 참가자 추가': '+ Add participant', '2~100명 · 마지막 칸에서 Enter를 누르면 다음 참가자가 추가됩니다.': '2–100 people · Press Enter in the last field to add another participant.',
    '팀 개수': 'Number of teams', '팀 이름': 'Team name', '예: 팀, 조, 그룹': 'e.g. Team, Group', '팀 나누기': 'Divide teams',
    '참가자와 팀 개수를 확인해 주세요.': 'Check the participants and number of teams.', '편가르기 결과': 'Team division result',
    '팀 개수는 참가자 수보다 많을 수 없습니다.': 'The number of teams cannot exceed the number of participants.', '먼저 팀을 나눠 주세요.': 'Divide the teams first.',
    '팀 결과를 복사했습니다.': 'Team results copied.', '팀': 'Team',
    '직접 복사할 결과': 'Result to copy manually', '자동 복사가 차단되었습니다. 아래 결과를 선택해 직접 복사해 주세요.': 'Automatic copying was blocked. Select the result below and copy it manually.',

    '이미지 모자이크 도구': 'Image mosaic tool', '이미지를 여기에 놓으세요': 'Drop an image here', 'PNG, JPEG, WebP · 최대 15MB': 'PNG, JPEG, WebP · up to 15MB', '이미지 선택': 'Choose image',
    '샘플 이미지로 체험': 'Try a sample image', '이미지는 서버로 전송되지 않고 현재 브라우저에서만 처리됩니다.': 'Images stay in this browser and are never uploaded.',
    '모자이크 편집기': 'Mosaic editor', '선택 도구': 'Selection tool', '브러시': 'Brush', '사각형 선택': 'Rectangle selection', '브러시 크기': 'Brush size', '모자이크 강도': 'Mosaic strength',
    '브러시로 칠하거나 사각형 범위를 드래그해 모자이크를 적용하세요.': 'Paint with the brush or drag a rectangle to apply mosaic.', '브러시로 칠하거나 사각형 범위를 드래그해 모자이크를 적용할 이미지': 'Image canvas for brush painting or rectangle selection', '한 단계 되돌리기': 'Undo one step', '원본으로 초기화': 'Reset to original', 'PNG 저장': 'Save PNG',
    '이미지 파일을 선택해 주세요.': 'Choose an image file.', 'PNG, JPEG, WebP 이미지만 사용할 수 있습니다.': 'Only PNG, JPEG, and WebP images are supported.',
    '파일 크기는 15MB 이하로 선택해 주세요.': 'Choose a file no larger than 15MB.', '이미지는 한 변 5,000px, 전체 2천만 픽셀 이하로 선택해 주세요.': 'Choose an image up to 5,000px per side and 20 million pixels total.',
    '이미지를 불러오지 못했습니다.': 'Could not load the image.', '되돌리기 기록은 최대 100개입니다. 원본으로 초기화한 뒤 계속해 주세요.': 'Undo history is limited to 100 steps. Reset to the original before continuing.',
    '한 단계를 되돌렸습니다.': 'Undid one step.', '모든 모자이크를 되돌렸습니다.': 'Removed all mosaic edits.', '원본 이미지로 초기화했습니다.': 'Reset to the original image.',
    'PNG 파일을 만들지 못했습니다.': 'Could not create the PNG file.', '모자이크 이미지를 PNG로 저장했습니다.': 'Saved the mosaic image as PNG.',
    '사각형 선택: 시작점에서 끝점까지 드래그하세요.': 'Rectangle selection: drag from the start point to the end point.', '브러시: 숨길 부분을 따라 드래그하세요.': 'Brush: drag over the area you want to hide.', '범위를 조금 더 크게 드래그해 주세요.': 'Drag a slightly larger area.',

    'URL 인코더·디코더': 'URL encoder / decoder', '변환 방식': 'Conversion mode', 'URL 인코딩': 'URL encode', 'URL 디코딩': 'URL decode', '처리 범위': 'Encoding scope', '쿼리 값·문장': 'Query value / text', '주소 전체': 'Full URL',
    '쿼리 값은 예약문자까지 안전하게 바꾸고, 주소 전체는 : / ? & = 같은 URL 구조를 유지합니다.': 'Query values encode reserved characters, while full URL mode keeps URL structure such as : / ? & =.',
    '원본 입력': 'Original input', '변환할 주소나 문장을 입력하세요.': 'Enter a URL or text to convert.', '디코딩할 URL 문자열을 입력하세요.': 'Enter an encoded URL string.', '변환 결과': 'Converted result', '변환 결과가 여기에 표시됩니다.': 'The converted result appears here.',
    '입력 내용은 현재 브라우저에서만 처리됩니다.': 'Your input is processed only in this browser.', '인코딩할 내용을 입력하세요.': 'Enter content to encode.', '디코딩할 내용을 입력하세요.': 'Enter content to decode.', '변환할 내용을 입력해 주세요.': 'Enter content to convert.',
    'URL 변환을 완료했습니다.': 'URL conversion complete.', 'Base64 변환 방식을 선택했습니다.': 'Base64 conversion selected.', 'URL 변환 방식을 선택했습니다.': 'URL conversion selected.', '올바른 URL 인코딩 형식이 아닙니다.': 'This is not a valid URL-encoded string.', '자동 복사가 차단되었습니다. 결과 상자를 선택해 직접 복사해 주세요.': 'Automatic copying was blocked. Select the result box and copy it manually.',

    '다용도 계산기': 'Multi calculator', '계산 종류': 'Calculator type', '일반 계산': 'Basic arithmetic', '단위 계산': 'Unit arithmetic', '날짜 계산': 'Date calculation',
    '첫 번째 값': 'First value', '두 번째 값': 'Second value', '단위 분야': 'Unit category', '길이': 'Length', '넓이': 'Area', '부피': 'Volume', '무게': 'Weight', '속도': 'Speed', '시간': 'Time', '데이터': 'Data',
    '첫 번째 값과 단위': 'First value and unit', '두 번째 값과 단위': 'Second value and unit', '첫 번째 단위': 'First unit', '두 번째 단위': 'Second unit', '결과 단위': 'Result unit',
    '연산': 'Operation', '더하기 +': 'Add +', '빼기 −': 'Subtract −', '곱하기 ×': 'Multiply ×', '나누기 ÷': 'Divide ÷',
    '두 값을 결과 단위로 각각 환산한 뒤 선택한 연산을 적용합니다.': 'Each value is converted to the result unit before applying the selected operation.',
    '입력값을 바꾸면 결과가 즉시 계산됩니다.': 'The result updates as you change the inputs.', '계산이 완료되었습니다.': 'Calculation complete.', '기본값으로 초기화했습니다.': 'Reset to defaults.',
    '숫자는 소수점 둘째 자리까지 입력해 주세요.': 'Enter numbers with up to two decimal places.', '숫자는 -1조부터 1조 사이로 입력해 주세요.': 'Enter a number from -1 trillion to 1 trillion.', '0으로 나눌 수 없습니다.': 'Cannot divide by zero.',
    '날짜 계산 방식': 'Date calculation type', '평': 'pyeong', '돈': 'don', '근': 'geun',
    '날짜 계산기': 'Date calculator', '계산 방식': 'Calculation type', '두 날짜 사이': 'Days between dates', '날짜 더하기·빼기': 'Add / subtract days', '시작일': 'Start date', '종료일': 'End date', '종료일을 포함해서 계산': 'Include the end date',
    '기준일': 'Base date', '더하거나 뺄 일수': 'Days to add or subtract', '빼려면 -30처럼 음수로 입력하세요.': 'Use a negative number such as -30 to subtract.', '날짜 계산': 'Calculate date', '날짜를 선택한 뒤 계산해 주세요.': 'Select dates, then calculate.',
    '계산 결과': 'Calculation result', '시작일과 종료일을 모두 선택해 주세요.': 'Select both the start and end dates.', '두 날짜가 같습니다.': 'The two dates are the same.', '종료일이 시작일보다 뒤에 있습니다.': 'The end date is after the start date.', '종료일이 시작일보다 앞에 있습니다.': 'The end date is before the start date.',
    '기준일을 선택해 주세요.': 'Select a base date.', '일수는 -100,000부터 100,000 사이의 정수로 입력해 주세요.': 'Enter a whole number of days from -100,000 to 100,000.', '날짜 계산을 완료했습니다.': 'Date calculation complete.', '복사할 계산 결과가 없습니다.': 'There is no calculation result to copy.', '계산 결과를 복사했습니다.': 'Calculation result copied.',

    '결과 공유': 'Share result', '결과 코드를 보내면 받은 사람이 같은 결과를 열 수 있습니다.': 'Send the result code so the recipient can open the same result.', '결과 코드를 보내면 받은 사람이 같은 숫자를 열 수 있습니다.': 'Send the result code so the recipient can open the same numbers.', '받은 결과 코드': 'Received result code', '친구에게 받은 코드를 붙여넣으세요.': 'Paste the result code you received.',
    '결과 코드 복사': 'Copy result code', '같은 결과 열기': 'Open same result', 'PNG 저장': 'Save PNG',
    '코드에는 입력값과 결과가 포함됩니다. 필요한 사람에게만 공유하세요.': 'The code contains the inputs and result. Share it only with people you trust.', '코드에는 입력한 이름과 결과가 포함됩니다. 필요한 사람에게만 공유하세요.': 'The code contains the inputs and result. Share it only with people you trust.',
    '결과를 만든 뒤 코드 복사나 PNG 저장을 사용할 수 있습니다.': 'Create a result before copying a code or saving a PNG.',
    '공유할 결과가 없습니다. 먼저 결과를 만들어 주세요.': 'There is no result to share. Create a result first.',
    '결과 코드를 복사했습니다. 받은 사람은 같은 도구에 붙여넣으면 됩니다.': 'Result code copied. The recipient can paste it into the same tool.',
    '같은 결과를 열었습니다.': 'Opened the same result.', '받은 결과 코드를 붙여넣어 주세요.': 'Paste the result code you received.',
    '결과 코드가 너무 깁니다. 입력 항목을 줄여 주세요.': 'The result code is too long. Reduce the number of entries.',
    '올바른 결과 코드가 아닙니다.': 'This is not a valid result code.', '이 코드는 다른 놀이 도구에서 만든 코드입니다.': 'This code was created by a different play tool.',
    'PNG 이미지를 저장했습니다.': 'Saved the PNG image.', '입력값': 'Inputs', '확정 결과': 'Final result', '설정': 'Settings',
    '이 칸을 입력해 주세요.': 'Fill in this field.', '잘못된 난수 범위입니다.': 'Invalid random range.',
    '민수': 'Alex', '지영': 'Jamie', '하늘': 'Sky', '도윤': 'Dylan',
    '커피 사기': 'Buy coffee', '간식 받기': 'Get a snack', '다음 기회': 'Next chance', '행운의 주인공': 'Lucky winner',
    '치킨': 'Chicken', '피자': 'Pizza', '떡볶이': 'Tteokbokki', '햄버거': 'Burger', '초밥': 'Sushi', '샐러드': 'Salad',
    '항목': 'item', '예: 팀, 조, 그룹': 'e.g. Team, Group'
  }));

  const patterns = [
    [/^(\d+)자$/, '$1 chars'], [/^(\d+)행 · (\d+)열$/, '$1 rows · $2 columns'], [/^(\d+)행 · (\d+)열 \(미리보기 100행\)$/, '$1 rows · $2 columns (first 100 rows)'],
    [/^(\d+)개 팀$/, '$1 teams'], [/^(\d+)개의 숫자를 뽑았습니다\.$/, 'Picked $1 numbers.'], [/^(\d+)개 항목을 반영했습니다\.$/, 'Applied $1 items.'],
    [/^(\d+)명의 사다리를 새로 만들었습니다\.$/, 'Built a new ladder for $1 participants.'], [/^(\d+)명을 (\d+)개 팀으로 나눴습니다\.$/, 'Divided $1 people into $2 teams.'],
    [/^결과는 “(.+)”입니다\.$/, 'The result is “$1”.'], [/^(.*) 파일을 data: URL Base64로 변환했습니다\.$/, 'Converted $1 to data: URL Base64.'],
    [/^(\d+) × (\d+)px 이미지를 불러왔습니다\. 드래그해 모자이크를 적용하세요\.$/, 'Loaded a $1 × $2px image. Drag to apply mosaic.'],
    [/^(\d+) × (\d+)px 이미지를 불러왔습니다\. 브러시로 칠하거나 사각형 범위를 드래그하세요\.$/, 'Loaded a $1 × $2px image. Paint with the brush or drag a rectangle.'],
    [/^(\d{1,3}(?:,\d{3})*)일$/, '$1 days'],
    [/^모자이크를 적용했습니다\. 되돌리기 (\d+)단계가 저장되었습니다\.$/, 'Mosaic applied. $1 undo steps saved.'],
    [/^(.+)은 (\d+)~(\d+)개 입력해 주세요\.$/, 'Enter $2–$3 $1 values.'], [/^(.+)은 각각 (\d+)자 이하로 입력해 주세요\.$/, 'Each $1 must be $2 characters or fewer.'],
    [/^(.+) ([\d, ]+)번 칸을 채워 주세요\.$/, 'Fill in $1 fields $2.'], [/^([\d, ]+)번 줄의 참가자와 결과를 확인해 주세요\.$/, 'Check the participant and outcome in rows $1.'],
    [/^참가자 (\d+)$/, 'Participant $1'], [/^결과 (\d+)$/, 'Outcome $1'], [/^항목 (\d+)$/, 'Item $1'],
    [/^참가자 (\d+) 삭제$/, 'Remove participant $1'], [/^항목 (\d+) 삭제$/, 'Remove item $1'], [/^(\d+)번 참가자와 결과 삭제$/, 'Remove participant and outcome $1'],
    [/^(.+) (\d+) · (\d+)명$/, '$1 $2 · $3 people'], [/^(\d+)명$/, '$1 people'], [/^JSON 오류: (.*) \(줄 (\d+), 열 (\d+)\)$/, 'JSON error: $1 (line $2, column $3)']
  ];

  const originals = new WeakMap();
  const attributes = ['placeholder', 'aria-label', 'title'];
  let language = localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ko';
  let applying = false;

  function translate(value) {
    const text = String(value);
    if (exact.has(text)) return exact.get(text);
    for (const [pattern, replacement] of patterns) if (pattern.test(text)) return text.replace(pattern, replacement);
    return text;
  }

  function applyText(node) {
    if (!node.nodeValue || !node.nodeValue.trim()) return;
    if (language === 'en') {
      if (/[ㄱ-힝]/.test(node.nodeValue)) {
        const translated = translate(node.nodeValue);
        if (translated !== node.nodeValue) {
          originals.set(node, node.nodeValue);
          node.nodeValue = translated;
        }
      }
    } else if (originals.has(node) && node.nodeValue !== originals.get(node)) node.nodeValue = originals.get(node);
  }

  function applyElement(element) {
    for (const name of attributes) {
      if (!element.hasAttribute(name)) continue;
      const value = element.getAttribute(name);
      if (language === 'en' && /[ㄱ-힝]/.test(value)) {
        const translated = translate(value);
        if (translated !== value) {
          if (!originals.has(element)) originals.set(element, {});
          const saved = originals.get(element);
          if (!(name in saved)) saved[name] = value;
          element.setAttribute(name, translated);
        }
      } else if (language === 'ko' && originals.has(element)) {
        const saved = originals.get(element);
        if (saved && saved[name] !== undefined && value !== saved[name]) element.setAttribute(name, saved[name]);
      }
    }
    if (element.matches('[data-i18n-sample="true"]')) {
      if (language === 'en' && /[ㄱ-힝]/.test(element.value)) {
        const translated = translate(element.value);
        if (translated !== element.value) {
          if (!originals.has(element)) originals.set(element, {});
          const saved = originals.get(element);
          if (saved.value === undefined) saved.value = element.value;
          element.value = translated;
        }
      } else if (language === 'ko' && originals.has(element) && originals.get(element).value !== undefined && element.value !== originals.get(element).value) element.value = originals.get(element).value;
    }
  }

  function apply(root) {
    applying = true;
    document.documentElement.lang = language;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) applyText(node);
    if (root.nodeType === Node.ELEMENT_NODE) applyElement(root);
    root.querySelectorAll?.('*').forEach(applyElement);
    document.querySelectorAll('.toolbox-language__button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    applying = false;
  }

  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'ko';
    localStorage.setItem(STORAGE_KEY, language);
    apply(document.body);
    window.dispatchEvent(new CustomEvent('toolbox-language-change', { detail: { language } }));
  }

  function createSelector() {
    if (document.querySelector('.toolbox-language')) return;
    const bar = document.createElement('nav');
    bar.className = 'toolbox-language';
    bar.setAttribute('aria-label', 'Language / 언어');
    bar.innerHTML = '<div class="toolbox-language__group"><button class="toolbox-language__button" type="button" data-language="ko">KOR</button><button class="toolbox-language__button" type="button" data-language="en">ENG</button></div>';
    bar.addEventListener('click', (event) => { const button = event.target.closest('[data-language]'); if (button) setLanguage(button.dataset.language); });
    document.body.prepend(bar);
  }

  function start() {
    createSelector();
    apply(document.body);
    new MutationObserver((mutations) => {
      if (applying) return;
      applying = true;
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') applyText(mutation.target);
        else if (mutation.type === 'attributes') applyElement(mutation.target);
        else mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) applyText(node);
          else if (node.nodeType === Node.ELEMENT_NODE) apply(node);
        });
      }
      applying = false;
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
    window.dispatchEvent(new CustomEvent('toolbox-language-change', { detail: { language } }));
  }

  window.ToolboxI18n = { get language() { return language; }, setLanguage, translate };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}());
