import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {  DashboardComponent } from "./components/dashboard/dashboard";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'book-management';
}
