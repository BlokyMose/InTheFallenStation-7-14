import MyColor from "../list/MyColor";
import { sceneEvents } from "../events/EventsCenter";
let tsTextTorch = {
    fontSize: '20px',
    fontFamily: 'Courier',
    color: 'LimeGreen',
    align: 'left',
    lineSpacing: 5,    
    // backgroundColor: "#a0a0a0",
    // shadow: {color: '#000000',fill: true,offsetX: 2,offsetY: 2,blur: 8}
};
export default class UIInventory{
    constructor(
        scene,
        textInventory="Bag",
        textStyle,
        x,
        y
    ){
        //#region Basic vars and arrays
        this.scene = scene;
        this._textInventory = textInventory;
        this.bagMax =6;
        this.bagNow=0;

        this.allItems=[];
        this.allItemsBox =[];
        this.allItemsNoteDisplay = [];
        //This is fixed. UI Coordinates are used in UITool for setText. starting w/ [index0=topLeft][0=x,1=y]
        this.UICoordinates=[
            [160,540],[160,570],
            [320,540],[320,570],
            [480,540],[480,570]
        ]

                //#endregion
        //#region Personal Preference
        this.myColor = new MyColor();
        this.textStyleAccess={
            fontSize: '23px',
            fontFamily: 'Calibri',
            color: "DarkSlateGray",
            align: 'left',
            lineSpacing: 5,    
        },
        //#endregion
        //#region Temp vars
        this.isAccessOpen = false;
        this._tempTextDeleting="";
        this.timerTweenDelete;
                //#endregion

        this.AddUIText(x, y, textStyle);
        //#region Access arrays  
        //Init: big rect BG + each array will only have max items according to itemMax = 6
        this.UIInventoryAccessBG = this.scene.add.rectangle(400,245,290,440,this.myColor.military.number,0.8).setVisible(false).setDepth(20);
        for (let n = 0; n < this.bagMax; n++) {
            this.allItems.push(["No item","No type","","",0]);
            this.allItemsNoteDisplay.push("");

            // each item box has [0]=rect for BG, [1]= X, [2]=Display name
            this.allItemsBox.push([
                this.scene.add.rectangle(400,70*(n+1),250,55,this.myColor.military.number,1).setVisible(false).setInteractive().setDepth(20),
                this.scene.add.text(490,58+70*n,"✖",this.textStyleAccess).setVisible(false).setInteractive().setDepth(20),
                this.scene.add.text(290,58+70*n,"Empty",this.textStyleAccess).setVisible(false).setDepth(20),
            ]);
            this.allItemsBox[n][0].on("pointerover",function(pointer){this.DisplayDescLong(n,true)},this);
            this.allItemsBox[n][0].on("pointerout",function(pointer){this.DisplayDescLong(n,false)},this);
            this.allItemsBox[n][1].on("pointerover",function(pointer){this.HoverXDeletingItem(n,true)},this);
            this.allItemsBox[n][1].on("pointerout",function(pointer){this.HoverXDeletingItem(n,false)},this);
        }
        //#endregion
    }



    AddUIText(x, y, textStyle) {
        this.UITextInventory = this.scene.add.text(x, y, "| " + this._textInventory + ": " + this.bagNow, textStyle)
            .setOrigin(0).setInteractive();
        this.UITextInventory.on('pointerover', function (pointer) { this.DisplaySideInventory(true); }, this);
        this.UITextInventory.on('pointerout', function (pointer) { this.DisplaySideInventory(false); }, this);
        this.UITextInventory.on('pointerdown', function (pointer) { this.AccessInventory(); }, this);
    }

    InsertItem({
        _itemID="itemID",
        _item = {
            name:"name",
            type:"type",
            desc:"desc",
            descLong:"descLong",
            extra:'extra',
        },
        }){
            //Find first empty slot box, then insert the new item
            let index=0;
            while (index<this.bagMax) {
                //Assign new item properties
                if(this.allItems[index][0]=="No item"){
                    this.allItems[index][4]=_itemID;
                    this.allItems[index][0]=_item.name;
                    this.allItems[index][1]=_item.type;
                    this.allItems[index][2]=_item.desc;
                    this.allItems[index][3]=_item.descLong;

                    this.itemBoxColorChange(_item.type, index);
                    this.allItemsNoteDisplay[index] = "- "+_item.name+": "+_item.desc;
                    this.allItemsBox[index][2].setText(_item.name+": "+_item.type);

                    this.bagNow++;
                    console.log("_ID:"+_itemID+"ID "+this.allItems[index][4]+"; item "+this.allItems[index][0]);
                    this.UITextInventory.setColor("Chartreuse"); //Chartreuse //GreenYellow
                    this.UITextInventory.setText("| "+this._textInventory+": "+this.bagNow);
    
                    return {x:this.UICoordinates[index][0],
                            y:this.UICoordinates[index][1],
                        };
                    // index=this.bagMax+1;
                }
                index++;
            }
            
                //Signal for new item has been added
    }
    EmptyItem(tween,target,index){

        //emit event to destroy item's UI and its functionality
        sceneEvents.emit("destroy-item-ui",this.allItems[index][4]);
        console.log("Destroy ID" + this.allItems[index][4]);
        //emptying array element
        this.allItems[index][0]="No item";
        this.allItems[index][1]="No type";
        this.allItems[index][2]="";
        this.allItems[index][3]="";
        this.itemBoxColorChange(this.allItems[index][1], index);
        this.allItemsBox[index][0].setAlpha(1);         //Box bg
        this.allItemsBox[index][1].setVisible(false);   //Box X
        this.allItemsBox[index][2].setText("Empty");    //Box name for display
        this.allItemsNoteDisplay[index] = "";
        this._tempTextDeleting="Empty";
        this.bagNow--;
        this.UITextInventory.setText("| "+this._textInventory+": "+this.bagNow);

    }
    HoverXDeletingItem(index,boolValue){
        if(boolValue){
            //cache the name of item
            this._tempTextDeleting=this.allItemsBox[index][2].text;
            //change item box to display deleting process. To ensure the X won't be invisible, call DisplayDescLong
            this.DisplayDescLong(index,true);
            this.allItemsBox[index][1].setColor(this.myColor.redOrgan.hex);
            this.allItemsBox[index][2].setText("//Deleting...");
            //Animation, then callback
            this.timerTweenDelete = this.scene.tweens.add({
                targets: this.allItemsBox[index][0],
                duration: 5000,
                alpha:{from:1,to:0},
                repeat: 0,
                yoyo: false,
                onComplete: this.EmptyItem,
                onCompleteParams: [index],
                onCompleteScope:this
            });
    
        }else{
            //Stop deleting, item box returns to original state
            this.timerTweenDelete.remove();
            this.allItemsBox[index][2].setText(this._tempTextDeleting);
            this.allItemsBox[index][1].setColor(this.myColor.darkSlateGray.hex);
        }
    }
    DisplayDescLong(index,boolValue){
        if(boolValue){
            document.querySelector("#indexNotes-h1").textContent = this.allItems[index][0];
            document.querySelector("#indexNotes-p").textContent = this.allItems[index][3];
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:1;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:1;");
    
            this.allItemsBox[index][0].setAlpha(0.5);

            //Prevent X from showing in Empty slot
            if(this.allItems[index][0]!="No item"){
                this.allItemsBox[index][1].setVisible(true);
            }

        }else{
            document.querySelector("#indexNotes-h1").textContent = "";
            document.querySelector("#indexNotes-p").textContent = "";
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:0;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:0;");
    
            this.allItemsBox[index][0].setAlpha(1);
            this.allItemsBox[index][1].setVisible(false);

        }
    }
    itemBoxColorChange(type, arrayIndex) {

        // for additional type, my color still has orangeJuice , extraLime, redOrgan 

        if (type == "tool") {
            this.allItemsBox[arrayIndex][0].fillColor = this.myColor.springGreen.number;
        }
        else if (type == "item") {
            this.allItemsBox[arrayIndex][0].fillColor = this.myColor.blueDim.number;
        }
        else {
            this.allItemsBox[arrayIndex][0].fillColor = this.myColor.military.number;
        }
    }
    CheckItemByName(itemName){
        this.allItems.some((item)=>{
            console.log(item[0]+itemName);
            return item[0]===itemName;
        },this);
    }
    GetAllItemsArray(){
        return this.allItems;
    }
    AccessInventory(){
        //Execute this function when "Bag" clicked. isAccessOpen is the switch to turn on/off
        this.isAccessOpen = !this.isAccessOpen;

        //Set visible BG and all item boxes
        this.UIInventoryAccessBG.setVisible(this.isAccessOpen);
        for (let n = 0; n < this.bagMax; n++) {
            this.allItemsBox[n][0].setVisible(this.isAccessOpen);
            this.allItemsBox[n][2].setVisible(this.isAccessOpen);
        }

        if(this.isAccessOpen){
             //Instruction after clicking
            document.querySelector("#indexNotes-h1").textContent = "Bag";
            document.querySelector("#indexNotes-p").textContent = "Hover '✖' for 5 seconds to item delete permanently\n\nClick 'Bag' to close";
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:1;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:1;");

        }else{
            //Reset side noted after hovering out
            document.querySelector("#indexNotes-h1").textContent = "";
            document.querySelector("#indexNotes-p").textContent = "";
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:0;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:0;");
        }
    }
    DisplaySideInventory(boolValue){

        if(boolValue){
            if(this.isAccessOpen){
                //Instruction after clicking, when hovering
                document.querySelector("#indexNotes-h1").textContent = "Bag";
                document.querySelector("#indexNotes-p").textContent = "Hover '✖' for 5 seconds to delete object permanently\n\nClick 'Bag' to close";
            }else{
                //Instruction before clicking, when hovering
                document.querySelector("#indexNotes-h1").textContent = "Bag";
                document.querySelector("#indexNotes-p").textContent = this.allItemsNoteDisplay.join("\n")+"\n\n//Click 'Bag' for more";
            }
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:1;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:1;");
            this.UITextInventory.setColor("Green");
        }else{  
            //Reset side note after hovering out
            document.querySelector("#indexNotes-h1").setAttribute("style","opacity:0;");
            document.querySelector("#indexNotes-p").setAttribute("style","opacity:0;");
            document.querySelector("#indexNotes-h1").textContent = "";
            document.querySelector("#indexNotes-p").textContent = "";
            this.UITextInventory.setColor("LimeGreen");
        }

    }
}

//#region Garbage

        // this.allItemsAccessTexts[1][0] = this.scene.add.text(400,140,"bb",textStyle);
        // this.allItemsAccessTexts[2][0] = this.scene.add.text(400,210,"cc",textStyle);
        // this.allItemsAccessTexts[3][0] = this.scene.add.text(400,250,"",textStyle);
        // this.allItemsAccessTexts[4][0] = this.scene.add.text(400,350,"",textStyle);
        // this.allItemsAccessTexts[5][0] = this.scene.add.text(400,420,"",textStyle);

        // this.allItemsAccessTexts[0][1] = this.scene.add.text(400,75,"AA",textStyle);
        // this.allItemsAccessTexts[1][1] = this.scene.add.text(400,145,"BB",textStyle);
        // this.allItemsAccessTexts[2][1] = this.scene.add.text(400,215,"CC",textStyle);
        // this.allItemsAccessTexts[3][1] = this.scene.add.text(400,255,"",textStyle);
        // this.allItemsAccessTexts[4][1] = this.scene.add.text(400,355,"",textStyle);
        // this.allItemsAccessTexts[5][1] = this.scene.add.text(400,405,"",textStyle);

                        //emit event to add item's UI and activate functionality
                        //Add UI requires at least name,x, y, textStyle of the UI text
                        // sceneEvents.emit('insert-item-ui',{
                        //     itemID:_itemID,
                        //     name:this.allItems[index][0],
                        //     x:this.UICoordinates[index][0],
                        //     y:this.UICoordinates[index][1],
                        //     textStyle:tsTextTorch,
                        //     extra: extra,
                        // });
//#endregion