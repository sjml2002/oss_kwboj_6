const fetchStudentInfo = async () => {
    try {
        const response = await fetch('/getkwStudentInfo');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching student info:', error);
        return [];
    }};

const filterRecentSubmitters = (data) => {
    return [...data].sort((a, b) => new Date(b._submissionTime) - new Date(a._submissionTime)).slice(0, 3);
};

const filterGhostUsers = (data) => {
    return [...data].sort((a, b) => new Date(a._lastActivityTime) - new Date(b._lastActivityTime)).slice(0, 3);
};

const filterTopSolvers = (data) => {
    const today = new Date().toISOString().split('T')[0];
    return data
        .filter((user) => user._solveDate && user._solveDate.split('T')[0] === today)
        .sort((a, b) => b._solvedcnt - a._solvedcnt)
        .slice(0, 3);
};

const renderSection = (sectionId, users) => {
    const podium = document.getElementById(sectionId);
    podium.innerHTML = '';

    if (!users || users.length === 0) {
        podium.innerHTML = '<div>No data available</div>';
        return;
    }

    const stages = ['stage-1', 'stage-2', 'stage-3'];
    users.forEach((user, index) => {
        const stage = document.createElement('div');
        stage.classList.add('stage', stages[index]);

        const userName = document.createElement('div');
        userName.classList.add('user');
        userName.textContent = user._ID;

        const additionalInfo = document.createElement('div');
        additionalInfo.innerHTML = `
            <img src="${user._tierImgUrl}" alt="${user._tier}" style="width: 20px; vertical-align: middle;"> 
            ${user._tier} (${user._rankingInKWU}위, ${user._solvedcnt}문제)
        `;
        userName.appendChild(additionalInfo);

        const woodBase = document.createElement('div');
        woodBase.classList.add('wood-base');

        const medal = document.createElement('div');
        medal.classList.add('medal');
        medal.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';

        stage.appendChild(userName);
        stage.appendChild(woodBase);
        stage.appendChild(medal);

        podium.appendChild(stage);
    });
};

window.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchStudentInfo();
    renderSection('recent-podium', filterRecentSubmitters(data));
    renderSection('ghost-podium', filterGhostUsers(data));
    renderSection('solver-podium', filterTopSolvers(data));
});

