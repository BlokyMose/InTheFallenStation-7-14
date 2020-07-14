import { sceneEvents } from "../events/EventsCenter";

export default class UINotes{
    constructor(scene){
        this.scene= scene;
        this.isGunTriggered=false;
        sceneEvents.on('display-notes',this.DisplayNotes,this);
        sceneEvents.on('display-notes-as-target',this.GunIsTriggered,this);
    }

    GunIsTriggered(boolVar){
        this.isGunTriggered=boolVar;
    }

    DisplayNotes(isDisplayed,title,notes){
        if(isDisplayed){
            if(this.isGunTriggered==true){
                document.querySelector("#indexNotes-h1").textContent = "//TARGET FOUND";
                document.querySelector("#indexNotes-p").textContent = "//Target: "+title+"\n//Be prudent before firing\n//Click to fire";
                document.querySelector("#indexNotes-h1").setAttribute("style","opacity:1; color: red; font-style: italic; ");
                document.querySelector("#indexNotes-p").setAttribute("style","opacity:1; color: crimson;font-style: italic;");
            }else{
                    document.querySelector("#indexNotes-h1").textContent = title;
                    document.querySelector("#indexNotes-p").textContent = notes;
                    document.querySelector("#indexNotes-h1").setAttribute("style","opacity:1;");
                    document.querySelector("#indexNotes-p").setAttribute("style","opacity:1;");
    
            }
            }else{
                document.querySelector("#indexNotes-h1").textContent = "";
                document.querySelector("#indexNotes-p").textContent = "";
                document.querySelector("#indexNotes-h1").setAttribute("style","opacity:0; color:'gainsboro';font-style: normal; ");
                document.querySelector("#indexNotes-p").setAttribute("style","opacity:0;color:'gainsboro';font-style: normal; ");
    
            }

    }
}