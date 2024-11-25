//import * as crawling from "./crawlingMain.js";
//import axios from "axios";

const fetchStudentInfo = async() => {
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
const getTierList = async() => {
    const kwstudents = await fetchStudentInfo();

    let sectors = [
        { label: "언랭", start: 0, end: 10, color: "#2d2d2d", value: 0}, // value 값이 문제 수
        { label: "브론즈", start: 10, end: 20, color: "#ad5600", value: 0 },
        { label: "실버", start: 20, end: 40, color: "#435f7a", value: 0 },
        { label: "골드", start: 40, end: 60, color: "#ec9a00", value: 0 },
        { label: "플래티넘", start: 60, end: 70, color: "#27e2a4", value: 0 },
        { label: "다이아", start: 70, end: 80, color: "#00BFFF", value: 0 },
        { label: "루비", start: 80, end: 100, color: "#e0115f", value: 0 },
    ];
    
    kwstudents.forEach((student) => {
        const tier = student._tier;
        let tierName = "언랭";
        if (tier.includes("Ruby"))
            tierName = "루비";
        else if (tier.includes("Diamond"))
            tierName = "다이아";
        else if (tier.includes("Platinum"))
            tierName = "플래티넘";
        else if (tier.includes("Gold"))
            tierName = "골드";
        else if (tier.includes("Silver"))
            tierName = "실버";
        else if (tier.includes("Bronze"))
            tierName = "브론즈";
        
        sectors.forEach((sector) => {
            if (sector.label === tierName) {
                sector.value += 1;
            }
        })
    });

    //start, end 비율 설정
    for(let i=0; i<sectors.length; i++) {
        let solvedpercentage = 0;
        if (sectors[i].value != 0)
         solvedpercentage = (sectors[i].value / kwstudents.length) * 100; //백분율 환산했을 때 비율
        if (i > 0)
            sectors[i].start = sectors[i-1].end;
        sectors[i].end = sectors[i].start + (solvedpercentage);
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
            sectors.forEach((sector) => {
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
            alert(`클릭한 섹터: ${clickedSector.label} (${clickedSector.value} 명)`);
        } else {
            alert("섹터를 클릭하지 않았습니다.");
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
            // 섹터 정보 표시
            $(".tooltip").html(`${hoveredSector.label}: ${hoveredSector.value} 명`)
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


