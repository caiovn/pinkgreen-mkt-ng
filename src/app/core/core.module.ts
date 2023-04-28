import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PrimengModule } from './modules/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppAuthGuard } from './guards/app.authguard';
import { LoadingComponent } from './components/loading/loading.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { CreditcardValidatorDirectiveDirective } from './directives/creditcard-validator.directive.directive';

@NgModule({
  declarations: [NavbarComponent, LoadingComponent, ShoppingCartComponent, TruncatePipe, CreditcardValidatorDirectiveDirective],
  exports: [
    NavbarComponent,
    LoadingComponent,
    ShoppingCartComponent,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    TruncatePipe,
    CreditcardValidatorDirectiveDirective
  ],
  imports: [CommonModule, PrimengModule, FormsModule, ReactiveFormsModule],
  providers: [AppAuthGuard],
})
export class CoreModule {}
