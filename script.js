// script.js

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var rightPressed = false;
var leftPressed = false;

// Player object with image and animation properties
var player = {
  width: 48, // The width of a single frame
  height: 48, // The height of the sprite image
  x: canvas.width / 2 - 24, // Centered on canvas initially
  y: canvas.height - 70, // Positioned above the bottom of the canvas
  speed: 5, // Pixels to move per key press
  frameIndex: 0, // Current frame
  tickCount: 0, // Counts the number of updates since last frame change
  ticksPerFrame: 30, // Updates per frame for animation speed control
  numFrames: 6, // Total number of frames in the sprite sheet
  image: new Image(), // Player character image
  imageIdle: new Image(),
  imageRun: new Image(),
  facingLeft: false,
  frameIndexIdle: 0, // Current frame for idle
  numFramesIdle: 4, // Total number of frames in the idle sprite sheet

  animation: 'idle', // Current animation type
  facingLeft: false,

  updateFrame: function() {
    this.tickCount += 1;
   // Check the animation type to determine which frame index and count to update
   if (this.animation === 'run') {
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      if (this.frameIndex < this.numFrames - 1) { 
        this.frameIndex += 1; 
      } else { 
        this.frameIndex = 0;
      }
    }
  } else if (this.animation === 'idle') {
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      if (this.frameIndexIdle < this.numFramesIdle - 1) { 
        this.frameIndexIdle += 1; 
      } else { 
        this.frameIndexIdle = 0;
      }
    }
  }
},

  move: function() {
    if (rightPressed && this.x < canvas.width - this.width) {
      this.x += this.speed;
    }
    if (leftPressed && this.x > 0) {
      this.x -= this.speed;
    }
    if (rightPressed || leftPressed) {
        this.animation = 'run';
      } else {
        this.animation = 'idle';
      }
  }
};

// Load player image
player.image.src = 'images/1 Biker/Biker_run.png'; // Set the source path to the sprite sheet
player.imageIdle.src = 'images/1 Biker/Biker_idle.png';
player.imageRun.src = 'images/1 Biker/Biker_run.png';

// Handles the pressing of the keys
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      leftPressed = true;
    }
  }
  
// Handles the releasing of the keys
function keyUpHandler(e) {
if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    rightPressed = false;
} else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    leftPressed = false;
}
}
  

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Function to draw the ground
function drawGround() {
    var groundHeight = 20; // Height of the ground from the bottom
    ctx.beginPath();
    ctx.rect(0, canvas.height - groundHeight, canvas.width, groundHeight);
    ctx.fillStyle = '#000000'; // Color of the ground
    ctx.fill(); // Draw the filled ground
}

// Function to draw the player image
function drawPlayer() {
    // Update the frame based on the animation
    player.updateFrame();
  
    // Clear a larger area to accommodate the scaled up player size
    //ctx.clearRect(player.x, player.y, player.width * 2, player.height * 2);
  
    // Choose the correct image and frame index for the current animation
    var imageToDraw = player.animation === 'run' ? player.imageRun : player.imageIdle;
    var frameIndex = player.animation === 'run' ? player.frameIndex : player.frameIndexIdle;
  
    // Set scale factor
    var scaleFactor = 2; // Change this to scale the character up or down
  
    // Calculate the scaled width and height
    var scaledWidth = player.width * scaleFactor;
    var scaledHeight = player.height * scaleFactor;
    
    var groundHeight = 20; // Height of the ground from the bottom of the canvas
    player.y = canvas.height - groundHeight - scaledHeight;

    // Flip the canvas context if the player is moving left
    if (leftPressed) {
      ctx.save(); // Save the current state
      ctx.scale(-1, 1); // Scale -1 on the x-axis to flip horizontally
  
      ctx.drawImage(
        imageToDraw,
        frameIndex * player.width, // Source x
        0, // Source y
        player.width, // Source width
        player.height, // Source height
        -(player.x + scaledWidth), // Destination x, adjusted for scaling
        player.y, // Destination y
        scaledWidth, // Scaled destination width
        scaledHeight // Scaled destination height
      );
      ctx.restore(); // Restore to the original state
    } else {
      // Draw the image normally if moving right or idle
      ctx.drawImage(
        imageToDraw,
        frameIndex * player.width, // Source x
        0, // Source y
        player.width, // Source width
        player.height, // Source height
        player.x, // Destination x
        player.y, // Destination y
        scaledWidth, // Scaled destination width
        scaledHeight // Scaled destination height
      );
    }
  }
  

// Function to draw the entire game frame
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the background image
    drawGround(); // Draw the ground
    player.move(); // Move player if keys are pressed
    player.updateFrame(); // Update the player's animation frame
    drawPlayer(); // Draw the player with the current animation frame
    requestAnimationFrame(draw); // Keep updating the game at the next frame
  }

var img = new Image(); // Create new img element
img.onload = function() {
  draw(); // Start the game loop once the image is loaded
};
img.src = 'images/citybg.png'; // Set the source of the background image

// Start the game loop when the window loads
window.onload = function() {
  if (canvas.getContext) {
    draw(); // Call draw to render the initial state of the game
  }
};
