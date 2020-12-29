import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/utils/game';
import { Player } from 'src/app/utils/player';

const CANVAN_WITDH = 800;
const CANVAN_HEIGH = 600;
const GRAVITY = .6;
const FRICTION = .85;
const PLAYER_WIDTH = 16;
const PLAYER_HEIGH = 32; 
const PLAYER_COLOR = 'black';
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

    var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    CANVAN_WITDH = win.innerWidth || docElem.clientWidth || body.clientWidth,
    CANVAN_HEIGH = win.innerHeight|| docElem.clientHeight|| body.clientHeight;

    this.game = new Game(CANVAN_WITDH - 50, CANVAN_HEIGH - 50, FRICTION, GRAVITY);
    new Player(this.game, PLAYER_WIDTH, PLAYER_HEIGH, PLAYER_COLOR, PLAYER_SPEED);
    this.game.start();
  }

}
