import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PrimengModule } from './modules/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppAuthGuard } from './guards/app.authguard';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [NavbarComponent, LoadingComponent],
  exports: [NavbarComponent, LoadingComponent, PrimengModule, FormsModule, ReactiveFormsModule],
  imports: [CommonModule, PrimengModule, FormsModule, ReactiveFormsModule],
  providers: [AppAuthGuard],
})
export class CoreModule {}
