import {
  APP_INITIALIZER,
  DEFAULT_CURRENCY_CODE,
  NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrandComponent } from './pages/brand/brand.component';
import { CategoryComponent } from './pages/category/category.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductPurchaseFlowComponent } from './pages/product-purchase-flow/product-purchase-flow.component';
import { OrderSummaryComponent } from './pages/product-purchase-flow/steps/order-summary/order-summary.component';
import { PaymentDataComponent } from './pages/product-purchase-flow/steps/payment-data/payment-data.component';
import { PersonalDataComponent } from './pages/product-purchase-flow/steps/personal-data/personal-data.component';
import { ProductComponent } from './pages/product/product.component';
import { SearchComponent } from './pages/search/search.component';
import { PurchaseFinishedComponent } from './pages/product-purchase-flow/steps/purchase-finished/purchase-finished.component';
import { OrderComponent } from './pages/order/order.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { CatalogAdministrationComponent } from './pages/catalog-administration/catalog-administration.component';

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
    PurchaseFinishedComponent,
    OrderComponent,
    OrderDetailsComponent,
    CatalogAdministrationComponent,
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
    CalendarModule
  ],
  providers: [
    MessageService,
    DatePipe,
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
export class AppModule { }
