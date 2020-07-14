import { sceneEvents } from "../events/EventsCenter";

export default class UICard{
    constructor(scene){
        this.itemID=0;
        this.name = "Card";
        this.text = "▭";

        this.type = "item";
        this.desc = ""; //fill the same text in desc and descLong. Do it manually in game Scene
        this.descLong = "";
        this.title ="";

        this.scene = scene;

        this.isExist;
        this.allMessages;
        this.UIText;

        document.querySelector("#indexNotes-h1").setAttribute("style","opacity:0;");
        document.querySelector("#indexNotes-p").setAttribute("style","opacity:0;");

    }

    AddToUI({
        itemID=0,
        name=this.name,
        x=0, 
        y=0, 
        text=this.text,
        textStyle={},
        extra={
            title:"",
            desc:"",
        }
    }){
            this.itemID = itemID;
            this.text = text;
            this.isExist = true;
            
            this.UIText = this.scene.add.text(x, y, "| " + this.text, textStyle).setOrigin(0).setInteractive();
            this.UIText.setColor("LimeGreen");
            this.UIText.on('pointerover', function (pointer) { this.OpenNote(true); }, this);
            this.UIText.on('pointerout', function (pointer) { this.OpenNote(false); }, this);
            
            this.title = name;
            this.desc = extra["desc"];
            sceneEvents.on('destroy-item-ui',this.Destroy,this);
    }

    OpenNote(boolValue){
        if(boolValue){
            document.querySelector("#indexNotes-h1").textContent = this.title;
            document.querySelector("#indexNotes-p").textContent = this.desc;
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

    Destroy(itemID){
        if(itemID==this.itemID){
            this.isExist = false;
            this.UIText.destroy();
        }
    }
}