import { GameObject } from "../interfaces/game-object";
import { Level } from "../interfaces/level";
import { Box } from "./box";
import { Game } from "./game";
import { GamePad } from "./game-pad";

const PLAYER_WIDTH = 45;
const PLAYER_HEIGH = 75; 
const PLAYER_SPEED = 6;
const GRAVITY = .6;
const FRICTION = .85;
const HIT_BOX_COLOR = '#a2ffa34d';
const SPRITES_SET = "assets/png/playerX2.png";


export class Player implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    velX: number;
    velY: number;
    hitBoxColor: string;
    health: number;
    healthDelay: number;
    friction: number;
    gravity: number;

    grounded: boolean;
    jumping: boolean;
    jumpDelay: number;

    currentSprite = 0;
    currentSpriteDelay = 0;
    currentSpriteDirection = 'right';

    game: Game;
    keys = [];

    constructor(_game: Game) {
        this.x = 50;
        this.y = _game.height - PLAYER_HEIGH - 150; 
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGH;
        this.speed = PLAYER_SPEED;
        this.velX = 0;
        this.velY = 0;
        this.health = 100;
        this.jumping = false;
        this.jumpDelay = 0;
        this.healthDelay = 0;
        this.friction = FRICTION;
        this.gravity = GRAVITY;

        this.game = _game;
        _game.player = this;
        this.addEvents();
    }

    update = () => { 
        let level:Level = this.game.currentLevel;
        this.ActionValidations();

        if (this.velX < 0.1 && this.velX >  -0.1) {
            this.velX = 0;
        } else {
            this.velX *= FRICTION;
        }
        this.velY += GRAVITY;
        this.y += this.velY;

        if (this.jumpDelay > 0) {
            this.jumpDelay--;
        }

        if (this.healthDelay > 0) {
            this.healthDelay--;
        }

        level.boxes.forEach((box: Box) => {
            box.collitions();
        });
        level.velX = 0;
        if (this.velX > 0) {
            if ((level.viewport.x * -1) + this.game.width <= level.viewport.width) {
                if (this.x > (this.game.width - this.width) / 2) {
                    level.velX = this.velX;
                } else {
                    this.x  +=  this.velX;
                }
            } else {
                this.x  +=  this.velX;
            }
        } else {
            if (level.viewport.x < 0) {
                if (this.x < (this.game.width - this.width) / 2) {
                    level.velX = this.velX;
                } else {
                    this.x  +=  this.velX;
                }
            } else {
                this.x  +=  this.velX;
            }
        }
        level.boxes.forEach((box: Box) => {
            box.x -= level.velX;
            box.update();
        });
        this.collitions();
        this.draw();
    }

    collitions() {
        if (this.x >= this.game.width - this.width) {
            // right
            if(this.currentSpriteDirection == 'right') {
                this.velX = 0;
                this.x = this.game.width - this.width;
            }
        } else if (this.x <= 0) {
            // left
            if(this.currentSpriteDirection == 'left') {
                this.velX = 0;
                this.x = 0;
            }
        }

        if (this.y >= this.game.height - this.height) {
            // bottom
            this.y = this.game.height - this.height;
            this.velY = 0;
            if (this.jumping) {
                this.jumping = false;
            }
            this.setHealth(100);
        } else if (this.y <= 0) {
            // top
            this.y = 0;
            this.velY = 0;
        }
    }

    addEvents() {
        document.body.addEventListener("keydown", (e) => {
            this.keys[e.code] = true;
        });

        document.body.addEventListener("keyup", (e) => {
            this.keys[e.code] = false;
        });
    }

    ActionValidations() {
        // check keyBoard and Gamepad
        let buttonLeft = GamePad.getButton(14);
        let buttonJump = GamePad.getButton(0);
        let buttonRight = GamePad.getButton(15);
        let stickX = GamePad.getAxes(0);

        // Jump
        if (this.keys['ArrowUp'] || this.keys['Space'] || this.keys['KeyW'] || buttonJump?.pressed) {
            if (!this.jumping && this.velY === 0  && this.jumpDelay == 0 ) {
                this.jumping = true;
                this.velY = -this.speed * 2;
            }
        }

        // Move to right
        if (this.keys['ArrowRight'] || this.keys['KeyD'] || buttonRight?.pressed) {
            this.currentSpriteDirection = 'right';
            if (this.velX < this.speed) {
                this.velX++;
            }
        }

        // Move to Left
        if (this.keys['ArrowLeft'] || this.keys['KeyA'] || buttonLeft?.pressed) {
            this.currentSpriteDirection = 'left';
            if (this.velX > -this.speed) {
                this.velX--;
            }
        }

        // Move using stick
        if (stickX) {
            this.currentSpriteDirection = stickX > 0 ? 'right' : 'left';
            this.velX += stickX;
        }
    }

    draw() {
        let spriteSize = 96;
        let spriteRealSizeX = 56;
        let spriteRealSizeY = 80;
        let spriteOffsetX = 22;
        let spriteOffsetY = 5;
        let spriteIntenalOffsetX = 0;
        let spriteIntenalOffsetY = -5;
        let spriteLimit = spriteSize * 6;
        let currentSpriteColumn = 0;
        let currentSpriteRow = 0;
        let defaultVelocity = 0;

        if (this.currentSpriteDelay > 6) {
            this.currentSprite = this.currentSprite >= spriteLimit ? 0 : this.currentSprite + spriteSize;
            this.currentSpriteDelay = 0;
        }
        this.currentSpriteDelay++;
        if (!this.healthDelay || Math.trunc(this.healthDelay / 10)  % 2 === 0) {
            if (this.velX > 0) {
                // run right
                currentSpriteColumn = this.currentSprite;
                currentSpriteRow =  spriteSize * (this.velY != defaultVelocity ? 4 : 2);
            } else if(this.velX < 0) {
                // run letf
                currentSpriteColumn = spriteLimit - this.currentSprite;
                currentSpriteRow =  spriteSize * (this.velY != defaultVelocity ? 5 : 3);
                spriteIntenalOffsetX = -5;
            } else {
                if (this.currentSpriteDirection === 'right') {
                    // idle right
                    currentSpriteColumn = this.currentSprite;
                    currentSpriteRow =  spriteSize * (this.velY != defaultVelocity ? 4 : 0);
                    spriteIntenalOffsetX = 5;
                } else {
                    // idle left
                    currentSpriteColumn = spriteLimit - this.currentSprite;
                    currentSpriteRow =   spriteSize * (this.velY != defaultVelocity ? 5 : 1);
                    spriteIntenalOffsetX = -10;
                }
            }

            if (this.game.dev) {
                this.game.ctx.fillStyle = HIT_BOX_COLOR;
                this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            var background = new Image();
            background.src = SPRITES_SET;
            this.game.ctx.fillStyle = this.game.ctx.createPattern(background, 'repeat');
            this.game.ctx.drawImage(
                background,
                currentSpriteColumn + spriteOffsetX,
                currentSpriteRow + spriteOffsetY,
                spriteRealSizeX,
                spriteRealSizeY + spriteOffsetY,
                this.x + spriteIntenalOffsetX,
                this.y + spriteIntenalOffsetY,
                spriteRealSizeX,
                spriteRealSizeY);
        }

        this.game.ctxFront.fillStyle = 'white';
        this.game.ctxFront.fillRect(50, 50, 204, 12);

        this.game.ctxFront.fillStyle = 'red';
        this.game.ctxFront.fillRect(52, 52, this.health * 2, 8);
    }

    setHealth(hit: number = 20) {
        if (this.healthDelay <= 0) {
            let newValue = this.health - hit;
            this.health = newValue >= 0 ? newValue : 0;
            this.healthDelay = 60;
            if (this.health === 0) {
                this.game.gameOver = true;
            }
        }
    }
}