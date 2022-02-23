import { ChangeDetectionStrategy, Component } from "@angular/core";
import { combineLatest, EMPTY, Subject } from "rxjs";
import { catchError, filter, map } from "rxjs/operators";

import { ProductService } from "../product.service";

@Component({
    selector: 'rpm-product-detail-alt',
    templateUrl: './product-detail-alt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailAltComponent {  
    private errorMessageSubject = new Subject<string>();
    errorMessage$ = this.errorMessageSubject.asObservable();

    constructor(private productService: ProductService){}

    // getting the data..?
    product$ = this.productService.selectedProduct$.pipe(
        catchError(err => {
            this.errorMessageSubject = err;
            return EMPTY;
        })
    );
    
    pageTitle$ = this.product$.pipe(
        map(p => p ? `Product Detal For : ${p.productName}`: null)
    );

    // Getting supplier data from product.service
    productSuppliers$ = this.productService.selectedProductSupplier$.pipe(
        catchError(err => {
            this.errorMessageSubject.next(err);
            return EMPTY;
        })
    );

    // Combining all the streams so that we dont need to async 3 times in the html
    // destructuring needs () inside square brackets.
    vm$ = combineLatest([
        this.product$,
        this.productSuppliers$,
        this.pageTitle$
    ]).pipe(
        filter(([product]) => Boolean(product)),
        map(([product, productSuppliers, pageTitle]) =>
            ({ product, productSuppliers, pageTitle }))
    );
} 