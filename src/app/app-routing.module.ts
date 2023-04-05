import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAuthGuard } from './core/guards/app.authguard';
import { BrandComponent } from './pages/brand/brand.component';
import { CategoryComponent } from './pages/category/category.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { HomeComponent } from './pages/home/home.component';
import { OrderComponent } from './pages/order/order.component';
import { ProductPurchaseFlowComponent } from './pages/product-purchase-flow/product-purchase-flow.component';
import { ProductComponent } from './pages/product/product.component';
import { SearchComponent } from './pages/search/search.component';
import { CatalogAdministrationComponent } from './pages/catalog-administration/catalog-administration.component';
import { OrderAdministrationComponent } from './pages/order-administration/order-administration.component';
import { OrderDetailsComponent } from './pages/order/pages/order-details/order-details.component';
import { OrderAdministrationDetailsComponent } from './pages/order-administration/pages/order-administration-details/order-administration-details.component';
import { CreateEditBrandComponent } from './pages/catalog-administration/pages/create-edit-brand/create-edit-brand.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'brand/:id', component: BrandComponent },
  {
    path: 'favorites',
    canActivate: [AppAuthGuard],
    component: FavoritesComponent,
  },
  {
    path: 'purchase',
    canActivate: [AppAuthGuard],
    component: ProductPurchaseFlowComponent,
  },
  {
    path: 'order',
    canActivate: [AppAuthGuard],
    component: OrderComponent,
  },
  {
    path: 'order/:id',
    canActivate: [AppAuthGuard],
    component: OrderDetailsComponent,
  },
  {
    path: 'catalog-administration',
    canActivate: [AppAuthGuard],
    component: CatalogAdministrationComponent,
  },
  {
    path: 'catalog-administration/brand',
    canActivate: [AppAuthGuard],
    component: CreateEditBrandComponent,
  },
  {
    path: 'catalog-administration/brand/:id',
    canActivate: [AppAuthGuard],
    component: CreateEditBrandComponent,
  },
  {
    path: 'order-administration',
    canActivate: [AppAuthGuard],
    component: OrderAdministrationComponent,
  },
  {
    path: 'order-administration/:id',
    canActivate: [AppAuthGuard],
    component: OrderAdministrationDetailsComponent,
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
