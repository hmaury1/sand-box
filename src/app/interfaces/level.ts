import { Box } from "../utils/box";
import { Game } from "../utils/game";

export interface Level {
    game: Game
    boxes: Box[];
    viewport: Box;
    velX: number

    drawBackground: () => void;
}