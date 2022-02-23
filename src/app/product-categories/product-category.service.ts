import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { throwError, Observable } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';

import { ProductCategory } from './product-category';


@Injectable({
    providedIn: 'root'
})
export class ProductCategoryService {
    private productCategoriesUrl ='http://localhost:5000/product-categories';
    //private productCategoriesUrl = 'api/products/productCategories.json';

    constructor(private http: HttpClient){}

    productCategories$ = this.http.get<ProductCategory[]>(this.productCategoriesUrl)
        .pipe(
            tap(data => console.log('categories', JSON.stringify(data))),
            shareReplay(1),
            catchError(this.handleError)
        );

    private handleError(err: any): Observable<never> {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
        }
        console.error(err);
        return throwError(errorMessage);
    };
}