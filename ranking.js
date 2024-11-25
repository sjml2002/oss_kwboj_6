// 데이터 클래스 정의 (기존 코드 유지)
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

// 더미 데이터 생성 (실제 크롤링 데이터로 대체 필요)
const recentSubmissions = [
    new submitWithTime('kwuser1', 'problem1', new Date()), // 최근 제출자 1
    new submitWithTime('kwuser2', 'problem2', new Date(Date.now() - 1000 * 60 * 5)), // 최근 제출자 2 (5분 전)
    new submitWithTime('kwuser3', 'problem3', new Date(Date.now() - 1000 * 60 * 10)) // 최근 제출자 3 (10분 전)
];

const dormantUsers = [
    new submitWithTime('kwuser4', 'problem4', new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)), // 잠수 사용자 1 (30일 전)
    new submitWithTime('kwuser5', 'problem5', new Date(Date.now() - 1000 * 60 * 60 * 24 * 20)), // 잠수 사용자 2 (20일 전)
    new submitWithTime('kwuser6', 'problem6', new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)) // 잠수 사용자 3 (10일 전)
];

const todayTopSolvers = [
    new kwStudentInfo('kwuser7', 'Gold', 'gold.png', 1, 2000, 2500, 5, 10), // 오늘의 탑 솔버 1
    new kwStudentInfo('kwuser8', 'Silver', 'silver.png', 2, 1800, 2400, 4, 8), // 오늘의 탑 솔버 2
    new kwStudentInfo('kwuser9', 'Bronze', 'bronze.png', 3, 1600, 2300, 3, 6) // 오늘의 탑 솔버 3
];

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 최근 제출 섹션 업데이트
    const recentPodium = document.querySelector('.podium'); // 첫 번째 podium 선택
    if (recentPodium) {
        recentSubmissions
            .sort((a, b) => b._time - a._time) // 제출 시간을 기준으로 내림차순 정렬
            .forEach((submission, index) => {
                const stageElement = recentPodium.children[index]; // 각 스테이지 요소 선택
                if (stageElement) {
                    const userElement = stageElement.querySelector('.user'); // 사용자 이름 요소 선택
                    if (userElement) userElement.textContent = submission._ID; // 사용자 이름 업데이트

                    // 메달 업데이트 (인덱스에 따라)
                    const medalElement = stageElement.querySelector('.medal'); 
                    if (medalElement) {
                        medalElement.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'; 
                    }
                }
            });
    }

    // 잠수 순위 섹션 업데이트
    const dormantPodium = document.querySelectorAll('.podium')[1]; // 두 번째 podium 선택
    if (dormantPodium) {
        dormantUsers
            .sort((a, b) => b._time - a._time) // 제출 시간을 기준으로 내림차순 정렬
            .forEach((submission, index) => {
                const stageElement = dormantPodium.children[index]; // 각 스테이지 요소 선택
                if (stageElement) {
                    const userElement = stageElement.querySelector('.user'); 
                    if (userElement) userElement.textContent = submission._ID; 

                    // 메달 업데이트 (인덱스에 따라)
                    const medalElement = stageElement.querySelector('.medal'); 
                    if (medalElement) {
                        medalElement.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'; 
                    }
                }
            });
    }

    // 오늘의 탑 솔버 섹션 업데이트
    const topSolverPodium = document.querySelectorAll('.podium')[2]; // 세 번째 podium 선택
    if (topSolverPodium) {
        todayTopSolvers
            .sort((a, b) => b._todaySolved - a._todaySolved) // 오늘 해결한 문제 수 기준으로 내림차순 정렬
            .forEach((solver, index) => {
                const stageElement = topSolverPodium.children[index]; // 각 스테이지 요소 선택
                if (stageElement) {
                    const userElement = stageElement.querySelector('.user'); 
                    if (userElement) userElement.textContent = solver._ID; 

                    // 메달 업데이트 (인덱스에 따라)
                    const medalElement = stageElement.querySelector('.medal'); 
                    if (medalElement) {
                        medalElement.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'; 
                    }
                }
            });
    }
}); 
