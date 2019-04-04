var SpaceshipGame = SpaceshipGame || {};

SpaceshipGame.Play = function(){};

SpaceshipGame.Play.prototype = {
    create: function(){
        //Scrolling starfield
        this.starfield = this.game.add.tileSprite(0,0,1024,576, 'starfield');
        
        //set shotTime, gameTime, asteroidDelay
        this.shotTime = 0;
        this.gameTime = 0;
        this.asteroidDelay = 1500;
        this.score = 0;
        this.stillAlive = true;
        this.asteroidSpeed = -300;
        this.shotDelay = 250;
        
        //Shots group
        this.shots = this.game.add.group();
        this.shots.enableBody = true;
        this.shots.physicsBodyType = Phaser.Physics.ARCADE;
        this.shots.createMultiple(30, 'shot'); //This method is useful if you need to quickly generate a pool of sprites, such as bullets.
        this.shots.setAll('anchor.x', 0.5);
        this.shots.setAll('anchor.y', 1);
        this.shots.setAll('outOfBoundsKill', true);
        this.shots.setAll('checkWorldBounds', true);
        
        //The Player
        this.ship = this.game.add.sprite(50, 250, 'ship');
        this.ship.anchor.setTo(0.25, 0.25);
        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
        this.ship.animations.add('move', Phaser.Animation.generateFrameNames('move', 1, 2), 9, true);
        this.ship.animations.add('exp', Phaser.Animation.generateFrameNames('exp', 1, 4), 10, false, true);
        this.ship.animations.play('move');
        this.ship.body.collideWorldBounds = true;
        
        //The Asteroids
        this.asteroids = this.game.add.group();
        this.asteroids.enableBody = true;
        this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;
        this.asteroids.createMultiple(20, 'asteroid');
        this.asteroids.setAll('anchor.x', 0.5);
        this.asteroids.setAll('anchor.y', 0.5);
        this.asteroids.setAll('outOfBoundsKill', true);
        this.asteroids.setAll('checkWorldBounds', true);
        
        //Ship Controls
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        //Game Text
        this.stateText = this.game.add.text(this.world.centerX, this.world.centerY, ' ', {font: '64px Arial', fill: '#ffffff'});
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.visible = false;
        
        //Scorekeeper
        this.scoreString = 'Score : ';
        this.scoreText = this.game.add.text(10, 10, this.scoreString + this.score, {font: '34px Arial', fill: '#ffffff'});
        
        
    },
    update: function(){
        //Scroll the starfield
        this.starfield.tilePosition.x -= 2;
        
        this.ship.body.velocity.setTo(0, 0);
        
        //Check for player movement
        if (this.cursors.up.isDown){
            this.ship.body.velocity.y = -200;
        }
        else if (this.cursors.down.isDown){
            this.ship.body.velocity.y = 200;
        }
        //Check for shots fired
        if (this.fireButton.isDown){
            this.fireShot();
        }
        
        if (this.stillAlive){
            this.createAsteroids();
        }
        
        this.updateAsteroidsDifficulty();
        
        this.game.physics.arcade.collide(this.shots, this.asteroids, this.destroyAsteroid, null, this);
        this.game.physics.arcade.collide(this.ship, this.asteroids, this.destroyShip, null, this);
    },
    fireShot: function(){
        //This keeps the player from being able to fire too many shots at a time
        if (this.game.time.now > this.shotTime){
            //This gets the first shot from the pool
            var shot = this.shots.getFirstExists(false);
            
            if (shot){
                
                shot.reset(this.ship.x + 130, this.ship.y + 65);
                shot.body.velocity.x = 600;
                shot.animations.add('pulse');
                shot.animations.play('pulse', 10, true);
                this.shotTime = this.game.time.now + this.shotDelay;
            }
        }
    },
    render: function(){
        /*
        game.debug.text('asteroids: ' + asteroids.length, 500, 48);
        game.debug.text('shots: ' + shots.length, 500, 64);
        game.debug.body(ship);
        game.debug.text('gameTime: ' + gameTime, 500, 80);
        game.debug.text('actual time: ' + game.time.now, 500, 96);
        game.debug.text('created ast: ' + createdAst, 500, 110);
        */
    },
    createAsteroids: function(){
        if (this.game.time.now > this.gameTime){
            
            var asteroid = this.asteroids.getFirstDead();
            
            if (asteroid) {
                asteroid.reset(1000, this.game.rnd.integerInRange(50, 550));
                asteroid.frame = 0;
                asteroid.animations.add('explosion', [1,2,3,4], 10);
                asteroid.body.angularVelocity = 100;
                asteroid.body.velocity.x = this.asteroidSpeed;
                this.createdAst += 1;
            }
            this.gameTime = this.game.time.now + this.asteroidDelay;
        }
    },
    destroyAsteroid: function(shot, asteroid){
        asteroid.play('explosion', 10, false, true);
        shot.kill();
        this.score += 25;
        this.scoreText.text = this.scoreString + this.score;
    },
    destroyShip: function(ship, asteroid){
        this.ship.play('exp', 10, false, true);
        asteroid.kill();
        
        this.stateText.text = "GAME OVER \nClick to Restart";
        this.stateText.visible = true;
        
        this.fireButton.enabled = false;
        this.stillAlive = false;
        
        this.game.input.onTap.addOnce(this.restart, this);
    },
    updateAsteroidsDifficulty: function(){
        if (this.score > 1100) {
            this.asteroidSpeed = -800;
            this.asteroidDelay = 250;
            this.shotDelay = 450;
        } 
        else if (this.score > 900){
            this.asteroidSpeed = -700;
            this.asteroidDelay = 500;
            this.shotDelay = 400;
        } 
        else if (this.score > 700){
            this.asteroidSpeed = -600;
            this.asteroidDelay = 650;
            this.shotDelay = 350;
        }
        else if (this.score > 500){
            this.asteroidSpeed = -500;
            this.asteroidDelay = 850;
            this.shotDelay = 300;
        }
        else if (this.score > 300){
            this.asteroidSpeed = -400;
            this.asteroidDelay = 1000;
            this.shotDelay = 250;
        }
    },
    restart: function(){
        this.ship.revive();
        this.fireButton.enabled = true;
        this.ship.animations.play('move');
        this.stateText.visible = false;
        this.score = 0;
        this.scoreText.text = this.scoreString + this.score;
        this.asteroidSpeed = -300;
        this.asteroidDelay = 1500;
        this.shotDelay = 250;
        this.stillAlive = true;
    }
};