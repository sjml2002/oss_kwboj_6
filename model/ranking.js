// 학생 데이터를 가져오는 함수
const fetchStudentInfo = async () => {
    try {
        const response = await fetch('/getkwStudentInfo');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched Student Data:', data); // 원본 데이터 확인
        return data;
    } catch (error) {
        console.error('Error fetching student info:', error);
        document.body.innerHTML += `<div style="color: red;">Error: ${error.message}</div>`;
        return [];
    }
};

/// 제출 및 제출 시각과 관련한 정보
const fetchSubmitTimeInfo = async() => {
    try {
        const response = await fetch('/getSubmitInfo');
        const jsondata = await response.json();

        // 데이터를 HTML에 넣기 (example 코드는 studentInfo.html 참고)
        // TODO for 시각화 맴버들
        return (jsondata);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// 유효한 날짜인지 확인하는 함수
const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
};

// /** 
//  * 고스트 유저 필터링 함수 (7일 이상 비활동)
//  * @param {array}studentdata
//  * @param {array}submitdata
//  */
// const filterGhostUsers = (studentdata, submitdata) => {
//     //console.log('Original Data for Ghost Users:', data); // 원본 데이터 확인
//     const now = new Date();

//     const filtered = submitdata.filter(submit => {
//         console.log("submit: ", submit); //debug
//         //console.log('User Data:', user); // 각 사용자 데이터 출력
//         const submittime = submit._time; //제출 시각
//         const userid = submit._ID;

//         if (submittime == "undefined") return false; // 날짜가 없는 경우 제외 (예외처리)
//         const lastActivity = new Date(submittime);
//         return isValidDate(lastActivity) && (now - lastActivity) / (1000 * 60 * 60 * 24) > 7; // 7일 이상 비활동
//     });
//     const setfiltered = new Set(filtered);
//     const arrayfiltered = [...setfiltered];

//     console.log('Filtered Ghost Users:', arrayfiltered);
//     return arrayfiltered.slice(0, 3); // 상위 3명만 반환
// };

// 최근 제출자 필터링 함수
const filterRecentSubmitters = (studentdata, submitdata) => {
    //console.log('Original Data for Recent Submitters:', data); // 원본 데이터 확인

    let recentsubmitters = []
        
    for (const submit of submitdata) {
        const userid = submit._ID; // 유저 ID
        const userInfo = studentdata.find((item) => item._ID === userid);

        console.log(userInfo); // debug
        if (userInfo !== undefined) {
            recentsubmitters.push(userInfo);
        }
        if (recentsubmitters.length === 3) {
            break; // 루프 종료
        }
    }

    console.log('Filtered Recent Submitters:', recentsubmitters);
    return (recentsubmitters);
};

// 상위 솔버 필터링 함수 (문제 해결 수 기준)
const filterTopSolvers = (studentdata, submitdata) => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    let topsolvers = new Map(); //{ID: solvedcnt(today)}
    for (const submit of submitdata) {
        const submittime = new Date(submit._time);
        if (today > submittime)
            break ;
       
        const userid = submit._ID; // 유저 ID
        if (topsolvers.has(userid)) {
            // 키가 존재하면 값을 +1
            topsolvers.set(userid, topsolvers.get(userid) + 1);
        } else {
            // 키가 없으면 초기 값 1 설정
            topsolvers.set(userid, 1);
        }
    }

    //오늘 푼 문제수 내림차순 정렬
    topsolvers = [...topsolvers].sort((a, b) => b[1] - a[1]);
    //topsolvers = topsolvers.slice(0, 3); //3명으로 추리기

    //{ID} 에 따라서 kwStudentsInfo DTO 로 return
    let resulttopsolvers = [];
    for(const solver of topsolvers) {
        const userid = solver[0];
        let userInfo = studentdata.find((item) => item._ID === userid);
        
        if (userInfo) {
            userInfo._solvedcnt = solver[1]; //이거 괜찮을라나
            resulttopsolvers.push(userInfo);
        }

        if (resulttopsolvers.length == 3)
            break;
    }
    console.log("resulttopsolvers: ", resulttopsolvers); //debug
    
    return (resulttopsolvers.slice(0, 3));
};

// 시상대 렌더링 함수
const renderPodium = (sectionId, users) => {
    console.log(`Rendering ${sectionId}`, users);
    const podium = document.getElementById(sectionId);
    podium.innerHTML = ''; // 기존 내용 초기화
    
    if (users.length === 0) {
        podium.innerHTML = '<div>No data available</div>';
        return;
    }

    const stages = ['stage-2', 'stage-1', 'stage-3']; // 2위, 1위, 3위 순서

    users.forEach((user, index) => {
        const stage = document.createElement('div');
        stage.classList.add('stage', stages[index]);

        stage.innerHTML = `
            <div>${user._ID || 'Unknown'}</div>
            <div class="user-info">
                <img src="${user._tierImgUrl || ''}" alt="Tier" style="width: 20px;">
                ${user._tier || ''} (${user._rankingInKWU || 'N/A'}위, ${user._solvedcnt || 0}문제)
            </div>
            <div class="medal">${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
        `;
        
        podium.appendChild(stage);
    });
};

// DOMContentLoaded 이벤트
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const studentdata = await fetchStudentInfo();
        const submitdata = await fetchSubmitTimeInfo();

        if (!studentdata || studentdata.length === 0) {
            console.error('No student data received');
            document.body.innerHTML += '<div style="color: red;">No student data available</div>';
            return;
        }
        if (!submitdata || submitdata.length === 0) {
            console.error('No submit data received');
            document.body.innerHTML += '<div style="color: red;">No student data available</div>';
            return;
        }


        // console.log('Fetched Data:', data);

        // // 필드 확인용 로그
        // console.log("Students with submissionTime:",
        //     data.filter(user => user._submissionTime)
        // );

        // console.log("Students with lastActivityTime:",
        //     data.filter(user => user._lastActivityTime)
        // );

        // 섹션별 데이터 렌더링
        renderPodium('recent-podium', filterRecentSubmitters(studentdata, submitdata)); // 최근 제출자
        //renderPodium('ghost-podium', filterGhostUsers(studentdata, submitdata));       // 고스트 유저
        renderPodium('solver-podium', filterTopSolvers(studentdata, submitdata));      // 상위 솔버

    } catch (error) {
        console.error('Error during rendering:', error);
        document.body.innerHTML += `<div style="color: red;">Error during rendering: ${error.message}</div>`;
    }
});

