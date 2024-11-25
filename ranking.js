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
    const recentContainer = document.getElementById('recentSubmissionChart');
    if (recentContainer) {
        recentSubmissions
            .sort((a, b) => b._time - a._time)
            .forEach((submission, index) => {
                const submissionElement = document.createElement('div');
                submissionElement.className = 'ranking-item'; // CSS 클래스 추가
                
                const medalSpan = document.createElement('span');
                medalSpan.className = 'medal-icon';
                medalSpan.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';

                const submissionText = document.createTextNode(
                    ` ${submission._ID} (제출 시간: ${Math.round((Date.now() - submission._time) / (1000 * 60))}분 전)`
                );

                submissionElement.appendChild(medalSpan);
                submissionElement.appendChild(submissionText);
                
                recentContainer.appendChild(submissionElement);
            });
    }

    // 잠수 순위 섹션
    const dormantContainer = document.getElementById('dormantUserChart');
    if (dormantContainer) {
        dormantUsers
            .sort((a, b) => b._time - a._time)
            .forEach((submission, index) => {
                const dormantElement = document.createElement('div');
                dormantElement.className = 'ranking-item'; // CSS 클래스 추가
                
                const medalSpan = document.createElement('span');
                medalSpan.className = 'medal-icon';
                medalSpan.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';

                const dormantText = document.createTextNode(
                    ` ${submission._ID} (마지막 제출: ${Math.round((Date.now() - submission._time) / (1000 * 60 * 60 * 24))}일 전)`
                );

                dormantElement.appendChild(medalSpan);
                dormantElement.appendChild(dormantText);
                
                dormantContainer.appendChild(dormantElement);
            });
    }

    // 오늘의 탑 솔버 섹션
    const topSolverContainer = document.getElementById('topSolverToday');
    if (topSolverContainer) {
        todayTopSolvers
            .sort((a, b) => b._todaySolved - a._todaySolved)
            .forEach((solver, index) => {
                const solverElement = document.createElement('div');
                solverElement.className = 'ranking-item'; // CSS 클래스 추가

                const medalSpan = document.createElement('span');
                medalSpan.className = 'medal-icon';
                medalSpan.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';

                const solverText = document.createTextNode(
                    ` ${solver._ID} (푼 문제: ${solver._todaySolved})`
                );

                solverElement.appendChild(medalSpan);
                solverElement.appendChild(solverText);

                topSolverContainer.appendChild(solverElement);
            });
    }
});