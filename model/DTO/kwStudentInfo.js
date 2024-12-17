export default class kwStudentInfo {
    _ID;             //유저 ID
    _tier;           //솔브닥 티어
    _tierImgUrl;     //티어 이미지 url
    _ranking;        //전체 순위
    _rankingInKWU;   //광운대학교 안에서의 순위
    _ACrating;       //AC레이팅
    _CLASSLEVEL;     //솔브닥에서 제공해주는 클래스
    _solvedcnt;      //푼 문제

    constructor(ID, tier, imgurl, r, rik, ac, cl, sc) {
        this._ID = ID;
        this._tier = tier;
        this._tierImgUrl = imgurl
        this._ranking = r;
        this._rankingInKWU = rik;
        this._ACrating = ac;
        this._CLASSLEVEL = cl;
        this._solvedcnt = sc;
    }



    // get ID() {
    //     return (this._ID);
    // }

    // get tier() {
    //     return (this._tier);
    // }

    // get tierImgUrl() {
    //     return (this._tierImgUrl);
    // }

    // get ranking() {
    //     return (this._ranking);
    // }

    // get rankingInKWU() {
    //     return (this._rankingInKWU);
    // }

    // get ACrating() {
    //     return (this._ACrating);
    // }

    // get CLASSLEVEL() {
    //     return (this._CLASSLEVEL);
    // }

    // get solvedcnt() {
    //     return (this._solvedcnt);
    // }
}