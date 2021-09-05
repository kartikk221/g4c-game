Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

Array.prototype.remove = function(arrIndex) {
    return this.slice(0,arrIndex).concat(this.slice(arrIndex + 1));
};

function randomNumber(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function calculateCoordinates(coords){
    return {
        x: (coords.x - globalX) * HSR,
        y: (globalY - coords.y) * VSR
    }
}

function calculateDistance(x1,y1,x2,y2){ 
    if(!x2) x2=0; 
    if(!y2) y2=0;
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
}

function getDropOffWindowLocation(verticalRow, horizontalRow)
{
    verticalRow -= 1;
    horizontalRow -= 1;
    var baseXValuesForRow = [-268, 143, 552];
    var baseYValuesForRow = [286, 262, 231];
    var XvalueAdjustFactor = [9,8,0];
    if(verticalRow > 3){ alert(verticalRow + "," + horizontalRow + " not possible."); return false;}
    return {
        x: baseXValuesForRow[verticalRow] + ((horizontalRow - 1) * XvalueAdjustFactor[verticalRow]), 
        y: baseYValuesForRow[verticalRow] + (horizontalRow * 566)
    }
}

var backgroundGroup = new PIXI.display.Group(0, true);
var buildingGroup = new PIXI.display.Group(1, true);
var dronePlayerGroup = new PIXI.display.Group(2, true);
var backgroundContainer = new PIXI.Container();
var buildingContainer = new PIXI.Container();
var dronePlayerContainer = new PIXI.Container();

app.stage = new PIXI.display.Stage();
app.stage.group.enableSort = true;

app.stage.addChild(new PIXI.display.Layer(backgroundGroup));
app.stage.addChild(new PIXI.display.Layer(buildingGroup));
app.stage.addChild(new PIXI.display.Layer(dronePlayerGroup));
app.stage.addChild(backgroundContainer);
app.stage.addChild(buildingContainer);
app.stage.addChild(dronePlayerContainer);



var SPRITES = {
    spriteStorage: {},
    create: function(spriteName, parent, container, textureURL, modifications){
        SPRITES.spriteStorage[spriteName] = new PIXI.Sprite(PIXI.Texture.fromImage(textureURL));
        SPRITES.spriteStorage[spriteName].parentGroup = parent;
        SPRITES.spriteStorage[spriteName].positioningEnabled = false;
        SPRITES.spriteStorage[spriteName].scale.x = HSR;
        SPRITES.spriteStorage[spriteName].scale.y = VSR;
        if(modifications){ 
            modifications(SPRITES.spriteStorage[spriteName]); 
            container.addChild(SPRITES.spriteStorage[spriteName]);
        } else {
            container.addChild(SPRITES.spriteStorage[spriteName]);
            return SPRITES.spriteStorage[spriteName]; 
        }
    },
    get: function(spriteName){
        return SPRITES.spriteStorage[spriteName];
    },
    delete: function(spriteName, container){
        if(SPRITES.spriteStorage[spriteName] == undefined){return false;}
        container.removeChild(SPRITES.spriteStorage[spriteName]);
        delete SPRITES.spriteStorage[spriteName];
    }
}