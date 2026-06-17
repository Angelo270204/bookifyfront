import { Component } from '@angular/core';
import { HomeBookGridComponent } from './components/home-book-grid/home-book-grid.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { HomeSidePanelComponent } from './components/home-side-panel/home-side-panel.component';
import { HomeSidebarComponent } from './components/home-sidebar/home-sidebar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home-page',
  imports: [
    HomeSidebarComponent,
    HomeHeaderComponent,
    HomeHeroComponent,
    HomeBookGridComponent,
    HomeSidePanelComponent,
    FooterComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent { }
