import { sceneEvents } from "../events/EventsCenter";


export default class UIWound{
    constructor({
        scene,
        text = "Bleeding",
        textStyle={},
        x=0,
        y=0,
    }){
        this.scene = scene;
        this.text=text;
        this.notBleedingVar=false;

        this.UIText = this.scene.add.text(x,y,"| "+this.text,textStyle).setOrigin(0).setInteractive();
        this.UIText.on('pointerover',function(pointer){this.PushWound(true);},this);
        this.UIText.on('pointerout',function(pointer){this.PushWound(false);},this);

        this.UIText.setColor("Red");
    }

    PushWound(boolValue){
        if(boolValue){
            this.UIText.setColor("LimeGreen");
            this.UIText.setText("| "+"Pushed");
            this.notBleedingVar = true;
            sceneEvents.emit("push-wound",true);            
        }
        else{
            this.UIText.setColor("Red");
            this.UIText.setText("| "+"Bleeding");
            this.notBleedingVar = false;
            sceneEvents.emit("push-wound",false);            
        }
    }

    NotBleeding(){
        return this.notBleedingVar;
    }
}