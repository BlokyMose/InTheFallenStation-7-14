import { sceneEvents } from "../events/EventsCenter";

export default class Chat{
    constructor(scene){
        this.scene = scene;
        this.isActive =  false;
        this.timeNow = 0;
        this.dialogues=[];
        this.session=0;

        sceneEvents.once("activate-chat",this.ActivateChat,this);
    }

    update(){
        if(this.isActive){
            this.dialogues[this.session].forEach(speech => {
                if(speech["isEnd"]==false){
                    if(speech["start"]<this.timeNow){
                        if(speech["isSaid"]==false){
                            console.log("Emit to displaySay: "+speech["name"]+speech["say"]);
                            sceneEvents.emit("display-say",true,speech["name"],speech["say"]); //must be in order
                            speech["isSaid"]=true;
                        }
                        if(speech["end"]<this.timeNow){
                            sceneEvents.emit("display-say",false,speech["name"]); //must be in order
                            speech["isEnd"]=true;
                            
                            //call after a say has ended 
                            switch (speech["onEnd"]) {
                                case "none": //default; continue dialogue
                                    break;
                                case "close":   //end dialogue, reset time
                                    this.isActive=false; 
                                    this.timeNow=0;
                                    break;
                                case "session":
                                    this.session = speech["params"]; //contain: session number ; reset time
                                    this.timeNow=0;
                                    break;
                                case "option":
                                    sceneEvents.emit("display-options",speech["params"]) //contain {'op1','op2','op3','isNewSession','session'}
                                    this.isActive=false;
                                    this.timeNow=0;
                                    break;
                                case "emit":
                                    sceneEvents.emit(speech["params"][0],speech["params"][1]); //custom; contain: string, parameter
                                    this.isActive=false;
                                    this.timeNow=0;
                                    break;
                                case "loop": //reset time; repeat all over infinitely
                                    this.dialogues[this.session].forEach(speech => {
                                        speech["isEnd"]=false;
                                        speech["isSaid"]=false;
                                    });
                                    this.timeNow=0;
                                    default:
                                    break;
                            }

                        }
                    }
                } 
            });

            this.timeNow++;
        }
    }

    ActivateChat(dialogues=this.dialogues,session=0,isActive=true){
        console.log("Catch Chat: "+dialogues);
        this.dialogues= dialogues;
        this.session = session;
        this.isActive = isActive;
    }
}