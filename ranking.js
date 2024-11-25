// 데이터 클래스 정의
class submitWithTime {
    constructor(ID, problem, time) {
        this._ID = ID; // 제출자의 ID
        this._problem = problem; // 문제 ID 또는 이름
        this._time = time; // 제출 시간
    }
}

class kwStudentInfo {
    constructor(ID, tier, tierIcon, ranking, solvedCnt, rating, todaySolved, totalProblems) {
        this._ID = ID; // 학생의 ID
        this._tier = tier; // 학생의 티어 (예: Gold, Silver, Bronze)
        this._tierIcon = tierIcon; // 티어 아이콘 이미지 경로
        this._ranking = ranking; // 학생의 랭킹
        this._solvedCnt = solvedCnt; // 해결한 문제 수
        this._rating = rating; // 학생의 평점
        this._todaySolved = todaySolved; // 오늘 해결한 문제 수
        this._totalProblems = totalProblems; // 총 문제 수
    }
}

// 더미 데이터 생성
const recentSubmissions = [
    new submitWithTime('kwuser1', 'problem1', new Date()),
    new submitWithTime('kwuser2', 'problem2', new Date(Date.now() - 1000 * 60 * 5)),
    new submitWithTime('kwuser3', 'problem3', new Date(Date.now() - 1000 * 60 * 10)),
];

const dormantUsers = [
    new submitWithTime('kwuser4', 'problem4', new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)),
    new submitWithTime('kwuser5', 'problem5', new Date(Date.now() - 1000 * 60 * 60 * 24 * 20)),
    new submitWithTime('kwuser6', 'problem6', new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)),
];

const todayTopSolvers = [
    new kwStudentInfo('kwuser7', 'Gold', 'gold.png', 1, 2000, 2500, 5, 10),
    new kwStudentInfo('kwuser8', 'Silver', 'silver.png', 2, 1800, 2400, 4, 8),
    new kwStudentInfo('kwuser9', 'Bronze', 'bronze.png', 3, 1600, 2300, 3, 6),
];

// podium 섹션 업데이트 함수
function updatePodium(podiumElement, data, sortKey, getUserName) {
    data
        .sort((a, b) => b[sortKey] - a[sortKey]) // 정렬 기준으로 내림차순 정렬
        .forEach((item, index) => {
            const stageElement = podiumElement.children[index];
            if (stageElement) {
                const userElement = stageElement.querySelector('.user');
                if (userElement) userElement.textContent = getUserName(item); // 사용자 이름 업데이트

                const medalElement = stageElement.querySelector('.medal');
                if (medalElement) {
                    medalElement.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'; // 메달 설정
                }
            }
        });
}

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
    const podiums = document.querySelectorAll('.podium');

    // 최근 제출 섹션 업데이트
    if (podiums[0]) {
        updatePodium(podiums[0], recentSubmissions, '_time', item => item._ID);
    }

    // 잠수 순위 섹션 업데이트
    if (podiums[1]) {
        updatePodium(podiums[1], dormantUsers, '_time', item => item._ID);
    }

    // 오늘의 탑 솔버 섹션 업데이트
    if (podiums[2]) {
        updatePodium(podiums[2], todayTopSolvers, '_todaySolved', item => item._ID);
    }
});

