import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/layouts/navbar/navbar.component";
import { NgxSpinnerModule } from "ngx-spinner"
import { FooterComponent } from "./core/layouts/footer/footer.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent, NgxSpinnerModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ecom';
}
 