// 서버에서 데이터 가져오기
const fetchStudentInfo = async () => {
    try {
        const response = await fetch('/getkwStudentInfo'); // 서버에서 API 요청
        const data = await response.json(); // JSON 데이터 변환
        return data;
    } catch (error) {
        console.error('Error fetching student info:', error);
        return [];
    }
};

// 섹션에 데이터를 렌더링하는 함수
const renderSection = (sectionId, users) => {
    const podium = document.getElementById(sectionId); // 섹션 DOM 가져오기
    podium.innerHTML = ''; // 기존 내용 초기화

    if (!users || users.length === 0) {
        podium.innerHTML = '<div>No data available</div>';
        return;
    }

    const stages = ['stage-1', 'stage-2', 'stage-3']; // 순위별 스타일 클래스
    const topUsers = users.slice(0, 3); // 상위 3명만 표시

    topUsers.forEach((user, index) => {
        const stage = document.createElement('div');
        stage.classList.add('stage', stages[index]); // 스테이지 스타일 추가

        const userName = document.createElement('div');
        userName.classList.add('user'); // 사용자 이름 스타일 추가
        userName.textContent = user._ID; // 사용자 ID 표시

        const additionalInfo = document.createElement('div');
        additionalInfo.innerHTML = `
            <img src="${user._tierImgUrl}" alt="${user._tier}" style="width: 20px; vertical-align: middle;"> 
            ${user._tier} (${user._rankingInKWU}위, ${user._solvedcnt}문제)
        `; // 추가 정보 표시 (티어, 랭킹, 문제 수)

        userName.appendChild(additionalInfo);

        const woodBase = document.createElement('div');
        woodBase.classList.add('wood-base'); // 스테이지 아래 받침대 스타일 추가

        const medal = document.createElement('div');
        medal.classList.add('medal'); // 메달 스타일 추가
        medal.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'; // 메달 설정

        // 스테이지 구성 요소 추가
        stage.appendChild(userName);
        stage.appendChild(woodBase);
        stage.appendChild(medal);

        // 섹션에 스테이지 추가
        podium.appendChild(stage);
    });
};

// 페이지 로드 시 데이터 가져와서 렌더링
window.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchStudentInfo(); // 서버에서 데이터 가져오기

    // 각 섹션에 데이터 렌더링
    renderSection('recent-podium', data); // 최근 제출자 섹션
    renderSection('ghost-podium', data); // 고스트 유저 섹션
    renderSection('solver-podium', data); // 오늘의 문제 해결자 섹션
});
