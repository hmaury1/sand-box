import { Box } from "../utils/box";
import { Game } from "../utils/game";

export interface Level {
    game: Game
    boxes: Box[];
    viewport: Box;

    start: () => void;
    draw: () => void;
    drawBack: () => void;
    drawFront: () => void;
}