import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './home/pagenotfound.component';
import { ProductModule } from './products/product.module';
import { AboutUsComponent } from './home/about-us.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PageNotFoundComponent,
    AboutUsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'welcome' ,component: WelcomeComponent },
      { path: 'about' ,component: AboutUsComponent },
      { path: '' , redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**' , component: PageNotFoundComponent },
    ]),
    ProductModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
