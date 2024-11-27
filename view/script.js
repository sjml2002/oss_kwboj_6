//////////////////하드코딩 버전////////////
/*
// 광운대학교 순위 표시 함수
function loadKwuRanking() {
    const rankingData = [
        { rank: 12, university: "대한대학교" },
        { rank: 13, university: "광운대학교" },
        { rank: 14, university: "민국대학교" },
    ];

    const rankingContainer = document.querySelector('.ranking-container');

    if (!rankingContainer) {
        console.error("Ranking container not found in DOM.");
        return;
    }


    // 순위 데이터 렌더링
    rankingContainer.innerHTML = rankingData
        .map((data, index) => {
            const isHighlight = data.university === "광운대학교";
            const positionClass = 
                index === 0 ? 'previous' :
                index === 2 ? 'next' :
                '';

            return `
                <div class="ranking-item ${isHighlight ? 'highlight' : ''} ${positionClass}">
                    <span class="rank">${data.rank}</span> 
                    <span class="university">${data.university}</span>
                </div>
            `;
        })
        .join('');
}
        */

///////////////////크롤링 데이터를 가져오는 버전/////////////////////////
import { getUniversityRanking } from './crawlingMain.js';

async function loadKwuRanking() {
    try {
        const rankingData = await getUniversityRanking(); // 크롤링된 순위 데이터 가져오기
        if (!Array.isArray(rankingData) || rankingData.length === 0) {
            throw new Error('순위 데이터를 불러오지 못했습니다.');
        }

        const rankingContainer = document.querySelector('.ranking-container');
        if (!rankingContainer) {
            console.error("Ranking container not found in DOM.");
            return;
        }

        // 광운대학교 데이터만 필터링
        const kwuRankingIndex = rankingData.findIndex(data => data._name === '광운대학교');
        if (kwuRankingIndex === -1) {
            throw new Error('광운대학교 데이터가 없습니다.');
        }

        const displayData = [
            rankingData[kwuRankingIndex - 1] || null, // 이전 학교
            rankingData[kwuRankingIndex],           // 광운대학교
            rankingData[kwuRankingIndex + 1] || null // 다음 학교
        ];

        rankingContainer.innerHTML = displayData
            .map((data, index) => {
                if (!data) return ''; // 데이터가 없으면 공백
                const isHighlight = data._name === "광운대학교";
                const positionClass =
                    index === 0 ? 'previous' :
                    index === 2 ? 'next' :
                    '';
                return `
                    <div class="ranking-item ${isHighlight ? 'highlight' : ''} ${positionClass}">
                        <span class="rank">${data._rank}</span> 
                        <span class="university">${data._name}</span>
                    </div>
                `;
            })
            .join('');
    } catch (error) {
        console.error('Error loading KWU ranking:', error);
        alert('순위 데이터를 로드하는 중 문제가 발생했습니다.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadKwuRanking();
});


////////////////////데이터 연결시에 check 필요//////////////////////////
//////////실시간 데이터 크롤링 버전

// 결투 기능
import { getkwStudentInfo } from './crawlingMain.js';

async function startDuel() {
    const user1 = document.getElementById('user1').value.trim();
    const user2 = document.getElementById('user2').value.trim();

    if (!user1 || !user2) {
        alert('두 아이디를 모두 입력해주세요!');
        return;
    }

    try {
        const studentData = await getkwStudentInfo(); // 학생 데이터 로드
        if (!Array.isArray(studentData) || studentData.length === 0) {
            throw new Error('학생 데이터를 불러오지 못했습니다.');
        }

        const student1 = studentData.find(student => student._ID === user1);
        const student2 = studentData.find(student => student._ID === user2);

        if (!student1 || !student2) {
            alert('입력된 ID에 해당하는 사용자가 없습니다.');
            return;
        }

        const resultDiv = document.getElementById('result');
        if (student1._ranking < student2._ranking) {
            resultDiv.textContent = `${student1._ID} 승리! (등수: ${student1._ranking} vs ${student2._ranking})`;
        } else if (student1._ranking > student2._ranking) {
            resultDiv.textContent = `${student2._ID} 승리! (등수: ${student1._ranking} vs ${student2._ranking})`;
        } else {
            resultDiv.textContent = `무승부! (등수: ${student1._ranking} vs ${student2._ranking})`;
        }
    } catch (error) {
        console.error('Error during duel:', error);
        alert('결투를 진행하는 중 오류가 발생했습니다.');
    }
}

// DOM이 로드된 후 함수 실행
document.addEventListener("DOMContentLoaded", () => {
    loadKwuRanking();
});

////////////////로드된 데이터에서 사용자 정보를 검색해서 가져오는 방식//////////////////


/*
// 결투 기능
function startDuel() {
    const user1 = document.getElementById('user1').value.trim();
    const user2 = document.getElementById('user2').value.trim();

    if (!user1 || !user2) {
        alert('두 아이디를 모두 입력해주세요!');
        return;
    }

    const student1 = studentData.find(student => student._ID === user1);
    const student2 = studentData.find(student => student._ID === user2);

    if (!student1 || !student2) {
        alert('입력된 ID에 해당하는 사용자가 없습니다.');
        return;
    }

    const resultDiv = document.getElementById('result');
    if (student1._ranking < student2._ranking) {
        resultDiv.textContent = `${student1._ID} 승리! (등수: ${student1._ranking} vs ${student2._ranking})`;
    } else if (student1._ranking > student2._ranking) {
        resultDiv.textContent = `${student2._ID} 승리! (등수: ${student1._ranking} vs ${student2._ranking})`;
    } else {
        resultDiv.textContent = `무승부! (등수: ${student1._ranking} vs ${student2._ranking})`;
    }
}

// DOM이 로드된 후 함수 실행
document.addEventListener("DOMContentLoaded", () => {
    loadKwuRanking();
});


*/