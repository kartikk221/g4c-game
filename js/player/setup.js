var supportedGraphics = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    supportedGraphics = "canvas"
}
// DECIDE UPON THE SUPPORTED GRAPHICS METHOD

function MusicEngine(source,volume,loop)
{
    this.source=source;
    this.volume=volume;
    this.loop=loop;
    var son;
    this.son=son;
    this.finish=false;
    this.stop=function()
    {
        document.body.removeChild(this.son);
    }
    this.start=function()
    {
        if(this.finish)return false;
        this.son=document.createElement("embed");
        this.son.setAttribute("src",this.source);
        this.son.setAttribute("hidden","true");
        this.son.setAttribute("volume",this.volume);
        this.son.setAttribute("autostart","true");
        this.son.setAttribute("loop",this.loop);
        document.body.appendChild(this.son);
    }
    this.remove=function()
    {
        document.body.removeChild(this.son);
        this.finish=true;
    }
    this.init=function(volume,loop)
    {
        this.finish=false;
        this.volume=volume;
        this.loop=loop;
    }
}

var backgroundMusic = new MusicEngine("/g4c_game/background_music.mp3", 20 ,true);

var app = new PIXI.Application({
    width: innerWidth, 
    height: innerHeight
});

var Physics = new Bump();


app.renderer.backgroundColor = 0x000000;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
document.body.appendChild(app.view);

function enableEssentialWorldEngines(){
  ActivateMovementEngine();
  ActivatePositioningEngine();
  bringDroneToPickupPoint();
  enablePositioningEngine = true;
  enableBackgroundClouds();
  costumeEngine = true;
  backgroundDronesEngine = true;
}

function establishMissionHandlers(){
  onButtonClick("#controls_finished", function(btn){
      $("#controls").iziModal("close");
      enableEssentialWorldEngines();
      screenFadeIn();
      missionsCloseButton("disable");
      GAME.updateMissionsUI();
      $("#job1").iziModal("open");
  });

  ["1","2","3","4","5"].forEach(function(num){
    onButtonClick("#start_job_" + num, function(btn){
      if(GAME.jobs_status["job" + num] == "unlocked"){
        if(GAME.missionLastStatus == "active"){
          $("#" + GAME.currentJob).iziModal("close");
          restartMission();
        } else {
          GAME.mission_setup["job" + num]();
        }
      }
    });
  })

  onButtonClick("#view_jobs", function(btn){
    $("#mission_failed").iziModal("close");
    missionsCloseButton("disable");
    $("#" + GAME.currentJob).iziModal("open");
  });

  onButtonClick("#view_jobs_success", function(btn){
    $("#mission_success").iziModal("close");
    missionsCloseButton("disable");
    $("#" + GAME.nextUnlockedJob).iziModal("open");
  });

  onButtonClick("#objective_understood", function(btn){
    $("#mission_objective").iziModal("close");
  });
}

function loadingDone(){

    $("#controls").iziModal({
      width: app.screen.width * 0.60,
      radius: 5,
      padding: 20,
      overlayClose: false,
      overlayColor: 'rgba(0,0,0,0.9)',
      closeButton: false,
      headerColor: '#08AEEA'
    });

    $("#mission_failed").iziModal({
      width: app.screen.width * 0.70,
      radius: 5,
      padding: 20,
      overlayClose: false,
      overlayColor: 'rgba(0,0,0,0.9)',
      closeButton: false,
      headerColor: '#bd5b5b'
    });

    $("#mission_success").iziModal({
      width: app.screen.width * 0.70,
      radius: 5,
      padding: 20,
      overlayClose: false,
      overlayColor: 'rgba(0,0,0,0.9)',
      closeButton: false,
      headerColor: '#84fab0'
    });

    $("#mission_objective").iziModal({
      width: app.screen.width * 0.60,
      radius: 5,
      padding: 20,
      overlayClose: true,
      overlayColor: 'rgba(0,0,0,0.9)',
      closeButton: true,
      headerColor: '#08AEEA',
      onClosed: function(){GAME.paused = false;}
    });

    missionsCloseButton("disable");

    $('.iziModal').each(function(el){
      $(this).find('.iziModal-header-title').css("font-size", (35 * HSR) + "px");
      $(this).find('.iziModal-header-subtitle').css("font-size", (28 * HSR) + "px");
    })

    app.stage.transform.pivot.x = -app.screen.width / 2;
    app.stage.transform.pivot.y = -app.screen.height / 2;
    $(".page-loader").fadeOut("slow").promise().done(function(){
      beginNewGame();
      establishMissionHandlers();
    })
}

PIXI.loader
  .add(urltoNativeDirectory("images/background.png"))
  .add(urltoNativeDirectory("images/building_bottom.png"))
  .add(urltoNativeDirectory("images/building_middle_1.png"))
  .add(urltoNativeDirectory("images/building_middle_2.png"))
  .add(urltoNativeDirectory("images/building_middle_3.png"))
  .add(urltoNativeDirectory("images/building_top.png"))
  .add(urltoNativeDirectory("images/building_dropoff.png"))
  .add(urltoNativeDirectory("images/cloud_1.png"))
  .add(urltoNativeDirectory("images/cloud_2.png"))
  .add(urltoNativeDirectory("images/cloud_3.png"))
  .add(urltoNativeDirectory("images/cloud_4.png"))
  .add(urltoNativeDirectory("images/cloud_5.png"))
  .add(urltoNativeDirectory("images/drone.png"))
  .add(urltoNativeDirectory("images/drone_package.png"))
  .add(urltoNativeDirectory("images/drone_1_1.png"))
  .add(urltoNativeDirectory("images/drone_1_2.png"))
  .add(urltoNativeDirectory("images/drone_2_1.png"))
  .add(urltoNativeDirectory("images/drone_2_2.png"))
  .add(urltoNativeDirectory("images/status_delivering.png"))
  .load(loadingDone)
// PRE LOAD ALL SPRITES HERE FOR EASIER INTERFACE LATER