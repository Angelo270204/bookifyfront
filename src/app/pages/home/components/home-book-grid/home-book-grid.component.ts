import { Component } from '@angular/core';

interface BookCard {
  title: string;
  author: string;
  category: string;
  coverUrl: string;
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
      category: 'Novela',
      coverUrl: 'https://images.unsplash.com/photo-1524578271613-b5d0d2d2c2d9?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'Habitos de una mente en calma',
      author: 'Laura Gomez',
      category: 'Bienestar',
      coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'Historias minimas del universo',
      author: 'Nora Collins',
      category: 'Ciencia',
      coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'El oficio de liderar equipos',
      author: 'Carlos Mills',
      category: 'Negocios',
      coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'Sabores de invierno',
      author: 'Alicia Turner',
      category: 'Cocina',
      coverUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'Viajar despacio',
      author: 'Kevin Stone',
      category: 'Viajes',
      coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80'
    }
  ];
}
