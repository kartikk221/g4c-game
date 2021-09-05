SPRITES.create("backgroundImage", backgroundGroup, backgroundContainer, urltoNativeDirectory("images/background.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    /* sprite.scale.x = 0.3;
    sprite.scale.y = 0.3; */
    sprite.zOrder = 0;
});

SPRITES.create("drone_player", dronePlayerGroup, dronePlayerContainer, urltoNativeDirectory("images/drone.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    sprite.scale.x = sprite.scale.x * 0.8;
    sprite.scale.y = sprite.scale.y * 0.8;
    sprite.zOrder = 1;
    sprite.flyPitch = 0;
});

SPRITES.create("drone_package", dronePlayerGroup, dronePlayerContainer, urltoNativeDirectory("images/drone_package.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    sprite.x = 0;
    sprite.y = 0;
    sprite.scale.x = 0.6;
    sprite.scale.y = 0.6;
    sprite.zOrder = 2;
    sprite.visible = false;
});

SPRITES.create("building_bottom", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_bottom.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("building_bottom", 0, 0);
    sprite.zOrder = 1;
});

SPRITES.create("building_middle_1", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_middle_1.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("building_middle_1", 0, 1078);
    sprite.zOrder = 1;
});

SPRITES.create("building_middle_2", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_middle_2.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("building_middle_2", 0, 2158);
    sprite.zOrder = 1;
});

SPRITES.create("building_middle_3", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_middle_3.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("building_middle_3", 0, 3238);
    sprite.zOrder = 1;
});

SPRITES.create("building_middle_4", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_middle_2.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("building_middle_4", 0, 4318);
    sprite.zOrder = 1;
});

SPRITES.create("building_middle_5", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_middle_3.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("building_middle_5", 0, 5398);
    sprite.zOrder = 1;
});

SPRITES.create("building_middle_6", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_middle_2.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("building_middle_6", 0, 6478);
    sprite.zOrder = 1;
});

SPRITES.create("building_top", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_top.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("building_top", 0, 7558);
    sprite.zOrder = 1;
});

SPRITES.create("dropoff_window_1", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_dropoff.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("dropoff_window_1", 552, 797);
    sprite.zOrder = 0;
});

SPRITES.create("dropoff_window_2", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_dropoff.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("dropoff_window_2", 151, 2415);
    sprite.zOrder = 0;
});

SPRITES.create("dropoff_window_3", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_dropoff.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("dropoff_window_3", 552, 5112);
    sprite.zOrder = 0;
});

SPRITES.create("dropoff_window_4", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_dropoff.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("dropoff_window_4", -259, 6237);
    sprite.zOrder = 0;
});

SPRITES.create("dropoff_window_5", buildingGroup, buildingContainer, urltoNativeDirectory("images/building_dropoff.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("dropoff_window_5", 151, 7265);
    sprite.zOrder = 0;
});

SPRITES.create("delivery_status", buildingGroup, buildingContainer, urltoNativeDirectory("images/status_delivering.png"), 
function(sprite){
    sprite.anchor.set(0.5);
    PositioningEngine.add("delivery_status", 0, 0);
    sprite.zOrder = -1;
    sprite.visible = false;
});