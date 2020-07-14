import { sceneEvents } from "../events/EventsCenter";

export default class UITorch{
    constructor(scene, keyImgInner,keyImgOuter){

        this.itemID=0;
        this.name = "Torch";
        this.text = "Torch";

        this.type = "tool";
        this.desc = "to light";
        this.descLong = "Hover 'Torch' to turn on\n\nBattery instruction:\n■■■ = <100%\n■■□ = <75%\n■□□ = <40%\n□□□ = <10%\n\nReplace battery to increase lifespan"

        this.scene = scene;
        this.torchBattery;
        this.torchOnSec;
        this.torchOffSec;
        this.UIDarknessInner= this.scene.add.image(0,0,keyImgInner).setOrigin(0);
        this.UIDarknessOuter= this.scene.add.image(0,0,keyImgOuter).setOrigin(0);


        //Dev
        this.UIDarknessInner.setAlpha(0);
        this.UIDarknessOuter.setAlpha(0);
    }

    AddToUI({
        itemID=this.itemID,
        name=this.name,
        x=0,
        y=0, 
        text=this.text, 
        textStyle={}
    }) {
            this.itemID = itemID;
            this._textTorch = text;
            this.torchBattery=100;
    
            this.UITextTorch = this.scene.add.text(x, y, "| " + text + ": ■■■", textStyle).setOrigin(0).setInteractive(); //■ □
            if (this.torchBattery < 76.66) {
                this.UITextTorch.setText("| " + this._textTorch + ": ■■□");
                if (this.torchBattery < 43.33) {
                    this.UITextTorch.setText("| " + this._textTorch + ": ■□□");
                    if (this.torchBattery < 10) {
                        this.UITextTorch.setText("| " + this._textTorch + ": □□□");
                        this.UITextTorch.setColor("#238f23");
                    }
                }
            }
            this.UITextTorch.on('pointerover', function (pointer) {
                this.ActivateTorch(true);
            }, this);
            this.UITextTorch.on('pointerout', function (pointer) {
                this.ActivateTorch(false);
                sceneEvents.emit('ui-text-desc-reset'); //for UI desc
            }, this);
    
            sceneEvents.on("destroy-item-ui",this.Destroy,this);
    
    }

    ActivateTorch(boolValue){
        if(this.torchBattery>0){
            if(boolValue==true){
                this.UIDarknessInner.alpha = (100-this.torchBattery)/200; //Battery reach 0, alpha=0.5
                console.log("Alpha: "+this.UIDarknessInner.alpha);
                this.UITextTorch.setColor("Red");
                this.DisplayTorchStatus(true);

                // this.UITextTorch.setText("| "+this._textTorch+": ■■■ ☀"); //☀☽

                this.torchOnSec = this.scene.time.now;

            }else if (boolValue==false){
                this.torchOffSec = this.scene.time.now;
                this.UIDarknessInner.setAlpha(1);

                // //dev
                this.UIDarknessInner.setAlpha(0);
                this.UIDarknessOuter.setAlpha(0);

                sceneEvents.emit('ui-text-desc-reset'); //for UI desc
                this.torchBattery -= (this.torchOffSec-this.torchOnSec)/2000;
                this.UITextTorch.setColor("LimeGreen");
                this.UITextTorch.setText("| "+this._textTorch+": ■■■");
                if(this.torchBattery<76.66){
                    this.UITextTorch.setText("| "+this._textTorch+": ■■□");
                    if(this.torchBattery<43.33){
                        this.UITextTorch.setText("| "+this._textTorch+": ■□□");
                        if(this.torchBattery<10){
                            this.UITextTorch.setText("| "+this._textTorch+": □□□");
                            this.UITextTorch.setColor("#238f23");
                        }
                    }
                }
            }
      } else{
        this.DisplayTorchStatus(false);
      }
    }

    DisplayTorchStatus(hasBattery) {
        if(hasBattery){
            sceneEvents.emit('ui-text-desc-change', {text:"Battery: draining", color:"red"});
        }else{
            sceneEvents.emit('ui-text-desc-change', {text:"Battery: 0"});

        }
    }

    Destroy(itemID){
        console.log("sentDestroyMe: "+itemID+" ; mineID: "+this.itemID);
        if(itemID==this.itemID){
            this.UITextTorch.destroy();
            this.torchBattery=0;
            this.UIDarknessInner.setAlpha(1);
            this.UIDarknessOuter.setAlpha(1);
        }
    }

}

