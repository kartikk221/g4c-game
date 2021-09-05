var pageLoad = {
    commands: [],
    assign: function(func){
        pageLoad.commands.push(func);
    },
    startTime: performance.now()
}

window.onload = function(){
    pageLoad.commands.forEach(function(func){
        func();
    })
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

function switchpage(url){
    $(".page-loader").fadeIn().promise().done(function(){
        location.href = url;
    })
}

function API(m,d,c){
if(d instanceof Object == false){return 'The data must be in Javascript Object form. For Example: {"someData":"someValue"}';}
d.method = m;
$.ajax({
	type:"POST",
	url:"api/index.php",
	data: d
}).done(function(response){if(c){c(response);}})
}

function isComputer(){
return !( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));	
}

function onButtonClick(id,callback){
$(id).click(function() {
	callback($(id)); // GIVING A REFERENCE FOR FUTURE USE
});	
}

/* pageLoad.assign(function(){
    if(performance.now() - pageLoad.startTime < 1000){
        setTimeout(function(){
            $(".page-loader").fadeOut(1000);
        }, 1000)
    }
    else
    {
    $(".page-loader").fadeOut("slow");
    }
});

*/