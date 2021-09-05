function getBrowser() {
    if( navigator.userAgent.indexOf("Chrome") != -1 ) {
      return "Chrome";
    } else if( navigator.userAgent.indexOf("Opera") != -1 ) {
      return "Opera";
    } else if( navigator.userAgent.indexOf("MSIE") != -1 ) {
      return "IE";
    } else if( navigator.userAgent.indexOf("Firefox") != -1 ) {
      return "Firefox";
    } else {
      return "unknown";
    }
}

pageLoad.assign(function(){
    if(performance.now() - pageLoad.startTime < 1000){
        setTimeout(function(){
            $(".page-loader").fadeOut(1000);
        }, 1000)
    }
    else
    {
    $(".page-loader").fadeOut("slow");
    }
    
    onButtonClick("#start_game", function(){
        var userBrowser = getBrowser();
        if(userBrowser == "IE"){
            alert("We are sorry, but due to your browser Internet Explorer being outdated, SwiftScale will not be able to run on this browser. Please utilize Google Chrome for the best experience. Other supported browsersinclude Mozilla Firefox and Opera.");
            return false;
        }
        if(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){
            alert("We are sorry, but due to your browser Safari being outdated, SwiftScale will not be able to run on this browser. Please utilize Google Chrome for the best experience. Other supported browsers include Mozilla Firefox and Opera.");
            return false;
        }
        switchpage("/g4c_game/player");
    })
    
})