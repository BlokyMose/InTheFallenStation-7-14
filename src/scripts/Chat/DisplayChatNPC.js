import { sceneEvents } from "../events/EventsCenter";

export default class DisplayChatNPC{
    constructor({
        scene,
        name = "NPC",
        color = "rgba(0,0,0,0.4)",
        offsetY = 0,
    }){
        this.scene = scene;
        this.name = name; //must match the emission of display-say
        this.x = 0;
        this.y = 300;
        // this.offsetX = 0;
        this.offsetY = 25;
        this.textStyleLeft={
            align:"left",
            fontSize: '17px',
            fontFamily: 'Courier',
            color: 'White',
            align: 'center',
            lineSpacing: 5,    
            backgroundColor: color,
        
        },
        this.textStyleRight={
            align:"right",
            fontSize: '17px',
            fontFamily: 'Courier',
            color: 'White',
            align: 'center',
            lineSpacing: 5,    
            backgroundColor: color,
        
        },
        this.textStyleMiddle={
            align:"center",
            fontSize: '17px',
            fontFamily: 'Courier',
            color: 'White',
            align: 'center',
            lineSpacing: 5,    
            backgroundColor: color,
        
        },

        this.textBox = this.scene.add.text(this.x,this.y+this.offsetY,"",this.textStyleMiddle).setDepth(50).setOrigin(0.5,0);

        sceneEvents.on("display-say",this.DisplaySay,this);
        sceneEvents.on("display-move",this.Move,this);
    }

    DisplaySay(bool,name,say=""){
        if(name==this.name){
            if(bool){
                this.textBox.setText(say);

                console.log(this.name+" have said: "+say);
            } else{
                this.textBox.setText("");
                console.log(this.name+": clear say ");

            }
        }else{
            console.log("The message is for: "+name+"; I'm: "+this.name);
        }
    }

    Move(name,x,y,playerX,playerY){
        if(name==this.name){
            if(x>playerX){
                this.textBox.setOrigin(1,0.5);
                this.textBox.setStyle(this.textStyleRight)
                this.textBox.x = 750;
                this.textBox.y = 300+this.offsetY;

            }else{
                this.textBox.setOrigin(0,0.5);
                this.textBox.setStyle(this.textStyleLeft)
                this.textBox.x = 50;
                this.textBox.y = 300+this.offsetY;
            }
        }
    }

}