import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../product';
import { ProductService } from '../product.service';

// We dont need the selector here as this component will not be nested in another component.
@Component({
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  pageTitle : string = 'Product Detail';
  product: IProduct | undefined;
  errorMessage = '';
  
  // we need this so that it is routed to product details page
  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService) { } 

  // The parameter wont change while the component is displayed so we use snapshot approach
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getProduct(id);
    }
  }

  getProduct(id: number){
    this.productService.getProduct(id).subscribe(
      {next: product => this.product = product,
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }
}




