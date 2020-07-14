import { sceneEvents } from "../events/EventsCenter";

export default class DisplayOptions{
    constructor(scene){
        this.scene=scene;
        this.textStyle = {
            fontSize: '17px',
            fontFamily: 'Calibri',
            color: 'White',
            lineSpacing: 4,    
            align: "left",
        
        };
        this.opSessions = [];
        this.isNewSession = false;
        this.session =0;
        this.record=[];
        this.opCoor = [
            [220,140], //text for op1
            [220,220], //text for op2
            [220,300] //text for op3
        ]
        this.opTexts = [];
        this.BGRect = this.scene.add.rectangle(400,225,400,250,0x0a0a0a,0.5)
        .setOrigin(0.5).setActive(false).setVisible(false);

        this.opCoor.forEach((coor)=>{
            this.opTexts.push(this.scene.add.text(coor[0],coor[1],"",this.textStyle)
            .setOrigin(0,0.5).setInteractive().setActive(false))
        })
    
        this.opTexts.forEach((text,index)=>{
            text.on('pointerdown', function (pointer) { this.RecordClear(index); }, this); 
            text.on('pointerover', function (pointer) { this.ChangeAlpha(text); }, this);
            text.on('pointerout', function (pointer) { this.ResetAlpha(text); }, this);
        });

        sceneEvents.on("display-options",this.DisplayOptionsMethod,this);

    }

    DisplayOptionsMethod({
        ops,
        opSessions,
        isNewSession,
    }){
        this.BGRect.setActive(true).setVisible(true);
        this.opTexts.forEach((text,index)=>{text.setActive(true).setText(ops[index]); });
        opSessions.forEach((session)=>{this.opSessions.push(session);});
        this.isNewSession = isNewSession;
    }

    RecordClear(op){
        this.RecordOption(op);
        this.Branching(op);
        this.NewChatSession();
        this.ClearOptions();
    }

    Branching(op){
        this.session = this.opSessions[op]; //0,1,2
    }
    RecordOption(optionNumber){
        this.record.push(optionNumber+1); //recorded option starts from 1,2,3
    }
    ClearOptions(){
        this.BGRect.setActive(false).setVisible(false);
        this.opSessions = [];
        this.opTexts.forEach((text)=>{ text.setText("").setActive(false);});
        this.session=0;
        this.isNewSession=false;
    }
    NewChatSession(){
        if(this.isNewSession){
            //pass back to scene to activate Chat with session
            console.log("Back to Chat() w/ session:"+this.session);
            sceneEvents.emit('activate-chat',undefined,this.session,true); //use the same dialogue deck, different session
        }
    }
    ChangeAlpha(text){
                text.setStyle({color:"OrangeRed"});
    }
    ResetAlpha(text){
                text.setStyle({color:"White"});
    }

}
