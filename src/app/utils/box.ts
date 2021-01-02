import { GameObject } from "../interfaces/game-object";
import { Game } from "./game";
import { Player } from "./player";

export class Box implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    game: Game;
    collisable = true;
    deadly: boolean;
    colliderTopOnly: boolean;
    render: (instance: Box) => void;

    constructor(game, obj) {
        this.game = game;
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
        this.render = obj.render;
        this.collisable = !(obj.collisable == false);
        this.deadly = obj.deadly;
        this.colliderTopOnly = obj.colliderTopOnly;
    }

    draw() {
        if (this.render) {
            this.render(this);
        } else {
            if (this.collisable) {
                this.game.ctxFront.fillStyle = this.deadly ? '#ffa2a24d' : (this.colliderTopOnly ? '#ffffff9e' : '#a2ffa34d');
                this.game.ctxFront.fillRect(this.x, this.game.height - (1080 - this.y), this.width, this.height);
            }
        }
    }

    update() {
        if (this.game.dev || !this.collisable) {
            this.draw();
        }
    }

    collitions() {
        if (this.collisable) {
            let shapeA: Player = this.game.player;
            let shapeB: Box = this;
            // get the vectors to check against
            var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
                vY = (shapeA.y + (shapeA.height / 2)) - (this.game.height - (1080 - shapeB.y) + (shapeB.height / 2)),
                // add the half widths and half heights of the objects
                hWidths = (shapeA.width / 2) + (shapeB.width / 2),
                hHeights = (shapeA.height / 2) + (shapeB.height / 2),
                colDir = null;

            // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
            if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {         // figures out on which side we are colliding (top, bottom, left, or right)         
                var oX = hWidths - Math.abs(vX), oY = hHeights - Math.abs(vY);
                if (oX >= oY) {
                    if (vY > 0) {
                        if (!this.colliderTopOnly) {
                            colDir = "t";
                            shapeA.y += oY;
                            shapeA.velY = 0;
                        }
                    } else {
                        if (shapeA.velY > 0) {
                            colDir = "b";
                            shapeA.y -= oY;
                            shapeA.velY = 0;
                            if (shapeA.jumping) {
                                shapeA.jumping = false;
                                shapeA.jumpDelay = 10; // 10 frames
                            }
                        }
                    }
                } else {
                    if (!this.colliderTopOnly && vX > 0 && shapeA.currentSpriteDirection === 'left') {
                        shapeA.velX = 0;
                        colDir = "l";
                        // shapeB.x -= oX;
                    }

                    if (!this.colliderTopOnly && vX < 0 && shapeA.currentSpriteDirection === 'right') {
                        colDir = "r";
                        shapeA.velX = 0;
                        // shapeB.x += oX;
                    }
                }
            }

            if (colDir != null && this.deadly) {
                shapeA.setHealth(20);
            }
        }
    }
}