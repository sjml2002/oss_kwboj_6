let allStudentData = []; // 모든 데이터를 저장

const fetchStudentInfo = async () => {
    try {
        const response = await fetch('/getkwStudentInfo');
        const jsondata = await response.json();

        allStudentData = jsondata; // 데이터를 저장
        console.log('All Student Data:', allStudentData); // 데이터 확인
        displayTable(jsondata.slice(0, 10));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const displayTable = (data) => {
    const tableBody = document.getElementById('rankingTableBody');
    tableBody.innerHTML = ''; // 기존 데이터 초기화

    data.forEach((item, index) => {
        const tr = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        tr.appendChild(rankCell);

        const idCell = document.createElement('td');
        idCell.textContent = item._ID;
        tr.appendChild(idCell);

        const tierImgCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = item._tierImgUrl;
        img.width = 20;
        img.height = 20;
        tierImgCell.appendChild(img);
        tr.appendChild(tierImgCell);

        const ratingCell = document.createElement('td');
        ratingCell.textContent = item._ACrating;
        tr.appendChild(ratingCell);

        const solvedCountCell = document.createElement('td');
        solvedCountCell.textContent = item._solvedcnt;
        tr.appendChild(solvedCountCell);

        tableBody.appendChild(tr);
    });
};

window.searchAndDisplay = () => {
    const searchInput = document.querySelector('.searchInput').value.trim().toLowerCase();

    // 1위부터 5위까지의 ID 확인
    const top5IDs = allStudentData.slice(0, 5).map(item => item._ID?.toLowerCase());

    // 만약 검색한 ID가 1위부터 5위에 속하면 초기 화면(1~10위) 리턴
    if (top5IDs.includes(searchInput)) {
        displayTable(allStudentData.slice(0, 10), searchInput); // 초기 화면 출력
        return;
    }

    const targetIndex = allStudentData.findIndex(item => item._ID?.toLowerCase() === searchInput);

    if (targetIndex === -1) {
        alert('해당 ID를 찾을 수 없습니다.');
        return;
    }

    const tableBody = document.getElementById('rankingTableBody');
    tableBody.innerHTML = ''; // 기존 테이블 초기화

    const rows = 9; // 총 9개의 행 (5번째가 중심)
    const center = 4; // 중심이 5번째
    const start = Math.max(0, targetIndex - center);
    const end = Math.min(allStudentData.length, targetIndex + (rows - center));

    // 중심 데이터 맞추기
    let displayData = allStudentData.slice(start, end);
    while (displayData.length < rows) {
        if (start > 0) displayData.unshift(allStudentData[start - 1]);
        else if (end < allStudentData.length) displayData.push(allStudentData[end]);
        else break;
    }

    // 테이블에 표시
    displayData.forEach((item, index) => {
        const tr = document.createElement('tr');

        // 순위
        const rankCell = document.createElement('td');
        rankCell.textContent = start + index + 1;
        tr.appendChild(rankCell);

        // ID
        const idCell = document.createElement('td');
        idCell.textContent = item._ID;
        tr.appendChild(idCell);

        // 티어 이미지
        const tierImgCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = item._tierImgUrl;
        img.width = 20;
        img.height = 20;
        tierImgCell.appendChild(img);
        tr.appendChild(tierImgCell);

        // 레이팅
        const ratingCell = document.createElement('td');
        ratingCell.textContent = item._ACrating;
        tr.appendChild(ratingCell);

        // 푼 문제 수
        const solvedCountCell = document.createElement('td');
        solvedCountCell.textContent = item._solvedcnt;
        tr.appendChild(solvedCountCell);

        // 중앙 강조 (5번째 행)
        if (index === center) {
            tr.style.backgroundColor = '#f0f8ff'; // 하이라이트 색상
        }
        
        tableBody.appendChild(tr);
    });
};

fetchStudentInfo();

