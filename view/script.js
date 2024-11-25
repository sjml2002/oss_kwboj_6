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
