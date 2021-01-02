import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/utils/game';
import { Player } from 'src/app/utils/player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  public game;

  constructor() { }

  ngOnInit(): void {
    this.game = new Game();
    this.game.start();
  }

}
