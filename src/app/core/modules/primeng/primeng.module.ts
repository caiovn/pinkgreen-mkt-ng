import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { StepsModule } from 'primeng/steps';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    ButtonModule,
    MenubarModule,
    InputTextModule,
    MenuModule,
    ToastModule,
    ProgressSpinnerModule,
    CardModule,
    RatingModule,
    TableModule,
    StepsModule,
  ],
})
export class PrimengModule {}
