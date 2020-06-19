const matches = require('../../PBEloBot/storage/matches.json');
const fs = require('fs');

module.exports = class _Match {

    /**
     * 
     * @param {String} team1 
     * @param {String} team2 
     * @param {Number} score1 
     * @param {Number} score2 
     * @param {Date} date 
     */

    constructor(team1, team2, score1, score2, date){

        this.team1 = team1;
        this.team2 = team2;
        this.score1 = score1;
        this.score2 = score2;
        this.date = date;

    }

    /**
     * 
     * @param {Date} date 
     * @param {Number} team1 
     * @param {Number} team2 
     * @returns {_Match}
     */

    static getMatch(date, team1, team2){
        let filtered = matches.filter(val => val.date == date.toString() && ((val.team1 == team1 && val.team2 == team2 ) || (val.team1 == team2 && val.team2 == team1)));
        if(filtered.length == 0) return null;
        else return filtered.pop();
    }

    /**
     * 
     * @param {String} team1 
     * @param {String} team2 
     * @param {Number} score1 
     * @param {Number} score2 
     * @param {Date} date 
     * @returns {_Match}
     */

    static createMatch(team1, team2, score1, score2, date){
        let obj = {
            team1: team1,
            team2: team2,
            score1: score1,
            score2: score2,
            date: date.toString()
        }
        matches.push(obj);
        fs.writeFile("./storage/matches.json", JSON.stringify(matches), err => {
            if(err) console.log(err);
        });
        return new _Match(team1, team2, score1, score2, date);
    }

    /**
     * 
     * @param {String} team1 
     * @param {String} team2 
     * @returns {Array}
     */

    static findMatches(team1, team2){
        let filtered = matches.filter(val => (val.team1 == team1 && val.team2 == team2) || (val.team1 == team2 && val.team2 == team1));
        if(filtered.length == 0) return null;
        else return filtered;
    }

    /**
     * 
     * @param {String} team
     * @returns {Array}
     */

    static findMatches(team){
        let filtered = matches.filter(val => val.team1 == team || val.team2 == team);
        if(filtered.length == 0) return null;
        else return filtered;
    }

    /**
     * 
     * @param {Date} dayDate 
     * @returns {Array}
     */

    static findMatches(dayDate){
        let filtered = matches.filter(val => {
            let date = new Date(val.date);
            return date.getFullYear() == dayDate.getFullYear() && date.getMonth() == dayDate.getMonth() && date.getDate() == dayDate.getDate();
        });
        if(filtered.length == 0) return null;
        else return filtered;
    }

    /**
     * @returns {Array}
     */

    static getMatchesObj(){
        return matches;
    }

}