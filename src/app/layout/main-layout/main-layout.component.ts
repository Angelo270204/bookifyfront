import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeHeaderComponent } from '../../pages/home/components/home-header/home-header.component';
import { HomeSidebarComponent } from '../../pages/home/components/home-sidebar/home-sidebar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HomeHeaderComponent, HomeSidebarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {}
