import { Level } from "../../interfaces/level";
import { Box } from "../box";
import { Game } from "../game";
import * as THREE from 'three';

const TEXTURE_BACK = new THREE.TextureLoader().load('assets/png/level1Back.png');
const TEXTURE_FRONT = new THREE.TextureLoader().load('assets/png/level1Front.png');
const TEXTURE_BACKGROUND1 = new THREE.TextureLoader().load('assets/png/level1/bakcground_night1.png');
const TEXTURE_BACKGROUND2 = new THREE.TextureLoader().load('assets/png/level1/bakcground_night2.png');
const TEXTURE_BACKGROUND3 = new THREE.TextureLoader().load('assets/png/level1/bakcground_night3.png');

export class Level1 implements Level {

    game: Game
    boxes: Box[] = [];
    viewport: Box;
    
    planeBackground1: THREE.Mesh[];
    planeBackground2: THREE.Mesh[];
    planeBackground3: THREE.Mesh[];

    planeBox1: THREE.Mesh;

    constructor(_game: Game) {
        this.game = _game;

         // TO DO
        this.planeBox1 = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshBasicMaterial({ color: 'yellow', transparent: true, opacity: .5 }));
        this.planeBox1.translateY(48 + 30);
        this.game.scene.add(this.planeBox1);
        this.planeBackground1 = [];
        this.planeBackground2 = [];
        this.planeBackground3 = [];
        this.viewport = new Box(this.game, { x: 3840 / 2, y: 1080 / 2, width: 3840, height: 1080, collisable: false, render: (instance) => {}});
    }

    start() {
        this.boxes = [
            new Box(this.game, { x: 0,   y:  0, width: 240,    height: 48}),
            new Box(this.game, { x: 1000,   y:  48, width: 60,  height: 60, isStatic: false, render: this.moveableBoxRender}),
            new Box(this.game, { x: 372, y:  0, width: 270,    height: 48 }),
            new Box(this.game, { x: 240, y:  0, width: 132,    height: 1, deadly: true }),
            new Box(this.game, { x: 643, y:  0, width: 280,    height: 1, deadly: true }),
            new Box(this.game, { x: 710, y:  122, width: 123,  height: 38 }),
            new Box(this.game, { x: 435, y:  222, width: 123,  height: 38 }),
            new Box(this.game, { x: 421, y:  368, width: 146,  height: 12, colliderTopOnly: true }),
            new Box(this.game, { x: 710, y:  452, width: 123,  height: 38 }),
            new Box(this.game, { x: 923, y:  0, width: 2919,   height: 48 }),
        ];
    }

    draw() {
        this.updateBackgrounds();
    }

    moveableBoxRender = (instance) => {
        this.planeBox1.translateX(instance.x + (instance.width / 2) - this.planeBox1.position.x);
    } 

    viewportRender(instance) {
        const geometryBack = new THREE.PlaneGeometry(instance.width, instance.height);
        geometryBack.translate(instance.x, instance.y, 0);
        const materialBack = new THREE.MeshLambertMaterial({ map: TEXTURE_BACK, transparent: true });
        const planeBack = new THREE.Mesh(geometryBack, materialBack);
        this.game.scene.add(planeBack);

        
    }

    drawBack() {
        for (let index = 0; index < 4; index++) {
            const geometryBackground1 = new THREE.PlaneGeometry(1920, 1080);
            geometryBackground1.translate((index * this.game.width), 0 + this.game.height / 2, -5);
            this.planeBackground1.push(new THREE.Mesh(geometryBackground1, new THREE.MeshLambertMaterial({ map: TEXTURE_BACKGROUND1, transparent: true })));
            this.game.scene.add(this.planeBackground1[index]);
        }

        for (let index = 0; index < 4; index++) {
            const geometryBackground2 = new THREE.PlaneGeometry(1920, 1080);
            geometryBackground2.translate((index * this.game.width), 0 + this.game.height / 2, -4);
            this.planeBackground2.push(new THREE.Mesh(geometryBackground2, new THREE.MeshLambertMaterial({ map: TEXTURE_BACKGROUND2, transparent: true })));
            this.game.scene.add(this.planeBackground2[index]);
        }

        for (let index = 0; index < 8; index++) {
            const geometryBackground3 = new THREE.PlaneGeometry(1920, 1080);
            geometryBackground3.translate((index * this.game.width), 0 + this.game.height / 2, -3);
            this.planeBackground3.push(new THREE.Mesh(geometryBackground3, new THREE.MeshLambertMaterial({ map: TEXTURE_BACKGROUND3, transparent: true })));
            this.game.scene.add(this.planeBackground3[index]);
        }

        // Back tileMap
        new Box(this.game, { x: 3840 / 2, y: 1080 / 2, width: 3840, height: 1080, collisable: false, render: (instance) => {
            const geometryFront = new THREE.PlaneGeometry(instance.width, instance.height);
            geometryFront.translate(instance.x, instance.y, 0);
            const materialFront = new THREE.MeshLambertMaterial({ map: TEXTURE_BACK, transparent: true });
            const planeFront = new THREE.Mesh(geometryFront, materialFront);
            this.game.scene.add(planeFront);
        }}).draw();
    }

    drawFront() {
        // Front tileMap
        new Box(this.game, { x: 3840 / 2, y: 1080 / 2, width: 3840, height: 1080, collisable: false, render: (instance) => {
            const geometryFront = new THREE.PlaneGeometry(instance.width, instance.height);
            geometryFront.translate(instance.x, instance.y, 0);
            const materialFront = new THREE.MeshLambertMaterial({ map: TEXTURE_FRONT, transparent: true });
            const planeFront = new THREE.Mesh(geometryFront, materialFront);
            this.game.scene.add(planeFront);
        }}).draw();
    }

    updateBackgrounds() {
        if (this.game.player.x >= this.game.width / 2 && this.game.player.x < this.game.currentLevel.viewport.width - this.game.width / 2) {
            for (let index = 0; index < this.planeBackground2.length; index++) {
                this.planeBackground2[index].translateX(-this.game.player.velX / 8);
            }
            for (let index = 0; index < this.planeBackground3.length; index++) {
                this.planeBackground3[index].translateX(-this.game.player.velX / 4);
            }
        }
        
    }
}