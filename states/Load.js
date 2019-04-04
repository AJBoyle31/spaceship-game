var SpaceshipGame = SpaceshipGame || {};

SpaceshipGame.Load = function(){};

SpaceshipGame.Load.prototype = {
    preload: function(){
        var loadingLabel = this.game.add.text(this.world.centerX, this.world.centerY, '...loading...', {font: '40px Arial', fill: '#ffffff'});
        loadingLabel.anchor.setTo(0.5);
        
        this.load.atlas('ship', 'assets/spaceship.png', 'assets/spaceship.json');
        this.load.spritesheet('shot', 'assets/shot_85x50.png', 85, 50, 2);
        this.load.spritesheet('asteroid', 'assets/asteroid_131x124.png', 131, 124);
        this.load.image('starfield', 'assets/space_background.jpg');


    },
    create: function(){
        this.state.start('Menu');
    }
    
    
};