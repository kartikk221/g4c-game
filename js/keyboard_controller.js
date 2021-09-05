function KeyboardController(value) {
    var key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    var downListener = key.downHandler.bind(key);
    var upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
}


// ESTABLISH ALL KEY HANDLERS

var wPressed = KeyboardController("w");
var aPressed = KeyboardController("a");
var sPressed = KeyboardController("s");
var dPressed = KeyboardController("d");
var UpArrowPressed = KeyboardController("ArrowUp");
var DownArrowPressed = KeyboardController("ArrowDown");
var LeftArrowPressed = KeyboardController("ArrowLeft");
var RightArrowPressed = KeyboardController("ArrowRight");