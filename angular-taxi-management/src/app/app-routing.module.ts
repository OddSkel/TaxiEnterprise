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
import { ClienteComponent } from './cliente/cliente.component';
import { ViagemComponent } from './viagem/viagem.component';

const routes: Routes = [
  // Rotas para o Gestor (prefixo /gestor/)
  { path: 'gestor/taxis', component: TaxisComponent }, // Gerenciamento de taxis
  { path: 'gestor/dashboard', component: DashboardComponent }, // Dashboard
  { path: 'gestor/taxis/:id', component: TaxiDetailComponent }, // Detalhes do taxi
  { path: 'gestor/motorista', component: MotoristaComponent }, // Gerenciamento de motoristas
  { path: 'gestor/confortos', component: ConfortoComponent }, // Gerenciamento de confortos
  { path: 'gestor/confortos/:id', component: ConfortoDetailsComponent }, // Detalhes de um conforto
  { path: 'gestor/confortos/simular/:id', component: SimularComponent }, // Simulação de conforto

  // Rotas para o Motorista (prefixo /motorista/)
  { path: 'motorista/motoristas/search', component: MotoristaSearchComponent }, // Busca de motoristas
  { path: 'motorista/turnos/motoristas/:id', component: MotoristaDetailComponent }, // Detalhes de turnos de motorista
  { path: 'motorista/viagens/:id', component: ViagemComponent }, // Detalhes de turnos de motorista

  // Rotas para o Cliente (prefixo /cliente/)
  { path: 'cliente', component: ClienteComponent }, // Rota para o Cliente onde ele pode pedir um táxi
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
