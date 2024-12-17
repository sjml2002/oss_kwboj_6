//import * as crawling from "./crawlingMain.js";
//import axios from "axios";

const fetchStudentInfo = async () => {
    try {
        const response = await fetch('/getkwStudentInfo');
        const jsondata = await response.json();

        // 데이터를 HTML에 넣기 (example 코드는 studentInfo.html 참고)
        // TODO for 시각화 맴버들
        return (jsondata);

    } catch (error) {
        console.error('Error fetching data:', error);
        return ([]);
    }
};

/**
 * 티어에 따른 인원 수 계산
 * @returns {List - Map} 실제 랜더링 데이터가 되는 sectors
 */
const getTierList = async () => {
    const kwstudents = await fetchStudentInfo();

    let sectors = [
        { label: "Unrated", start: 0, end: 10, color: "#2d2d2d", value: 0, ratio: 5 }, // value 값이 문제 수
        { label: "Bronze", start: 10, end: 20, color: "#ad5600", value: 0, ratio: 5 },
        { label: "Silver", start: 20, end: 40, color: "#435f7a", value: 0, ratio: 5 },
        { label: "Gold", start: 40, end: 60, color: "#ec9a00", value: 0, ratio: 5 },
        { label: "Platinum", start: 60, end: 70, color: "#27e2a4", value: 0, ratio: 5 },
        { label: "Diamond", start: 70, end: 80, color: "#00BFFF", value: 0, ratio: 5 },
        { label: "Ruby", start: 80, end: 100, color: "#e0115f", value: 0, ratio: 5 },
    ];

    kwstudents.forEach((student) => {
        const tier = student._tier;
        let tierName = "Unrated";
        if (tier.includes("Ruby"))
            tierName = "Ruby";
        else if (tier.includes("Diamond"))
            tierName = "Diamond";
        else if (tier.includes("Platinum"))
            tierName = "Platinum";
        else if (tier.includes("Gold"))
            tierName = "Gold";
        else if (tier.includes("Silver"))
            tierName = "Silver";
        else if (tier.includes("Bronze"))
            tierName = "Bronze";

        sectors.forEach((sector) => {
            if (sector.label === tierName) {
                sector.value += 1;
            }
        })
    });

    //start, end 비율 설정
    for (let i = 0; i < sectors.length; i++) {
        let solvedpercentage = 0;
        if (sectors[i].value != 0)
            solvedpercentage = (sectors[i].value / kwstudents.length) * 100; //백분율 환산했을 때 비율
        if (i > 0)
            sectors[i].start = sectors[i - 1].end;
        sectors[i].end = sectors[i].start + (solvedpercentage);

        // Ratio 값 추가 
        const rawRatio = sectors[i].end - sectors[i].start;
        sectors[i].ratio = Math.floor(rawRatio * 10) / 10; // 소수점 첫 번째 자리까지만 유지

    }
    return (sectors);
}


$(window).ready(async function () {
    const chartRadius = 150; // 차트의 반지름 (px)
    const centerX = 150; // 차트의 중심 X 좌표
    const centerY = 150; // 차트의 중심 Y 좌표

    let sectors = await getTierList();

    // 그래프 애니메이션
    let i = 1;
    let func1 = setInterval(function () {
        if (i <= 100) {
            updateChart(i);
        } else {
            clearInterval(func1);
            sectors.slice().reverse().forEach((sector) => { // 역순으로 루비가 젤 위로 가게끔 출력
                addValue(sector);
            });
        }
        i++;
    }, 10);

    // 차트 그리는 함수
    function updateChart(i) {
        let background = sectors
            .map((sector) => {
                if (i <= sector.end) {
                    return `${sector.color} ${sector.start}% ${i}%, #ffffff ${i}% 100%`;
                }
                return `${sector.color} ${sector.start}% ${sector.end}%`;
            })
            .join(", ");
        $(".pie-chart").css("background", `conic-gradient(${background})`);

        // 레이블 추가
        sectors.forEach((sector) => {
            if (i >= sector.end && !$(`.chart-labels .${sector.label}`).length) {
                addLabel(sector);
            }
        });
    }

    function addLabel(sector) {
        // 중심 각도 계산
        const angle = ((sector.start + sector.end) / 2) * 3.6 * (Math.PI / 180); // 중심 각도를 라디안으로 변환
    }

    function addValue(sector) {

        // 값이 그래프에 추가되는 동시에 로딩 메시지 변경
        $("#center-label").text("Click It!");

        // 그래프 오른쪽에 티어 별 인원수 데이터 입력
        $(".chart-value ul").append(`
            <li class="${sector.label}" style="
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: bold;">
                <span style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background-color: ${sector.color};
                    margin-right: 8px;
                    border-radius: 4px;">
                </span>
                ${sector.label}: ${sector.value} 
            </li>
        `);

    }

    $(".pie-chart").on("click", function (e) {
        // 차트 중심 및 클릭 좌표 계산
        const offset = $(this).offset();
        const clickX = e.pageX - offset.left - centerX;
        const clickY = e.pageY - offset.top - centerY;

        // 클릭 각도 계산 (라디안 -> 각도로 변환)
        let clickAngle = Math.atan2(clickY, clickX) * (180 / Math.PI);
        if (clickAngle < 0) clickAngle += 360; // 각도를 0~360도로 변환

        // CSS conic-gradient와 맞추기 위해 기준을 -90도 이동
        clickAngle = (clickAngle + 90) % 360;

        // 클릭한 섹터 탐색
        let clickedSector = sectors.find(
            (sector) => clickAngle >= sector.start * 3.6 && clickAngle < sector.end * 3.6
        );

        if (clickedSector) {
            $("#center-label").html(
                `<div style="text-align: center;">
                    <span style="color: ${clickedSector.color}; font-weight: bold;">${clickedSector.label}</span>
                    <br>
                    ${clickedSector.ratio}%
                </div>`
            );
        } else {
            $("#center-label").text("No Sector Clicked");
        }

    });

    $(".pie-chart").on("mousemove", function (e) {
        // 차트 중심 및 마우스 좌표 계산
        const offset = $(this).offset();
        const mouseX = e.pageX - offset.left - centerX;
        const mouseY = e.pageY - offset.top - centerY;

        // 마우스 각도 계산 (라디안 -> 각도로 변환)
        let mouseAngle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
        if (mouseAngle < 0) mouseAngle += 360; // 각도를 0~360도로 변환

        // CSS conic-gradient 기준(12시 방향)으로 조정
        mouseAngle = (mouseAngle + 90) % 360;

        // 마우스가 위치한 섹터 탐색
        let hoveredSector = sectors.find(
            (sector) => mouseAngle >= sector.start * 3.6 && mouseAngle < sector.end * 3.6
        );

        if (hoveredSector) {
            // 섹터별 다른 텍스트 구성
            let tooltipText = "";
            switch (hoveredSector.label) {
                case "Unrated":
                    tooltipText = `티어가 배정되지 않았네요! 조금 더 문제를 풀어 어떤 티어든 들어가봐요!`;
                    break;
                case "Bronze":
                    tooltipText = `누구에게나 시작은 브론즈였죠. 하지만 걱정하지 마세요. 기본기를 익히다 보면 금방 실버 티어로 올라갈 수 있을 거에요!`;
                    break;
                case "Silver":
                    tooltipText = `실버 티어는 확실히 초급자의 티는 벗었다고 할 수 있죠! 
                    초급 알고리즘의 개념을 완전히 이해하고 문제를 꾸준히 풀어야 올라갈 수 있어요. 이제 코딩이 조금 재미있어지지 않았나요?`;
                    break;
                case "Gold":
                    tooltipText = `골드 티어에 도달한 당신은 이미 상위 **30%** 안에 속하는 준고수! 
                    이제 문제 난이도가 급격히 상승하면서 실력을 검증받는 시점입니다. 이 정도면 학교에서 코딩 잘한다는 소리, 한 번쯤 들어보셨을 거예요.`;
                    break;
                case "Platinum":
                    tooltipText = `플래티넘 티어는 상위 약 **7%** 이상의 진정한 알고리즘 실력자들만 모이는 곳! 
                    각종 대회에서 우승을 노리는 개발자라면 반드시 도달해야 하는 티어죠. 이제 백준 문제를 풀며 실력을 증명하는 중입니다.`;
                    break;
                case "Diamond":
                    tooltipText = `다이아몬드 티어에 오르셨다니 대단합니다! 
                    상위 약 **1%**에 속하는 당신은 이미 알고리즘 마스터로, 복잡한 문제도 가볍게 해결하는 경지에 이르렀습니다.
                    코드 속에 파묻혀 살지 않는 한, 백준 세계의 **1%** 안에 들 수 없을 거예요!`;
                    break;
                case "Ruby":
                    tooltipText = `루비는 단 **0.1%**(500명이 안된다고?!)의 사람들만 오를 수 있는 신화 같은 경지! 
                    필요 레이팅은 무려 2700 이상! 백준 세계에서 더 이상 오를 곳이 없는 절대고수로, 이름만 들어도 존경받는 레벨입니다.`;
                    break;
                default:
                    tooltipText = `${hoveredSector.label}: ${hoveredSector.value} 명`;
            }

            // 툴팁 업데이트
            $(".tooltip").html(tooltipText)
                .css({
                    top: e.pageY + 10 + "px",
                    left: e.pageX + 10 + "px",
                    display: "block"
                });
        } else {
            // 섹터 밖에서는 툴팁 숨기기
            $(".tooltip").css("display", "none");
        }
    });

    // 마우스가 차트를 벗어나면 툴팁 숨기기
    $(".pie-chart").on("mouseleave", function () {
        $(".tooltip").css("display", "none");
    });

});


