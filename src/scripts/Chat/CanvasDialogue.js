import { CST } from "../CST";

export default class CanvasDialogue extends Phaser.Scene{
    constructor(){
        super({key:CST.SCENES.CanvasDialogue})
    }

    init(){

    }
    preload(){

    }
    create(){
        this.add.text(400,400,"AAAAAAA",{fontSize:"50px"}).setOrigin(0.5);
    }
    update(){
    }
}