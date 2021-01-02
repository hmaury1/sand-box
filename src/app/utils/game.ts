import { GamePad } from "./game-pad";
import { Player } from "./player";
import { Level1 } from "./level1";
import { Level } from "../interfaces/level";

const DEV_MODE = false;

export class Game {
    private canvasBack;
    private canvas;
    private canvasFront;
    ctxBack: CanvasRenderingContext2D;
    ctx: CanvasRenderingContext2D;
    ctxFront: CanvasRenderingContext2D;
    width: number;
    height: number;
    player: Player;
    keys: string[];
    gameOver: boolean;
    gamePause: boolean;
    gamePauseDelay: number;
    dev: boolean;
    fireDelay = 0; // TODO
    fireSprite = 1; // TODO

    currentLevel: Level;

    constructor() {
        this.dev = DEV_MODE;

        var win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0];
        this.width = win.innerWidth || docElem.clientWidth || body.clientWidth;
        this.height = win.innerHeight|| docElem.clientHeight|| body.clientHeight;

        this.keys = [];

        this.gameOver = false;
        this.gamePause = false;
        this.gamePauseDelay = 0;

        this.player = new Player(this);

        this.configureLayers();
    }

    configureLayers() {
        this.canvasBack = document.getElementById("back");
        this.canvas = document.getElementById("game");
        this.canvasFront = document.getElementById("front");
        this.ctxBack = this.canvasBack.getContext("2d");
        this.ctx = this.canvas.getContext("2d");
        this.ctxFront = this.canvasFront.getContext("2d");

        this.canvasBack.width = this.width;
        this.canvasBack.height = this.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvasFront.width = this.width;
        this.canvasFront.height = this.height;
    }

    start() {
        this.addEvents();
        this.currentLevel = new Level1(this);
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

        if (!this.gamePause && !this.gameOver) {
            this.validateGamePad();
            this.ctxBack.clearRect(0, 0, this.width, this.height);
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctxFront.clearRect(0, 0, this.width, this.height);    
            this.currentLevel.drawBackground();
            this.player.update();
        }

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