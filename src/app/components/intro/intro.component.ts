import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css',
})
export class IntroComponent {
  constructor(private router: Router) {}
}
