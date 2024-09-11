import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EquadleGameComponent } from "./equadle-game/equadle-game.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EquadleGameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Equadle';
}
