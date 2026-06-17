import { Component } from '@angular/core';
import { HomeBookGridComponent } from './components/home-book-grid/home-book-grid.component';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { HomeSidePanelComponent } from './components/home-side-panel/home-side-panel.component';

@Component({
  selector: 'app-home-page',
  imports: [
    HomeHeroComponent,
    HomeBookGridComponent,
    HomeSidePanelComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent { }
