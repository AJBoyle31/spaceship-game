Re-creating the following spaceship game found here: http://wimi5.com/my-first-game-with-wimi5/    http://wimi5.com/the-background/
http://examples.phaser.io/_site/view_full.html?d=games&f=invaders.js&t=invaders

Goal is to re-create this, and then turn it into levels that get harder in difficulty. 

To Do
    
    Background - infinite from right to left - DONE
    
    Spaceship - moves up and down, on left part of screen, need to add boundries - DONE
    
    Spaceship shots - emerge from the ship and travel left to right - DONE
                    - added group, button, and checking if spacebar is pressed. need to finish fireShot function - DONE
    
    Asteroids   - randomly generate from right side of screen - DONE
                - asteroids now appear every 1.5 seconds. have to randomize how often they appear and where on the y axis. also need to add rotation. - DONE
    
    Collisions  - ship/edge of screen - DONE
                - shots/asteroids - DONE
                - asteroids/ship - DONE
                    - Need to change from a spritesheet for the ship to an atlas. See reading here: 
                        - Read this: https://www.joshmorony.com/how-to-create-animations-in-phaser-with-a-texture-atlas/
                        - That reading is key. The free tool to convert worked well
    
    Game Over   - When the ship is hit by an asteroid, the game needs to stop and tell the player the game is over. - DONE
                - Should be an option to restart - DONE
                - The ship still shoots after being killed, need to remove the ships ability to shoot. - DONE
                
                
    
    Scoreboard  - points for each asteroid killed - DONE
                - the game and reset the score to zero after death - DONE
                - after so many points, the speed of the asteroids and duration increases - DONE
                - highscore set after death as well?
                
    Create a number of asteroids in the group. Then reuse the asteroids as they are killed.
        - for memory management - DONE
    
    Menu Screen - Game title and player clicks something to start the game - DONE
                    - look at plnkr: http://plnkr.co/edit/9UkbvqCaUUiGrvQ7WKFG
                    - this works. Need to update styling and do more testing
    
    