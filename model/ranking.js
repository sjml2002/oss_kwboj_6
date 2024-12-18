// 학생 정보 데이터를 가져오는 함수
const fetchStudentInfo = async () => {
    try {
        const response = await fetch('/getkwStudentInfo');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched Student Data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching student info:', error);
        document.body.innerHTML += `<div style="color: red;">Error: ${error.message}</div>`;
        return [];
    }
};

// 제출 정보 데이터를 가져오는 함수
const fetchSubmitTimeInfo = async () => {
    try {
        const response = await fetch('/getSubmitInfo');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsondata = await response.json();
        console.log('Fetched Submit Data:', jsondata);
        return jsondata;
    } catch (error) {
        console.error('Error fetching data:', error);
        document.body.innerHTML += `<div style="color: red;">Error: ${error.message}</div>`;
        return [];
    }
};

// 유효한 날짜인지 확인하는 함수
const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
};

// 최근 제출자를 필터링하는 함수
const filterRecentSubmitters = (studentdata, submitdata) => {
    let recentsubmitters = [];
    for (const submit of submitdata) {
        const userid = submit._ID;
        const userInfo = studentdata.find((item) => item._ID === userid);
        if (userInfo !== undefined) {
            recentsubmitters.push(userInfo);
        }
        if (recentsubmitters.length === 3) {
            break;
        }
    }
    console.log('Filtered Recent Submitters:', recentsubmitters);
    return recentsubmitters;
};

// 오늘의 상위 솔버를 필터링하는 함수
const filterTopSolvers = (studentdata, submitdata) => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    let topsolvers = new Map();
    for (const submit of submitdata) {
        const submittime = new Date(submit._time);
        if (today > submittime) break;
        const userid = submit._ID;
        if (topsolvers.has(userid)) {
            topsolvers.set(userid, topsolvers.get(userid) + 1);
        } else {
            topsolvers.set(userid, 1);
        }
    }
    console.log(topsolvers); //debug
    topsolvers = [...topsolvers].sort((a, b) => b[1] - a[1]);
    let resulttopsolvers = [];
    for (const solver of topsolvers) {
        const userid = solver[0];
        let userInfo = studentdata.find((item) => item._ID === userid);
        if (userInfo) {
            userInfo._solvedcnt = solver[1];
            resulttopsolvers.push(userInfo);
        }
        if (resulttopsolvers.length == 3) break;
    }
    console.log('Result Top Solvers:', resulttopsolvers);
    return resulttopsolvers.slice(0, 3);
};

// 시상대를 렌더링하는 함수
const renderPodium = (sectionId, users) => {
    console.log(`Rendering ${sectionId}`, users);
    const podium = document.getElementById(sectionId);
    podium.innerHTML = '';
    if (users.length === 0) {
        podium.innerHTML = '<div>No data available</div>';
        return;
    }
    const stages = ['stage-2', 'stage-1', 'stage-3'];
    users.forEach((user, index) => {
        const stage = document.createElement('div');
        stage.classList.add('stage', stages[index]);
        stage.innerHTML = `
            <div class="user">${user._ID || 'Unknown'}</div>
            <div class="user-info">
                <img src="${user._tierImgUrl || ''}" alt="Tier" style="width: 20px;">
                ${user._tier || ''} (${user._rankingInKWU || 'N/A'}위, ${user._solvedcnt || 0}문제)
            </div>
            <div class="medal">${index === 1 ? '🥇' : index === 0 ? '🥈' : '🥉'}</div>
            <div class="wood-base"></div>
        `;
        podium.appendChild(stage);
    });
};

// 로딩 메시지를 제어하는 함수
const showLoading = () => {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.style.display = 'flex';
};

const hideLoading = () => {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.style.display = 'none';
};

// DOMContentLoaded 이벤트
window.addEventListener('DOMContentLoaded', async () => {
    try {
        showLoading(); // 로딩 메시지 표시
        const studentdata = await fetchStudentInfo();
        const submitdata = await fetchSubmitTimeInfo();

        if (!studentdata || studentdata.length === 0) {
            console.error('No student data received');
            document.body.innerHTML += '<div style="color: red;">No student data available</div>';
            hideLoading(); // 로딩 메시지 숨기기
            return;
        }

        if (!submitdata || submitdata.length === 0) {
            console.error('No submit data received');
            document.body.innerHTML += '<div style="color: red;">No submit data available</div>';
            hideLoading(); // 로딩 메시지 숨기기
            return;
        }

        // 시상대 렌더링
        renderPodium('recent-podium', filterRecentSubmitters(studentdata, submitdata));
        renderPodium('solver-podium', filterTopSolvers(studentdata, submitdata));

    } catch (error) {
        console.error('Error during rendering:', error);
        document.body.innerHTML += `<div style="color: red;">Error during rendering: ${error.message}</div>`;
    } finally {
        hideLoading(); // 모든 작업 완료 후 로딩 메시지 숨기기
    }
});



