import { Component } from '@angular/core';

interface BookCard {
  title: string;
  author: string;
  category: string;
}

@Component({
  selector: 'app-home-book-grid',
  templateUrl: './home-book-grid.component.html',
  styleUrl: './home-book-grid.component.scss'
})
export class HomeBookGridComponent {
  protected readonly books: BookCard[] = [
    {
      title: 'El jardin de las cartas perdidas',
      author: 'Clara Medina',
      category: 'Novela'
    },
    {
      title: 'Habitos de una mente en calma',
      author: 'Laura Gomez',
      category: 'Bienestar'
    },
    {
      title: 'Historias minimas del universo',
      author: 'Nora Collins',
      category: 'Ciencia'
    },
    {
      title: 'El oficio de liderar equipos',
      author: 'Carlos Mills',
      category: 'Negocios'
    },
    {
      title: 'Sabores de invierno',
      author: 'Alicia Turner',
      category: 'Cocina'
    },
    {
      title: 'Viajar despacio',
      author: 'Kevin Stone',
      category: 'Viajes'
    }
  ];
}
