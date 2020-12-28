import { GamePad } from "./game-pad";
import { PlatForm } from "./platform";
import { Player } from "./player";

export class Engine {
    private canvas;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    friction: number;
    gravity: number;
    player: Player;
    keys: string[];
    gameOver: boolean;

    platforms: PlatForm[];

    platformsCount = 0;

    constructor(_width, _height, _friction, _gravity) {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = _width;
        this.height = _height;
        this.friction = _friction;
        this.gravity = _gravity;
        this.keys = [];
        this.gameOver = false;
        this.canvas.width = _width;
        this.canvas.height = _height;
        this.platforms = [];
    }

    start() {
        this.update();
    }

    update = () => {
        let tc = GamePad.testForConnections();

        if (tc > 0) {
            console.log(tc + " gamepads connected");
            GamePad.getState();
        } else if (tc < 0) {
            console.log((-tc) + " gamepads disconnected");
        } else {
            // Gamepads neither connected nor disconnected.
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.player) {
            this.player.update();
        }

        if(this.platformsCount == 100) {
           
            this.platforms.push(new PlatForm(this, {
                x: 600 + 200,
                y: this.getRandomInt(500, 600),
                width: 100,
                height: 8,
                color: 'blue'
            }));
           
            this.platforms.push(new PlatForm(this, {
                x: 600 + 200,
                y: this.getRandomInt(0, 500),
                width: 100,
                height: 8,
                color: 'blue'
            }));
            
        }

        if(this.platformsCount == 200) {
           
            this.platforms.push(new PlatForm(this, {
                x: 600 + 200,
                y: this.getRandomInt(400, 500),
                width: 100,
                height: 8,
                color: 'blue'
            }));
           
            this.platforms.push(new PlatForm(this, {
                x: 600 + 200,
                y: this.getRandomInt(0, 600),
                width: 100,
                height: 8,
                color: 'blue'
            }));
            
        }

        if(this.platformsCount >= 300) {
            this.platforms.push(new PlatForm(this, {
                x: 600 + 200,
                y: this.getRandomInt(300, 400),
                width: 100,
                height: 8,
                color: 'blue'
            }));
            this.platforms.push(new PlatForm(this, {
                x: 600 + 200,
                y: this.getRandomInt(0, 300),
                width: 100,
                height: 8,
                color: 'blue'
            }));
            this.platformsCount = 0;
        }        

        this.platformsCount++;

        this.platforms.forEach(p => {
            if (p && p.x + p.width > 0){
                p.update()
            } else {
                p = null;
            }
        });
        
        requestAnimationFrame(this.update);
    }

    getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
    }
}