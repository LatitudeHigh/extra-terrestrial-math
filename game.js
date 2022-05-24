var State = {
    INIT_INTRO: 0,
    PLAY_INTRO: 1,
    MENU: 2,
    PLAY: 3,
};

var gameState = State.INIT_INTRO;

var objectMap;
var rotationSpeed =  0.2;
var speed = 0;


//learn about Object.keys() here: https://stackoverflow.com/questions/5223/length-of-a-javascript-object
                                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
var NUM_IMAGES = 3; //number of images in objectMap.
var numLoadedImages = 0;
var loaded = false; //true when all of the web images in the game are loaded

//click variables
var clickableObjects = [];
var clickCallbackFunctions = [];

var MOVE_SPEED = 2;
var meteorVX = 8;
var meteorVY = 4;

function playGame(){  
    moveShip();
    collide();
    moveMeteor();
    moveMeteor2();
}
// function math(){
//     if( collide == true){
//         var firstNum = Randomizer.nextInt(0,50);
//         var secondNum = Randomizer.nextInt(0,50);
        
//     }
// }
function start() 
{
    mouseClickMethod(clickHandler); //clickHandler will be called when the mouse is clicked
    setBackgroundColor(Color.BLACK);
    loadImages();
}


function collide (){
    console.log(objectMap.meteor);
    var shipX = objectMap.ship.getX();
    var shipY = objectMap.ship.getY();
    if(objectMap.meteor.containsPoint(shipX, shipY))
    {
        console.log("middle");
        crash();
    }
}
function crash(){
    remove(objectMap.meteor);
    remove(objectMap.meteor2)
    remove(objectMap.ship)
    add(objectMap.boom);
    math;
}

//loads all of the web images in objectMap
function loadImages()
{
    objectMap = {
        title: new WebImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpefmp_9mjNYZo60rUr4hDUtcdXKL7_1akA&usqp=CAU"),
        ship: new WebImage("https://cdn.pixabay.com/photo/2017/06/25/22/00/rocket-2442125_960_720.png"),
        playButton : new WebImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyxquXU-SY5qNkXhtg6YK61Uabi_qttEm-Iw&usqp=CAU"),
        meteor  : new WebImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx3BaMusudcsynKw7KLM0QM1WXa56rGeCOXw&usqp=CAU"),
        meteor2  : new WebImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx3BaMusudcsynKw7KLM0QM1WXa56rGeCOXw&usqp=CAU"),
 
      boom : new WebImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2X0qQIap8M5N2a9TfWbcSHwEMnEk_XXPFUQ&usqp=CAU")

        
    }
    objectMap.ship.setSize(getWidth()/20, getHeight()/10)

    objectMap.boom.setPosition(100, 100);
    objectMap.meteor.setSize(getWidth()/5,getHeight() / 5)
    objectMap.title.loaded(loadedCallback);
    objectMap.ship.loaded(loadedCallback);
    objectMap.playButton.loaded(loadedCallback);
    
    console.log("Loading Images . . .");
    loaded = true;
    setTimer(gameManager, 50);
}

//called when a WebImage is loaded. If all the images are loaded, it will start the game
function loadedCallback()
{
    numLoadedImages++;
    console.log(numLoadedImages + " image(s) loaded");
    
    if(numLoadedImages >= NUM_IMAGES && !loaded)
    {
        console.log("Load Success!");
        loaded = true;
    }
}

//main function to organize which part of the game is run based on gameState
function gameManager()
{
    switch(gameState)
    {
        case State.INIT_INTRO:
            initIntro();
            break;
            
        case State.PLAY_INTRO:
            playIntro();
            break;
            
        case State.MENU:
            break;

        case State.PLAY:
            playGame();
            break;
    }
}

//initialize all of the objects used in the intro and add them onto the sceen
function initIntro()
{
    removeAll();
    
    setPositionCentered(objectMap.title, getWidth() / 2, -100);
    setPositionCentered(objectMap.playButton, getWidth() / 2, getHeight() + 100);
    
    add(objectMap.title);
    add(objectMap.playButton);
    
    addClickableObject(
        objectMap.playButton, 
        function() { 
            remove(objectMap.playButton);
            remove(objectMap.title);
            gameState = State.PLAY;
            objectMap.ship.setPosition(
              (getWidth() - objectMap.ship.getWidth()) / 2,
              (getHeight() - objectMap.ship.getHeight()) / 2,
            )
            add(objectMap.meteor);
            add(objectMap.ship);
        }
    );
    
    gameState = State.PLAY_INTRO;
}



//move the game title and play button onto the screen
function playIntro()
{
    console.log("Playing Intro")
    var finished = true;
    
    finished = moveTowards(objectMap.title, getWidth() / 2, 100) && finished;
    finished = finished && moveTowards(objectMap.playButton, getWidth() / 2, getHeight() - 150) ;
    
    if(finished)
    {
        console.log("Done")
        gameState = State.MENU;
    }
}

function moveMeteor() {
  objectMap.meteor.move(meteorVX,meteorVY);
  var meteorX = objectMap.meteor.getX();
  var meteorY = objectMap.meteor.getY();
  var meteorWidth = objectMap.meteor.getWidth();
  var meteorHeight = objectMap.meteor.getHeight();
  
  if(meteorX < 0 || meteorX + meteorWidth > getWidth()) {
      meteorVX = -meteorVX;
  }
  if (meteorY < 0 || meteorY + meteorHeight > getHeight()) {
      meteorVY = -meteorVY;
  }
}

function moveMeteor2() {
  objectMap.meteor2.move(meteorVX,meteorVY);
  var meteorX = objectMap.meteor2.getX();
  var meteorY = objectMap.meteor2.getY();
  var meteorWidth = objectMap.meteor2.getWidth();
  var meteorHeight = objectMap.meteor2.getHeight();
  
  if(meteorX < 0 || meteorX + meteorWidth > getWidth()) {
      meteorVX = -meteorVX;
  }
  if (meteorY < 0 || meteorY + meteorHeight > getHeight()) {
      meteorVY = -meteorVY;
  }
}

function moveShip()
{
    var theta = objectMap.ship.rotation;
    if(isKeyPressed(Keyboard.LEFT)) rotationSpeed-= 5;
    if(isKeyPressed(Keyboard.RIGHT)) rotationSpeed+=5;
    if(isKeyPressed(Keyboard.UP)) speed -= MOVE_SPEED;
    if(isKeyPressed(Keyboard.DOWN)) speed += MOVE_SPEED;

    var shipX = objectMap.ship.getX();
    var shipY = objectMap.ship.getY();
    var shipWidth = objectMap.ship.getWidth();
    var shipHeight = objectMap.ship.getHeight();

    var dx = -Math.sin(theta) * speed;
    var dy = Math.cos(theta) * speed;
    
    if(shipX < 0 && shipX && dx < 0) {
        dx = 0;
    }
    if (shipX + shipWidth > getWidth() && dx > 0) {
        dx = 0;
    }
    if(shipY < 0 && dy < 0){
        dy = 0;
    }
    if (shipY + shipHeight > getHeight() && dy > 0) {
        dy = 0;
    }
    
    objectMap.ship.move(dx, dy);
    objectMap.ship.setRotation(theta + rotationSpeed);
}

//make no objects clickable
function clearClickableObjects()
{
    clickableObjects = [];
    clickCallbackFunctions = [];
}

//make the given object clickable (can be a shape or WebImage).
//the callback function will be called when that object is clicked
function addClickableObject(shape, callbackFunction)
{
    clickableObjects.push(shape);
    clickCallbackFunctions.push(callbackFunction);
}

//Function called on mouse clicks to make objects clickable
function clickHandler(e)
{
    for(var i = 0; i < clickableObjects.length; i++)
    {
        //this goes through the array of clickable objects and checks if the click
        //is within the bounds of each
        if(clickableObjects[i].containsPoint(e.getX(), e.getY()))
        {
            //if the click is within the bounds of the clickable object, run the
            //callback function associated with that object
            clickCallbackFunctions[i]();
            break;
        }
    }
}

//Sets the position of shape or WebImage with its center at the given coordinates
function setPositionCentered(shape, x, y)
{
    shape.setPosition(x - shape.getWidth() / 2, y - shape.getHeight() / 2);
}

//smoothly move an object towards the target position. If centered is true, the
//middle of the shape will be at the target position. Note: with circles, centered
//can be false since they are already centered
function moveTowards(shape, targetX, targetY, centered = true)
{
    if(centered)
    {
        targetX -= shape.getWidth() / 2;
        targetY -= shape.getHeight() / 2;
    }
    
    var distX = targetX - shape.getX();
    var distY = targetY - shape.getY();
    
    shape.move(distX / 10, distY / 10);
    
    if(getDistance(shape.getX(), shape.getY(), targetX, targetY) < 1)
    {
        shape.setPosition(targetX, targetY);
        return true;
    }
    
    return false;
}

//return the distance between the two given points
function getDistance(x1, y1, x2, y2)
{
    var distX = x1 - x2;
    var distY = y1 - y2;
    
    return Math.sqrt(distX * distX + distY * distY);
}