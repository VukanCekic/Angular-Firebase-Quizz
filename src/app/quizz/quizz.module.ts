import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizzRoutingModule } from './quizz-routing.module';
import {QuizzComponent} from './quizz.component';
import {LeaderBoardComponent} from './leader-board/leader-board.component';
import {FormsModule} from '@angular/forms';
import {SortPipe} from './leader-board/SortPipe';



@NgModule({
  declarations: [
    QuizzComponent,
    LeaderBoardComponent,
    SortPipe,
  ],
  imports: [
    CommonModule,
    QuizzRoutingModule,
    FormsModule,
  ],
  providers: [],
})
export class QuizzModule { }
