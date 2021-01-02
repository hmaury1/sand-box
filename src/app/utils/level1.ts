import { Level } from "../interfaces/level";
import { Box } from "./box";
import { Game } from "./game";

export class Level1 implements Level {

    game: Game
    boxes: Box[] = [];
    viewport: Box;
    
    velX: number;

    private backgroundX1: number;
    private backgroundX2: number [];
    private backgroundX3: number [];



    constructor(_game: Game) {
        this.game = _game;

        this.velX = 0;
        this.backgroundX1 = 0;
        this.backgroundX2 = [0, 1080];
        this.backgroundX3 = [0, 1080, 2160, 3240];

        this.viewport = new Box(this.game, { x: 0, y: this.game.height - 1080, width: 3840, height: 1080, collisable: false, render: this.viewportRender });
        this.boxes = [
            // viewport
            this.viewport,
            // colliders
            new Box(this.game, { x: 0, y: 1032, width: 240,  height: 48}),
            new Box(this.game, { x: 372, y: 1032, width: 270, height: 48 }),
            new Box(this.game, { x: 240, y: 1064, width: 132, height: 16, deadly: true }),
            new Box(this.game, { x: 643, y: 1064, width: 280, height: 19, deadly: true }),
            new Box(this.game, { x: 710, y: 920, width: 123, height: 38 }),
            new Box(this.game, { x: 435, y: 820, width: 123, height: 38 }),
            new Box(this.game, { x: 421, y: 700, width: 146, height: 12, colliderTopOnly: true }),
            new Box(this.game, { x: 710, y: 590, width: 123, height: 38 }),
            new Box(this.game, { x: 923, y: 1032, width: 2919, height: 48 }),
        ];
    }

    drawAnimatedObject() { 
        // TO DO ANIMATED boxes:
        /*if (this.fireDelay > 15) {
            this.fireSprite = Math.floor(Math.random() * 4) * 32;
            this.fireDelay = 0;
        }
        var background = new Image();
        background.src = "assets/png/torch.png";
        this.ctxBack.fillStyle = this.ctxBack.createPattern(background, 'repeat');
        this.ctxBack.drawImage(background, this.fireSprite, 0, 32, 32, 96,  this.height - (1080 - 890), 32, 32);
        this.fireDelay++;*/
    }

    viewportRender(instance: Box) {
        var background = new Image();
        background.src = "assets/png/level1Back.png";
        this.game.ctxBack.fillStyle = this.game.ctxBack.createPattern(background, 'repeat');
        this.game.ctxBack.drawImage(background, 0, 0, instance.width, instance.height, instance.x, instance.y, instance.width, instance.height);
    
        var background = new Image();
        background.src = "assets/png/level1Front.png";
        this.game.ctxFront.fillStyle = this.game.ctxFront.createPattern(background, 'repeat');
        this.game.ctxFront.drawImage(background, 0, 0, instance.width, instance.height, instance.x, instance.y, instance.width, instance.height);
    }

    drawBackground() {
        var background = new Image();
        background.src = "/assets/PFantasy_SET1_v1.0/bakcground_night1.png";
        this.game.ctxBack.fillStyle = this.game.ctxBack.createPattern(background, 'repeat');
        this.game.ctxBack.drawImage(background, 0, 0, 640, 368, this.backgroundX1, 0, 1920, 1080);

        for (let index = 0; index < this.backgroundX2.length; index++) {
            this.backgroundX2[index] -= this.velX / 4;
            var background = new Image();
            background.src = "/assets/PFantasy_SET1_v1.0/bakcground_night2.png";
            this.game.ctxBack.fillStyle = this.game.ctxBack.createPattern(background, 'repeat');
            this.game.ctxBack.drawImage(background, 0, 0, 640, 368, this.backgroundX2[index], 0, 1920, 1080);
        }

        for (let index = 0; index < this.backgroundX3.length; index++) {
            this.backgroundX3[index] -= this.velX / 2;
            var background = new Image();
            background.src = "/assets/PFantasy_SET1_v1.0/bakcground_night3.png";
            this.game.ctxBack.fillStyle = this.game.ctxBack.createPattern(background, 'repeat');
            this.game.ctxBack.drawImage(background, 0, 0, 640, 368, this.backgroundX3[index], 0, 1920, 1080);
        }
    }
}