import {
  APP_INITIALIZER,
  DEFAULT_CURRENCY_CODE,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { BrandComponent } from './pages/brand/brand.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { SearchComponent } from './pages/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductPurchaseFlowComponent } from './pages/product-purchase-flow/product-purchase-flow.component';
import { PersonalDataComponent } from './pages/product-purchase-flow/steps/personal-data/personal-data.component';
import { PaymentDataComponent } from './pages/product-purchase-flow/steps/payment-data/payment-data.component';
import { OrderSummaryComponent } from './pages/product-purchase-flow/steps/order-summary/order-summary.component';
import { AppAuthGuard } from './core/guards/app.authguard';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'pinkgreen-mkt',
        clientId: 'pinkgreen-mkt-frontend',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CategoryComponent,
    ProductComponent,
    BrandComponent,
    FavoritesComponent,
    SearchComponent,
    ProductPurchaseFlowComponent,
    PersonalDataComponent,
    PaymentDataComponent,
    OrderSummaryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    KeycloakAngularModule,
    CoreModule,
    SlickCarouselModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    MessageService,
    provideNgxMask(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
