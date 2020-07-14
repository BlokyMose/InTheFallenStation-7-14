import { Math } from "phaser";

export default class ObjectTween{
    constructor(
        scene, 
        keyImg,
        x,
        y,
        toX,
        toY,

        onCompleteRef=100, //use this to pass reference to mode methods
        ){
        this.scene = scene;
        this.initX = x;
        this.initY = y;
        this._toX = toX;
        this._toY= toY;
        this._reference = onCompleteRef;

        this._object = this.scene.add.image(this.initX,this.initY,keyImg).setOrigin(0).setDepth(10);
            // this.SimpleTween(-1,false,1000,undefined,undefined);
    }

    SetFlipX(){
        this._object.setFlipX();
    }
    SetFlipY(){
        this._object.setFlipY();
    }
    SetFlipXY(){
        this.SetFlipX();
        this.SetFlipY();
    }

    ComplexTweenY(
        speed=1,
        toY=0,
        randomRangeX = 0,
        ){
        if(this._object.y>toY){
            this._object.y-=speed;
            if(this._object.y<=toY){
                this._object.y=this.initY;
                let randomValue = Phaser.Math.Between((this.initX-randomRangeX),(this.initX+randomRangeX));
                this._object.setX(randomValue);
            }
        }
    }

    SimpleTween(        
        repeat=-1,
        yoyo=false,
        duration=5000,
        ease=undefined,
        onComplete=()=>{console.log("execute onComplete; simpleTween")},
        ) {

        this.objectTween = this.scene.tweens.add({
            ease: ease,
            targets: this._object,
            duration: duration,
            props: {
                x: { value: this.ReturnX() },
                y: { value: this.ReturnY() },
            },
            repeat: repeat,
            yoyo: yoyo,
            onComplete: this.OnCompleteMethod.bind(this),
            onCompleteParams: onComplete,
        });
    }

    ReturnX(){
        return this._toX;
    }
    ReturnY(){
        return this._toY;
    }

    OnCompleteMethod(tween, targets, modeName){
        if(modeName=="randomX"){
            this.RandomSpawnX();
        } else{
            
        }
    }

    RandomSpawnX(){
        // let randomValue= Phaser.Math.RND.between((this.initX-this._reference),(this.initX+this._reference));
        let randomValue = Phaser.Math.Between((this.initX-this._reference),(this.initX+this._reference));
        this._object.setX(randomValue);
        this._toX = randomValue;

        this.objectTween.restart();
        console.log("SMOKEX: "+this._object.x+" ; "+randomValue);

    }

    ConsoleLogStatus(){
        // console.log("ObjectX: "+this._object.x+" ; ObjectY: "+this._object.y);
        if(typeof(this.objectTween) == "undefined"){
            console.log("This object Tween is: "+this.objectTween);
        } else{
            console.log(this.objectTween.progress);
        }

        console.log("Obj X: "+this._object.x+"; Obj Y: "+this._object.y);
    }
}