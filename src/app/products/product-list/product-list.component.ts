import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from "../product";
import { ProductService } from "../product.service";

@Component({
    templateUrl: "./product-list.component.html",
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
    pageTitle: string = "Product List";
    imageWidth: number = 25;
    imageMargin: number = 2;
    showImage: boolean = true;
    filteredProducts: IProduct[] = [];
    products: IProduct[] = [];
    errMessage: string = '';
    sub!: Subscription;
    
    constructor(private productService: ProductService){} // Injectable
    
    private _listFilter: string = '';
    get listFilter(): string {
        return this._listFilter;
    }

    // setter. We only want to display the output of filteredProducts
    set listFilter(value: string){
        this._listFilter = value;
        this.filteredProducts = this.performFilter(value);
    }

    // Func to show only items that are filteredby.
    performFilter(filterBy: string): IProduct[] {
        filterBy = filterBy.toLocaleLowerCase();

        return this.products.filter((product: IProduct) => 
            product.productName.toLocaleLowerCase().includes(filterBy)
        );
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    // Assign the value to the setter function not the property (ie. _listFilter)
    ngOnInit(): void {
        this.sub = this.productService.getProducts().subscribe({
            next: products => {
                this.products = products;
                this.filteredProducts = this.products;},
            error: err => this.errMessage = err
        });
    }
    
    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    onRatingClicked(message: string): void{
        this.pageTitle = `Product List : ${message}`;
    }
}
