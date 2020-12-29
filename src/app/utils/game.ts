import { GamePad } from "./game-pad";
import { Player } from "./player";
import { Cloud } from "./cloud";
import { Platform } from "./platform";
import { Box } from "./box";

export class Game {
    private canvas;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    friction: number;
    gravity: number;
    player: Player;
    keys: string[];
    gameOver: boolean;
    gamePause: boolean;
    gamePauseDelay: number;
    dev: boolean;

    cloud: Cloud;
    platform: Platform;

    constructor(_width, _height, _friction, _gravity) {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = _width;
        this.height = _height;
        this.friction = _friction;
        this.gravity = _gravity;
        this.keys = [];
        this.gameOver = false;
        this.gamePause = false;
        this.canvas.width = _width;
        this.canvas.height = _height;
        this.gamePauseDelay = 0;
        this.dev = false;

        this.cloud = new Cloud(this);
        this.platform = new Platform(this);
    }

    start() {
        this.addEvents();
        this.cloud.initClouds();
        this.update();
    }

    update = () => {
        let buttonPause = GamePad.getButton(9);
        if (buttonPause?.pressed) {
            this.pause();
        }
        if(this.gamePauseDelay > 0) {
            this.gamePauseDelay--;
        }
        this.validateGamePad();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.player.update();
        this.draw();
        requestAnimationFrame(this.update);
    }

    validateGamePad() {
        let tc = GamePad.testForConnections();

        if (tc > 0) {
            console.log(tc + " gamepads connected");
            GamePad.getState();
        } else if (tc < 0) {
            console.log((-tc) + " gamepads disconnected");
        } else {
            // Gamepads neither connected nor disconnected.
        }
    }

    draw() {
        new Box(this, {
            x: 0,
            y: this.height - 1080,
            width: 1920,
            height: 1080,
            render: (instance: Box) => {
                instance.x = instance.x - .7;
                var background = new Image();
                background.src = "assets/png/level1.png";
                this.ctx.fillStyle = this.ctx.createPattern(background, 'repeat');
                this.ctx.drawImage(background, 0, 0, 1920, 1080, instance.x, instance.y, 1920, 1080);
            }
        }).draw();

        this.cloud.randomClouds();
        this.platform.draw();
    }

    addEvents() {
        document.body.addEventListener("keydown", (e) => {
            if (e.code === 'Escape') {
                this.pause();
            }
        });
    }

    pause() {
        if (this.gamePauseDelay === 0) {
            this.gamePause = !this.gamePause;
            this.gamePauseDelay = 30;
        }
    }
}