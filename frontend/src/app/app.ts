import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <- Súper importante importar RouterOutlet
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  // Este componente se queda limpio. Es el "marco" de tu aplicación.
}
