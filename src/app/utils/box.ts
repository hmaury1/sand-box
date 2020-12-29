import { GameObject } from "../interfaces/game-object";
import { Game } from "./game";
import { GamePad } from "./game-pad";
import { Player } from "./player";

export class Box implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    velX: number;
    velY: number;
    color: string;
    game: Game;
    collisable = false;
    tile: null;
    deadly: boolean;
    colliderTop: boolean;
    render: (instance: Box) => void;

    constructor(game, obj) {
        this.game = game;
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
        this.color = obj.color;
        this.render = obj.render;
        this.collisable = obj.collisable;
        this.tile = obj.tile;
        this.deadly = obj.deadly;
        this.colliderTop = obj.colliderTop;
    }

    draw() {
        if (this.render) {
            this.render(this);
        } else {
            this.game.ctx.fillStyle = this.color || (this.game.dev ? (this.deadly ? '#ffa2a24d' : '#a2ffa34d') : 'transparent');
            this.game.ctx.fillRect(this.x, this. y, this.width, this.height);
        }
    }

    update() {
        if (this.collisable) {
            this.collitions();
        }
        this.draw();
    }

    collitions() {
        let shapeA = this.game.player;
        let shapeB = this;
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
                    if (this.colliderTop) {
                        colDir = "t";
                        shapeA.y += oY;
                        this.game.player.velY = 0;
                    }
                } else {
                    if (this.game.player.velY > 0) {
                        colDir = "b";
                        shapeA.y -= oY;
                        this.game.player.velY = 0;
                        if (this.game.player.jumping) {
                            this.game.player.jumping = false;
                            this.game.player.jumpDelay = 10; // 10 frames
                        }
                    }
                }
            } else {
                this.game.player.velX = 0;
                if (vX > 0) {
                    colDir = "l";
                    shapeA.x += oX;
                } else {
                    colDir = "r";
                    shapeA.x -= oX;
                }
            }
        }

        if (colDir != null && this.deadly) {
            this.game.player.setHealth(20);
        }
     }
}