import { GamePad } from "./game-pad";
import { Player } from "./player";
import { Level1 } from "./levels/level1";
import { Level } from "../interfaces/level";
import * as THREE from 'three';

const DEV_MODE = false;

export class Game {
    dev: boolean;
   
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    clock: THREE.Clock

    width: number;
    height: number;
    player: Player;
    keys: string[];
    gameOver: boolean;
    gamePause: boolean;
    gamePauseDelay: number;
    gameTime = 0;
    currentTime = 0;
    framesCounter = 0;
    fps = 0;
    frameRateBase = 75

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
        
    }

    start() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        document.body.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(0, this.width, this.height, 0, 0, 2000 );
        this.scene.add(this.camera);
        const light = new THREE.AmbientLight(0xffffff,);
        this.scene.add(light);
        this.addEvents();
        this.currentLevel = new Level1(this);
        this.currentLevel.drawBack();
        this.player.start();
        this.currentLevel.start();
        this.currentLevel.drawFront();

        this.clock = new THREE.Clock();
        this.update();
    }

    update = () => {
        requestAnimationFrame(this.update);
        this.gameTime += this.clock.getDelta();
        this.framesCounter++;
        if (this.gameTime >= this.currentTime + 1) { // 1 second 
            this.currentTime = this.gameTime;
            this.fps = this.framesCounter;
            this.framesCounter = 0;
        }
        
        let buttonPause = GamePad.getButton(9);
        if (buttonPause?.pressed) {
            this.pause();
        }

        if(this.gamePauseDelay > 0) {
            this.gamePauseDelay--;
        }

        if (!this.gamePause) {
            this.validateGamePad();
            this.currentLevel.draw();
            this.player.update();
            this.player.drawHealthAndMagicBar();
            this.renderer.render(this.scene, this.camera);
        }
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
            this.gamePauseDelay = this.frameRateBase / 2;
        }
    }
}