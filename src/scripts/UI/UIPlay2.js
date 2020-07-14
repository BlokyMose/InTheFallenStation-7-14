import { CST } from "../CST";
import { sceneEvents } from "../events/EventsCenter";
import UITorch from "./UITorch";
import UIWound from "./UIWound";
import UIPhone from "./UIPhone";
import UINotes from "./UINotes";
import UIGun from "./UIGun";
import UIInventory from "./UIInventory";
import UICard from "./UICard";
import DisplayChat from "../Chat/DisplayChat";
import Chat from "../Chat/Chat";
import DisplayOptions from "../Chat/DisplayOptions";
import DisplayChatNPC from "../Chat/DisplayChatNPC";

let UITextBox;
let UITextDesc;

let healthPlayer;
let healthCynthia;
let healthLot;

let timerEvent;

let _UITorch;
let _UIWound;
let _UIPhone;
let _UIGun;
let _UIInventory;
let _UICard;
let tsTextDesc = {
    fontSize: '20px',
    fontFamily: 'Candara',
    color: 'darkgray',
    lineSpacing: 4,    
    align: "right",
    // backgroundColor: '#ff00ff',
    // shadow: {color: '#000000',fill: true,offsetX: 2,offsetY: 2,blur: 8}
};
let tsTextTorch = {
    fontSize: '20px',
    fontFamily: 'Courier',
    color: 'LimeGreen',
    align: 'left',
    lineSpacing: 5,    
    // backgroundColor: "#a0a0a0",
    // shadow: {color: '#000000',fill: true,offsetX: 2,offsetY: 2,blur: 8}
};




export default class UIPlay2 extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.UIPlay2})
    }

    init({
        iHealthPlayer=100,
        iHealthCynthia=100,
        iHealthLot=100,
        dialogueScene=[],
        dialogueSession=0,
        dialogueActive=true,
        npcDisplay=[]
    }){
        healthPlayer=iHealthPlayer;
        healthCynthia=iHealthCynthia;
        healthLot=iHealthLot;
        this.dialogueScene = dialogueScene;
        this.dialogueSessionInit = dialogueSession;
        this.dialogueActiveInit = dialogueActive;
        this.npcDisplay = npcDisplay;
        this.displayChatNPC=[];
        console.log("UIPLAY2");   
    }

    preload(){
        this.load.image('UIDarknessOuter', "assets/img/UI/darknessOuter.png");
        this.load.image("UIDarknessInner","assets/img/UI/darknessInner.png");
    }

    create(){       
        this.allTools = [];
        this.input.setDefaultCursor('url(assets/cur/dotDark.cur), pointer');

        UITextBox = this.add.rectangle(0,520,800,80,0x0a0a0a,1).setOrigin(0,0);//0x0a0a0a //0x808080
        UITextDesc = this.add.text(660,540,"",tsTextDesc).setOrigin(0,-0);

        sceneEvents.on('ui-text-desc-change', ChangeUITextDesc,this);
        sceneEvents.on('ui-text-desc-reset', ResetUITextDesc,this);
        sceneEvents.on('decrease-health-player', DecreaseHealthPlayer,this);

        _UIWound= new UIWound({
            scene:this,
            text:"Bleeding",
            textStyle:tsTextTorch,
            x: 0,
            y:540
        });

        //#region  Initial tools:
    //_______________________________________________
    //
        //Default for all tools and items
        //Add new tools by making Class+AddToUI(), add InsertToInventory() switch, add InsertTOOLToInventory(), 
        //Insert tools by emit an insert-item + ref:itemID to call InsertToInventory here
        //ex:  sceneEvents.emit('insert-item',{itemID:101,name:"Torch"});

        //Flow: emit-> InsertToInventory-> switch-> InsertTOOL-> push allTools for new Class
        //      -> InsertItem by UIInventory-> get x,y for UIText-> add UIText by UITOOL 
    //
    //_______________________________________________
        this.AddInventory();
        this.InsertTorchToInventory(0); //0 is a unique ID for this torch only
        this.InsertGunToInventory(1);
        this.InsertPhoneToInventory(2);
        // this.InsertCardToInventory(3,{title: "yeyCard", desc: 'PANJAAng sekali say asuk makan bakso dengan seseorang yang saya benci yaitu sipaa hayooo'});
//#endregion
        //#region Add permanent HP Texts on left side
        document.querySelector("#indexPlayerHealth").textContent = "You ✙ "+healthPlayer;
        document.querySelector("#indexCynthiaHealth").textContent = "Cynthia ✙ "+healthCynthia;
        document.querySelector("#indexLotHealth").textContent = "Lot ✙ "+healthLot;

//#endregion
        //#region Chat
        this.displayChatEva = new DisplayChat({
            scene:this, name:"Eva", x:400,y:300,color: "rgba(0,0,0,0.3)"}); //textBox
        this.npcDisplay.forEach(npc => {
            this.displayChatNPC.push(new DisplayChatNPC({
                scene:this,
                name:npc["name"],
                color: npc["color"],
            }));
        });
        this.displayOptions = new DisplayOptions(this);
        this.chat = new Chat(this); //Chat engine
        this.InsertDialogueToChat(this.dialogueScene,this.dialogueSessionInit,this.dialogueActiveInit);
    //#endregion
    
        sceneEvents.on('timer-event',DecreaseHealth);
        sceneEvents.on('insert-item',this.InsertToInventory,this);
    }

    //#region INVENTORY
    AddInventory() {
        _UIInventory = new UIInventory(this, "Bag", tsTextTorch, 0, 570);
    }
    InsertToInventory({
        itemID,
        name
        }){
            //Check maximum capacity
            console.log("INVE "+_UIInventory.bagNow);
            if(_UIInventory.bagNow<_UIInventory.bagMax){
                switch (name) {
                    case "Card":
                        this.InsertCardToInventory(itemID,
                            {
                                title:"FireCard",
                                desc:"Firedesc"
                            }) 
                        break;
                    case "Phoenix":
                        this.InsertCardToInventory(itemID,
                            {
                                title:"Phoenix Card",
                                desc:"wowwwwww",
                            })
                        break;
                    case "Torch":
                        this.InsertTorchToInventory(itemID);
                        break;
                    case "Gun":
                        this.InsertGunToInventory(itemID);
                        break;
                    case "Phone":
                        this.InsertPhoneToInventory(itemID);
                        break;
                    default:
                        console.log("No item found");
                        break;
                }
            }
    }
    InsertTorchToInventory(itemID) {
        this.allTools.push("");
        this.allTools[this.allTools.length-1] = new UITorch(this, "UIDarknessInner", "UIDarknessOuter");
       let XY= _UIInventory.InsertItem({
            _itemID: itemID,
            _item: this.allTools[this.allTools.length-1],
        });
        this.allTools[this.allTools.length-1].AddToUI({
            itemID: itemID,
            textStyle: tsTextTorch,
            x: XY["x"],
            y: XY["y"],
        })
    }
    InsertGunToInventory(itemID) {
        this.allTools.push("");
        this.allTools[this.allTools.length-1] = new UIGun(this);
        let XY= _UIInventory.InsertItem({
            _itemID: itemID,
            _item: this.allTools[this.allTools.length-1],
        });
        this.allTools[this.allTools.length-1].AddToUI({
            itemID: itemID,
            textStyle: tsTextTorch,
            x: XY["x"],
            y: XY["y"],
        })
    }
    InsertPhoneToInventory(itemID) {
        this.allTools.push("");
        this.allTools[this.allTools.length-1] = new UIPhone(this);
        let XY= _UIInventory.InsertItem({
            _itemID: itemID,
            _item: this.allTools[this.allTools.length-1],
        });
        this.allTools[this.allTools.length-1].AddToUI({
            itemID: itemID,
            textStyle: tsTextTorch,
            x: XY["x"],
            y: XY["y"],
        })
    }
    InsertCardToInventory(itemID,extra){
        this.allTools.push();
        this.allTools[this.allTools.length-1] = new UICard(this);
        this.allTools[this.allTools.length-1].desc = extra["desc"];
        this.allTools[this.allTools.length-1].descLong = extra["desc"];
        this.allTools[this.allTools.length-1].name = extra["title"];


        let XY= _UIInventory.InsertItem({
            _itemID: itemID,
            _item: this.allTools[this.allTools.length-1],
        });
        this.allTools[this.allTools.length-1].AddToUI({
            extra:extra,
            itemID: itemID,
            textStyle: tsTextTorch,
            x: XY["x"],
            y: XY["y"],
        })
    }
    //#endregion
    update(){
        this.chat.update();
    }

    DecreaseHealthTimer() {
        timerEvent = this.time.addEvent({
            //30min=>20.000ms; Must include eating food cna
            delay: 20000,
            loop: true,
            callback: DecreaseHealth,
        });
    
    }

    InsertDialogueToChat(dialogues,session=0,isActive = true){
        console.log("catch InsetDialScene: "+dialogues);
        this.chat.ActivateChat(dialogues,session,isActive);
    }

}

//#region Right bottom text desc
function ChangeUITextDesc({
    text="?",
    color="darkgray",
}){
    UITextDesc.setColor(color);
    UITextDesc.setText([text]);
    UITextDesc.setFontStyle('italic');
}

function ResetUITextDesc(){
    UITextDesc.setText("");
    UITextDesc.setColor("darkgray");
    UITextDesc.setFontStyle("italic");
}
//#endregion

//#region Health
function DecreaseHealth(){
    DecreaseHealthPlayer(2);
    DecreaseHealthCynthia(2);
    DecreaseHealthLot(1);
}
function DecreaseHealthPlayer(damage){
    if(_UIWound.NotBleeding()){
        healthPlayer-=damage/2;
    } else{
        healthPlayer-=damage;
    }
    UpdateUIHealth();
}
function DecreaseHealthCynthia(damage){
    healthCynthia-=damage;
    UpdateUIHealth();
}
function DecreaseHealthLot(damage){
    healthLot-=damage;
    UpdateUIHealth();
}
function UpdateUIHealth(){
    // UITextHPPlayer.setText("You: "+healthPlayer);
    document.querySelector("#indexPlayerHealth").textContent = "You ✙ "+healthPlayer;
    document.querySelector("#indexCynthiaHealth").textContent = "Cynthia ✙ "+healthCynthia;
    document.querySelector("#indexLotHealth").textContent = "Lot ✙ "+healthLot;

    if(healthPlayer<=50){
        document.querySelector("#indexPlayerHealth").setAttribute("style","color:#ffd300;");

        if(healthPlayer<=25){
        document.querySelector("#indexPlayerHealth").setAttribute("style","color:#ff1a00;");

        }
    }
    if(healthCynthia<=50){
        document.querySelector("#indexCynthiaHealth").setAttribute("style","color:#ffd300;");
        if(healthCynthia<=25){
            document.querySelector("#indexCynthiaHealth").setAttribute("style","color:#ff1a00;");
        }
    }
    if(healthLot<=50){
        document.querySelector("#indexLotHealth").setAttribute("style","color:#ffd300;");
        if(healthLot<=25){
            document.querySelector("#indexLotHealth").setAttribute("style","color:#ff1a00;");
        }
    }

}
//#endregion


