import { Box } from "./box";
import { Game } from "./game";

export class Platform {

    private game: Game
    private platforms: Box[] = [];

    constructor(_game: Game) {
        this.game = _game;
    }

    draw() {
        let data = [
            { x: 0, y: this.game.height - 48, width: 238, height: 48 },
            { x: 362, y: this.game.height - 48, width: 286, height: 48 },
            { x: 238, y: this.game.height - 16, width: 124, height: 16, deadly: true },
        ]

        this.platforms = [];

        data.forEach(element => {
            this.platforms.push(
                new Box(this.game, {
                    ...element,
                    collisable: true
                })
            );
        });

        this.platforms.forEach(p => {
            p.update()
        });
    }
}