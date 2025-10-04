import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MytranslationService } from '../../services/translate/mytranslation.service';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe,FormsModule,CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  translationService=inject(MytranslationService)
}