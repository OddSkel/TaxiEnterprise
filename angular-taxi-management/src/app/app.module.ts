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
import { MotoristaComponent } from './motorista/motorista.component';
import { MotoristaDetailComponent } from './motorista-detail/motorista-detail.component';
import { MotoristaSearchComponent } from './motorista-search/motorista-search.component';
import { ConfortoComponent } from './conforto/conforto.component';
import { ConfortoDetailsComponent } from './conforto-details/conforto-details.component';
import { SimularComponent } from './simular/simular.component';
import { TurnoComponent } from './turno/turno.component';

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
  declarations: [
    AppComponent,
    DashboardComponent,
    TaxisComponent,
    TaxiDetailComponent,
    MessagesComponent,
    TaxiSearchComponent,
    MotoristaComponent,
    MotoristaDetailComponent,
    MotoristaSearchComponent,
    ConfortoComponent,
    ConfortoDetailsComponent,
    SimularComponent,
    TurnoComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
