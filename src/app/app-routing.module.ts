import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAuthGuard } from './core/guards/app.authguard';
import { BrandComponent } from './pages/brand/brand.component';
import { CategoryComponent } from './pages/category/category.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { HomeComponent } from './pages/home/home.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { OrderComponent } from './pages/order/order.component';
import { ProductPurchaseFlowComponent } from './pages/product-purchase-flow/product-purchase-flow.component';
import { ProductComponent } from './pages/product/product.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'search', component: SearchComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'brand/:id/:name', component: BrandComponent },
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
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
