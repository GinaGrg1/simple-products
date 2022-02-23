import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

// Here we make a guard to make sure that the productUrl does not have id < 0 or strings.
// We need to navigate back to products page so the Router so need to import that.

@Injectable({
  providedIn: 'root'
})
export class ProductDetailGuard implements CanActivate {

  constructor(private router: Router){}

  // ActivatedRouteSnapshot contains the information about a route at any particular moment in time
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const id = Number(route.paramMap.get('id'));
    if (isNaN(id) || id < 1){
      alert('Invalid Product ID.'); // In real world navigate to 404 page.
      this.router.navigate(['/products']);
      return false;
    }
    return true;
  }
}
