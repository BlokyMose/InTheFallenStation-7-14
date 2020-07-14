import { sceneEvents } from "../events/EventsCenter";

export default class UIPhone{
    constructor(scene){
        this.itemID=0;
        this.name = "Phone";
        this.text = "✉";

        this.type = "tool";
        this.desc = "to contact";
        this.descLong = "Hover '✉' to turn see texts sent by someone else and by you";

        this.scene = scene;

        this.isExist;
        this.allMessages;
        this.UIText;


        document.querySelector("#indexNotes-h1").setAttribute("style","opacity:0;");
        document.querySelector("#indexNotes-p").setAttribute("style","opacity:0;");


    }

    AddToUI({
        itemID=this.itemID,
        name=this.name,
        x=0, 
        y=0, 
        text=this.text,
        textStyle={}
    }){
            this.itemID = itemID;
            this.text = text;
            this.isExist = true;
            this.allMessages = [];
            this.allMessages[0] = "> no log";
    
            this.UIText = this.scene.add.text(x, y, "| " + this.text, textStyle).setOrigin(0).setInteractive();
            this.UIText.setColor("LimeGreen");
            this.UIText.on('pointerover', function (pointer) { this.OpenPhone(true); }, this);
            this.UIText.on('pointerout', function (pointer) { this.OpenPhone(false); }, this);
    
            sceneEvents.on('send-new-message', this.NewMessage ,this);
            sceneEvents.on('destroy-item-ui',this.Destroy,this);
    }

    OpenPhone(boolValue){
        if(boolValue){
            document.querySelector("#indexNotes-h1").textContent = "Message Log";
            document.querySelector("#indexNotes-p").textContent = this.allMessages.join(";");
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:1;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:1;");
            
            this.UIText.setColor("Green");
        }else{
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:0;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:0;");
            document.querySelector("#indexNotes-h1").textContent = "";
            document.querySelector("#indexNotes-p").textContent = "";
            this.UIText.setColor("LimeGreen");
        }

    }
    NewMessage(message,sender){
        if(this.isExist){
            this.allMessages.push("\n>"+sender+": "+message);
            if(this.allMessages.length>13){
                this.allMessages.shift();
            }
            this.UIText.setColor("Chartreuse"); //Chartreuse //GreenYellow
        }
    }
    Destroy(itemID){
        if(itemID==this.itemID){
            this.isExist = false;
            this.UIText.destroy();
        }
    }
}