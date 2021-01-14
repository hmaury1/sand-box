import { GameObject } from "../interfaces/game-object";
import { Game } from "./game";
import { Player } from "./player";
import * as THREE from 'three';

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
    isStatic = true;

    planeBox: THREE.Mesh;

    constructor(game, obj) {
        this.game = game;
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
        this.render = obj.render;
        this.collisable = !(obj.collisable == false);
        this.deadly = obj.deadly;
        this.colliderTopOnly = obj.colliderTopOnly == true;
        this.isStatic = !(obj.isStatic == false);
        this.start();
    }

    start() {
        if (this.game.dev && this.collisable && !this.render) {
            let color = (this.deadly ? 'red': (this.colliderTopOnly ? 'white': (this.isStatic ? 'green': 'black')));
            this.planeBox = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height), new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: .5 }));
            this.game.scene.add(this.planeBox);
        }
    }

    draw() {
        if (this.render) {
            this.render(this);
        } else {
            if (this.game.dev && this.collisable) {
                this.planeBox.translateX(this.x + (this.width / 2) - this.planeBox.position.x);
                this.planeBox.translateY(this.y + (this.height / 2) - this.planeBox.position.y);
            }
        }
    }

    update() {
        this.collitions();
        this.draw();
    }

    collitions() {
        if (this.collisable) {
            let shapeA: Player = this.game.player;
            let shapeB: Box = this;
            // get the vectors to check against

            var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
                vY = (shapeA.y + (shapeA.height / (shapeA.sliding ? 4 : 2))) - (shapeB.y + (shapeB.height / 2)),
                // add the half widths and half heights of the objects
                hWidths = (shapeA.width / 2) + (shapeB.width / 2),
                hHeights = (shapeA.height / (shapeA.sliding ? 4 : 2)) + (shapeB.height / 2),
                colDir = null;

            // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
            if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {         // figures out on which side we are colliding (top, bottom, left, or right)         
                var oX = hWidths - Math.abs(vX), oY = hHeights - Math.abs(vY);
                if (oX >= oY) {
                    if (vY > 0) {
                        if (shapeA.velY <= -0.6) { 
                            if (this.game.player.fallingDelay == 0 || !this.colliderTopOnly) { 
                                colDir = "b";
                                shapeA.y += (!this.colliderTopOnly ? oY : ((shapeA.y - (shapeB.y + shapeB.height)) > -15) ? oY : 0); 
                                shapeA.velY = 0;
                                if (shapeA.jumping) {
                                    shapeA.jumping = false;
                                    shapeA.jumpDelay = 10; // 10 frames
                                }
                            }
                        }
                    } else {
                        if (!this.colliderTopOnly && shapeA.velY >= 0.6) {
                            colDir = "t";
                            shapeA.y -= oY;
                            shapeA.velY = 0;
                        }
                    }
                } else {
                    if (!this.colliderTopOnly && vX > 0 && shapeA.currentSpriteDirection === 'left') {
                        colDir = "l";
                        if (shapeB.isStatic) {
                            shapeA.velX = 0;
                            shapeA.x += oX - 1;
                        } else {
                            shapeA.velX = shapeA.velX / 2;
                            shapeB.x -= oX;
                        }
                    }

                    if (!this.colliderTopOnly && vX < 0 && shapeA.currentSpriteDirection === 'right') {
                        colDir = "r";
                        
                        if (shapeB.isStatic) {
                            shapeA.velX = 0;
                            shapeA.x -= oX - 1;
                        } else {
                            shapeA.velX = shapeA.velX / 2;
                            shapeB.x += oX;
                        }
                    }
                }
            }

            if (colDir != null && this.deadly) {
                shapeA.setHealth(20);
            }
        }
    }
}