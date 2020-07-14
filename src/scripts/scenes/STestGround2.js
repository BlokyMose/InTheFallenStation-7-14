import { CST } from "../CST";

export class STestGround2 extends Phaser.Scene{
    constructor() {
        super({
            key: CST.SCENES.STestGround
        })
    }
    init(){
    }

    preload(){
    }

    create(){
        console.log("Test2");
        this.add.rectangle(0,0,111,111,0xff0000);
    }
    update(){
        console.log('UpdateTest2');
    }
}