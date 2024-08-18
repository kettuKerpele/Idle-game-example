let clickCount = 0;
let automaticCount = 0;

let sBtn = document.getElementById("mouseMine");
sBtn.addEventListener(event, clickMine);

let expBtn = document.getElementById("exp");
expBtn.addEventListener(event, blow);

window.setInterval(function(){
  autoCount();
  power();
}, 500);

function autoCount() {
  automaticCount += 1;
  document.getElementById("scores").innerHTML = "Crystals: " + automaticCount;
}

function power() {
  if (automaticCount < 500) {
     document.getElementById("percent").innerHTML = "Manual power: 1";
     document.getElementById("gameInfo").innerHTML = "Collect 500 crystals to upgrade";
     document.getElementById("autoBonus").innerHTML = "Auto mining power: 1";
  }
   if (automaticCount > 500) {
     document.getElementById("percent").innerHTML = "Manual power: +5";
     document.getElementById("gameInfo").innerHTML = "Collect 2500 crystals to upgrade";
     document.getElementById("autoBonus").innerHTML = "Auto mining power: +2";
     automaticCount += 1;   //klikkaus ekstra teho
  }
  if (automaticCount > 2500) {
     document.getElementById("percent").innerHTML = "Manual power: +10";
     document.getElementById("gameInfo").innerHTML = "Collect 5000 crystals to upgrade";
     automaticCount += 1;	
     document.getElementById("autoBonus").innerHTML = "Auto mining power: +3";
  }
  if (automaticCount > 5000) {
     document.getElementById("percent").innerHTML = "Manual power: +15";
     document.getElementById("gameInfo").innerHTML = "Demo-pelin toiminnot päättyy tähän";  
  }
}

function clickMine() {
  automaticCount ++;
  clickCount ++;
  bonus();
  document.getElementById("scores").innerHTML = "Crystals: " + automaticCount;
   
  if (automaticCount > 500) {
     automaticCount += 5;
     document.getElementById("scores").innerHTML = "Crystals: " + automaticCount;
  }
  if (automaticCount > 2500) {
     automaticCount += 5;
     document.getElementById("scores").innerHTML = "Crystals: " + automaticCount;
  }
  if (automaticCount > 5000) {
     automaticCount += 5;
     document.getElementById("scores").innerHTML = "Crystals: " + automaticCount;
  }
}

function bonus() {
  if (clickCount == 100) {
     automaticCount += 20;
     document.getElementById("gameInfo").innerHTML = "Bonus +20";
  }
  if (clickCount == 500) {
     automaticCount += 20;
     document.getElementById("gameInfo").innerHTML = "Bonus +20";
  }
  if (clickCount == 1000) {
     automaticCount += 20;
     document.getElementById("gameInfo").innerHTML = "Bonus +20";
  }
}

var drill, drill2, drillBlade;
var engine;
var hydraul;
var hitHammer;
var tnt;
function startGame() {
    engine = new sound("engine.mp3");
    hydraul = new sound("hydraulic.mp3");
    hitHammer = new sound("hammer.mp3");
    tnt = new sound("tnt.mp3");
    drillBlade = new component(10, 60, "#6b6b6e", 365, 300);
    drill = new component(40, 500, "#1e1e21", 350, -700);
    drill2 = new component(50, 20, "#1e1e21", 345, 300);
    engine.play();
    gameArea.start();
}
var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 700;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval);
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("none", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function() {
        engine.play();
        ctxx = gameArea.context;
	ctxx.beginPath();
	ctxx.moveTo(0, 0);
	ctxx.lineTo(30, 480); 
	ctxx.lineTo(670, 480)
	ctxx.lineTo(700, 0)
	ctxx.lineWidth = 15;
	ctxx.strokeStyle = "#b57e0e";
	ctxx.stroke();
	ctxx.beginPath();
	ctxx.moveTo(5, -5);
	ctxx.lineTo(35, 470);
	ctxx.lineTo(665, 470)
	ctxx.lineTo(695, -5)
	ctxx.lineWidth = 5;
	ctxx.strokeStyle = "#434347";
	ctxx.stroke();
	ctxx.beginPath();
	ctxx.moveTo(0, 500);
	ctxx.lineTo(30, 485);
	ctxx.lineTo(669, 485)
	ctxx.lineTo(700, 500)
	ctxx.lineWidth = 20;
	ctxx.strokeStyle = "#b57e0e";
	ctxx.stroke();
        ctxx.fillStyle = color;
        ctxx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.maxDepth();
        this.maxHeight();
        this.hittingWallright();
        this.hittingWallLeft();       
    }
    this.maxDepth = function() {
        var bottom = gameArea.canvas.height - 65;//105
        if (this.y > bottom) {
            this.y = bottom;
            drill.speedY = 0;
            drill2.speedY = 0;
            drillBlade.speedY = 0;
            hydraul.stop();
            hitHammer.play();
            drillAction();
    }
    this.maxHeight = function() {
        var top = gameArea.canvas.height - 680;
        if (this.y < top) {
            this.y = top;
            drill.speedY = 0;
            drill2.speedY = 0;
            drillBlade.speedY = 0;
            hydraul.stop();
	    }
    }
    this.hittingWallright = function() {
        var hitWallr = gameArea.canvas.width - 60;
	if (this.x > hitWallr) {
            this.x = hitWallr;
	    drill.speedX = 0;
            drill2.speedX = 0;
            drillBlade.speedX = 0;
            hydraul.stop();    
	    }
    }
    this.hittingWallLeft = function() {
	var areaSize = gameArea.canvas.width;
	var areaSize = 1;
        var hitLeft = areaSize + 40;	
	if (this.x < hitLeft) {
            this.x = hitLeft;
	    drill.speedX = 0;
            drill2.speedX = 0;
            drillBlade.speedX = 0;
            hydraul.stop();   
	    }  
      } 
   }
}

function updateGameArea() {
    gameArea.clear();
    drillBlade.newPos();
    drill2.newPos();
    drill.newPos();
    drillBlade.update();
    drill2.update();
    drill.update();
    text();    
}

function moveup() {
    drill.speedY = -1;
    drill2.speedY = -1;
    drillBlade.speedY = -1;
    hydraul.play();
}

function movedown() {
    drill.speedY = 1;
    drill2.speedY = 1;
    drillBlade.speedY = 1;
    hydraul.play();
}

function moveleft() {
    drill.speedX = -1;
    drill2.speedX = -1;
    drillBlade.speedX = -1;
    hydraul.play();   
}

function moveright() {
    drill.speedX = 1;
    drill2.speedX = 1;
    drillBlade.speedX = 1;
    hydraul.play();       
}

function clearmove() {
    drill.speedX = 0; 
    drill.speedY = 0;
    drill2.speedX = 0; 
    drill2.speedY = 0;
    drillBlade.speedX = 0; 
    drillBlade.speedY = 0;
    hydraul.stop();    
}

function text() {
  ctxx.font = "16px Impact";
  ctxx.fillStyle = "white";
  ctxx.fillText("Drill master 4000",50,492);
}

function drillAction() {
  automaticCount += 10;
}

function blow() {
  if (automaticCount < 100) {
     automaticCount += 5;
     tnt.play();
  } else {
     automaticCount += 10;
     tnt.play();
  }
}


//alla lainattu koodi

let snowflakes = [];

  // Global variables to store our browser's window size
  let browserWidth;
  let browserHeight;

  // Specify the number of snowflakes you want visible
  let numberOfSnowflakes = 50;

  // Flag to reset the position of the snowflakes
  let resetPosition = false;

  // Handle accessibility
  let enableAnimations = false;
  let reduceMotionQuery = matchMedia("(prefers-reduced-motion)");

  // Handle animation accessibility preferences
  function setAccessibilityState() {
    if (reduceMotionQuery.matches) {
      enableAnimations = false;
    } else {
      enableAnimations = true;
    }
  }
  setAccessibilityState();

  reduceMotionQuery.addListener(setAccessibilityState);

  //
  // It all starts here...
  //
  function setup() {
    if (enableAnimations) {
      window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
      window.addEventListener("resize", setResetFlag, false);
    }
  }
  setup();

  //
  // Constructor for our Snowflake object
  //
  class Snowflake {
    constructor(element, speed, xPos, yPos) {
      // set initial snowflake properties
      this.element = element;
      this.speed = speed;
      this.xPos = xPos;
      this.yPos = yPos;
      this.scale = 1;

      // declare variables used for snowflake's motion
      this.counter = 0;
      this.sign = Math.random() < 0.5 ? 1 : -1;

      // setting an initial opacity and size for our snowflake
      this.element.style.opacity = (0.1 + Math.random()) / 2;
    }

    // The function responsible for actually moving our snowflake
    update(delta) {
      // using some trigonometry to determine our x and y position
      this.counter += (this.speed / 5000) * delta;
      this.xPos += (this.sign * delta * this.speed * Math.cos(this.counter)) / 40;
      this.yPos += Math.sin(this.counter) / 40 + (this.speed * delta) / 30;
      this.scale = 0.5 + Math.abs((10 * Math.cos(this.counter)) / 20);

      // setting our snowflake's position
      setTransform(
        Math.round(this.xPos),
        Math.round(this.yPos),
        this.scale,
        this.element
      );

      // if snowflake goes below the browser window, move it back to the top
      if (this.yPos > browserHeight) {
        this.yPos = -50;
      }
    }
  }

  //
  // A performant way to set your snowflake's position and size
  //
  function setTransform(xPos, yPos, scale, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) scale(${scale}, ${scale})`;
  }

  //
  // The function responsible for creating the snowflake
  //
  function generateSnowflakes() {
    // get our snowflake element from the DOM and store it
    let originalSnowflake = document.querySelector(".snowflake");

    // access our snowflake element's parent container
    let snowflakeContainer = originalSnowflake.parentNode;
    snowflakeContainer.style.display = "block";

    // get our browser's size
    browserWidth = document.documentElement.clientWidth;
    browserHeight = document.documentElement.clientHeight;

    // create each individual snowflake
    for (let i = 0; i < numberOfSnowflakes; i++) {
      // clone our original snowflake and add it to snowflakeContainer
      let snowflakeClone = originalSnowflake.cloneNode(true);
      snowflakeContainer.appendChild(snowflakeClone);

      // set our snowflake's initial position and related properties
      let initialXPos = getPosition(50, browserWidth);
      let initialYPos = getPosition(50, browserHeight);
      let speed = (5 + Math.random() * 40) * delta;

      // create our Snowflake object
      let snowflakeObject = new Snowflake(
        snowflakeClone,
        speed,
        initialXPos,
        initialYPos
      );
      snowflakes.push(snowflakeObject);
    }

    // remove the original snowflake because we no longer need it visible
    snowflakeContainer.removeChild(originalSnowflake);

    requestAnimationFrame(moveSnowflakes);
  }

  //
  // Responsible for moving each snowflake by calling its update function
  //
  let frames_per_second = 60;
  let frame_interval = 1000 / frames_per_second;

  let previousTime = performance.now();
  let delta = 1;

  function moveSnowflakes(currentTime) {
    delta = (currentTime - previousTime) / frame_interval;

    if (enableAnimations) {
      for (let i = 0; i < snowflakes.length; i++) {
        let snowflake = snowflakes[i];
        snowflake.update(delta);
      }
    }

    previousTime = currentTime;

    // Reset the position of all the snowflakes to a new value
    if (resetPosition) {
      browserWidth = document.documentElement.clientWidth;
      browserHeight = document.documentElement.clientHeight;

      for (let i = 0; i < snowflakes.length; i++) {
        let snowflake = snowflakes[i];

        snowflake.xPos = getPosition(50, browserWidth);
        snowflake.yPos = getPosition(50, browserHeight);
      }

      resetPosition = false;
    }

    requestAnimationFrame(moveSnowflakes);
  }

  //
  // This function returns a number between (maximum - offset) and (maximum + offset)
  //
  function getPosition(offset, size) {
    return Math.round(-1 * offset + Math.random() * (size + 2 * offset));
  }

  //
  // Trigger a reset of all the snowflakes' positions
  //
  function setResetFlag(e) {
    resetPosition = true;
  }













