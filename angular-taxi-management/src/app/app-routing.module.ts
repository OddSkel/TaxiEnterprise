import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxisComponent } from './taxis/taxis.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaxiDetailComponent } from './taxi-detail/taxi-detail.component';
import { MotoristaComponent } from './motorista/motorista.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'taxis', component: TaxisComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'taxis/:id', component: TaxiDetailComponent },
  { path: 'motorista', component: MotoristaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
