var SpaceshipGame = SpaceshipGame || {};

SpaceshipGame.game = new Phaser.Game(1024, 576, Phaser.AUTO, 'gameDiv');

SpaceshipGame.game.state.add('Boot', SpaceshipGame.Boot);
SpaceshipGame.game.state.add('Load', SpaceshipGame.Load);
SpaceshipGame.game.state.add('Menu', SpaceshipGame.Menu);
SpaceshipGame.game.state.add('Play', SpaceshipGame.Play);


SpaceshipGame.game.state.start('Boot');