import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './home-sidebar.component.html',
  styleUrl: './home-sidebar.component.scss'
})
export class HomeSidebarComponent {}
