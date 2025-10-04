import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MytranslationService {
  private renderer: Renderer2;
  _translate = inject(TranslateService);
  _rendererFactory = inject(RendererFactory2);
  _PLATFORM_ID = inject(PLATFORM_ID);
  private currentLang = 'en';

  constructor() {
    this.renderer = this._rendererFactory.createRenderer(null, null);
    this.initLanguage();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this._PLATFORM_ID);
  }

  initLanguage() {
    if (this.isBrowser()) {
      const savedLang = localStorage.getItem('appLang') || 'en';
      this.useLang(savedLang);
    } else {
      this.useLang('en');
    }
  }

  useLang(lang: string) {
    this.currentLang = lang;
    this._translate.use(lang);

    if (this.isBrowser()) {
      this.setDirection(lang);
      localStorage.setItem('appLang', lang);
      this.updateBodyLanguageClass(lang);
    }
  }

  private setDirection(lang: string) {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const langAttr = lang === 'ar' ? 'ar' : 'en';

    this.renderer.setAttribute(document.body, 'dir', dir);
    this.renderer.setAttribute(document.body, 'lang', langAttr);
  }

  private updateBodyLanguageClass(lang: string) {
    if (!this.isBrowser()) return;

    const body = document.body;

    this.renderer.removeClass(body, 'lang-en');
    this.renderer.removeClass(body, 'lang-ar');

    this.renderer.addClass(body, `lang-${lang}`);
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  isRTL(): boolean {
    return this.currentLang === 'ar';
  }
    instant(key: string, interpolateParams?: Object): string {
    return this._translate.instant(key, interpolateParams);
  }

  
get(key: string | string[], interpolateParams?: Object) {
  return this._translate.get(key, interpolateParams);
}
}
