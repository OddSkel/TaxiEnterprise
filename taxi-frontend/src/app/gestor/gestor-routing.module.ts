import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestorComponent } from './gestor.component';
import { TaxisListComponent } from './pages/taxis-list/taxis-list.component';
import { RegisterTaxiComponent } from './pages/register-taxi/register-taxi.component';
import { TaxiDetailComponent } from './pages/taxi-detail/taxi-detail.component';
import { TaxiEditComponent } from './pages/taxi-edit/taxi-edit.component';
import { DriversListComponent } from './pages/drivers-list/drivers-list.component';
import { RegisterDriverComponent } from './pages/register-driver/register-driver.component';
import { DriverDetailComponent } from './pages/driver-detail/driver-detail.component';
import { DriverEditComponent } from './pages/driver-edit/driver-edit.component';
import { ConfortListComponent } from './pages/confort-list/confort-list.component';
import { ConfortEditComponent } from './pages/confort-edit/confort-edit.component';
import { SimulateRideComponent } from './pages/simulate-ride/simulate-ride.component';
import { StatsComponent } from './pages/stats/stats.component';
import { TaxiStatsComponent } from './pages/taxi-stats/taxi-stats.component';
import { DriverStatsComponent } from './pages/driver-stats/driver-stats.component';
import { TripStatsComponent } from './pages/trip-stats/trip-stats.component';

const routes: Routes = [
  {
    path: '',
    component: GestorComponent,
    children: [
      { path: '', redirectTo: 'taxis', pathMatch: 'full' },
      { path: 'taxis', component: TaxisListComponent },
      { path: 'taxis/add', component: RegisterTaxiComponent },
      { path: 'taxis/:id', component: TaxiDetailComponent },
      { path: 'taxis/:id/edit', component: TaxiEditComponent },

      { path: 'motoristas', component: DriversListComponent },
      { path: 'motoristas/add', component: RegisterDriverComponent },
      { path: 'motoristas/:id', component: DriverDetailComponent },
      { path: 'motoristas/:id/edit', component: DriverEditComponent },

      { path: 'confortos', component: ConfortListComponent },
      { path: 'confortos/:id/edit', component: ConfortEditComponent },
      { path: 'confortos/:id/simulate', component: SimulateRideComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'taxi-stats', component: TaxiStatsComponent },
      { path: 'driver-stats', component: DriverStatsComponent },
      { path: 'trip-stats', component: TripStatsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestorRoutingModule {}
