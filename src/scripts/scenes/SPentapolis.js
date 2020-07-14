import { CST } from "../CST";
import { sceneEvents } from "../events/EventsCenter";
import Player from "../player/Player";
import MarkerTile from "../modules/MarkerTile";
import UINotes from "../UI/UINotes";
import Tandok from "../NPC/Tandok";
import ObjectTween from "../modules/ObjectTween";
import UITorch from "../UI/UITorch";
import UIWound from "../UI/UIWound";
import UIPhone from "../UI/UIPhone";
import UIGun from "../UI/UIGun";
import UIInventory from "../UI/UIInventory";
import DTest from "../Chat/Dialogues/DTest";

let tsTextTorch = {
    fontSize: '20px',
    fontFamily: 'Courier',
    color: 'LimeGreen',
    align: 'left',
    lineSpacing: 5,    
    // backgroundColor: "#a0a0a0",
    // shadow: {color: '#000000',fill: true,offsetX: 2,offsetY: 2,blur: 8}
};

let playerClass;
let player;
let cameraMoveInput;
let cameraMain;

let BGParallaxBack;
let BGParallaxMid;
let BGParallaxFront;
let BGParallaxGradient;
let alphaBoolRise = true;
let alphaValue = 0.83;

let _objectTween, _objectTween2;

let marker;
let LPlatform;
let _UINotes;
let _triggerCount = 100;
let _temp=0;

export class SPentapolis extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.SPentapolis
        })
    }

    init(){
        console.log("SPENTA");
        
    }

    preload(){
        //#region TIlemap
        this.load.image('tiles','assets/img/tilemap/atlas_sodom.png');
        this.load.tilemapTiledJSON('tilemap','assets/img/tilemap/sodom.json');
        //#endregion
        //#region BG Parallax
        this.load.image('BGPentapolis-back','assets/img/bg/Pentapolis/pentapolis-back.png');
        this.load.image('BGPentapolis-mid','assets/img/bg/Pentapolis/pentapolis-mid.png');
        this.load.image('BGPentapolis-front','assets/img/bg/Pentapolis/pentapolis-front.png');
        this.load.image('BGPentapolis-gradient','assets/img/bg/Pentapolis/pentapolis-gradient.png');
        //#endregion
        //#region Object tweens/motion
        this.load.image("objSmoke","assets/img/objectDecor/sodom-smoke.png");
        //#endregion
        //#region Characters
        this.load.spritesheet('Eva','assets/img/characters/Eva10px.png', {frameWidth:10, frameHeight:24});
        this.load.spritesheet('Tandok','assets/img/characters/Tandok.png', {frameWidth:18, frameHeight:36});
        //#endregion
        //#region Objects
        this.load.image("imgAsherahPoleBody","assets/img/objects/pentapolis/asherahPoleBody.png");
        this.load.image("imgAsherahPoleHeadLady","assets/img/objects/pentapolis/asherahPoleHeadLady.png");
        this.load.image("imgAsherahPoleHeadYoung","assets/img/objects/pentapolis/asherahPoleHeadYoung.png");
        this.load.image("imgAsherahPoleHeadBull","assets/img/objects/pentapolis/asherahPoleHeadBull.png");
        this.load.image("imgRockDebris","assets/img/objects/pentapolis/rockDebris.png");
        this.load.image("imgBoxRed","assets/img/objects/pentapolis/boxRed.png");
        this.load.image("imgChalliceWine","assets/img/objects/pentapolis/challiceWine.png");
        this.load.image("imgChalliceEmpty","assets/img/objects/pentapolis/challiceEmpty.png");
        this.load.image("imgFoodChicken","assets/img/objects/pentapolis/foodChicken.png");
        this.load.image("imgFoodMeat","assets/img/objects/pentapolis/foodMeat.png");
        this.load.image("imgFoodSkull","assets/img/objects/pentapolis/foodSkull.png");
        this.load.image("imgTableDragon","assets/img/objects/pentapolis/tableDragon.png");
        this.load.spritesheet("sprFireOrange","assets/img/objects/pentapolis/fireOrangeSprite.png",{frameWidth:32,frameHeight:28});
        this.load.image("imgChandelierLeft","assets/img/objects/pentapolis/chandelierLeft.png");
        this.load.image("imgChandelierMiddle","assets/img/objects/pentapolis/chandelierMiddle.png");
        this.load.image("imgChandelierRight","assets/img/objects/pentapolis/chandelierRight.png");
        //#endregion

    }

    create(){
        //#region UI config and vars
        this.DialoguesScene = new DTest(this); //dialogue deck
        let UIConfig={
            iHealthPlayer:80,
            iHealthCynthia:100,
            iHealthLot:100,
            dialogueScene: this.DialoguesScene.dialogues,
            dialogueSession:0,
            dialogueActive:true,
            npcDisplay:[ //all talking NPCs
                {
                    "name":"Tandok",
                    "color":"rgba(100,0,0,0.3)",
                    "offsetY":100
                },
                {
                    "name":"Lot",
                    "color":"rgba(0,100,0,0.3)",
                    "offsetY":0,
                }
            ]
            // inventory bag items?
        };
        this.scene.run(CST.SCENES.UIPlay2,UIConfig);
        this.input.setDefaultCursor('url(assets/cur/dotDark.cur), pointer');
        this.timerEvent = this.time.addEvent({
            //30min=>20.000ms; Must include eating food cna
            delay: 20000,
            loop: true,
            callback: ()=>{sceneEvents.emit('timer-event');},
        });

        this.timerFire = this.time.addEvent({
            delay: 1000,
            loop: true,
            paused: true,
            callback: ()=>{sceneEvents.emit('decrease-health-player',4);},
        });


        //#endregion
        //#region Basic vars
        const startPointX = 0; //-210; can be altered accordingly, better not to
        const startPointY = 0; //-510; 
        const startPointXPlayer =210;
        const startPointYPlayer=790;
        cameraMain = this.cameras.main;
        cameraMain.zoom = 3;
        cameraMoveInput = this.input.keyboard.createCursorKeys();
        //#endregion
        //#region BG Parallax
        BGParallaxBack= this.add.tileSprite(0,0,800,600,"BGPentapolis-back").setOrigin(0.05,0.065).setScrollFactor(0).setTileScale(0.4);
        BGParallaxMid= this.add.tileSprite(0,0,800,600,"BGPentapolis-mid").setOrigin(-0.03,0.05).setScrollFactor(0).setTileScale(0.4);
        BGParallaxFront= this.add.tileSprite(0,0,800,600,"BGPentapolis-front").setOrigin(-0.05,0.05).setScrollFactor(0).setTileScale(0.4);
        BGParallaxGradient= this.add.tileSprite(0,0,800,600,"BGPentapolis-gradient").setOrigin(0,0.07).setScrollFactor(0).setTileScale(0.4);
        //#endregion
        //#region TileMap
        const tilemap = this.make.tilemap({key:'tilemap'});
        const tileset = tilemap.addTilesetImage("atlas_sodom", 'tiles'); //Tiled tileset, loaded image key
        const LWall = tilemap.createStaticLayer("wall", tileset,startPointX,startPointY);
        const LDecorations = tilemap.createStaticLayer("decorations", tileset,startPointX,startPointY);
        const LLights = tilemap.createStaticLayer("lights", tileset,startPointX,startPointY).setDepth(2);
        LPlatform = tilemap.createDynamicLayer("platform", tileset,startPointX,startPointY);
        tilemap.setCollisionByExclusion(-1,true);
        LPlatform.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(LPlatform);
        LPlatform.putTileAtWorldXY(101,0,0);
        //#endregion
        this.Animations();
        let _PlayerConfig ={
            scene: this,
            x:startPointXPlayer,
            y:startPointYPlayer,
            platform:LPlatform,
        };
        playerClass = new Player(_PlayerConfig);
        // playerClass = new Tandok(_PlayerConfig);

        player = playerClass.sprite;

        let LObjects = tilemap.getObjectLayer("objects").objects.forEach(obj=>{
                if(obj.name=="Asherah Body"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgAsherahPoleBody",undefined,{torque:0.0005,restitution:0.7})
                    .setMass(10).setFriction(0.3,0.01);
                }else if(obj.name=="Asherah Head Bull"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgAsherahPoleHeadBull",undefined,{})
                    .setMass(15).setFriction(0.7,0.01).setOrigin(0.5).applyForce(new Phaser.Math.Vector2(-0.001,0));
                }else if(obj.name=="Asherah Head Young"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgAsherahPoleHeadYoung",undefined,{})
                    .setMass(15).setFriction(0.7,0.01).setOrigin(0.5).applyForce(new Phaser.Math.Vector2(-0.001,0));
                }else if(obj.name=="Asherah Head Lady"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgAsherahPoleHeadLady",undefined,{})
                    .setMass(15).setFriction(0.7,0.01).setOrigin(0.5).applyForce(new Phaser.Math.Vector2(-0.001,0));
                }else if(obj.name=="Rock Debris"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgRockDebris").setBody({
                        type:"circle",
                        radius: 6.5,
                    }).setMass(5).setFriction(0.2,0.01).setOrigin(0.5);
                }else if(obj.name=="Box Red"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgBoxRed")
                    .setMass(30).setFriction(0.9,0.01).setOrigin(0.5);
                }else if(obj.name=="Challice Wine"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgChalliceWine")
                    .setMass(15).setFriction(0.2,0.01).setOrigin(0.5);
                }else if(obj.name=="Challice Empty"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgChalliceEmpty")
                    .setMass(15).setFriction(0.2,0.01).setOrigin(0.5);
                }else if(obj.name=="Food Chicken"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgFoodChicken")
                    .setMass(15).setFriction(0.2,0.01).setOrigin(0.5);
                }else if(obj.name=="Food Meat"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgFoodMeat")
                    .setMass(15).setFriction(0.2,0.01).setOrigin(0.5);
                }else if(obj.name=="Food Skull"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgFoodSkull")
                    .setMass(15).setFriction(0.2,0.01).setOrigin(0.5);
                }else if(obj.name=="Table Dragon"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgTableDragon")
                    .setMass(15).setFriction(0.2,0.01).setOrigin(0.5);
                }else if(obj.name=="Chandelier Left"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgChandelierLeft",undefined,{ignoreGravity:true, torque:0.7,})
                    .setMass(40).setFriction(0.3,0.1).setOrigin(0.5);
                }else if(obj.name=="Chandelier Middle"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgChandelierMiddle",undefined,{ignoreGravity:true,torque:0.7,})
                    .setMass(40).setFriction(0.3,0.05).setOrigin(0.5);
                }else if(obj.name=="Chandelier Right"){
                    this.matter.add.image(obj.x,obj.y-obj.height/2,"imgChandelierRight",undefined,{ignoreGravity:true,torque:0.7,})
                    .setMass(40).setFriction(0.3,0.1).setOrigin(0.5);
                }else if(obj.name=="Fire Orange"){
                    this.matter.add.sprite(obj.x,obj.y-obj.height/2+3,"sprFireOrange",undefined,
                    {label:"fire",isSensor:true,isStatic:true})
                    .setOnCollideWith(player.body,()=>{
                        sceneEvents.emit('decrease-health-player',4);
                        sceneEvents.emit('insert-item',{itemID:_temp++,name:"Torch"});
                        sceneEvents.emit('display-move',"Lot",obj.x,obj.y,player.x,player.y);
                        this.timerFire.paused = false;
                    })
                    .setOnCollideEnd(()=>{
                        sceneEvents.emit('display-move',"Tandok",obj.x,obj.y,player.x,player.y);
                        this.timerFire.paused = true;
                    })
                    .setOrigin(0.5,0.55).anims.play('animFire',true);
                }             
        });


    }

    Animations() {
        this.anims.create({
            key: "animFire",
            frames: this.anims.generateFrameNumbers('sprFireOrange', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1,
        });

        //Animated objects in BG:
        _objectTween = new ObjectTween(this,"objSmoke", 800,1200,1000,-0,-1,false,15000,undefined,"randomX",200);
        _objectTween2 = new ObjectTween(this,"objSmoke", 600,1800,1000,-0,-1,false,15000,undefined,"randomX",200);
        _objectTween2.SetFlipXY();
        
    }

    update(){
        // this.CameraMovement(3);
        // marker.PaintTilemapLayer(LPlatform,101);
        cameraMain.startFollow(player,false,1,0.05,0,40);
        playerClass.update();

        this.UpdateTriggerGun();
        this.BGParallaxMotion();
        this.UpdateObjectTweens();
        // _objectTween.ConsoleLogStatus();

        // sceneEvents.emit('updateSecond',);
        // console.log("Time "+_temp++);
    }

    UpdateObjectTweens() {
        _objectTween.ComplexTweenY(1, 0, 500);
        _objectTween2.ComplexTweenY(1, 0, 500);
    }

    BGParallaxMotion() {

        BGParallaxBack.tilePositionX = cameraMain.scrollX * .05;
        BGParallaxBack.tilePositionY = cameraMain.scrollY * .01;

        BGParallaxMid.tilePositionX = cameraMain.scrollX * .19;
        BGParallaxMid.tilePositionY = cameraMain.scrollY * .07;

        BGParallaxFront.tilePositionX = cameraMain.scrollX * .35;
        BGParallaxFront.tilePositionY = cameraMain.scrollY * .15;

        //Control the alpha of the BG to produce breathing fire effect
        BGParallaxGradient.setAlpha(alphaValue);
        if (alphaBoolRise == true) {
            alphaValue += 0.005;
            if (alphaValue >= 1) {
                alphaBoolRise = false;
            }
        }
        else {
            alphaValue -= 0.004;
            if (alphaValue <= 0.8) {
                alphaBoolRise = true;
            }
        }
    }

    UpdateTriggerGun() {
        //For some reason, a 10 or so seconds are needed to successfully emit trigger-gun
        if (_triggerCount > 90) {
            this.TriggerGun(true);
        }
        if (_triggerCount > -400) {
            _triggerCount--;

        }
        else if (_triggerCount > -420) {
            this.TriggerGun(false);
            _triggerCount--;

            // console.log(_triggerCount);
        }
    }

    TriggerGun(boolVar){
        sceneEvents.emit('trigger-gun',boolVar);
    }

    CameraMovement(speed){
        if(cameraMoveInput.up.isDown){
            cameraMain.scrollY-=speed;
        }
        if(cameraMoveInput.down.isDown){
            cameraMain.scrollY+=speed;
        }
        if(cameraMoveInput.left.isDown){
            cameraMain.scrollX-=speed;
        }
        if(cameraMoveInput.right.isDown){
            cameraMain.scrollX+=speed;
        }

        //camera position relative to player x =0
        console.log("Camera: x= "+(cameraMain.scrollX+400)+"; y= "+(cameraMain.scrollY-36)); 

    }

}




