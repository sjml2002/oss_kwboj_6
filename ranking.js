// 데이터 클래스 정의 (기존 코드 유지)
class submitWithTime {
    constructor(ID, problem, time) {
        this._ID = ID;
        this._problem = problem;
        this._time = time;
    }
}

class kwStudentInfo {
    constructor(ID, tier, tierIcon, ranking, solvedCnt, rating, todaySolved, totalProblems) {
        this._ID = ID;
        this._tier = tier;
        this._tierIcon = tierIcon;
        this._ranking = ranking;
        this._solvedCnt = solvedCnt;
        this._rating = rating;
        this._todaySolved = todaySolved;
        this._totalProblems = totalProblems;
    }
}

// 더미 데이터 생성 (실제 크롤링 데이터로 대체 필요)
const recentSubmissions = [
    new submitWithTime('kwuser1', 'problem1', new Date()),
    new submitWithTime('kwuser2', 'problem2', new Date(Date.now() - 1000 * 60 * 5)),
    new submitWithTime('kwuser3', 'problem3', new Date(Date.now() - 1000 * 60 * 10))
];

const dormantUsers = [
    new submitWithTime('kwuser4', 'problem4', new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)),
    new submitWithTime('kwuser5', 'problem5', new Date(Date.now() - 1000 * 60 * 60 * 24 * 20)),
    new submitWithTime('kwuser6', 'problem6', new Date(Date.now() - 1000 * 60 * 60 * 24 * 10))
];

const todayTopSolvers = [
    new kwStudentInfo('kwuser7', 'Gold', 'gold.png', 1, 2000, 2500, 5, 10),
    new kwStudentInfo('kwuser8', 'Silver', 'silver.png', 2, 1800, 2400, 4, 8),
    new kwStudentInfo('kwuser9', 'Bronze', 'bronze.png', 3, 1600, 2300, 3, 6)
];

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // 최근 제출 섹션
    const recentPodium = document.querySelector('.podium');
    if (recentPodium) {
        recentSubmissions
            .sort((a, b) => b._time - a._time)
            .forEach((submission, index) => {
                const stageElement = recentPodium.children[index];
                const userElement = stageElement.querySelector('.user');
                userElement.textContent = submission._ID;

                // Update medal based on index
                const medalElement = stageElement.querySelector('.medal');
                medalElement.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            });
    }

    // 잠수 순위 섹션
    const dormantPodium = document.querySelectorAll('.podium')[1]; // 두 번째 podium
    if (dormantPodium) {
        dormantUsers
            .sort((a, b) => b._time - a._time)
            .forEach((submission, index) => {
                const stageElement = dormantPodium.children[index];
                const userElement = stageElement.querySelector('.user');
                userElement.textContent = submission._ID;

                // Update medal based on index
                const medalElement = stageElement.querySelector('.medal');
                medalElement.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            });
    }

    // 오늘의 탑 솔버 섹션
    const topSolverPodium = document.querySelectorAll('.podium')[2]; // 세 번째 podium
    if (topSolverPodium) {
        todayTopSolvers
            .sort((a, b) => b._todaySolved - a._todaySolved)
            .forEach((solver, index) => {
                const stageElement = topSolverPodium.children[index];
                const userElement = stageElement.querySelector('.user');
                userElement.textContent = solver._ID;

                // Update medal based on index
                const medalElement = stageElement.querySelector('.medal');
                medalElement.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            });
    }
});