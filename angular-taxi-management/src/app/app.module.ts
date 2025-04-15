import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaxiDetailComponent } from './taxi-detail/taxi-detail.component';
import { TaxisComponent } from './taxis/taxis.component';
import { TaxiSearchComponent } from './taxi-search/taxi-search.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
  declarations: [
    AppComponent,
    DashboardComponent,
    TaxisComponent,
    TaxiDetailComponent,
    MessagesComponent,
    TaxiSearchComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
