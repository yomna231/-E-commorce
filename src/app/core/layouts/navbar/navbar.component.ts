import {
  RouterModule,
  Router,
  RouterLinkActive,
  RouterLink,
} from '@angular/router';
import { Component, inject } from '@angular/core';
import { AuthonService } from '../../services/authontication/authon.service';
import { CartCountComponent } from '../../../features/components/cart-count/cart-count.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MytranslationService } from '../../services/translate/mytranslation.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    RouterLink,
    RouterLinkActive,
    CartCountComponent,
    CartCountComponent,
    TranslatePipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  _AuthonService = inject(AuthonService);
  _myTranslation = inject(MytranslationService);
  _Router = inject(Router);
  login: boolean = false;
  UsreNameLogged: string = '';
 

  ngOnInit() {
    this._AuthonService.isLogin.subscribe((val) => {
      this.login = val;
      console.log('navbar subscribe');
    });

    this._AuthonService.UsreName.subscribe((name) => {
      this.UsreNameLogged = name;
      console.log('user Name');
    });
  }

  SingOut() {
    localStorage.removeItem('token');
    this._AuthonService.isLogin.next(false);
    this._Router.navigate(['/login']);
  }

  switchLanguage(lang: string) {
    this._myTranslation.useLang(lang);
  }

   currentLanguage(): string {
    return this._myTranslation.getCurrentLang();
  }

  isRTL(): boolean {
    return this._myTranslation.isRTL();
  }
}
