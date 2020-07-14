import { sceneEvents } from "../events/EventsCenter";

export default class DisplayChat{
    constructor({
        scene,
        name,
        x,
        y,
        color = "rgba(0,0,0,0.4)",
        
    }){
        this.scene = scene;
        this.name = name; //must match the emission of display-say
        this.offsetX = 0;
        this.offsetY = 25;
        this.textStyle={
            fontSize: '17px',
            fontFamily: 'Calibri',
            color: 'White',
            align: 'center',
            lineSpacing: 5,    
            backgroundColor: color,
        
        },
        this.textBox = this.scene.add.text(x+this.offsetX,y+this.offsetY,"",this.textStyle).setDepth(50).setOrigin(0.5,0);

        sceneEvents.on("display-say",this.DisplaySay,this);
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

}