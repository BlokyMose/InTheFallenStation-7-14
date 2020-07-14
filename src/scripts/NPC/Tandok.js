export default class Tandok{
    constructor({
        scene,
        x,
        y,
        platform,
        }){
        this.scene = scene;
        this.sprite = scene.matter.add.sprite(x,y,'Tandok',undefined,{
            label:"player", //change accordingly
            mass:"20",
            friction:"0",
        }).setFixedRotation();

        const anims = scene.anims;
        anims.create({
            key: 'runLeft',
            frames: anims.generateFrameNumbers("Tandok",{start:2,end:0}),
            frameRate:10,
            repeat:-1,
        });
        anims.create({
            key: 'runRight',
            frames: anims.generateFrameNumbers("Tandok",{start:5,end:7}),
            frameRate:10,
            repeat:-1,
        });
        anims.create({
            key: 'idleLeft',
            frames: anims.generateFrameNumbers("Tandok",{start:3,end:3}),
            frameRate:6,
            repeat:-1,
        });
        anims.create({
            key: 'idleRight',
            frames: anims.generateFrameNumbers("Tandok",{start:4,end:4}),
            frameRate:6,
            repeat:-1,
        });

        this.moveInput = scene.input.keyboard.addKeys({
            'w':Phaser.Input.Keyboard.KeyCodes.W,
            'a':Phaser.Input.Keyboard.KeyCodes.A,
            's':Phaser.Input.Keyboard.KeyCodes.S,
            'd':Phaser.Input.Keyboard.KeyCodes.D,
            'space':Phaser.Input.Keyboard.KeyCodes.SPACE,
        });
        this.playerFacingRight = true;

        //check on ground for jump
        this.touchingGround = true;
        this.sprite.setOnCollide(()=>{
            this.touchingGround=true;
        });

        // scene.matter.world.on("collisionactive",(platform)=>{
        //     this.touchingGround=true;
        // });

    }

    update(){
        const moveInput = this.moveInput;
        const sprite = this.sprite;
        // const touchingGround = sprite.body.blocked.down;

        if((moveInput['w'].isDown || moveInput['space'].isDown) && this.touchingGround==true){
            sprite.setVelocityY(-3);
            this.touchingGround=false;
        }
        else if(moveInput['a'].isDown){
            sprite.setVelocityX(-2);
            sprite.anims.play('runLeft',true);
            this.playerFacingRight=false;
        }
        else if(moveInput['d'].isDown){
            sprite.setVelocityX(2);
            sprite.anims.play('runRight',true); 
            this.playerFacingRight=true;
        }
        else if(this.playerFacingRight==true){
            sprite.anims.play('idleRight',true);
            sprite.setVelocityX(0);
        }
        else if(this.playerFacingRight==false){
            sprite.anims.play('idleLeft',true);
            sprite.setVelocityX(0);
        }
    
    }

    destroy(){
        this.sprite.destroy();
    }
}