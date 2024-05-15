### Game Documentation

#### 1. Introduction
This is a web-based two-player fighting game where one player is controlled using PoseNet for motion detection and the other via keyboard controls. This setup allows for engaging and interactive gameplay.

#### 2. Folder Structure and File Descriptions
```plaintext
img/
    keni/
        *.png          # Sprites for the character Keni
    samuraiMack/
        *.png          # Sprites for the character Samurai Mack
    background.png     # Background image for the game scene
    shop.png           # Image for the shop scene
js/
    ai.js              # AI logic for controlling the enemy character
    classes.js         # Classes defining the game objects and characters
    utils.js           # Utility functions for game management
index.html            # Main HTML document for the game
index.js              # Main JavaScript file for game initialization and loop
```

#### 3. Game Setup
##### **index.html**
The HTML file sets up the game environment, including a canvas for the game, video feed for PoseNet, and overlay elements like health bars and timers.
##### **index.js**
This script initializes the game, setting up the background, player, enemy, and game loop. It also handles the animation cycle and game state updates.

#### 4. Game Mechanics
##### **Player Control via PoseNet (ai.js)**
The `ai.js` file includes functions for setting up the camera, drawing keypoints and skeletons from PoseNet predictions, and classifying poses to simulate keyboard presses based on player movements.

```javascript
async function loadAndPredict() {
    const video = await setupCamera();
    video.play();
    const net = await posenet.load();
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    function detectPose() {
        net.estimateSinglePose(video, {flipHorizontal: false}).then((pose) => {
            drawPose(pose);
            classifyPose(pose);
        });
    }
    setInterval(detectPose, 100); // Continuously run detection every 100 milliseconds
}
```

##### **Keyboard Control for Enemy (index.js)**
The enemy is controlled via keyboard inputs, capturing key events to move and trigger actions for the enemy character.

```javascript
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowRight': // Handling right arrow key press
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft': // Handling left arrow key press
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp': // Handling up arrow key press for jumping
            if(enemy.prevVelocity.y > 18) {
                enemy.velocity.y = -20;
            }
            break;
        case 'ArrowDown': // Handling down arrow key press for attack
            enemy.attack();
            break;
    }
});
```

#### 5. AI and Gameplay (ai.js)
The AI uses PoseNet to detect the player's pose and classify it into game actions like moving left, right, jumping, and punching.

#### 6. Utilizing Game Assets (classes.js)
The `classes.js` file defines classes for sprites and characters, handling their initialization, animation, and updates within the game loop.

```javascript
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.offset = offset;
    }

    draw() {
        // Drawing logic here
    }

    update() {
        // Update logic here
    }
}
```

#### 7. Additional Features
The game includes features like a shop, different levels, and a dynamic health system, enhancing gameplay complexity and engagement.

#### 8. Challenges and Solutions
Integration of PoseNet with the traditional game loop was a primary challenge, requiring synchronization between asynchronous PoseNet predictions and the synchronous game update cycle.

#### 9. Conclusion
This game represents a fusion of traditional game mechanics with modern web-based machine learning, offering a unique and interactive gaming experience.

#### Appendices
##### A. Code Snippets
Includes the essential code snippets provided.
##### B. References
- TensorFlow.js PoseNet Model
- HTML5 Canvas API
- GSAP for animations

