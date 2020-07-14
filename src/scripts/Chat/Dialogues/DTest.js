export default class DTest{
    constructor(scene){
        this.scene = scene;
        this.dialogues=[
            [   //session 0
                    { //speech 0
                        "id":1,
                        "tag":"firstTag",
                        "name": "Eva",
                        "say": "This is a disaster!",
                        "start": 100,
                        "end":200,
                        "isSaid":false,
                        "isEnd": false,
                        "onEnd": "none", //none, close, session, option, emit
                        "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                    },
                    { //speech 1
                        "id":2,
                        "tag":"firstTag",
                        "name": "Tandok",
                        "say": "Hello, there??\Eva, nice to meet ya",
                        "start": 200,
                        "end":400,
                        "isSaid":false,
                        "isEnd": false,
                        "onEnd": "none", //none, close, session, option, emit
                        "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                    },
                    { //speech 2
                        "id":3,
                        "tag":"firstTag",
                        "name": "Lot",
                        "say": "dammit! Why did you do that dammit!",
                        "start":250,
                        "end":500,
                        "isSaid":false,
                        "isEnd": false,
                        "onEnd": "option", //none, close, session, option, emit,loop
                        "params": {
                            "ops":[
                                "Lie\nI don't think that is a good idea",
                                "Honest\nWe should do it",
                                "Avoid\nI have no idea what to say",
                            ],
                            "opSessions":[
                                1,
                                2,
                                3
                            ],
                            "isNewSession":true,
                        }, 
//undef,undef,int, 
//{'op1','op2','op3','op1Session','op2Session','op3Session','isNewSession','session'}, [string,params]
                    },

            ],
            //=========================================================
            [ //session 1
                { //speech 0
                    "id":1,
                    "tag":"firstTag",
                    "name": "Eva",
                    "say": "Hello, world! Sess1",
                    "start": 0,
                    "end":500,
                    "isSaid":false,
                    "isEnd": false,
                    "onEnd": "none", //none, close, session, option, emit
                    "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                },
                { //speech 1
                    "id":1,
                    "tag":"firstTag",
                    "name": "Lot",
                    "say": "Hello, I'mLOT!",
                    "start": 600,
                    "end":700,
                    "isSaid":false,
                    "isEnd": false,
                    "onEnd": "none", //none, close, session, option, emit
                    "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                },
                { //speech 2
                    "id":1,
                    "tag":"firstTag",
                    "name": "Tandok",
                    "say": "Hello, I'm Tandok!",
                    "start": 650,
                    "end":900,
                    "isSaid":false,
                    "isEnd": false,
                    "onEnd": "close", //none, close, session, option, emit
                    "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                },
            ],
            //=========================================================
            [ //session 2
                { //speech 0
                    "id":1,
                    "tag":"firstTag",
                    "name": "Eva",
                    "say": "Hello, world! Session2",
                    "start": 0,
                    "end":500,
                    "isSaid":false,
                    "isEnd": false,
                    "onEnd": "none", //none, close, session, option, emit
                    "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                },
                { //speech 1
                    "id":1,
                    "tag":"firstTag",
                    "name": "Lot",
                    "say": "Hello, I'mLOT!",
                    "start": 600,
                    "end":700,
                    "isSaid":false,
                    "isEnd": false,
                    "onEnd": "none", //none, close, session, option, emit
                    "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                },
                { //speech 2
                    "id":1,
                    "tag":"firstTag",
                    "name": "Tandok",
                    "say": "Hello, I'm Tandok!",
                    "start": 650,
                    "end":900,
                    "isSaid":false,
                    "isEnd": false,
                    "onEnd": "close", //none, close, session, option, emit
                    "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                },
            ],
            //=========================================================
            [ //session 3
                { //speech 0
                    "id":1,
                    "tag":"firstTag",
                    "name": "Eva",
                    "say": "Hello, world 3333!",
                    "start": 0,
                    "end":500,
                    "isSaid":false,
                    "isEnd": false,
                    "onEnd": "none", //none, close, session, option, emit
                    "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                },
                { //speech 1
                    "id":1,
                    "tag":"firstTag",
                    "name": "Lot",
                    "say": "Hello, I'mLOT!",
                    "start": 600,
                    "end":700,
                    "isSaid":false,
                    "isEnd": false,
                    "onEnd": "none", //none, close, session, option, emit
                    "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                },
                { //speech 2
                    "id":1,
                    "tag":"firstTag",
                    "name": "Tandok",
                    "say": "Hello, I'm Tandok!",
                    "start": 650,
                    "end":900,
                    "isSaid":false,
                    "isEnd": false,
                    "onEnd": "close", //none, close, session, option, emit
                    "params": undefined, //undef,undef,int, {'op1','op2','op3','isNewSession','session'}, [string,params]
                },
            ],
        ]
    }
}