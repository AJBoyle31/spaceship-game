//The full game without any states

var game = new Phaser.Game(1024, 576, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });


function preload() {
    //game.load.spritesheet('ship', 'res/spaceship.png', 160, 85, 2); //this needs to be changed to an atlas and not spritesheet
    game.load.atlas('ship', 'assets/spaceship.png', 'assets/spaceship.json');
    game.load.spritesheet('shot', 'assets/shot_85x50.png', 85, 50, 2);
    game.load.spritesheet('asteroid', 'assets/asteroid_131x124.png', 131, 124);
    game.load.image('starfield', 'assets/space_background.jpg');
    
}


var starfield;
var ship;
var cursors;
var shots;
var fireButton;
var shotTime = 0;
var shotDelay = 200;
var asteroids;
var gameTime = 0;
var stateText;
var score = 0;
var scoreString = '';
var scoreText;
var asteroidDelay = 1500;
var asteroidSpeed = -300;
var stillAlive = true;



function create(){
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //Scrolling starfield
    starfield = game.add.tileSprite(0,0,1024,576, 'starfield');
    
    //Shots group
    shots = game.add.group();
    shots.enableBody = true;
    shots.physicsBodyType = Phaser.Physics.ARCADE;
    shots.createMultiple(30, 'shot'); //This method is useful if you need to quickly generate a pool of sprites, such as bullets.
    shots.setAll('anchor.x', 0.5);
    shots.setAll('anchor.y', 1);
    shots.setAll('outOfBoundsKill', true);
    shots.setAll('checkWorldBounds', true);
    
    //The Player
    ship = game.add.sprite(50, 250, 'ship');
    ship.anchor.setTo(0.25, 0.25);
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.animations.add('move', Phaser.Animation.generateFrameNames('move', 1, 2), 9, true);
    ship.animations.add('exp', Phaser.Animation.generateFrameNames('exp', 1, 4), 10, false, true);
    ship.animations.play('move');
    ship.body.collideWorldBounds = true;
    
    //The Asteroids
    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.ARCADE;
    asteroids.createMultiple(20, 'asteroid');
    asteroids.setAll('anchor.x', 0.5);
    asteroids.setAll('anchor.y', 0.5);
    asteroids.setAll('outOfBoundsKill', true);
    asteroids.setAll('checkWorldBounds', true);
    
    //Ship Controls
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    //Game Text
    stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {font: '64px Arial', fill: '#ffffff'});
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
    
    //Scorekeeper
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, {font: '34px Arial', fill: '#ffffff'});
    
}

function update(){
    //Scroll the starfield
    starfield.tilePosition.x -= 2;
    
    ship.body.velocity.setTo(0, 0);
    
    //Check for player movement
    if (cursors.up.isDown){
        ship.body.velocity.y = -200;
    }
    else if (cursors.down.isDown){
        ship.body.velocity.y = 200;
    }
    //Check for shots fired
    if (fireButton.isDown){
        fireShot();
    }
    
    if (stillAlive){
        createAsteroids();
    }
    
    updateAsteroidsDifficulty();
    
    game.physics.arcade.collide(shots, asteroids, destroyAsteroid, null, this);
    game.physics.arcade.collide(ship, asteroids, destroyShip, null, this);
    
}

//SHOTS
function fireShot(){
    //This keeps the player from being able to fire too many shots at a time
    if (game.time.now > shotTime){
        //This gets the first shot from the pool
        shot = shots.getFirstExists(false);
        
        if (shot){
            
            shot.reset(ship.x + 130, ship.y + 65);
            shot.body.velocity.x = 600;
            shot.animations.add('pulse');
            shot.animations.play('pulse', 10, true);
            shotTime = game.time.now + shotDelay;
        }
    }
}

function render(){
    game.debug.text('asteroids: ' + asteroids.length, 500, 48);
    game.debug.text('shots: ' + shots.length, 500, 64);
}

//ASTEROIDS
function createAsteroids(){
        
    if (game.time.now > gameTime){
        
        var asteroid = asteroids.getFirstDead();
        
        if (asteroid) {
            
            asteroid.reset(1100, game.rnd.integerInRange(50, 550));
            asteroid.frame = 0;
            asteroid.animations.add('explosion', [1,2,3,4], 10);
            asteroid.body.angularVelocity = 100;
            asteroid.body.velocity.x = asteroidSpeed;
        
        }
        /*
        if (asteroids.length > 20) {
            asteroid = asteroids.getFirstDead();
            if (asteroid){
                asteroid.reset(1100, game.rnd.integerInRange(50, 550));
                asteroid.frame = 0;
            }
        } else {
            asteroid = asteroids.create(1100, game.rnd.integerInRange(50, 550), 'asteroid');
        }
        */
        /*
        asteroid = asteroids.create(1100, game.rnd.integerInRange(50, 550), 'asteroid');
        
        asteroid.animations.add('explosion', [1,2,3,4], 10);
        asteroid.anchor.setTo(0.5, 0.5);
        
        asteroid.body.angularVelocity = 100;
        asteroid.body.velocity.x = asteroidSpeed;
        */
        gameTime = game.time.now + asteroidDelay;
        
    }
}

//When a shot hits the asteroid
function destroyAsteroid(shot, asteroid){
    asteroid.play('explosion', 10, false, true);
    shot.kill();
    score += 25;
    scoreText.text = scoreString + score;
}

//When an asteroid hits the ship
function destroyShip(ship, asteroid){
    ship.play('exp', 10, false, true);
    asteroid.kill();
    
    stateText.text = "GAME OVER \nClick to Restart";
    stateText.visible = true;
    
    fireButton.enabled = false;
    stillAlive = false;
    
    game.input.onTap.addOnce(restart, this);
}

//Increase games difficulty
function updateAsteroidsDifficulty(){
    //200, 400, 600, 800, 1000, 1200, 
    if (score > 1100) {
        asteroidSpeed = -800;
        asteroidDelay = 250;
        shotDelay = 450;
    } 
    else if (score > 900){
        asteroidSpeed = -700;
        asteroidDelay = 500;
        shotDelay = 400;
    } 
    else if (score > 700){
        asteroidSpeed = -600;
        asteroidDelay = 750;
        shotDelay = 350;
    }
    else if (score > 500){
        asteroidSpeed = -500;
        asteroidDelay = 1000;
        shotDelay = 300;
    }
    else if (score > 300){
        asteroidSpeed = -400;
        asteroidDelay = 1250;
        shotDelay = 250;
    }
}

//Restarts the game
function restart(){
    ship.revive();
    fireButton.enabled = true;
    ship.animations.play('move');
    stateText.visible = false;
    score = 0;
    scoreText.text = scoreString + score;
    asteroidSpeed = -300;
    asteroidDelay = 1500;
    stillAlive = true;
}