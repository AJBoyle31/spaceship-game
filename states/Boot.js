var SpaceshipGame = SpaceshipGame || {};

SpaceshipGame.Boot = function(){};

SpaceshipGame.Boot.prototype = {
    create: function(){
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.state.start('Load');
    }
};