export default class MarkerTile{
    constructor(scene,tilemap){
        //Basically, "this" is translated as this.scene in this class
        //The context has been transferred by passing the "this"
        this.scene = scene;

        this.marker = scene.add.graphics();
        this.marker.lineStyle(5,0xfffff,1);
        this.marker.strokeRect(0,0,tilemap.tileWidth,tilemap.tileHeight);
        this.marker.lineStyle(3,0xff4f78,1);
        this.marker.strokeRect(0,0,tilemap.tileWidth,tilemap.tileHeight);

    }

    setPositionTo(x,y){
        this.marker.setPosition(x,y);
    }

    PaintTilemapLayer(tilemapLayer,tileGID){

        const worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);
        const pointerTileXY = tilemapLayer.worldToTileXY(worldPoint.x,worldPoint.y);
        const snappedWorldPoint = tilemapLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
        this.setPositionTo(snappedWorldPoint.x,snappedWorldPoint.y);

        if(this.scene.input.manager.activePointer.isDown){
           let tile= tilemapLayer.putTileAtWorldXY(tileGID,worldPoint.x,worldPoint.y);
        }

    }
}