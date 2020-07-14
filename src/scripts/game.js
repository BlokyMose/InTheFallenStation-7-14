import 'phaser'
import '@babel/polyfill'

// import MainScene from './scenes/mainScene'
// import PreloadScene from './scenes/preloadScene'
import { SOpening } from "./scenes/SOpening";
import { STestGround } from "./scenes/STestGround";
import { SWareHouse } from "./scenes/SWareHouse";
import { SPentapolis } from "./scenes/SPentapolis";
import UIPlay from "./UI/UIPlay";
import UIPlay2 from "./UI/UIPlay2";
import { STestGround2 } from "./scenes/STestGround2";
import CanvasDialogue from "./Chat/CanvasDialogue";

var config = {
  type: Phaser.AUTO,
  width:800,
  height:600,
  pixelArt: true,
  scale:{ 
      parent:'myGame',
      // autoCenter:Phaser.Scale.CENTER_BOTH
  },
  physics:{
      default: 'matter',
      matter:{
          gravity:{y:0.4},
          debug:false
      }
  },
  scene:[
      SPentapolis,
      UIPlay2,
      STestGround2,
      CanvasDialogue,

      //======================
      SWareHouse,
      UIPlay,
      // STestGround,
      SOpening, 

  ]
};


window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
