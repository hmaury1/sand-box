import { Box } from "./box";
import { Game } from "./game";

export class Cloud {

    private game: Game
    private clouds: Box[] = [];
    private cloudsCount = 0;
    private cloudTypes = [
        (_game) => {
            return (instance: Box) => {
                instance.x = instance.x - .7;
                var background = new Image();
                background.src = "assets/png/blue-clouds.png";
                _game.ctx.fillStyle = _game.ctx.createPattern(background, 'repeat');
                _game.ctx.drawImage(background, 0, 0, 470, 250, instance.x, instance.y, 150, 50);
            }
        },
        (_game) => {
            return (instance: Box) => {
                instance.x = instance.x - .7;
                var background = new Image();
                background.src = "assets/png/blue-clouds.png";
                _game.ctx.fillStyle = _game.ctx.createPattern(background, 'repeat');
                _game.ctx.drawImage(background, 350, 320, 470, 180, instance.x, instance.y, 150, 50);
            }
        }
    ];

    constructor(_game: Game) {
        this.game = _game;
    }
    

    randomClouds() {
        if (this.cloudsCount == 100) {
            this.clouds.push(new Box(this.game, {
                x: this.game.width,
                y: this.getRandomInt(0, this.game.height / 2),
                width: 842,
                height: 604,
                color: 'blue',
                render: this.cloudTypes[this.getRandomInt(0,2)](this.game)
            }));
            this.cloudsCount = 0;
        }
        this.cloudsCount++;
        this.clouds.forEach(p => {
            if (p && p.x + p.width > 0) {
                p.update()
            } else {
                p = null;
            }
        });
    }

    initClouds() {
        this.clouds.push(new Box(this.game, {
            x: this.game.width / 4,
            y: this.getRandomInt(0, this.game.height / 2),
            width: 842,
            height: 604,
            color: 'blue',
            render: this.cloudTypes[0](this.game)
        }));
        this.clouds.push(new Box(this.game, {
            x: this.game.width / 2,
            y: this.getRandomInt(0, this.game.height / 2),
            width: 842,
            height: 604,
            color: 'blue',
            render: this.cloudTypes[1](this.game)
        }));
    }

    private getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}