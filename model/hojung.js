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

// 결투 기능
const startDuel = async () => {
    const user1 = document.getElementById('user1').value.trim();
    const user2 = document.getElementById('user2').value.trim();

    if (!user1 || !user2) {
        alert('두 아이디를 모두 입력해주세요!');
        return;
    }

    try {
        const studentData = await fetchStudentInfo();
        if (!Array.isArray(studentData) || studentData.length === 0) {
            throw new Error('학생 데이터를 불러오지 못했습니다.');
        }

        const student1 = studentData.find(student => student._ID === user1);
        const student2 = studentData.find(student => student._ID === user2);

        const resultDiv = document.getElementById('result');
        if (!student1 || !student2) {
            resultDiv.textContent = '입력된 ID에 해당하는 사용자가 없습니다.';
            return;
        }

        resultDiv.textContent = student1._ranking < student2._ranking
            ? `${student1._ID} 승리! (등수: ${student1._ranking} vs ${student2._ranking})`
            : student1._ranking > student2._ranking
            ? `${student2._ID} 승리! (등수: ${student1._ranking} vs ${student2._ranking})`
            : `무승부! (등수: ${student1._ranking} vs ${student2._ranking})`;
    } catch (error) {
        console.error('Error during duel:', error);
    }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadKwuRanking();
    loadRecommendedProblems();
    loadUnsolvedProblems();

    document.querySelector('.duel-button').addEventListener('click', startDuel);
});
