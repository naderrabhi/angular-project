import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  constructor(private router: Router) {}
}
