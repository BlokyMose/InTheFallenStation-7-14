import { CST } from "../CST";
import { sceneEvents } from "../events/EventsCenter";
import UITorch from "./UITorch";
import UIWound from "./UIWound";
import UIPhone from "./UIPhone";
import UINotes from "./UINotes";
import UIGun from "./UIGun";

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
let tsTextDesc = {
    fontSize: '20px',
    fontFamily: 'Candara',
    color: '#f8f8ff',
    lineSpacing: 4,    

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

let _torchBattery;



export default class UIPlay extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.UIPlay})
    }

    init({
        iHealthPlayer=100,
        iHealthCynthia=100,
        iHealthLot=100,
        iTorchBattery=100,
    }){
        healthPlayer=iHealthPlayer;
        healthCynthia=iHealthCynthia;
        healthLot=iHealthLot;
        _torchBattery=iTorchBattery;
        console.log("UaaaIPLAY");   
    }

    preload(){
        console.log("preload");

        this.load.image('UIDarknessOuter', "assets/img/UI/darknessOuter.png");
        this.load.image("UIDarknessInner","assets/img/UI/darknessInner.png");
    }

    create(){       
        console.log("create");

        this.input.setDefaultCursor('url(assets/cur/dotDark.cur), pointer');

        UITextBox = this.add.rectangle(0,520,800,80,0x0a0a0a,1).setOrigin(0,0);//0x0a0a0a //0x808080
        UITextDesc = this.add.text(350,540,"",tsTextDesc).setOrigin(0,-0);
        let UIGroup = this.add.group({
            classType: Phaser.GameObjects.Graphics
        });
        UIGroup.add(UITextBox);

        sceneEvents.on('ui-text-desc-change', ChangeUITextDesc,this);
        sceneEvents.on('ui-text-desc-reset', ResetUITextDesc,this);

        _UITorch= new UITorch(this,"UIDarknessInner","UIDarknessOuter","Torch",tsTextTorch,0,570,_torchBattery);
        _UIWound= new UIWound(this,"Wound",tsTextTorch,0,540);
        _UIPhone = new UIPhone(this,"✉",tsTextTorch,220,540);
        _UIGun = new UIGun(this,"Gun",220,570,tsTextTorch);

        document.querySelector("#indexPlayerHealth").textContent = "You ✙ "+healthPlayer;
        document.querySelector("#indexCynthiaHealth").textContent = "Cynthia ✙ "+healthCynthia;
        document.querySelector("#indexLotHealth").textContent = "Lot ✙ "+healthLot;

        this.DecreaseHealthTimer();

    }

    DecreaseHealthTimer() {
        timerEvent = this.time.addEvent({
            //30min=>20.000ms; Must include eating food cna
            delay: 20000,
            loop: true,
            callback: DecreaseHealth,
        });
    }

    update(){

    }
}

function ChangeUITextDesc(textContent,colorStr){
    UITextDesc.setColor(colorStr);
    UITextDesc.setText([textContent]);
    UITextDesc.setFontStyle('italic');

}

function ResetUITextDesc(){
    UITextDesc.setText("");
    UITextDesc.setColor("#d3d3d3");
    UITextDesc.setFontStyle();
}

function DecreaseHealth(){
    DecreaseHealthPlayer();
    DecreaseHealthCynthia();
    DecreaseHealthLot();
    ChangeUIHealth();
}

function DecreaseHealthPlayer(){
    if(_UIWound.NotBleeding()){
        healthPlayer-=1;
    } else{
        healthPlayer-=2;
    }
}

function DecreaseHealthCynthia(){
    healthCynthia-=2;
}
function DecreaseHealthLot(){
    healthLot-=1;
}

function ChangeUIHealth(){
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


