export default class submitWithTime {
    _ID;         //유저 ID
    _problemID;  //문제 ID
    _time;       //언제 풀었는지

    constructor(id, pid, t) {
        this._ID = id;
        this._problemID = pid;
        this._time = t;
    }

    get ID() {
        return (this._ID);
    }

    get problemID() {
        return (this._problemID);
    }

    get time() {
        return (this._time);
    }
}