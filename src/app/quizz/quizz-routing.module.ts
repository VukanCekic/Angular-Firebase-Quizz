import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {QuizzComponent} from './quizz.component';
import {RouteGuardGuard} from '../route-guard.guard';
import {LeaderBoardComponent} from './leader-board/leader-board.component';

const routes: Routes = [
  {
    path: '',
    component: QuizzComponent,
    canActivate: [RouteGuardGuard],
  },
  { path: 'leaderboard', component: LeaderBoardComponent, canActivate: [RouteGuardGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizzRoutingModule { }
