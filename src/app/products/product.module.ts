import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductDetailGuard } from './product-detail.guard';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDisplayComponent } from './product-display/product-display.component';
import { ProductListAltComponent } from './product-list-alt/product-list-alt.component';
import { ProductShellComponent } from './product-list-alt/product-shell.component';
import { ProductDetailAltComponent } from './product-list-alt/product-detail-alt.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductDisplayComponent,
    ProductListAltComponent,
    ProductShellComponent,
    ProductDetailAltComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'products' , component: ProductListComponent },
      { path: 'products-display', component: ProductDisplayComponent},
      { path: 'products-alt', component: ProductShellComponent},
      {
        path: 'products/:id',
        canActivate: [ProductDetailGuard],
        component: ProductDetailComponent
      }
    ])
    ]
})
export class ProductModule { }
