import { Engine } from "../utils/engine";

export interface GameObject {
    width: number;
    height: number;
    x: number;
    y: number;
    game: Engine;
    update: () => void;
    draw(): void;
}