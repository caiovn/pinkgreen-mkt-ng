import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PrimengModule } from './modules/primeng/primeng.module';
import { CategoryService } from './services/category.service';
import { BrandService } from './services/brand.service';

@NgModule({
  declarations: [NavbarComponent],
  exports: [NavbarComponent, PrimengModule],
  imports: [CommonModule, PrimengModule],
  providers: [CategoryService, BrandService],
})
export class CoreModule {}
