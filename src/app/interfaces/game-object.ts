import { Game } from "../utils/game";

export interface GameObject {
    width: number;
    height: number;
    x: number;
    y: number;
    game: Game;
    update: () => void;
    draw(): void;
    collitions(): void;
}