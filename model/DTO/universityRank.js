export default class universityRank {
    _rank; //순위
    _name; //학교명
    _members; //인원 수
    _solvedcnt; //맞은 문제 수
    _submitcnt; //제출 문제 수
    _percentageCorrect; //정답률

    constructor(rank, name, members, solvedcnt, submitcnt, percent) {
        this._rank = rank;
        this._name = name;
        this._members = members;
        this._solvedcnt = solvedcnt;
        this._submitcnt = submitcnt;
        this._percentageCorrect = percent;
        
    }

    get rank() {
        return (this._rank);
    }

    get name() {
        return (this._name);
    }

    get members() {
        return (this._members);
    }

    get solvedcnt() {
        return (this._solvedcnt);
    }

    get submitcnt() {
        return (this._submitcnt);
    }

    get percentageCorrect() {
        return (this._percentageCorrect);
    }
}