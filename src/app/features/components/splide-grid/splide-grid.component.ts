import {
  AfterViewInit,
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
  inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Splide from '@splidejs/splide';
import { Grid } from '@splidejs/splide-extension-grid';

import '@splidejs/splide/dist/css/splide.min.css';
@Component({
  selector: 'app-splide-grid',
  imports: [],
  templateUrl: './splide-grid.component.html',
  styleUrls: ['./splide-grid.component.scss'],
})
export class SplideGridComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mainCarousel', { static: true }) mainCarousel!: ElementRef;

  @Input() items: any[] = [];

  _translate = inject(TranslateService);
  splide!: Splide;
  langSub: any;

  ngAfterViewInit() {
    this.initSplide(this.getDirection());

    this.langSub = this._translate.onLangChange.subscribe((event) => {
      this.reInitSplide(event.lang);
    });
  }

  initSplide(direction: 'ltr' | 'rtl') {
    this.splide = new Splide(this.mainCarousel.nativeElement, {
      type: 'loop',
      perPage: 1,
      perMove: 1,
      gap: '1rem',
      pagination: false,
      direction,
    });

    this.splide.mount({ Grid });

    // thumbnails
    const thumbnails = document.getElementsByClassName('thumbnail');
    let current: HTMLElement | null = null;

    for (let i = 0; i < thumbnails.length; i++) {
      const thumbnail = thumbnails[i] as HTMLElement;
      thumbnail.addEventListener('click', () => {
        this.splide.go(i);
      });
    }

    this.splide.on('mounted move', () => {
      const thumbnail = thumbnails[this.splide.index] as HTMLElement;
      if (thumbnail) {
        if (current) {
          current.classList.remove('is-active');
        }
        thumbnail.classList.add('is-active');
        current = thumbnail;
      }
    });
  }

  private reInitSplide(lang: string) {
    if (this.splide) {
      this.splide.destroy();
    }

    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.initSplide(dir);

    document.documentElement.setAttribute('dir', dir);
  }

  private getDirection(): 'rtl' | 'ltr' {
    return this._translate.currentLang === 'ar' ? 'rtl' : 'ltr';
  }
  ngOnDestroy(): void {
    if (this.splide) {
      this.splide.destroy();
    }
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }
}
