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
      'Una novela emocionante sobre decisiones, amistad y nuevos comienzos en una ciudad que nunca duerme.',
    coverUrl:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80'
  };
}
