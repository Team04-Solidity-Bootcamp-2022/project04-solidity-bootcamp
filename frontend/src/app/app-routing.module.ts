import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CastVotesComponent } from './cast-votes/cast-votes.component';
import { DelegateComponent } from './delegate/delegate.component';
import { QueryResultsComponent } from './query-results/query-results.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cast-votes', component: CastVotesComponent },
  { path: 'delegate', component: DelegateComponent },
  { path: 'query-results', component: QueryResultsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
