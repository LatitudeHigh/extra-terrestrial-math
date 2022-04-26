var State = {
    INIT_INTRO: 0,
    PLAY_INTRO: 1,
    MENU: 2,
    PLAY: 3,
};

var gameState = State.INIT_INTRO;

var objectMap;

//learn about Object.keys() here: https://stackoverflow.com/questions/5223/length-of-a-javascript-object
                                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
var NUM_IMAGES = 3; //number of images in objectMap.
var numLoadedImages = 0;
var loaded = false; //true when all of the web images in the game are loaded

//click variables
var clickableObjects = [];
var clickCallbackFunctions = [];

var MOVE_SPEED = 2;

function playGame(){
   
}
function start(){
    
}


//loads all of the web images in objectMap
function loadImages()
{
    objectMap = {
        title: new WebImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpefmp_9mjNYZo60rUr4hDUtcdXKL7_1akA&usqp=CAU"),
        ship: new WebImage("https://www.clipartmax.com/png/middle/2-20463_cartoon-rocket-ship-clipart-rocket-clipart.png"),
        playButton : new WebImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAMdpXAZ4d7VJRDC3RUo_v6qT6vCU1ESJ2hw&usqp=CAU")
    }

    objectMap.title.loaded(loadedCallback);
    objectMap.ship.loaded(loadedCallback);
    objectMap.playButton.loaded(loadedCallback);
    
    
    console.log("Loading Images . . .");
    loaded = true;
    setTimer(gameManager, 20);
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
        setTimer(gameManager, 20);
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
    console.log("Init intro");
    removeAll();
    
    setPositionCentered(objectMap.title, getWidth() / 2, -100);
    setPositionCentered(objectMap.playButton, getWidth() / 2, getHeight() + 100);
    
    add(objectMap.title);
    add(objectMap.playButton);
    
    addClickableObject(
        objectMap.playButton, 
        function() { 
            gameState = State.PLAY;
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

function moveShip()
{
    var moveX = 0;
    var moveY = 0;
    
    if(isKeyPressed(Keyboard.LEFT)) moveX -= MOVE_SPEED;
    if(isKeyPressed(Keyboard.RIGHT)) moveX += MOVE_SPEED;
    if(isKeyPressed(Keyboard.UP)) moveY -= MOVE_SPEED;
    if(isKeyPressed(Keyboard.DOWN)) moveY += MOVE_SPEED;
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