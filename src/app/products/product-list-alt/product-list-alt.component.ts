import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EMPTY, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { ProductService } from "../product.service";

@Component({
    selector: 'rpm-product-list',
    templateUrl: './product-list-alt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
    pageTitle = 'Products-Alt';
    private errorMessageSubject = new Subject<string>(); // so that error msg is shown in the UI?
    errorMessage$ = this.errorMessageSubject.asObservable();

    constructor(private productService: ProductService){}

    // All Products with their categories.
    productsWithCategories$ = this.productService.productDetailsWithCategory$.pipe(
        catchError(err => {
            this.errorMessageSubject.next(err);
            return EMPTY;
        })
    );

    // Selected product to higlight the entry
    selectedProduct$ = this.productService.selectedProduct$;
    
    onSelected(productId: number): void {
        this.productService.selectedProductChanged(productId);
    }
}