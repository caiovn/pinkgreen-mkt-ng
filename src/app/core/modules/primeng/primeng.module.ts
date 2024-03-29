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
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ChipsModule } from 'primeng/chips';
import { OverlayModule } from 'primeng/overlay';

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
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    SidebarModule,
    InputTextareaModule,
    TagModule,
    AccordionModule,
    InputNumberModule,
    MultiSelectModule,
    DialogModule,
    DynamicDialogModule,
    KeyFilterModule,
    ChipsModule,
    OverlayModule,
  ],
})
export class PrimengModule {}
