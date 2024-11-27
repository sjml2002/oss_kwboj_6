//import * as crawling from "./crawlingMain.js";
//import axios from "axios";


const fetchStudentInfo = async () => {
    try {
        const response = await fetch('/getkwStudentInfo');
        const data = await response.json();


        return data; 


    } catch (error) {
        console.error('Error fetching data:', error); 
        return []; 
    }
};

/**
 * 데이터를 렌더링하는 함수
 
 * @description 사용자 데이터를 렌더링하는 함수. 랭킹별 ID에 따라 정렬 및 필터링 방식이 다름.

 * @param {string} sectionId - DOM 요소 ID (렌더링할 ID)

 * @param {Array} users - 사용자 데이터 배열

 */
const renderSection = (sectionId, users) => {
    const podium = document.getElementById(sectionId); // 요소 가져오기
    podium.innerHTML = ''; // 기존 내용 초기화

    // 데이터 정렬/필터링 로직
    if (sectionId === 'recent-podium') {
        // 최근 제출 시간을 기준으로 내림차순 정렬 (최신 순)
        users.sort((a, b) => new Date(b.submissionTime) - new Date(a.submissionTime));
    } else if (sectionId === 'ghost-podium') {
        // 마지막 활동 시간을 기준으로 오름차순 정렬 (오래된 순)
        users.sort((a, b) => new Date(a.lastActivityDate) - new Date(b.lastActivityDate));
    } else if (sectionId === 'solver-podium') {
        // 오늘 날짜의 데이터만 필터링 후 해결한 문제 수 기준으로 내림차순 정렬 (많이 푼 순)
        const today = new Date().toDateString(); // 오늘 날짜
        users = users.filter(user => new Date(user.solveDate).toDateString() === today); // 오늘 날짜와 일치하는 데이터 필터링
        users.sort((a, b) => b.solvedProblems - a.solvedProblems); // 해결한 문제 수 기준 정렬
    }

    const topUsers = users.slice(0, 3); // 상위 3명 데이터 추출
    const stages = ['stage-1', 'stage-2', 'stage-3']; // 스테이지 클래스 배열

    // 각 사용자 데이터를 섹션에 추가
    topUsers.forEach((user, index) => {
        const stage = document.createElement('div');
        stage.classList.add('stage', stages[index]); // 사용자 순위별 스테이지 스타일 적용

        const userName = document.createElement('div');
        userName.classList.add('user'); // 사용자 이름 스타일 적용
        userName.textContent = user.name; // 사용자 이름 삽입

        const additionalInfo = document.createElement('div');
        additionalInfo.classList.add('additional-info'); // 추가 정보 스타일 적용

        // 추가 정보 설정
        if (sectionId === 'recent-podium') {
            const submissionTime = new Date(user.submissionTime);
            additionalInfo.textContent = `${submissionTime.toLocaleTimeString()}`; // 제출 시간 표시
        } else if (sectionId === 'ghost-podium') {
            const daysSinceLastActivity = Math.floor((new Date() - new Date(user.lastActivityDate)) / (1000 * 60 * 60 * 24));
            additionalInfo.textContent = `${daysSinceLastActivity}일`; // 마지막 활동 이후 경과일 표시
        } else if (sectionId === 'solver-podium') {
            additionalInfo.textContent = `${user.solvedProblems}문제`; // 해결한 문제 수 표시
        }

        userName.appendChild(additionalInfo); // 추가 정보를 사용자 이름에 포함

        const woodBase = document.createElement('div');
        woodBase.classList.add('wood-base'); // 목재 기반 스타일 적용

        const medal = document.createElement('div');
        medal.classList.add('medal'); // 메달 스타일 적용
        medal.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'; // 순위별 메달 설정

        // 각 구성 요소를 스테이지에 추가
        stage.appendChild(userName);
        stage.appendChild(woodBase);
        stage.appendChild(medal);

        podium.appendChild(stage); // 스테이지 추가
    });
};

/**
 * 페이지가 로드될 때 데이터를 가져와서 업데이트하는 이벤트 리스너
 * @description 페이지가 로드되면 fetchStudentInfo 함수를 호출하여 데이터를 가져온 후 데이터를 렌더링.
 */
window.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchStudentInfo(); // 서버에서 데이터 가져오기

    // 섹션별 데이터 렌더링
    renderSection('recent-podium', data.recentSubmitters); // THE MOST RECENT SUBMITTER
    renderSection('ghost-podium', data.ghostUsers); // GHOST USER RANKING
    renderSection('solver-podium', data.topSolvers); // TODAY'S TOP SOLVER
});



