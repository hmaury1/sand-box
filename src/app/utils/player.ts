import { GameObject } from "../interfaces/game-object";
import { Engine } from "./engine";
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
    
    jumping: boolean;
    jumpDelay: number;

    game: Engine;
    keys = [];

    constructor(_game: Engine, _Width, _Height, _Color, _speed) {
        this.x =  0;
        this.y =  _game.height - _Height;
        this.width =  _Width;
        this.height =  _Height;
        this.speed =  _speed;
        this.velX =  0;
        this.velY =  0;
        this.color =  _Color;
        this.jumping =  false;
        this.jumpDelay =  0;

        this.game = _game;
        _game.player = this;
        this.addEvents();
    }

    update = () => {
        this.ActionValidations();

        this.velX *= this.game.friction;
        this.velY += this.game.gravity;
        this.x -= 0.7;
        this.x += this.velX;
        this.y += this.velY;

        if (this.jumpDelay > 0) {
            this.jumpDelay--;
        }

        this.validateCollitions();
        this.draw();
    }

    validateCollitions() {
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
            if (this.jumping){
                this.jumping = false;
                this.jumpDelay = 10; // 10 frames
            }
        } else if (this.y <= 0) {
            // top border
            this.y = 0;
            this.velY *= -1;
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
        // let stickY = GamePad.getAxes(1);
        
        if (this.keys['Escape']) {
            this.game.gameOver = true;
        }
        if (this.keys['ArrowUp'] || this.keys['Space'] || this.keys['KeyW'] || buttonJump?.pressed) {
            if (!this.jumping && this.jumpDelay == 0) {
                this.jumping = true;
                this.velY = -this.speed * 2;
            }
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD'] || buttonRigth?.pressed) {
            if (this.velX < this.speed) {
                this.velX++;
            }
        }
        if (this.keys['ArrowLeft'] || this.keys['KeyA'] || buttonLeft?.pressed) {
            if (this.velX > -this.speed) {
                this.velX--;
            }
        }
        if (stickX) {
            this.velX += stickX;
        }
    }

    draw() {
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}