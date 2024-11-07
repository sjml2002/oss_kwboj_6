$(window).ready(function() {
    var i = 1; // 변수 i를 1로 초기화
    var func1 = setInterval(function() { // func1이라는 변수에 setInterval 함수로 애니메이션 타이머를 설정
        if (i <= 40) {
            color1(i); // i가 40 이하일 때 브론즈 색상 호출
        } else if (i <= 65) { // 40 + 25 = 65
            color2(i); // i가 65 이하일 때 실버 색상 호출
        } else if (i <= 80) { // 65 + 15 = 80
            color3(i); // i가 80 이하일 때 골드 색상 호출
        } else if (i <= 90) { // 80 + 10 = 90
            color4(i); // i가 90 이하일 때 플래티넘 색상 호출
        } else if (i <= 96) { // 90 + 6 = 96
            color5(i); // i가 96 이하일 때 다이아몬드 색상 호출
        } else if (i <= 100) { // 96 + 4 = 100
            color6(i); // i가 100 이하일 때 루비 색상 호출
        } else {
            clearInterval(func1); // i가 101 이상이 되면 타이머를 정지
        }
        i++; // i를 1 증가
    }, 10); // 10ms 간격으로 위의 함수 실행
});

// 색상 함수 정의
function color1(i) {
    $(".pie-chart3").css({
        "background": "conic-gradient(#cd7f32 0% " + i + "%, #ffffff " + i + "% 100%)" // 브론즈 색상
    });
}

function color2(i) {
    $(".pie-chart3").css({
        "background": "conic-gradient(#cd7f32 0% 40%, #c0c0c0 40% " + (i - 40) + "%, #ffffff " + (i - 40) + "% 100%)"
    });
}

function color3(i) {
    $(".pie-chart3").css({
        "background": "conic-gradient(#cd7f32 0% 40%, #c0c0c0 40% 65%, #ffd700 65% " + (i - 65) + "%, #ffffff " + (i - 65) + "% 100%)"
    });
}

function color4(i) {
    $(".pie-chart3").css({
        "background": "conic-gradient(#cd7f32 0% 40%, #c0c0c0 40% 65%, #ffd700 65% 80%, #e5e4e2 80% " + (i - 80) + "%, #ffffff " + (i - 80) + "% 100%)"
    });
}

function color5(i) {
    $(".pie-chart3").css({
        "background": "conic-gradient(#cd7f32 0% 40%, #c0c0c0 40% 65%, #ffd700 65% 80%, #e5e4e2 80% 90%, #b9fbc0 90% " + (i - 90) + "%, #ffffff " + (i - 90) + "% 100%)"
    });
}

function color6(i) {
    $(".pie-chart3").css({
        "background": "conic-gradient(#cd7f32 0% 40%, #c0c0c0 40% 65%, #ffd700 65% 80%, #e5e4e2 80% 90%, #b9fbc0 90% 96%, #e0115f 96% " + (i - 96) + "%)"
    });
}
