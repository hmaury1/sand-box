import { GameObject } from "../interfaces/game-object";
import { Game } from "./game";
import { GamePad } from "./game-pad";

export class Player implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    velX: number;
    velY: number;
    color: string;
    health: number;
    healthDelay: number;

    grounded: boolean;
    jumping: boolean;
    jumpDelay: number;

    game: Game;
    keys = [];

    constructor(_game: Game, _Width, _Height, _Color, _speed) {
        this.x = 100;
        this.y = _game.height - _Height - 300; 
        this.width = _Width;
        this.height = _Height;
        this.speed = _speed;
        this.velX = 0;
        this.velY = 0;
        this.color = _Color;
        this.health = 100;
        this.jumping = false;
        this.jumpDelay = 0;
        this.healthDelay = 0;

        this.game = _game;
        _game.player = this;
        this.addEvents();
    }

    update = () => {
        
        if (!this.game.gamePause && !this.game.gameOver) {
            this.ActionValidations();

            this.velX *= this.game.friction;
            this.velY += this.game.gravity;
            this.x += this.velX;
            this.y += this.velY;

            if (this.jumpDelay > 0) {
                this.jumpDelay--;
            }

            if (this.healthDelay > 0) {
                this.healthDelay--;
            }

            this.collitions();
            this.draw();
        }
    }

    collitions() {
        if (this.x >= this.game.width - this.width) {
            // right border
            this.velX = 0;
            this.x = this.game.width - this.width;
        } else if (this.x <= 0) {
            // left border
            this.velX = 0;
            this.x = 0;
        }

        if (this.y >= this.game.height - this.height) {
            // bottom border
            this.y = this.game.height - this.height;
            this.velY = 0;
            if (this.jumping) {
                this.jumping = false;
                this.jumpDelay = 10; // 10 frames
            }
            this.setHealth(100);
        } else if (this.y <= 0) {
            // top border
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
        let buttonRigth = GamePad.getButton(15);
        let stickX = GamePad.getAxes(0);

        // Jump
        if (this.keys['ArrowUp'] || this.keys['Space'] || this.keys['KeyW'] || buttonJump?.pressed) {
            if (!this.jumping && this.velY === 0  && this.jumpDelay == 0 ) {
                this.jumping = true;
                this.velY = -this.speed * 2;
            }
        }

        // Move to right
        if (this.keys['ArrowRight'] || this.keys['KeyD'] || buttonRigth?.pressed) {
            if (this.velX < this.speed) {
                this.velX++;
            }
        }

        // Move to Left
        if (this.keys['ArrowLeft'] || this.keys['KeyA'] || buttonLeft?.pressed) {
            if (this.velX > -this.speed) {
                this.velX--;
            }
        }

        // Move using stick
        if (stickX) {
            this.velX += stickX;
        }
    }

    draw() {

        if (!this.healthDelay || Math.trunc(this.healthDelay / 10)  % 2 === 0) {
            this.game.ctx.fillStyle = this.color;
            this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
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