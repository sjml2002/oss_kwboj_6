// 풍선과 배너 요소 가져오기
const balloon1 = document.getElementById('balloon1');
const adBanner1 = document.getElementById('ad-banner1');
const wire1 = document.getElementById('wire1');

// 풍선 터지는 이벤트
balloon1.addEventListener('click', () => {
    // 풍선 터짐 효과 추가
    balloon1.classList.add('popped');
    
    // 광고 배너를 애니메이션으로 내려가며 닫기
    adBanner1.style.top = '100%'; // 화면 아래로 내려감
    wire1.style.display = 'none';
    
    // 배너를 완전히 숨기기 (선택 사항)
    setTimeout(() => {
        adBanner1.style.display = 'none';
    }, 1000); // 1초 후에 숨김
});

//////////////////////////////////////////////////////////////////////////////////////////////////

// 풍선과 배너 요소 가져오기
const balloon2 = document.getElementById('balloon2');
const adBanner2 = document.getElementById('ad-banner2');
const wire2 = document.getElementById('wire2');

// 풍선 터지는 이벤트
balloon2.addEventListener('click', () => {
    // 풍선 터짐 효과 추가
    balloon2.classList.add('popped');
    
    // 광고 배너를 애니메이션으로 내려가며 닫기
    adBanner2.style.top = '100%'; // 화면 아래로 내려감
    wire2.style.display = 'none';
    
    // 배너를 완전히 숨기기 (선택 사항)
    setTimeout(() => {
        adBanner2.style.display = 'none';
    }, 1000); // 1초 후에 숨김
});