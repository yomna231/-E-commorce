import { Component, input } from '@angular/core';
import { Category } from '../../interface/product';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-slider-categories',
  imports: [CarouselModule],
  templateUrl: './slider-categories.component.html',
  styleUrl: './slider-categories.component.scss'
})
export class SliderCategoriesComponent {
 
readonly category = input.required<Category[]>();

customOptions: OwlOptions = {
  loop: true,
  autoplayTimeout: 4000,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: false,
  margin:5,
  dots: false,
  navSpeed: 700,
  navText: ['', ''],
  responsive: {
    0: {
      items: 1
    },
    400: {
      items: 2
    },
    740: {
      items: 3
    },
    940: {
      items: 4
    }
  },
  nav: true,
  rtl:true
}


ngOnInit():void{
  console.log(this.category());

}

}
