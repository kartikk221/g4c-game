var HSR = innerWidth / 1920; // Horizontal Sprite Scaling Ratio
var VSR = innerHeight / 1080; // Vertical Sprite Scaling Ratio
var enableUserMovement = false;
var enablePositioningEngine = false;
var backgroundCloudsEngine = false;
var backgroundDronesEngine = false;
var costumeEngine = false;
var costumeAnimationDelay = 30; // 100 Milliseconds
var globalX = 0;
var globalY = 0;
var xVelocity = 0;
var yVelocity = 0;
var gameSpeed = 6 * HSR;
var DroneFacingRight = true;
var numBackgroundClouds = 0;
var backgroundClouds = {};
var backgroundCloudSpeed = 0.3 * HSR;
var backgroundDrones = {};
var backgroundDroneSpeed = 6 * HSR;
var fullWidth = 1920 * HSR;
var fullHeight = 1080 * VSR;
var halfwayWidth = (1920 / 2) * HSR;
var halfwayHeight = (1080 / 2) * VSR;
var dronePackageDistance = 60;
var dronePackageScale = 0.6;
var droneDimensionsCategory = 1;
var maxHeightLimit = 7558;

function urltoNativeDirectory(url) {
    return '/' + url;
}

var peerDrone1_1 = PIXI.Texture.from(urltoNativeDirectory('images/drone_1_1.png'));
var peerDrone1_2 = PIXI.Texture.from(urltoNativeDirectory('images/drone_1_2.png'));

var peerDrone2_1 = PIXI.Texture.from(urltoNativeDirectory('images/drone_2_1.png'));
var peerDrone2_2 = PIXI.Texture.from(urltoNativeDirectory('images/drone_2_2.png'));

var status_delivering = PIXI.Texture.from(urltoNativeDirectory('images/status_delivering.png'));
var status_delivered = PIXI.Texture.from(urltoNativeDirectory('images/status_delivered.png'));

var PositioningEngine = {
    add: function (spriteName, spriteX, spriteY) {
        var sprite = SPRITES.get(spriteName);
        if (!sprite) {
            return false;
        }
        if (!sprite.positioningEnabled) {
            sprite.worldPositioning = {};
            sprite.worldPositioning.x = spriteX;
            sprite.worldPositioning.y = spriteY;
            sprite.positioningEnabled = true;
            sprite.moveTo = function (x, y) {
                sprite.worldPositioning.x = x;
                sprite.worldPositioning.y = y;
            };
        }
    },
};

function randomString() {
    return Math.random().toString(36).substr(2, 8);
}

var COSTUMES = {
    CostumeSprites: {},
    assign: function (sprite, costumes) {
        SPRITES.get(sprite).costumeIndex = 0;
        COSTUMES.CostumeSprites[sprite] = costumes;
    },
    remove: function (sprite, finalTexture) {
        delete COSTUMES.CostumeSprites[sprite];
        SPRITES.get(sprite).costumeIndex = undefined;
        if (finalTexture) {
            SPRITES.get(sprite).texture = finalTexture;
        }
    },
};

function smoothDecrease(type) {
    var isNegative = window[type] < 0;
    var shrunk = Math.abs(window[type]) * 0.9;
    if (shrunk > 0.03) {
        if (isNegative) {
            window[type] = -1 * shrunk;
        } else {
            window[type] = shrunk;
        }
    } else {
        window[type] = 0;
    }
}

function spawnNewPeerDrone(coords) {
    var droneID = randomString();
    var droneType = randomNumber(1, 2);
    SPRITES.create(
        'background_drone_' + droneID,
        dronePlayerGroup,
        dronePlayerContainer,
        urltoNativeDirectory('images/drone_' + droneType + '_1.png'),
        function (sprite) {
            sprite.visible = false;
            sprite.anchor.set(0.5);
            sprite.zOrder = randomNumber(1, 9);
            sprite.scale.x = sprite.scale.x * 0.8;
            sprite.scale.y = sprite.scale.y * 0.8;
            PositioningEngine.add('background_drone_' + droneID, coords.x, coords.y);
            if (droneType == 1) {
                COSTUMES.assign('background_drone_' + droneID, [peerDrone1_1, peerDrone1_2]);
            }
            if (droneType == 2) {
                COSTUMES.assign('background_drone_' + droneID, [peerDrone2_1, peerDrone2_2]);
            }
            sprite.xMoveSpeed = [-1, 1].random() * backgroundDroneSpeed * (randomNumber(60, 100) / 100);
            sprite.yMoveSpeed = [-1, 1].random() * backgroundDroneSpeed * (randomNumber(60, 100) / 100);
            backgroundDrones[droneID] = true;
        }
    );
}

function enablePeerDrones() {
    var numDrones = 0;
    while (numDrones < 4) {
        if (randomNumber(0, 1) == 0) {
            var droneY = fullHeight * 1.13;
        } else {
            var droneY = -1 * fullHeight * 1.13;
        }
        spawnNewPeerDrone({ x: randomNumber(0, fullWidth) - halfwayWidth, y: globalY + droneY });
        numDrones++;
    }
    backgroundDronesEngine = true;
}

function disablePeerDrones() {
    backgroundDronesEngine = false;
    for (var droneID in backgroundDrones) {
        COSTUMES.remove('background_drone_' + droneID);
        SPRITES.delete('background_drone_' + droneID, dronePlayerContainer);
        delete backgroundDrones[droneID];
    }
}

function spawnNewBackgroundCloud(coords) {
    var cloudID = randomString();
    SPRITES.create(
        'background_cloud_' + cloudID,
        dronePlayerGroup,
        dronePlayerContainer,
        urltoNativeDirectory('images/cloud_' + randomNumber(1, 5) + '.png'),
        function (sprite) {
            sprite.visible = false;
            sprite.anchor.set(0.5);
            sprite.zOrder = randomNumber(1, 9);
            sprite.alpha = randomNumber(3, 8) / 10;
            sprite.scale.set(randomNumber(7, 12) / 10);
            PositioningEngine.add('background_cloud_' + cloudID, coords.x, coords.y);
            sprite.moveRight = coords.x < halfwayWidth;
            numBackgroundClouds++;
            backgroundClouds[cloudID] = true;
        }
    );
}

function enableBackgroundClouds() {
    var numClouds = 6; // number of clouds we can have in the background at a time
    while (numBackgroundClouds < numClouds) {
        spawnNewBackgroundCloud({
            x: randomNumber(0, fullWidth) - halfwayWidth,
            y: randomNumber(0, fullHeight * 1.3) - halfwayHeight,
        });
    }
    backgroundCloudsEngine = true;
}

function bringDroneToPickupPoint() {
    globalY = 220;
    SPRITES.get('drone_player').x = -600 * HSR;
}

function dronePitchForward() {
    if (DroneFacingRight) {
        if (SPRITES.get('drone_player').flyPitch < 0.05) {
            SPRITES.get('drone_player').flyPitch += 0.007;
        }
    } else {
        if (SPRITES.get('drone_player').flyPitch > -0.05) {
            SPRITES.get('drone_player').flyPitch -= 0.007;
        }
    }
}

function dronePitchBackwards() {
    if (SPRITES.get('drone_player').flyPitch > 0) {
        SPRITES.get('drone_player').flyPitch -= 0.02;
        if (SPRITES.get('drone_player').flyPitch < 0) {
            SPRITES.get('drone_player').flyPitch = 0;
        }
    } else {
        if (SPRITES.get('drone_player').flyPitch < 0) {
            SPRITES.get('drone_player').flyPitch += 0.02;
            if (SPRITES.get('drone_player').flyPitch > 0) {
                SPRITES.get('drone_player').flyPitch = 0;
            }
        }
    }
}

function ActivateMovementEngine() {
    var playerDrone = SPRITES.get('drone_player');
    app.ticker.add(function (delta) {
        if (enableUserMovement && !GAME.paused) {
            GAME.updateBuildingFloor();
            if ((wPressed.isDown || UpArrowPressed.isDown) && globalY + gameSpeed < maxHeightLimit) {
                yVelocity = gameSpeed;
            } else if ((sPressed.isDown || DownArrowPressed.isDown) && globalY - gameSpeed > 0) {
                yVelocity = -1 * gameSpeed;
            } else if (globalY + gameSpeed < maxHeightLimit && globalY - gameSpeed > 0) {
                smoothDecrease('yVelocity');
            } else {
                yVelocity = 0;
            }

            if ((aPressed.isDown || LeftArrowPressed.isDown) && playerDrone.x - gameSpeed > (-1920 / 2) * HSR * 0.95) {
                xVelocity = -1 * gameSpeed;
                dronePitchForward();
                DroneFacingRight = false;
            } else if (
                (dPressed.isDown || RightArrowPressed.isDown) &&
                playerDrone.x + gameSpeed < (1920 / 2) * HSR * 0.95
            ) {
                xVelocity = gameSpeed;
                dronePitchForward();
                DroneFacingRight = true;
            } else if (
                playerDrone.x - gameSpeed > (-1920 / 2) * HSR * 0.95 &&
                playerDrone.x + gameSpeed < (1920 / 2) * HSR * 0.95
            ) {
                smoothDecrease('xVelocity');
                dronePitchBackwards();
            } else {
                xVelocity = 0;
                dronePitchBackwards();
            }

            globalY += yVelocity;
            playerDrone.x += xVelocity;
            playerDrone.rotation = playerDrone.flyPitch;

            var dronePackage = SPRITES.get('drone_package');
            dronePackage.x = playerDrone.x;
            dronePackage.y = playerDrone.y + dronePackageDistance * VSR;
            if (dronePackage.scale.x !== dronePackageScale) {
                dronePackage.scale.x = dronePackageScale;
                dronePackage.scale.y = dronePackageScale;
            }

            [1, 2, 3, 4, 5].forEach(function (num) {
                var dropoffWindow = SPRITES.get('dropoff_window_' + num);
                var distanceBetween = calculateDistance(playerDrone.x, playerDrone.y, dropoffWindow.x, dropoffWindow.y);
                if (
                    GAME.missionRequirements['dropoff_' + num] &&
                    GAME.missionRequirements['dropoff_' + num] == 'incomplete' &&
                    distanceBetween < 200
                ) {
                    if (distanceBetween < 190) {
                        SPRITES.get('delivery_status').visible = true;
                        SPRITES.get('delivery_status').texture = status_delivering;
                        SPRITES.get('delivery_status').moveTo(
                            dropoffWindow.worldPositioning.x,
                            dropoffWindow.worldPositioning.y
                        );
                        if (GAME.deliveryProcess == '') {
                            GAME.deliveryProcess = newDeliveryProcess(GAME.deliveryTime);
                        }
                        if (GAME.deliveryProcess.spendTime(1) == 'finished') {
                            GAME.missionRequirements['dropoff_' + num] = 'delivered';
                            SPRITES.get('delivery_status').texture = status_delivered;
                            GAME.onPackageDelivery(num);
                            setTimeout(function () {
                                SPRITES.get('delivery_status').visible = false;
                            }, 1500);
                        }
                    } else {
                        GAME.deliveryProcess = '';
                        SPRITES.get('delivery_status').visible = false;
                    }
                }
            });
        }
    });

    setInterval(function () {
        if (costumeEngine && !GAME.paused) {
            for (var name in COSTUMES.CostumeSprites) {
                var sprite = SPRITES.get(name);
                sprite.costumeIndex = sprite.costumeIndex + 1;
                if (sprite.costumeIndex == COSTUMES.CostumeSprites[name].length) {
                    sprite.costumeIndex = 0;
                }
                sprite.texture = COSTUMES.CostumeSprites[name][sprite.costumeIndex];
            }
        }
    }, costumeAnimationDelay);
}

function ActivatePositioningEngine() {
    app.ticker.add(function (delta) {
        if (enablePositioningEngine) {
            for (var name in SPRITES.spriteStorage) {
                if (SPRITES.get(name).positioningEnabled) {
                    var sprite = SPRITES.get(name);
                    var newCoordinates = calculateCoordinates({
                        x: sprite.worldPositioning.x,
                        y: sprite.worldPositioning.y,
                    });
                    sprite.x = newCoordinates.x;
                    sprite.y = newCoordinates.y;
                }
            }
        }
    });
}

function ActivatePositioningEngine() {
    var playerDrone = SPRITES.get('drone_player');
    app.ticker.add(function (delta) {
        if (enablePositioningEngine) {
            for (var name in SPRITES.spriteStorage) {
                if (SPRITES.get(name).positioningEnabled) {
                    var sprite = SPRITES.get(name);
                    var newCoordinates = calculateCoordinates({
                        x: sprite.worldPositioning.x,
                        y: sprite.worldPositioning.y,
                    });
                    sprite.x = newCoordinates.x;
                    sprite.y = newCoordinates.y;
                }
            }
        }

        if (backgroundCloudsEngine) {
            for (var cloud in backgroundClouds) {
                var cloudObject = SPRITES.get('background_cloud_' + cloud);
                if (cloudObject.moveRight) {
                    cloudObject.moveTo(
                        cloudObject.worldPositioning.x + backgroundCloudSpeed,
                        cloudObject.worldPositioning.y
                    );
                } else {
                    cloudObject.moveTo(
                        cloudObject.worldPositioning.x - backgroundCloudSpeed,
                        cloudObject.worldPositioning.y
                    );
                }
                if (calculateDistance(playerDrone.x, globalY, cloudObject.x, cloudObject.worldPositioning.y) > 1600) {
                    SPRITES.delete('background_cloud_' + cloud, dronePlayerContainer);
                    delete backgroundClouds[cloud];
                    numBackgroundClouds--;
                    if (randomNumber(0, 1) == 0) {
                        var cloudY = fullHeight * 1.2;
                    } else {
                        var cloudY = -1 * fullHeight * 1.2;
                    }
                    spawnNewBackgroundCloud({
                        x: randomNumber(0, fullWidth) - halfwayWidth,
                        y: cloudY + globalY,
                    });
                } else if (!cloudObject.visible) {
                    cloudObject.visible = true;
                }
            }
        }

        if (backgroundDronesEngine && !GAME.paused) {
            for (var droneID in backgroundDrones) {
                var droneObject = SPRITES.get('background_drone_' + droneID);
                droneObject.moveTo(
                    droneObject.worldPositioning.x + droneObject.xMoveSpeed,
                    droneObject.worldPositioning.y + droneObject.yMoveSpeed
                );
                if (
                    GAME.missionLastStatus == 'active' &&
                    Physics.hit(playerDrone, droneObject) &&
                    calculateDistance(playerDrone.x, playerDrone.y, droneObject.x, droneObject.y) < 120
                ) {
                    enableUserMovement = false;
                    backgroundDronesEngine = false;
                    GAME.missionLastStatus = 'failed';
                    screenFadeOut();
                    setTimeout(function () {
                        throwMissionFailPrompt('Your drone collided with another drone!');
                        bringDroneToPickupPoint();
                        GAME.updateMissionsUI();
                        GAME.missionInstance = '';
                    }, 1000);
                }
                if (calculateDistance(playerDrone.x, globalY, droneObject.x, droneObject.worldPositioning.y) > 1600) {
                    COSTUMES.remove('background_drone_' + droneID);
                    SPRITES.delete('background_drone_' + droneID, dronePlayerContainer);
                    delete backgroundDrones[droneID];
                    if (randomNumber(0, 1) == 0) {
                        var cloudY = fullHeight * 1.13;
                    } else {
                        var cloudY = -1 * fullHeight * 1.13;
                    }
                    spawnNewPeerDrone({
                        x: randomNumber(0, fullWidth) - halfwayWidth,
                        y: cloudY + globalY,
                    });
                } else if (!droneObject.visible) {
                    droneObject.visible = true;
                }
            }
        }
    });
}
