var SpaceshipGame = SpaceshipGame || {};

SpaceshipGame.Menu = function(){};

SpaceshipGame.Menu.prototype = {
    create: function(){
        
        var menuBackground = this.game.add.tileSprite(0,0,1024,576, 'starfield');
        
        var nameLabel = this.game.add.text(this.world.centerX, this.world.centerY - 50, 'Spaceship vs Asteroids', {font: '60px Arial', fill: '#ffffff'});
        var startLabel = this.game.add.text(this.world.centerX, this.world.centerY + 50, 'Press Spacebar to Start', {font: '40px Arial', fill: '#ffffff'});
        
        
        nameLabel.anchor.setTo(0.5);
        startLabel.anchor.setTo(0.5);
        
        var spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
        spaceBar.onDown.addOnce(this.start, this);
    },
    start: function(){
        this.state.start('Play');
    }
    
};