import { Component } from '@angular/core';
import { AboutComponent } from '../../components/about/about.component';
import { IntroComponent } from '../../components/intro/intro.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ContactComponent } from '../../components/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, IntroComponent, FooterComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
