import { GameObject } from "../interfaces/game-object";
import { Level } from "../interfaces/level";
import { Box } from "./box";
import { Game } from "./game";
import { GamePad } from "./game-pad";
import * as THREE from 'three';

const PLAYER_WIDTH = 40;
const PLAYER_HEIGH = 70;
const PLAYER_SPEED = 6;
const GRAVITY = .6;
const FRICTION = .85;
const HIT_BOX_COLOR = 'blue';

export class Player implements GameObject {
    x: number;
    y: number;
    width: number; // hitboxWidth
    height: number; // hitboxHeight
    speed: number;
    velX: number;
    velY: number;
    hitBoxColor: string;
    health: number;
    magic: number;
    healthDelay: number;
    friction: number;
    gravity: number;

    jumping: boolean;
    jumpDelay: number;
    fallingDelay = 0;

    currentSprite = 0;
    currentSpriteDelay = 0;
    currentSpriteDirection = 'right';

    sliding = false;
    attacking = false;
    attackingUp = false;
    healing = false;

    jumpBlur = true;

    game: Game;
    keys = [];

    planePlayer: THREE.Mesh;
    planeHealthBar: THREE.Mesh;
    planeHealthBarContainer: THREE.Mesh;
    planeMagicBar: THREE.Mesh;
    planeMagicBarContainer: THREE.Mesh;

    textureRight: THREE.Texture;
    textureLeft: THREE.Texture;
    playerSprite: THREE.Mesh;


    constructor(_game: Game) {
        this.x = 480;
        this.y = 380;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGH;
        this.speed = PLAYER_SPEED;
        this.velX = 0;
        this.velY = 0;
        this.health = 100;
        this.magic = 100;
        this.jumping = false;
        this.jumpDelay = 0;
        this.healthDelay = 0;
        this.friction = FRICTION;
        this.gravity = GRAVITY;

        this.game = _game;
        _game.player = this;
        this.addEvents();
    }

    start() {
        // init dev playe box
        if (this.game.dev) {
            this.planePlayer = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height), new THREE.MeshBasicMaterial({ color: HIT_BOX_COLOR, transparent: true, opacity: .5 }));
            this.planePlayer.translateZ(-1);
            this.game.scene.add(this.planePlayer);
        }
        // init player sprite
        this.textureRight = new THREE.TextureLoader().load('assets/png/playerRight.png');
        this.textureRight.wrapS = this.textureRight.wrapT = THREE.RepeatWrapping;
        this.textureRight.repeat.set(1 / 8, 1 / 12);

        this.textureLeft = new THREE.TextureLoader().load('assets/png/playerLeft.png');
        this.textureLeft.wrapS = this.textureLeft.wrapT = THREE.RepeatWrapping;
        this.textureLeft.repeat.set(1 / 8, 1 / 12);

        let geometrySprite = new THREE.PlaneGeometry(128, 128);
        this.playerSprite = new THREE.Mesh(geometrySprite, new THREE.MeshLambertMaterial({ map: this.textureRight, transparent: true }));
        this.game.scene.add(this.playerSprite);
    }

    update = () => {
        this.ActionValidations();

        if (this.velX < 0.1 && this.velX > -0.1) {
            this.velX = 0;
        } else {
            this.velX *= FRICTION;
        }
        
        if (this.healing || (!this.jumping && (this.attacking || this.attackingUp))) {
            this.velX = 0;
        }
        
        this.velY -= GRAVITY;
        this.y += this.velY;

        if (this.fallingDelay > 0) {
            this.fallingDelay--;
        }

        if (this.jumpDelay > 0) {
            this.jumpDelay--;
        }

        if (this.healthDelay > 0) {
            this.healthDelay--;
        }
        this.game.currentLevel.boxes.forEach((box: Box) => {
            box.update();
        });
        this.collitions();
        this.draw();
    }

    collitions() {
        if (this.x >= this.game.currentLevel.viewport.width - this.width) {
            // right
            if (this.currentSpriteDirection == 'right') {
                this.velX = 0;
                this.x = this.game.currentLevel.viewport.width - this.width;
            }
        } else if (this.x <= 0) {
            // left
            if (this.currentSpriteDirection == 'left') {
                this.velX = 0;
                this.x = 0;
            }
        }

        if (this.y >= this.game.height - this.height) {
            // bottom
            this.y = this.game.height - this.height;
            this.velY = 0;
            if (this.jumping) {
                this.jumping = false;
            }
            this.setHealth(100);
        } else if (this.y <= 0) {
            // top
            this.y = 0;
            this.velY = 0;
        }

        this.x += this.velX;
        if (this.velX != 0) {
            if (this.x >= this.game.width / 2 && this.x < this.game.currentLevel.viewport.width - this.game.width / 2) {
                this.game.camera.translateX(this.velX);
            } else {
                if (this.x < this.game.width / 2) {
                    this.game.camera.position.set(0, this.game.camera.position.y, this.game.camera.position.z);
                }
                if (this.x > this.game.currentLevel.viewport.width - this.game.width / 2) {
                    this.game.camera.position.set(this.game.currentLevel.viewport.width - this.game.width, this.game.camera.position.y, this.game.camera.position.z);
                }
            }
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

        if (this.health == 0 || this.game.gameOver) {
            return;
        }

        // check keyBoard and Gamepad
        
        let buttonA = GamePad.getButton(0);
        let buttonB = GamePad.getButton(1);
        let buttonX = GamePad.getButton(2);
        let buttonL = GamePad.getButton(4);
        let buttonUp = GamePad.getButton(12);
        let buttonDown = GamePad.getButton(13);
        let buttonLeft = GamePad.getButton(14);
        let buttonRight = GamePad.getButton(15);

        let stickX = GamePad.getAxes(0);
        let stickY = GamePad.getAxes(1);

        // Jump
        if (this.keys['KeyZ'] || this.keys['Space'] || buttonA?.pressed) {
            if (!this.healing && !this.attacking && !this.attackingUp && !this.jumping && this.jumpBlur && this.velY == 0 && this.jumpDelay == 0) {
                if (this.keys['ArrawDown'] || buttonDown?.pressed || stickY == 1) {
                    this.currentSprite = 3;
                    this.fallingDelay = this.game.frameRateBase / 5;
                } else {
                    this.currentSprite = 0;
                    this.velY = this.speed * 2;
                }
                this.jumping = true;
                this.jumpBlur = false;

            }
        } else {
            this.jumpBlur = true;
        }

        // Move to right
        if (this.keys['ArrowRight'] || buttonRight?.pressed) {
            this.currentSpriteDirection = 'right';
            if (this.velX < this.speed) {
                this.velX++;
            }
        }

        // Move to Left
        if (this.keys['ArrowLeft'] || buttonLeft?.pressed) {
            this.currentSpriteDirection = 'left';
            if (this.velX > -this.speed) {
                this.velX--;
            }
        }

        // Move using stick
        if (stickX) {
            this.currentSpriteDirection = stickX > 0 ? 'right' : 'left';
            if (this.velX > -this.speed && this.velX < this.speed) {
                this.velX += stickX;
            }
        }

        // Attack
        if (this.keys['KeyX'] || buttonX?.pressed) {
            if(!this.healing && !this.attacking && !this.attackingUp) {
                this.currentSprite = 0;
                if (this.keys['ArrowUp'] || buttonUp?.pressed  || stickY == -1) {
                    this.attackingUp = true;
                } else {
                    this.attacking = true;
                }
            }
        }

        // slide
        if (this.keys['KeyC'] || buttonB?.pressed) {
            if(!this.healing && !this.sliding && !this.attacking && !this.attackingUp && !this.jumping && (this.velX > 1 || this.velX < -1)) {
                this.currentSprite = 0;
                this.sliding = true;
            }
        }

        // heal
        if (this.keys['KeyA'] || buttonL?.pressed) {
            if(this.magic >= 20 && !this.healing && !this.sliding && !this.attacking && !this.attackingUp && !this.jumping && this.velX == 0) {
                this.currentSprite = 0;
                this.healing = true;
            }
        }
    }

    draw() {
        this.playerSprite.visible = true;
        let currentSpriteColumn = 0;
        let currentSpriteRow = 0;
        let defaultVelocity = 0;
        let rate = 8;

        currentSpriteColumn = this.currentSprite;

        // idle
        if (this.velX == 0) {
            currentSpriteRow = 0;
        }
        // run
        if (this.velX != 0) {
            currentSpriteRow = 1;
        }
        // jump
        if (this.velY != defaultVelocity && !this.attacking) {
            rate = 16;
            currentSpriteRow = 2;
            if (this.currentSprite == 7) {
                this.currentSprite = 0;
            }
            currentSpriteColumn = this.currentSprite;
        }
        
        if (this.attacking || this.attackingUp) {
            rate = 16;
            currentSpriteRow = this.attackingUp ? 6 : (this.velY != defaultVelocity ? 8 : 4);
            if(this.currentSprite == 7) {
                this.attacking = false;
                this.attackingUp = false;
            }
        }

        if (this.healing) {
            rate = 16;
            currentSpriteRow = 7;
            if (this.currentSprite == 7) {
                this.healing = false;
                this.health += 20;
                this.magic -= 20;
                if (this.health > 100){
                    this.health = 100;
                } 
            }
        }

        if (this.sliding) {
            if (this.velY == 0) {
                rate = this.currentSprite < 2 || this.currentSprite > 4 ? 16 : 8;
                currentSpriteRow = 9;
                if(this.currentSprite == 7) {
                    this.sliding = false;
                }
            } else {
                this.sliding = false;
                
            }
        }

        if (this.health == 0){
            // death
            currentSpriteRow = 3;
            if (this.currentSprite == 7 && !this.game.gameOver) {
                this.game.gameOver = true;
            }
        }
        
        if (this.health > 0 && this.healthDelay && Math.trunc(this.healthDelay / 10) % 2 == 0) { 
            // hit
            this.playerSprite.visible = false;
        } 

        this.textureLeft.offset.x = (this.currentSpriteDirection == 'right' ? currentSpriteColumn : 7 - currentSpriteColumn) / 8;
        this.textureLeft.offset.y = currentSpriteRow / 12;
        this.textureRight.offset.x = (this.currentSpriteDirection == 'right' ? currentSpriteColumn : 7 - currentSpriteColumn) / 8;
        this.textureRight.offset.y = currentSpriteRow / 12;

        this.playerSprite.material = new THREE.MeshLambertMaterial({ map: this.currentSpriteDirection == 'right' ? this.textureRight : this.textureLeft, transparent: true });
        this.playerSprite.translateX((this.x + (this.currentSpriteDirection == 'right' ? 25 : -25) + (this.width / 2)) - this.playerSprite.position.x);
        this.playerSprite.translateY((this.y + 25 + (this.height / 2)) - this.playerSprite.position.y);

        if (this.game.dev) {
            this.planePlayer.material = new THREE.MeshBasicMaterial({ color: HIT_BOX_COLOR, transparent: true, opacity: .7 });
            this.planePlayer.translateX((this.x + (this.width / 2)) - this.planePlayer.position.x);
            this.planePlayer.translateY((this.y + (this.height / 2)) - this.planePlayer.position.y);
        }
        
        if (this.currentSpriteDelay > this.game.frameRateBase / rate) {
            this.currentSprite = this.currentSprite == 7 ? (this.health == 0 ? 7 : 0) : this.currentSprite + 1;
            this.currentSpriteDelay = 0;
        }
        this.currentSpriteDelay++;
    }

    drawHealthAndMagicBar() {
        if (this.planeHealthBarContainer) {
            this.game.scene.remove(this.planeHealthBarContainer);
        }
        this.planeHealthBarContainer = new THREE.Mesh(new THREE.PlaneGeometry(204, 12), new THREE.MeshBasicMaterial({ color: 'white' }));
        this.planeHealthBarContainer.translateX(this.game.camera.position.x + 150 - this.planeHealthBarContainer.position.x);
        this.planeHealthBarContainer.translateY(this.game.height - 50);
        this.planeHealthBarContainer.translateZ(0);
        this.game.scene.add(this.planeHealthBarContainer);

        if (this.planeMagicBarContainer) {
            this.game.scene.remove(this.planeMagicBarContainer);
        }
        this.planeMagicBarContainer = new THREE.Mesh(new THREE.PlaneGeometry(204, 12), new THREE.MeshBasicMaterial({ color: 'white' }));
        this.planeMagicBarContainer.translateX(this.game.camera.position.x + 150 - this.planeMagicBarContainer.position.x);
        this.planeMagicBarContainer.translateY(this.game.height - 70);
        this.planeMagicBarContainer.translateZ(0);
        this.game.scene.add(this.planeMagicBarContainer);

        
        if (this.planeHealthBar) {
            this.game.scene.remove(this.planeHealthBar);
        }
        this.planeHealthBar = new THREE.Mesh(new THREE.PlaneGeometry(this.health * 2, 8), new THREE.MeshBasicMaterial({ color: 'red', transparent: true }));
        this.planeHealthBar.translateX(50 + this.health - this.planeHealthBar.position.x + this.game.camera.position.x);
        this.planeHealthBar.translateY((this.game.height - 50) + this.game.camera.position.y);
        this.planeHealthBar.translateZ(0);
        this.game.scene.add(this.planeHealthBar);

        if (this.planeMagicBar) {
            this.game.scene.remove(this.planeMagicBar);
        }
        this.planeMagicBar = new THREE.Mesh(new THREE.PlaneGeometry(this.magic * 2, 8), new THREE.MeshBasicMaterial({ color: 'green', transparent: true }));
        this.planeMagicBar.translateX(50 + this.magic - this.planeMagicBar.position.x + this.game.camera.position.x);
        this.planeMagicBar.translateY((this.game.height - 70) + this.game.camera.position.y);
        this.planeMagicBar.translateZ(0);
        this.game.scene.add(this.planeMagicBar);
    }

    setHealth(hit: number = 20) {
        if (this.healthDelay <= 0) {
            let newValue = this.health - hit;
            this.health = newValue;
            this.health = this.health < 0 ? 0 : this.health;
            this.healthDelay = this.game.frameRateBase;
        }
    }
}