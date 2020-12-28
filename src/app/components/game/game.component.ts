import { Component, OnInit } from '@angular/core';
import { Engine } from 'src/app/utils/engine';
import { Player } from 'src/app/utils/player';

const CANVAN_WITDH = 800;
const CANVAN_HEIGH = 600;
const GRAVITY = .6;
const FRICTION = .85;
const PLAYER_WIDTH = 16;
const PLAYER_HEIGH = 16;
const PLAYER_COLOR = 'red';
const PLAYER_SPEED = 6;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  public game;

  constructor() { }

  ngOnInit(): void {
    this.game = new Engine(CANVAN_WITDH, CANVAN_HEIGH, FRICTION, GRAVITY);
    new Player(this.game, PLAYER_WIDTH, PLAYER_HEIGH, PLAYER_COLOR, PLAYER_SPEED);
    this.game.start();
  }

}
