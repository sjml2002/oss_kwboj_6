/// 광운대 학생들의 백준 정보
const fetchStudentInfo = async() => {
    try {
        const response = await fetch('/getkwStudentInfo');
        const jsondata = await response.json();

        // 데이터를 HTML에 넣기
        // TODO for 시각화 맴버들
        const table = document.getElementById('studentInfoTable');
        jsondata.forEach((item, idx) => {
            const tr = document.createElement('tr');

            // 전체랭킹, 안씀
            // const rankingCell = document.createElement('td');
            // rankingCell.textContent = item._ranking;
            // tr.appendChild(rankingCell);

            const rankingInKWUCell = document.createElement('td');
            rankingInKWUCell.textContent = item._rankingInKWU;
            tr.appendChild(rankingInKWUCell);

            const idCell = document.createElement('td');
            idCell.textContent = item._ID;
            tr.appendChild(idCell);

            const tierCell = document.createElement('td');
            tierCell.textContent = item._tier;
            tr.appendChild(tierCell);

            const tierImgCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = item._tierImgUrl;
            img.alt = item._tier;
            img.width = 20; // 이미지 크기 조절
            img.height = 20;
            tierImgCell.appendChild(img);
            tr.appendChild(tierImgCell);

            const acratingCell = document.createElement('td');
            acratingCell.textContent = item._ACrating;
            tr.appendChild(acratingCell);

            const solvedCountCell = document.createElement('td');
            solvedCountCell.textContent = item._solvedcnt;
            tr.appendChild(solvedCountCell);

            // 클래스 레벨, 안씀
            // const classLevelCell = document.createElement('td');
            // classLevelCell.textContent = item._CLASSLEVEL;
            // tr.appendChild(classLevelCell);

            table.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

fetchStudentInfo();