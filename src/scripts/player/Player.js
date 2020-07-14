import { sceneEvents } from "../events/EventsCenter";


export default class Player{
    constructor({
        scene,
        x,
        y,
        platform,
        speedRun = 1,
        speedRunShift = 1.2,
        speedJump = 2.1,
        speedJumpShift = 2.4,
        }){
        
        //#region Vars
        this.scene = scene;
        this._speedRun = speedRun;
        this._speedRunShift = speedRunShift;
        this._speedJump = speedJump;
        this._speedJumpShift = speedJumpShift;
        this.handOffsetX = 7; //default
        this.handOffsetY = 0; //default
        this._handOffsetXRight = this.handOffsetX;
        this._handOffsetXLeft = this.handOffsetX;
        this._handOffsetYRight = this.handOffsetY;
        this._handOffsetYLeft = this.handOffsetY;
        this.animHandIdleCounter =1;
        this.animHandRunCounter = 1;
        this.animHandJumpCounter = 1;
        this.animPushWound = false;
        this.isPushWound=false;
        this.isFacingRight = true;
        //#endregion
        
        this.sprite = scene.matter.add.sprite(x,y,'Eva',undefined,{
            label: "player",
            mass: 10,
            friction:0,
        }).setFixedRotation();
        this.handRight = scene.add.rectangle(x+this._handOffsetXRight,y+this._handOffsetYRight,3,3,0xFCEDCB,1);
        this.handLeft = scene.add.rectangle(x+this._handOffsetXLeft,y+this._handOffsetYLeft,3,3,0xFCEDCB,1);
        this.updateHand();
        sceneEvents.on("push-wound",this.pushWound,this);
        sceneEvents.on("decrease-health-player",this.DamagedTint,this);


        this.Animation();


        this.moveInput = scene.input.keyboard.addKeys({
            'w':Phaser.Input.Keyboard.KeyCodes.W,
            'a':Phaser.Input.Keyboard.KeyCodes.A,
            's':Phaser.Input.Keyboard.KeyCodes.S,
            'd':Phaser.Input.Keyboard.KeyCodes.D,
            'space':Phaser.Input.Keyboard.KeyCodes.SPACE,
            'shift':Phaser.Input.Keyboard.KeyCodes.SHIFT,
        });

        //check on ground for jump
        // this.touchingGround = true;
        this.sprite.setOnCollide(()=>{
            this.touchingGround=true;
        });

        //#region Comments
        // scene.matter.world.on("collisionactive",(platform,)=>{
        //     this.touchingGround=true;
        // });
        //#endregion
    }

    Animation() {
        const anims = this.scene.anims;
        anims.create({
            key: 'runLeft',
            frames: anims.generateFrameNumbers("Eva", { start: 2, end: 0 }),
            frameRate: 8,
            repeat: -1,
        });
        anims.create({
            key: 'runRight',
            frames: anims.generateFrameNumbers("Eva", { start: 7, end: 9 }),
            frameRate: 8,
            repeat: -1,
        });
        anims.create({
            key: 'runLeftFast',
            frames: anims.generateFrameNumbers("Eva", { start: 2, end: 0 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: 'runRightFast',
            frames: anims.generateFrameNumbers("Eva", { start: 7, end: 9 }),
            frameRate: 10,
            repeat: -1,
        });
        anims.create({
            key: 'idleLeft',
            frames: anims.generateFrameNumbers("Eva", { start: 3, end: 4 }),
            frameRate: 5,
            repeat: -1,
        });
        anims.create({
            key: 'idleRight',
            frames: anims.generateFrameNumbers("Eva", { start: 5, end: 6 }),
            frameRate: 5,
            repeat: -1,
        });

    }

    DamagedTint(){
        this.scene.tweens.addCounter({
            from:0,
            to:100,
            // targets: this.sprite,
            duration: 1000,
            // yoyo:true,
            onUpdate: function(){
                this.sprite.setTint(0xff0000);
                this.handLeft.fillColor=0xff0000;
                this.handRight.fillColor=0xff0000;
                
            }.bind(this),
            onComplete: function(){
                this.sprite.clearTint();
                this.handLeft.fillColor=0xFCEDCB;
                this.handRight.fillColor=0xFCEDCB;

            }.bind(this),
        });
    }

    update(){

        this.Movement();
    }

    Movement() {
        const moveInput = this.moveInput;
        const sprite = this.sprite;
        // const touchingGround = sprite.body.blocked.down;
        if ((moveInput['w'].isDown || moveInput['space'].isDown) && this.touchingGround == true) {
            if (moveInput['shift'].isDown) {
                sprite.setVelocityY(-this._speedJumpShift);
                this.updateHand("jump");

            }
            else {
                sprite.setVelocityY(-this._speedJump);
                this.updateHand('jumpShift');

            }
            this.touchingGround = false;
        }
        else if (moveInput['a'].isDown) {
            if (moveInput['shift'].isDown == false) {

                sprite.setVelocityX(-this._speedRun);
                sprite.anims.play('runLeft', true);
                this.updateHand('run');

            }
            else {
                sprite.setVelocityX(-this._speedRunShift);
                this.updateHand('runShift');

                sprite.anims.play('runLeftFast', true);
            }
            this.isFacingRight = false;
        }
        else if (moveInput['d'].isDown) {
            if (moveInput['shift'].isDown == false) {

                sprite.setVelocityX(this._speedRun);
                sprite.anims.play('runRight', true);
                this.updateHand('run');

            }
            else {
                sprite.setVelocityX(this._speedRunShift);
                sprite.anims.play('runRightFast', true);
                this.updateHand('runShift');

            }
            this.isFacingRight = true;
        }
        else if (this.isFacingRight == true) {
            sprite.anims.play('idleRight', true);
            this.updateHand('idle');

            sprite.setVelocityX(0);
        }
        else if (this.isFacingRight == false) {
            sprite.anims.play('idleLeft', true);
            this.updateHand('idle');
            sprite.setVelocityX(0);
        }
    }

    destroy(){
        this.sprite.destroy();
    }

    updateHand(anim){
        if(anim=='idle'){
            if(this.animHandIdleCounter>=0){
                this.animHandIdleCounter++;
                this.handRight.y = this.sprite.y-this._handOffsetYRight+1;
                this.handLeft.y = this.sprite.y-this._handOffsetYLeft+1;    
                if(this.animHandIdleCounter>=20){
                    this.animHandIdleCounter=-1;
                }
            } else if (this.animHandIdleCounter<=0){
                this.animHandIdleCounter--;
                this.handRight.y = this.sprite.y-this._handOffsetYRight;
                this.handLeft.y = this.sprite.y-this._handOffsetYLeft;
                if(this.animHandIdleCounter<=-20){
                    this.animHandIdleCounter=1;
                }
            }

        } else if(anim=='runShift'){
            this.handRight.y = this.sprite.y-this._handOffsetYRight-2;
            this.handLeft.y = this.sprite.y-this._handOffsetYLeft-2;
        } else if (anim == 'run'){
            this.handRight.y = this.sprite.y-this._handOffsetYRight-1 ;
            this.handLeft.y = this.sprite.y-this._handOffsetYLeft-1;

        } else if(anim == 'jumpShift'){
            // this.handRight.y = this.sprite.y-this._handOffsetYRight-3;
            // this.handLeft.y = this.sprite.y-this._handOffsetYLeft-3;

        } else if(anim=='jump'){
            // this.handRight.y = this.sprite.y-this._handOffsetYRight-2;
            // this.handLeft.y = this.sprite.y-this._handOffsetYLeft-2;
        }

        this.handRight.x = this.sprite.x+this._handOffsetXRight;
        this.handLeft.x = this.sprite.x-this._handOffsetXLeft;

    }

    pushWound(bool){
        if (bool==false){
            this._handOffsetXRight = this.handOffsetX;
            this._handOffsetXLeft = this.handOffsetX;

            this._handOffsetYRight = this.handOffsetY;
            this._handOffsetYLeft = this.handOffsetY;

            this._speedRun+=0.1;
            this._speedRunShift+=0.1;
            this._speedJump+=0.1;
            this._speedJumpShift+=0.1;
        }
        else{
            //Actually there's no urgent need for extra var for Right and Left now
            this._handOffsetXRight = this.handOffsetX-1.5;
            this._handOffsetXLeft = this.handOffsetX-3.2;    
            this._handOffsetYRight = this.handOffsetY-0.7;
            this._handOffsetYLeft = this.handOffsetY-0.7;

            this._speedRun-=0.1;
            this._speedRunShift-=0.1;
            this._speedJump-=0.1;
            this._speedJumpShift-=0.1;

        // this.handRight.y = this.sprite.y-this._handOffsetY;
        }

    }
}
/*
function PlayerMovement(){

    if((moveInput['w'].isDown || moveInput['space'].isDown) && touchingGround==true){
        player.setVelocityY(-2);
        touchingGround=false;
    }
    else if(moveInput['a'].isDown){
        player.setVelocityX(-1);
        player.anims.play('runLeft',true);
        playerFacingRight=false;
    }
    else if(moveInput['d'].isDown){
        player.setVelocityX(1);
        player.anims.play('runRight',true); 
        playerFacingRight=true;
    }
    else if(playerFacingRight==true){
        player.anims.play('idleRight',true);
        player.setVelocityX(0);
    }
    else if(playerFacingRight==false){
        player.anims.play('idleLeft',true);
        player.setVelocityX(0);
    }

}
*/