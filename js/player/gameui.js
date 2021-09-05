function hideInfoPanel(){
    $("#top_left_ui_window").css("top", "-25%");
}

function showInfoPanel(){
    $("#top_left_ui_window").css("top", "2%");
}

function hideUIButtons(){
    $("#game_ui_buttons_holder").css("bottom", "-15%");
}

function showUIButtons(){
    $("#game_ui_buttons_holder").css("bottom", "0");
}

function screenFadeOut(){
    $("#fader").fadeIn(1000);
}

function screenFadeIn(){
    $("#fader").fadeOut(1000);
}

function dialougePrompt(msg,bt,callback){
    swal({title: "Manager", text: msg, icon: "/g4c_game/images/manager.png", allowOutsideClick: false,button:bt}).then((value) => {
    callback();
    })
}

function missionsCloseButton(action){
    if(action == "enable"){
        $("#job1,#job2,#job3,#job4,#job5").iziModal({
            width: app.screen.width * 0.50,
            radius: 5,
            padding: 20,
            group: 'products',
            loop: false,
            arrowKeys: false,
            overlayClose: true,
            navigateCaption: false,
            overlayColor: 'rgba(0,0,0,0.9)',
            closeButton: true,
            headerColor: '#08AEEA',
            onClosed: function(){GAME.paused = false;}
          });
    } else {
        $("#job1,#job2,#job3,#job4,#job5").iziModal({
            width: app.screen.width * 0.50,
            radius: 5,
            padding: 20,
            group: 'products',
            loop: false,
            arrowKeys: false,
            navigateCaption: false,
            overlayClose: false,
            overlayColor: 'rgba(0,0,0,0.9)',
            closeButton: false,
            headerColor: '#08AEEA'
          });
    }
}

function BackgroundMusicLoop(){
    var second = 1000; // 1 second = 1000ms
    var minute = (60 * 1000); // 1 minute = 60000
    setTimeout(function(){
        backgroundMusic.stop();
        backgroundMusic.start();
        BackgroundMusicLoop(); // Call the loop again
    }, (4 * minute) + (50 * second)); // The background loop is 4 minutes and 50 seconds long
}

function beginNewGame(){
    backgroundMusic.start();
    BackgroundMusicLoop();
    dialougePrompt(
        "Hello! Welcome to SwiftScale! We appreciate your service in allowing us to revolutionize drone delivery services.",
        "Hello",
        function(){
            dialougePrompt(
                "In the next 5 days, you will be completing a 5-day training program. I will task you with 5 jobs, each increasing in difficulty to prepare you for your position as a delivery drone operator.",
                "Wow! I cannot wait!",
                function(){
                    dialougePrompt(
                        "You will have to navigate to different floors of a residential skyscraper and deliver assigned packages.",
                        "Alright",
                        function(){
                            dialougePrompt(
                                "You must not collide with any other drone in the airspace as you navigate along the building.",
                                "Will keep that in mind!",
                                function(){
                                    dialougePrompt(
                                        "One last thing, you must complete all jobs in a given time. The time and tasks will be available in the job synopsis before you initiate each job.",
                                        "Alright! When do I start?",
                                        function(){
                                            dialougePrompt(
                                                "You can start today! Just review the controls and have fun! Good Luck!",
                                                "Start Game",
                                                function(){
                                                    $("#controls").iziModal("open");
                                                    $("#top_left_ui_window").find('h2').each(function(){$(this).css("font-size", (+$(this).css("font-size").replace("px", "") * HSR) + "px");}); // Fixes Top-UI being out of scope.
                                                }
                                            ) 
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            )
        }
    )
}

function loadMissions(){
    missionsCloseButton("enable");
    $("#" + GAME.currentJob).iziModal("open");
    GAME.paused = true;
}

function restartMission(){
    hideInfoPanel();
    hideUIButtons();
    screenFadeOut();
    clearInterval(GAME.missionTimer);
    setTimeout(function(){
        bringDroneToPickupPoint();
        GAME.mission_setup[GAME.currentJob]();
        screenFadeIn();
    }, 1000)
}

function throwMissionFailPrompt(reason){
    $("#job_fail_reason").text(reason);
    $("#mission_failed").iziModal("open");
    console.log("Mission Fail Fired: " + reason);
}

function throwMissionSuccessPrompt(managerNotes, reward){
    $(".manager-notes").text(managerNotes);
    $(".mission-reward").text(reward);
    $("#mission_success").iziModal("open");
    console.log("Mission Success Fired- Notes: " + managerNotes + " || Rewards: " + reward);
}

function showObjective(reason, whatodo){
    var objective = $("#mission_objective");
    objective.find("#objective_display").text(reason);
    objective.find("#objective_nextstep").text(whatodo);
    objective.iziModal("open");
}

function newDeliveryProcess(time){
    return {
        timeGoal: time,
        timeSpent: 0,
        spendTime: function(time){
            if(GAME.deliveryProcess.timeSpent < GAME.deliveryProcess.timeGoal){
                GAME.deliveryProcess.timeSpent += time;
                return false;
            } else {
                return "finished";
            }    
        }
    }
}

function updatePackageDimensions(items){
    droneDimensionsCategory = items;
    if(items == 1){
        dronePackageDistance = 60;
        dronePackageScale = 0.6;
    }
    if(items == 2){
        dronePackageDistance = 70;
        dronePackageScale = 0.8
    }
    if(items == 3){
        dronePackageDistance = 90;
        dronePackageScale = 1.0
    }
    if(items == 4){
        dronePackageDistance = 90;
        dronePackageScale = 1.1;
    }
    if(items == 5){
        dronePackageDistance = 100;
        dronePackageScale = 1.3;
    }
}

function missionObjective(){
    function getNextDeliveryFloor(){
        for (var dropoffwindow in GAME.missionRequirements) {
            if(GAME.missionRequirements[dropoffwindow] == "incomplete"){
                return Math.floor(((SPRITES.get(dropoffwindow.replace("dropoff_", "dropoff_window_")).worldPositioning.y - 255) / 420)) + 1;
            }
        }
    }
    
    var nextStep = "Please naviage to Building floor #" + getNextDeliveryFloor();
    showObjective(GAME.missionObjective, nextStep);
    GAME.paused = true;
}

function wonGame(){
    dialougePrompt(
        "Congratulations! You have just completed your training and now certify as a professional delivery-drone operator!",
        "Wohoooooo!!",
        function(){
            dialougePrompt(
                "You know it is crazy how Amazon and other corporations solved the problem of delivering to skyscrapers. I mean people would have to take elevators and waste time to travel down to the main floor to receive a package a decade ago.",
                "Yeah, drones can be used in almost anything!",
                function(){
                    dialougePrompt(
                        "Yeah, but be mindful, drones can still face some problems such as connection-dropouts, collisions, hardware failures and others. However, companies are always trying to innovate new ways to make drones safer than ever. Anyways, my work is done here. Good Luck!",
                        "Thank you, see you around",
                        function(){
                            swal("The End", "We hope you enjoyed a little glimpse into a possible future of drones and one of their applications in the world. We were inspired by Amazon's attempts at making drones delivery-capable and speculated a future where drones can deliver to places which may be far from receiving spots from conventional deliveries. Skyscrapers were one of the most probable locations as employees and companies situated on higher building floors can receive deliveries directly to their offices. Good Bye.");
                            backgroundMusic.stop();
                        });
                });
        });
}

var GAME = {
    currentJob: "none",
    missionTimer: "",
    missionLastStatus: "none",
    nextUnlockedJob: "",
    onPackageDelivery: function(){},
    missionRequirements: {},
    deliveryTime: 0,
    deliveryProcess: "",
    missionInstance: "",
    missionSteps: [],
    paused: false,
    jobs_status: {
        job1: "unlocked",
        job2: "locked",
        job3: "locked",
        job4: "locked",
        job5: "locked"
    },
    mission_setup: {
        job1: function(){
            GAME.missionObjective = "You are tasked to deliver a package to one of our customers on floor #2. To deliver a package, simply go near the dropoff window and wait for the delivering process to finish.";
            bringDroneToPickupPoint();
            GAME.deliveryTime = 100;
            GAME.missionRequirements["dropoff_1"] = "incomplete";
            disablePeerDrones();
            enablePeerDrones();
            clearInterval(GAME.missionTimer);
            var MissionInstance = randomString();
            GAME.missionInstance = MissionInstance;
            GAME.currentJob = "job1";
            GAME.missionLastStatus = "active";
            $("#currentJob").text("1");
            SPRITES.get("drone_package").visible = true;
            updatePackageDimensions(1);
            $("#job1").iziModal("close");
            enableUserMovement = true;
            backgroundDronesEngine = true;
            showUIButtons();
            showInfoPanel();
            GAME.countdown(20, function(timeRemaining, timer){
                GAME.missionTimer = timer;
                GAME.updateRemainingTime(timeRemaining);
            }, function(){
                if(MissionInstance == GAME.missionInstance){
                    GAME.checkMissionFailed();
                }
            })
            GAME.onPackageDelivery = function(droffoffwindowNum){
                GAME.missionRequirements = {};
                GAME.missionLastStatus = "complete";
                GAME.jobs_status.job1 = "completed";
                GAME.jobs_status.job2 = "unlocked";
                clearInterval(GAME.missionTimer);
                enableUserMovement = false;
                backgroundDronesEngine = false;
                GAME.updateMissionsUI();
                GAME.nextUnlockedJob = "job2";
                screenFadeOut();
                setTimeout(function(){
                    throwMissionSuccessPrompt("Manager: Congrats on finishing job #1. I would have never thought that the skyscraper industry would allow us to operate drones remotely and deliver products. Anyways, The next job will have increased difficulty as other drones will start moving at faster speeds", "Job #2 has been unlocked");
                })
            }
            screenFadeIn();
            GAME.paused = false;
        },
        job2: function(){
            GAME.missionObjective = "Your new task is to deliver two packages to our customers on floors #2 and #6. To deliver a package, simply go near the dropoff window and wait for the delivering process to finish.";
            bringDroneToPickupPoint();
            GAME.deliveryTime = 120;
            GAME.missionRequirements["dropoff_1"] = "incomplete";
            GAME.missionRequirements["dropoff_2"] = "incomplete";
            disablePeerDrones();
            enablePeerDrones();
            clearInterval(GAME.missionTimer);
            var MissionInstance = randomString();
            GAME.missionInstance = MissionInstance;
            GAME.currentJob = "job2";
            GAME.missionLastStatus = "active";
            $("#currentJob").text("2");
            backgroundDroneSpeed = 8 * HSR;
            SPRITES.get("drone_package").visible = true;
            updatePackageDimensions(2);
            $("#job2").iziModal("close");
            enableUserMovement = true;
            backgroundDronesEngine = true;
            showUIButtons();
            showInfoPanel();
            GAME.countdown(30, function(timeRemaining, timer){
                GAME.missionTimer = timer;
                GAME.updateRemainingTime(timeRemaining);
            }, function(){
                if(MissionInstance == GAME.missionInstance){
                    GAME.checkMissionFailed();
                }
            })
            GAME.onPackageDelivery = function(droffoffwindowNum){
                if(GAME.missionRequirements["dropoff_1"] == "delivered" && GAME.missionRequirements["dropoff_2"] == "delivered"){
                    GAME.missionLastStatus = "complete";
                    GAME.jobs_status.job2 = "completed";
                    GAME.jobs_status.job3 = "unlocked";
                    clearInterval(GAME.missionTimer);
                    enableUserMovement = false;
                    backgroundDronesEngine = false;
                    GAME.updateMissionsUI();
                    GAME.nextUnlockedJob = "job3";
                    screenFadeOut();
                    setTimeout(function(){
                        throwMissionSuccessPrompt("Manager: Wow! You are a fast learner! Congrats on finishing job #2. Remember this is the future, drone traffic has increased in our airpsace but it also causes a higher risk of drone-human accidents. Be careful! The next job will have increased difficulty as other drones will start moving at faster speeds.", "Job #3 has been unlocked");
                    })
                } else {
                    updatePackageDimensions(droneDimensionsCategory - 1);
                    GAME.missionSteps = GAME.missionSteps.remove(droffoffwindowNum);
                }
            }
            screenFadeIn();
            GAME.paused = false;
        },
        job3: function(){
            GAME.missionObjective = "This task requires you to deliver three packages to our customers on floors #2, #6, and #12. To deliver a package, simply go near the dropoff window and wait for the delivering process to finish.";
            bringDroneToPickupPoint();
            GAME.deliveryTime = 120;
            GAME.missionRequirements["dropoff_1"] = "incomplete";
            GAME.missionRequirements["dropoff_2"] = "incomplete";
            GAME.missionRequirements["dropoff_3"] = "incomplete";
            disablePeerDrones();
            enablePeerDrones();
            clearInterval(GAME.missionTimer);
            var MissionInstance = randomString();
            GAME.missionInstance = MissionInstance;
            GAME.currentJob = "job3";
            GAME.missionLastStatus = "active";
            $("#currentJob").text("3");
            backgroundDroneSpeed = 10 * HSR;
            SPRITES.get("drone_package").visible = true;
            updatePackageDimensions(3);
            $("#job3").iziModal("close");
            enableUserMovement = true;
            backgroundDronesEngine = true;
            showUIButtons();
            showInfoPanel();
            GAME.countdown(30, function(timeRemaining, timer){
                GAME.missionTimer = timer;
                GAME.updateRemainingTime(timeRemaining);
            }, function(){
                if(MissionInstance == GAME.missionInstance){
                    GAME.checkMissionFailed();
                }
            })
            GAME.onPackageDelivery = function(droffoffwindowNum){
                if(GAME.missionRequirements["dropoff_1"] == "delivered" && GAME.missionRequirements["dropoff_2"] == "delivered" && GAME.missionRequirements["dropoff_3"] == "delivered"){
                    GAME.missionLastStatus = "complete";
                    GAME.jobs_status.job3 = "completed";
                    GAME.jobs_status.job4 = "unlocked";
                    clearInterval(GAME.missionTimer);
                    enableUserMovement = false;
                    backgroundDronesEngine = false;
                    GAME.updateMissionsUI();
                    GAME.nextUnlockedJob = "job4";
                    screenFadeOut();
                    setTimeout(function(){
                        throwMissionSuccessPrompt("Manager: Good Job! It seems you have learned to manage your time efficiently while operating through fast drone traffic! Congrats on finishing job #3. The next job will have increased difficulty as other drones will start moving at faster speeds.", "Job #4 has been unlocked");
                    })
                } else {
                    updatePackageDimensions(droneDimensionsCategory - 1);
                    GAME.missionSteps = GAME.missionSteps.remove(droffoffwindowNum);
                }
            }
            screenFadeIn();
            GAME.paused = false;
        },
        job4: function(){
            GAME.missionObjective = "You must deliver four packages to our customers on floors #2, #6, #12, and #15. To deliver a package, simply go near the dropoff window and wait for the delivering process to finish.";
            bringDroneToPickupPoint();
            GAME.deliveryTime = 120;
            GAME.missionRequirements["dropoff_1"] = "incomplete";
            GAME.missionRequirements["dropoff_2"] = "incomplete";
            GAME.missionRequirements["dropoff_3"] = "incomplete";
            GAME.missionRequirements["dropoff_4"] = "incomplete";
            disablePeerDrones();
            enablePeerDrones();
            clearInterval(GAME.missionTimer);
            var MissionInstance = randomString();
            GAME.missionInstance = MissionInstance;
            GAME.currentJob = "job4";
            GAME.missionLastStatus = "active";
            $("#currentJob").text("4");
            backgroundDroneSpeed = 10 * HSR;
            SPRITES.get("drone_package").visible = true;
            updatePackageDimensions(4);
            $("#job4").iziModal("close");
            enableUserMovement = true;
            backgroundDronesEngine = true;
            showUIButtons();
            showInfoPanel();
            GAME.countdown(40, function(timeRemaining, timer){
                GAME.missionTimer = timer;
                GAME.updateRemainingTime(timeRemaining);
            }, function(){
                if(MissionInstance == GAME.missionInstance){
                    GAME.checkMissionFailed();
                }
            })
            GAME.onPackageDelivery = function(droffoffwindowNum){
                if(GAME.missionRequirements["dropoff_1"] == "delivered" && GAME.missionRequirements["dropoff_2"] == "delivered" && GAME.missionRequirements["dropoff_3"] == "delivered" && GAME.missionRequirements["dropoff_4"] == "delivered"){
                    GAME.missionLastStatus = "complete";
                    GAME.jobs_status.job4 = "completed";
                    GAME.jobs_status.job5 = "unlocked";
                    clearInterval(GAME.missionTimer);
                    enableUserMovement = false;
                    backgroundDronesEngine = false;
                    GAME.updateMissionsUI();
                    GAME.nextUnlockedJob = "job5";
                    screenFadeOut();
                    setTimeout(function(){
                        throwMissionSuccessPrompt("Manager: Alright! You are almost done with your training! Congrats on finishing job #4. The next job will be very difficult! Many drone operators are sometimes burnedend with many orders and can crash their drones in an attempt to rush their deliveries. Lawsuits from individuals getting hurt by falling drones can affect your career. The next job will have increased difficulty as other drones will start moving at faster speeds.", "Job #5 has been unlocked");
                    })
                } else {
                    updatePackageDimensions(droneDimensionsCategory - 1);
                    GAME.missionSteps = GAME.missionSteps.remove(droffoffwindowNum);
                }
            }
            screenFadeIn();
            GAME.paused = false;
        },
        job5: function(){
            GAME.missionObjective = "You must deliver five packages to our customers on floors #2, #6, #12, #15, and #17. To deliver a package, simply go near the dropoff window and wait for the delivering process to finish.";
            bringDroneToPickupPoint();
            GAME.deliveryTime = 130;
            GAME.missionRequirements["dropoff_1"] = "incomplete";
            GAME.missionRequirements["dropoff_2"] = "incomplete";
            GAME.missionRequirements["dropoff_3"] = "incomplete";
            GAME.missionRequirements["dropoff_4"] = "incomplete";
            GAME.missionRequirements["dropoff_5"] = "incomplete";
            disablePeerDrones();
            enablePeerDrones();
            clearInterval(GAME.missionTimer);
            var MissionInstance = randomString();
            GAME.missionInstance = MissionInstance;
            GAME.currentJob = "job5";
            GAME.missionLastStatus = "active";
            $("#currentJob").text("5");
            backgroundDroneSpeed = 11 * HSR;
            SPRITES.get("drone_package").visible = true;
            updatePackageDimensions(5);
            $("#job5").iziModal("close");
            enableUserMovement = true;
            backgroundDronesEngine = true;
            showUIButtons();
            showInfoPanel();
            GAME.countdown(50, function(timeRemaining, timer){
                GAME.missionTimer = timer;
                GAME.updateRemainingTime(timeRemaining);
            }, function(){
                if(MissionInstance == GAME.missionInstance){
                    GAME.checkMissionFailed();
                }
            })
            GAME.onPackageDelivery = function(droffoffwindowNum){
                if(GAME.missionRequirements["dropoff_1"] == "delivered" && GAME.missionRequirements["dropoff_2"] == "delivered" && GAME.missionRequirements["dropoff_3"] == "delivered" && GAME.missionRequirements["dropoff_4"] == "delivered" && GAME.missionRequirements["dropoff_5"] == "delivered"){
                    GAME.missionLastStatus = "complete";
                    GAME.jobs_status.job5 = "completed";
                    clearInterval(GAME.missionTimer);
                    enableUserMovement = false;
                    backgroundDronesEngine = false;
                    GAME.updateMissionsUI();
                    screenFadeOut();
                    setTimeout(function(){
                        wonGame();
                    }, 1000)
                } else {
                    updatePackageDimensions(droneDimensionsCategory - 1);
                    GAME.missionSteps = GAME.missionSteps.remove(droffoffwindowNum);
                }
            }
            screenFadeIn();
            GAME.paused = false;
        }
    },
    updateRemainingTime: function(timeRemaining){
        var seconds = timeRemaining;
        var minutes = 0;
        if(timeRemaining > 60){
        var minutes = (timeRemaining - (timeRemaining % 60)) / 60;
        seconds = (timeRemaining % 60);
        }
        $("#time_minutes").text(minutes);
        $("#time_seconds").text(seconds);
    },
    countdown: function(seconds, callback1, callback2){
        var timeReminaing = seconds;
        if(seconds == 0){ return false; }
        var timer = setInterval(function(){
            if(!GAME.paused){
                callback1(timeReminaing, timer);
                timeReminaing--;
                if(timeReminaing == -1){
                    callback2();
                    clearInterval(timer);
                }
            }
        }, 1000)
    },
    checkMissionFailed: function(){
        if(GAME.missionLastStatus == "active"){
            screenFadeOut();
            setTimeout(function(){
                bringDroneToPickupPoint();
                GAME.missionLastStatus = "failed";
                enableUserMovement = false;
                backgroundDronesEngine = false;
                throwMissionFailPrompt("You failed to deliver the packages in the given time.");
                GAME.updateMissionsUI();
                GAME.missionInstance = "";
            }, 1000)
        }
    },
    updateMissionsUI: function(){
        for (var job in GAME.jobs_status) {
            var status = GAME.jobs_status[job];
            var jobEl = $("#" + job);
            if(status == "unlocked"){
                jobEl.find(".mission-disclaimer").find("strong").text("Complete this job to unlock the next job!");
                jobEl.find(".iziModal-header-subtitle").text("Unlocked");
                jobEl.find(".mission-disclaimer").css("color", "rgb(8, 174, 234)");
                jobEl.find(".missionUI-button").text("Start Job #" + job.replace("job", ""));
                jobEl.find(".missionUI-button").attr("class", "missionUI-button");
            } else if(status == "locked"){
                jobEl.find(".iziModal-header-subtitle").text("Locked");
                jobEl.find(".mission-disclaimer").find("strong").text("Please complete previous jobs to unlock this job!");
                jobEl.find(".mission-disclaimer").css("color", "red");
                jobEl.find(".missionUI-button").attr("class", "missionUI-button button-disabled");
                jobEl.find(".missionUI-button").text("LOCKED");
            } else if(status == "completed"){
                jobEl.find(".iziModal-header-subtitle").text("Completed");
                jobEl.find(".mission-disclaimer").find("strong").text("Congrats on successfully completing this job!");
                jobEl.find(".mission-disclaimer").css("color", "green");
                jobEl.find(".missionUI-button").attr("class", "missionUI-button button-disabled");
                jobEl.find(".missionUI-button").text("COMPLETED");
            }
        }
    },
    updateBuildingFloor: function(){
        var floor = Math.floor(((globalY - 255) / 420)) + 1;
        if(floor < 2){floor = "1st";
        } else if(floor == 2){floor = "2nd";
        } else if(floor == 3){floor = "3rd";
        } else {
            floor = floor + "th";
        }
        $("#buildingFloor").text(floor);
    }
}