// 데이터 가져오기 함수
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return [];
    }
};

// 학생 정보 가져오기
const fetchStudentInfo = async () => {
    return await fetchData('/getkwStudentInfo');
};

// 대학교 순위 정보 가져오기
const fetchUniversityRanking = async () => {
    return await fetchData('/getUniversityRanking');
};

// 오늘의 문제 가져오기
const fetchTodaysProblem = async () => {
    return await fetchData('/getTodaysProblem');
};

// 광운대학교 순위 표시
const loadKwuRanking = async () => {
    try {
        const rankingData = await fetchUniversityRanking();
        const container = document.getElementById('ranking-content');

        if (!rankingData || rankingData.length === 0) {
            throw new Error('순위 데이터를 불러오지 못했습니다.');
        }

        const kwuIndex = rankingData.findIndex(school => school._name === '광운대학교');
        const displayData = [
            rankingData[kwuIndex - 1] || null,
            rankingData[kwuIndex],
            rankingData[kwuIndex + 1] || null
        ];

        container.innerHTML = displayData
            .map((school, idx) => school ? `
                <div class="ranking-item ${idx === 1 ? 'highlight' : idx === 0 ? 'previous' : 'next'}">
                    <span class="rank">${school._rank}</span> - ${school._name}
                </div>
            ` : '')
            .join('');
    } catch (error) {
        console.error('Error loading KWU ranking:', error);
    }
};

// 추천 문제 로드
const loadRecommendedProblems = async () => {
    try {
        const problems = await fetchTodaysProblem();
        const problemList = document.getElementById('recommended-problems');

        problemList.innerHTML = problems.slice(0, 3)
            .map(id => `
                <a href="https://www.acmicpc.net/problem/${id}" target="_blank" class="problem">
                    문제 ${id}
                </a>
            `).join('');
    } catch (error) {
        console.error('Error loading recommended problems:', error);
    }
};

// 못 푼 문제 로드
const loadUnsolvedProblems = async () => {
    try {
        const problems = await fetchTodaysProblem();
        const problemList = document.getElementById('unsolved-problems');

        problemList.innerHTML = problems.slice(3, 6)
            .map(id => `
                <a href="https://www.acmicpc.net/problem/${id}" target="_blank" class="problem">
                    문제 ${id}
                </a>
            `).join('');
    } catch (error) {
        console.error('Error loading unsolved problems:', error);
    }
};

// 꽃가루(팡파레) 효과
const launchConfetti = () => {
    const body = document.body;

    for (let i = 0; i < 300; i++) { // confetti 개수를 300개로 늘림
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // 화면 전체를 기준으로 랜덤 위치 설정
        confetti.style.left = `${Math.random() * window.innerWidth}px`;
        confetti.style.top = `${Math.random() * window.innerHeight}px`;

        // 크기와 색상을 랜덤으로 설정
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.backgroundColor = getRandomColor();

        // 애니메이션 지연 시간 랜덤 설정
        confetti.style.animationDelay = `${Math.random() * 2}s`;

        body.appendChild(confetti);

        // 5초 후 confetti 제거
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
};

// 랜덤 색상 생성
const getRandomColor = () => {
    const colors = ['#ffcc00', '#ff4444', '#44ccff', '#66ff66', '#ff66cc'];
    return colors[Math.floor(Math.random() * colors.length)];
};

// 결투 기능
const startDuel = async () => {
    const user1 = document.getElementById('user1').value.trim();
    const user2 = document.getElementById('user2').value.trim();
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const user1Img = document.getElementById('user1-img');
    const user2Img = document.getElementById('user2-img');

    if (!user1 || !user2) {
        alert('두 아이디를 모두 입력해주세요!');
        return;
    }

    try {
        // 로딩 이미지 표시
        loading.style.display = 'block';
        resultDiv.textContent = '';

        const studentData = await fetchStudentInfo();
        if (!Array.isArray(studentData) || studentData.length === 0) {
            throw new Error('학생 데이터를 불러오지 못했습니다.');
        }

        const student1 = studentData.find(student => student._ID === user1);
        const student2 = studentData.find(student => student._ID === user2);

        if (!student1 || !student2) {
            loading.style.display = 'none';
            resultDiv.textContent = '입력된 ID에 해당하는 사용자가 없습니다.';
            return;
        }

        // 2초 대기 (로딩 시뮬레이션)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 결과 계산 및 표시
        const winner = student1._ranking < student2._ranking ? student1 : student2;
        const loser = winner === student1 ? student2 : student1;

        resultDiv.textContent = `${winner._ID} 승리!`;

        // 이미지 및 등수 업데이트
        user1Img.innerHTML = `
            <img src="${winner === student1 ? 'win.png' : 'lose.png'}" alt="결과">
            <div class="ranking-info">${student1._ranking}위</div>`;
        user2Img.innerHTML = `
            <img src="${winner === student2 ? 'win.png' : 'lose.png'}" alt="결과">
            <div class="ranking-info">${student2._ranking}위</div>`;

        // 로딩 이미지 숨김
        loading.style.display = 'none';

        // 꽃가루 효과 실행
        launchConfetti();
    } catch (error) {
        console.error('Error during duel:', error);
        loading.style.display = 'none';
    }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadKwuRanking();
    loadRecommendedProblems();
    loadUnsolvedProblems();

    document.querySelector('.duel-button').addEventListener('click', startDuel);
});
