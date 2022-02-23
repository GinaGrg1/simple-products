import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BehaviorSubject, combineLatest, EMPTY, Subject } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { ProductCategoryService } from "../../product-categories/product-category.service";
import { ProductService } from "../product.service";

@Component({
    templateUrl: "./product-display.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDisplayComponent {
    pageTitle = 'Products Display';
    errorMessage = '';

    // categoryId that the user will select?
    private categorySelectedSubject = new BehaviorSubject<number>(0);
    categorySelectedAction$ = this.categorySelectedSubject.asObservable();
    
    constructor(private productService: ProductService,
                private productCategoryService: ProductCategoryService){}

    // data from joining productCategories.json & productsDisplay.json
    displayProducts$ = combineLatest([
        this.productService.productWithAdd$,
        this.categorySelectedAction$
    ]).pipe(
        map(([products, selectedCategoryId]) =>
              products.filter(product =>
                selectedCategoryId ? product.categoryId === selectedCategoryId : true
            )
        ),
        tap(products => console.log('added product: ', JSON.stringify(products))),
        catchError(err => {
            this.errorMessage = err;
            return EMPTY  // can also use of([])
        })
    )
        
    // data from productCategories.json to populate the drop down
    categories$ = this.productCategoryService.productCategories$.pipe(
        catchError(err => {
            this.errorMessage = err;
            return EMPTY;
        })
    )
    
    // To be able to use the drop down filter.
    // If categoryId is eq to selectedCategoryId then take it else true, ie, show all.
    // productsDisplayFilter$ = this.productService.productWithCategory$.pipe(
    //     map(products =>
    //         products.filter(product =>
    //                         this.selectedCategoryId ? product.categoryId == this.selectedCategoryId : true))
    // );
    

    // Since the action stream [to add new Product] is defined in the product.service we will 
    // define the method addProduct there.
    onAdd(): void {
        this.productService.addProduct()
    };

    onSelected(categoryId: string): void {
        this.categorySelectedSubject.next(+categoryId);
    }

    // onSelected(categoryId: string): void {
    //     console.log(this.categorySelectedSubject.next(+categoryId));
    //     this.categorySelectedSubject.next(+categoryId);
    // }

    // Declarative way. Adding $ means it is observable
    // displayProducts$ = this.productService.displayProducts$
    //     .pipe(
    //         catchError(err => {
    //             this.errorMessage = err;
    //             return EMPTY  // can also use of([])
    //         })
    //     )

    // The common way to get data from the http request
    //displayProducts$!: Observable<IProductsDisplay[]>;
    //
    // ngOnInit(): void {
    //     this.displayProducts$ = this.productService.getProductDisplays()
    //         .pipe(
    //             catchError(err => {
    //                 this.errorMessage = err;
    //                 return of([]);  // catch and replace. Can also use EMPTY
    //             })
    //         )
    // }
} 
