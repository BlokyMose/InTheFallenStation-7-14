import { CST } from "../CST";
import UIPlay from "../UI/UIPlay";
import { sceneEvents } from "../events/EventsCenter";
import Player from "../player/Player";
import MarkerTile from "../modules/MarkerTile";
import UINotes from "../UI/UINotes";
import Tandok from "../NPC/Tandok";

let playerClass;
let player;
let cameraMoveInput;
let cameraMain;
let objDoorArray =[];
let objDoorOpenedArray=[];
let objFoodCanArray=[];
let objCardKeyArray=[];

let marker;
let LPlatform;
let _UINotes;
let _triggerCount = 100;

export class SWareHouse extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.SWareHouse
        })
    }

    init(){
        console.log("SWARE");
        _UINotes = new UINotes(this);
    }

    preload(){
        this.load.image('tiles','assets/img/tilemap/atlas.png');
        this.load.tilemapTiledJSON('tilemap','assets/img/tilemap/warehouse.json');

        //objects
        this.load.image('ImgDoorOpened', "assets/img/objects/doorOpened.png");
        this.load.image('ImgDoor', "assets/img/objects/door.png");
        this.load.image('ImgCardKey', "assets/img/objects/cardKey.png");
        this.load.image('ImgFoodCan', "assets/img/objects/foodCan.png");

        //Characters
        this.load.spritesheet('Eva','assets/img/characters/Eva.png', {frameWidth:16, frameHeight:24});
        this.load.spritesheet('Tandok','assets/img/characters/Tandok.png', {frameWidth:18, frameHeight:36});

    }
    
    create(){
        let UIConfig={
            iHealthPlayer:101,
            iHealthCynthia:100,
            iHealthLot:100,
            iTorchBattery:0,
        };
        this.scene.run(CST.SCENES.UIPlay2,UIConfig);        
        this.input.setDefaultCursor('url(assets/cur/dotDark.cur), pointer');
        
        const startPointX = 0; //-210; can be altered accordingly, better not to
        const startPointY = 0; //-510; 
        const startPointXPlayer =1100;
        const startPointYPlayer=830;

        cameraMain = this.cameras.main;
        cameraMain.zoom = 3;
        cameraMoveInput = this.input.keyboard.createCursorKeys();

        const tilemap = this.make.tilemap({key:'tilemap'});
        const tileset = tilemap.addTilesetImage("atlas", 'tiles'); //Tiled tileset, loaded image key
        const LWall = tilemap.createStaticLayer("wall", tileset,startPointX,startPointY);
        const LDecorations = tilemap.createStaticLayer("decorations", tileset,startPointX,startPointY);
        LPlatform = tilemap.createDynamicLayer("platform", tileset,startPointX,startPointY);

        let LArrayObjects = tilemap.getObjectLayer('objects').objects;
        LArrayObjects.forEach(element => {
            let object=element;
            let objectAsGO = this.add.image(object.x,object.y,("Img"+object.type)).setOrigin(0,1).setInteractive();
            // let objectAsMatter = this.matter.add.image(object.x,object.y,("ImgDoor")).setOrigin(0,0);

            objectAsGO.on('pointerover', function(pointer){
                this.setTint(0xa1a1a1);
                sceneEvents.emit('ui-text-desc-change',{text:object.type+"\ntest\nwow",color:"#d3d3d3"});
                // sceneEvents.emit('send-new-message',object.type,"system");
                sceneEvents.emit('display-notes',true,"System",object.type);
            });
            
            objectAsGO.on('pointerout', function(pointer){
                this.clearTint();
                sceneEvents.emit('ui-text-desc-reset');
                sceneEvents.emit('display-notes',false,"System",object.type);
            });
            objectAsGO.on('pointerdown',function(pointer){
                sceneEvents.emit('fire-gun',objectAsGO);
            });
            switch (object.type) {
                case "Door": objDoorArray.push(object);
                    objectAsGO.on('pointerdown',function(pointer){
                        // objectAsGO.destroy();
                        sceneEvents.emit('fire-gun',objectAsGO);
                        console.log("Iam door");
                    });
                    break;
                case "DoorOpened": objDoorOpenedArray.push(object);;
                    break
                case "CardKey": objCardKeyArray.push(object);
                    break;
                case "FoodCan": objFoodCanArray.push(object);
                    break;
                default:
                    break;
            }
        });
        
        tilemap.setCollisionByExclusion(-1,true);
        this.matter.world.convertTilemapLayer(LPlatform); //add bodies to all tile
        // LPlatform.setCollisionByProperty({collides:true});
        let tile = LPlatform.putTileAtWorldXY(101,0,0);
        // playerClass = new Player(this,startPointXPlayer,startPointYPlayer,LPlatform);
        // playerClass = new Tandok(this,startPointXPlayer,startPointYPlayer,LPlatform);
        // player = playerClass.sprite;

        // arcade physics: player.setCollideWorldBounds(false);
        // this.physics.add.collider(player, LPlatform);

        marker = new MarkerTile(this,tilemap);
    sceneEvents.emit('trigger-gun',true);
        
        }

    update(){
        CameraMovement(3);
        // marker.PaintTilemapLayer(LPlatform,101);

        // cameraMain.startFollow(player,false,1,0.05,0,40);
        // playerClass.update();

        //For some reason, a 10 or so seconds are needed to successfully emit trigger-gun
        if(_triggerCount>90){
            TriggerGun(true);
        } 
        if(_triggerCount>-400){
            _triggerCount--;

        }else if(_triggerCount>-420){
            TriggerGun(false);
            _triggerCount--;

            // console.log(_triggerCount);
        }
        
    }
}

function CameraMovement(speed){
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

function TestMethod(){
    console.log("Test Succeed");
}

function TriggerGun(boolVar){
    sceneEvents.emit('trigger-gun',boolVar);
}
