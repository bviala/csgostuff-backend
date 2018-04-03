var mongoose = require('mongoose');
var Vote = require('../models/vote');

class StuffDTO{
    constructor(id, name, map, stuffType, gifURL, reqIP){
        this.id = id;
        this.name = name;
        this.map = map;
        this.stuffType = stuffType;
        this.gifURL = gifURL;
        this.reqIP = reqIP;
    }

    score(){
        return Vote.count({
            stuffID: this.id, 
            voteType: 'UPVOTE'
        });
    }

    myVote(){
        let query = {
            stuffID: this.id,
            voterIP: this.reqIP
        }
        return Vote.findOne(query).then(doc => {
            if(doc) return doc.voteType;
        });
    }
}

module.exports = StuffDTO;