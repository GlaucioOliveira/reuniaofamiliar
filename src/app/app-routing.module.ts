import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { GetFamilyMemberResolver } from './resolver/get-family-member.resolver';
import { GetHinosResolver } from './resolver/get-hinos.resolver';

const routes: Routes = [
  {path: 'meetings', component: MeetingsComponent, canActivate: [AuthGuard]},
  {path: 'configuracao', component: ConfigurationComponent, canActivate: [AuthGuard]},
  {path: 'ata/:data-reuniao', component: HomeComponent, canActivate: [AuthGuard], resolve: { familyMember : GetFamilyMemberResolver, hinos: GetHinosResolver}},
  {path: 'login', component: LoginComponent},
  {path: 'reuniao', component: HomeComponent, canActivate: [AuthGuard], resolve: { familyMember : GetFamilyMemberResolver, hinos: GetHinosResolver}},
  {path: '**', component: MeetingsComponent, canActivate: [AuthGuard], resolve: { familyMember : GetFamilyMemberResolver, hinos: GetHinosResolver}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
