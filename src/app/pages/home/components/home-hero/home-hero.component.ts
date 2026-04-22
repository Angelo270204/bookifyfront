import { Component } from '@angular/core';

@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss'
})
export class HomeHeroComponent {
  protected readonly featured = {
    title: 'El mapa de los dias imposibles',
    author: 'Valentina Torres',
    description:
      'Una novela emocionante sobre decisiones, amistad y nuevos comienzos en una ciudad que nunca duerme.'
  };
}
