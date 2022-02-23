import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable, of, Subject, throwError } from "rxjs";
import { catchError, filter, map, scan, shareReplay, switchMap, tap } from "rxjs/operators"

import { IProduct, IProductsDisplay, IProductSupply, ISupplier } from "./product";
import { ProductCategoryService } from "../product-categories/product-category.service";
import { SupplierService } from "../suppliers/supplier.service";

// We are using this to extract data from backend/apis
@Injectable({
    providedIn: 'root'
})
export class ProductService {
    mainUrl = 'http://localhost:5000/';

    productUrl = `${this.mainUrl}products`; //"api/products/products.json";
    productDisplayUrl = `${this.mainUrl}products-display`; //"api/products/productsDisplay.json";
    productSupplyUrl = `${this.mainUrl}products-supply`; //"api/products/productSupply.json";

    private supplierUrl = this.supplierService.supplierUrl;

    // Angular will inject the HttpClient service instance to this variable http.
    constructor(private http: HttpClient,
                private productCategoryService: ProductCategoryService,
                private supplierService: SupplierService
                ){}

    // When we get a response back, this get method will automatically map the
    // returned response to an array of products.
    // tap operator accesses the emitted item without modifying it. Takes an arrow func.
    getProducts(): Observable<IProduct[]> {
        const returnedObservable = this.http.get<IProduct[]>(this.productUrl);
        return returnedObservable.pipe(
            tap(data => console.log('ALL: ', JSON.stringify(data))),
            catchError(this.handleError)
            );
        };
        
        
    // All products. From products.json
    products$ = this.http.get<IProduct[]>(this.productUrl).pipe(
        tap(data => console.log('Products loaded from products.json', data.length)),
        catchError(this.handleError)
    );


    // For use in product-list-alt
    productSupply$ = this.http.get<IProductSupply[]>(this.productSupplyUrl).pipe(
        tap(data => console.log('Products Alt: ', JSON.stringify(data))),
        catchError(this.handleError)
    )

    // Only select one product.
    getProduct(id: number){
        return this.getProducts().pipe(
            map((products: IProduct[]) => products.find(p => p.productId === id))
        );
    }

    // Using Declarative Pattern.
    displayProducts$ = this.http.get<IProductsDisplay[]>(this.productDisplayUrl)
        .pipe(
            tap(data => console.log('Product Display: ', JSON.stringify(data))),
            catchError(this.handleError)
        )

    // Trying to merge productCategories.json & productDisplay.json product on category id 
    // and display the name. This is for product-detail-alt
    productDetailsWithCategory$ = combineLatest([
        this.displayProducts$,
        this.productCategoryService.productCategories$
    ]).pipe(
        map(([products, categories]) =>
              products.map(product => ({
                ...product,
                price: product.price! * 1,
                category: categories.find(c => product.categoryId === c.id)?.name,
                searchKey: [product.productName]
            }) as IProductsDisplay)
        )
    );

    // Get the item selected by the user, ie. selection in `Products-Alt`
    // Then combine this action with productDetailsWithCategory.
    private productSelectedSubject = new BehaviorSubject<number>(0);
    productSelectedAction$ = this.productSelectedSubject.asObservable();
    
    // This is for product-detail-alt. Merge what is selected
    selectedProduct$ = combineLatest([
        this.productDetailsWithCategory$,
        this.productSelectedAction$
    ]).pipe(
        map(([products, selectedProductId]) => 
            products.find(product => product.id === selectedProductId)),
        shareReplay(1)
    )
    
    // When user clicks on the selected product [in Products-Alt]
    selectedProductChanged(selectedProductId: number): void {
        this.productSelectedSubject.next(selectedProductId);
    }

    // For adding new product. The new array will be merged with all products list.
    private productInsertedSubject = new Subject<IProductsDisplay>();
    productInsertedAction$ = this.productInsertedSubject.asObservable();

    // The resulting merged stream will emit both Product & Product array items.
    productWithAdd$ = merge(
        this.productDetailsWithCategory$,
        this.productInsertedAction$
    ).pipe(
        scan((acc, value) =>(value instanceof Array) ? [...value] : [...acc, value], [] as IProductsDisplay[]),
        catchError(err => {
            console.log(err);
            return throwError(err);
        })
    );

    // Adding fake product. In real work it will come from the UI.
    // Use the next method on the action stream to emit the new product.
    addProduct(newProduct?: IProductsDisplay){
        newProduct = newProduct || this.fakeProduct();
        this.productInsertedSubject.next(newProduct);
    }

    private fakeProduct(){
        return {
            id: 42,
            productName: "New Product",
            productCode: "NEW-0099",
            description: "Our new product",
            price: 99.9,
            categoryId: 3,
            category: 'Toolbox',
            quantityInStock: 50
        }
    }

    // Adding suppliers info. We will use this stream in product-detail-alt.component.ts
    //This is 'Get it all' method.
    // selectedProductSupplier$ = combineLatest([
    //     this.selectedProduct$,
    //     this.supplierService.suppliers$
    // ]).pipe(
    //     map(([selectedProduct, suppliers]) =>
    //     suppliers.filter(supplier => selectedProduct?.supplierIds?.includes(supplier.id))
    // ));

    //'Just in time' approach.
    // filter out if the selected process is undefined or null, for eg when page loads for the first time.
     selectedProductSupplier$ = this.selectedProduct$.pipe(
         filter(product => Boolean(product)),
         switchMap(selectedProduct => {
             if (selectedProduct?.supplierIds){
                 return forkJoin(selectedProduct.supplierIds.map(supplierId =>
                    this.http.get<ISupplier>(`${this.supplierUrl}/${supplierId}`)))
             } else {
                 return of([]);
             }
         }),
         tap(suppliers => console.log('Product Suppliers JIT :', JSON.stringify(suppliers)))
     )


    private handleError(err: HttpErrorResponse){
        // instead of just logging, we can send the server to somewhere else
        let errorMessage: string;
        if (err.error instanceof ErrorEvent){
            // A client-side or network error occurred.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`
        }
        console.error(err);
        return throwError(errorMessage);
    }
}