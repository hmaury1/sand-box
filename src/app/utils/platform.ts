import { GameObject } from "../interfaces/game-object";
import { Engine } from "./engine";
import { GamePad } from "./game-pad";
import { Player } from "./player";

export class PlatForm implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    velX: number;
    velY: number;
    color: string;
    game: Engine;

    constructor(game, obj) {
        this.game = game;
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
        this.color = obj.color;
    }

    draw() {
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.x, this. y, this.width, this.height);
    }

    update() {

        this.x = this.x - .7;

         var dir = this.colCheck(this.game.player, this);

        if (dir === "l" || dir === "r") {
            this.game.player.velX = 0;
        } else if (dir === "b") {
            //this.player.grounded = true;
            this.game.player.velY = 0;
            if (this.game.player.jumping) {
                this.game.player.jumping = false;
                this.game.player.jumpDelay = 10; // 10 frames
            }
        } else if (dir === "t") {
            this.game.player.velY *= -1;
        }
        this.draw();
    }

    colCheck(shapeA: Player, shapeB: GameObject) {
        // get the vectors to check against
        var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
            vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
            // add the half widths and half heights of the objects
            hWidths = (shapeA.width / 2) + (shapeB.width / 2),
            hHeights = (shapeA.height / 2) + (shapeB.height / 2),
            colDir = null;

        // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {         // figures out on which side we are colliding (top, bottom, left, or right)         
            var oX = hWidths - Math.abs(vX), oY = hHeights - Math.abs(vY);
            if (oX >= oY) {
                if (vY > 0) {
                    colDir = "t";
                    shapeA.y += oY;
                } else {
                    colDir = "b";
                    shapeA.y -= oY;
                }
            } else {
                if (vX > 0) {
                    colDir = "l";
                    shapeA.x += oX;
                } else {
                    colDir = "r";
                    shapeA.x -= oX;
                }
            }
        }
        return colDir;
    }
}