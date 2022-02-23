import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, throwError } from "rxjs";
import { catchError, concatMap, map, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";
import { ISupplier } from "../products/product";


@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    supplierUrl = "http://localhost:5000/suppliers"; //"api/suppliers/suppliers.json";
    
    // Higher order observables.
    constructor(private http: HttpClient){
        // this.supplierWithMap$.subscribe(o => o.subscribe(
        //     item => console.log('Map Result: ', item)
        // ));
        // this.supplierWithConcatMap$.subscribe(item => console.log('concatMap result : ', item))
        // this.supplierWithMergeMap$.subscribe(item => console.log('mergeMap result : ', item))
        // this.supplierWithSwitchMap$.subscribe(item => console.log('switchMap result :', item))
        
    }

    // Get all suppliers
    suppliers$ = this.http.get<ISupplier[]>(this.supplierUrl).pipe(
        tap(data => console.log('Suppliers :', JSON.stringify(data))),
        shareReplay(1),
        catchError(this.handleError)
    );

    supplierWithMap$ = of(1, 5, 8)
        .pipe(
            map(id => this.http.get<ISupplier>(`${this.supplierUrl}/${id}`))
        )
    
    // using concatMap
    supplierWithConcatMap$ = of(1, 5, 8).pipe(
        tap(id => console.log('concatMap source Observable ', id)),
        concatMap(id => this.http.get<ISupplier>(`${this.supplierUrl}/${id}`))
    )

    // Using mergeMap
    supplierWithMergeMap$ = of(1, 5, 8).pipe(
        tap(id => console.log('mergeMap source Observable ', id)),
        mergeMap(id => this.http.get<ISupplier>(`${this.supplierUrl}/${id}`))
    )

    // Using switchMap
    supplierWithSwitchMap$ = of(1, 5, 8).pipe(
        tap(id => console.log('switchMap source Observable ', id)),
        switchMap(id => this.http.get<ISupplier>(`${this.supplierUrl}/${id}`))
    )

    private handleError(err: any){
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