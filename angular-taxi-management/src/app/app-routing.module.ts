import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxisComponent } from './taxis/taxis.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaxiDetailComponent } from './taxi-detail/taxi-detail.component';
import { MotoristaComponent } from './motorista/motorista.component';
import { ConfortoComponent } from './conforto/conforto.component';
import { ConfortoDetailsComponent } from './conforto-details/conforto-details.component';
import { SimularComponent } from './simular/simular.component';
import { MotoristaDetailComponent } from './motorista-detail/motorista-detail.component';
import { MotoristaSearchComponent } from './motorista-search/motorista-search.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'taxis', component: TaxisComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'taxis/:id', component: TaxiDetailComponent },
  { path: 'motorista', component: MotoristaComponent },
  { path: 'confortos', component: ConfortoComponent },
  { path: 'confortos/:id', component: ConfortoDetailsComponent },
  { path: 'confortos/simular/:id', component: SimularComponent },
  { path: 'motorista/nif/:nif', component: MotoristaDetailComponent },
  { path: 'motoristas/search', component: MotoristaSearchComponent },
  { path: 'motoristas/:id', component: MotoristaDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
