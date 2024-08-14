import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { AuthGuard } from '../guard/auth.guard';
import { GetFamilyMemberResolver } from '../resolver/get-family-member.resolver';
import { GetHinosResolver } from '../resolver/get-hinos.resolver';
import { ReuniaoComponent } from '../reuniao/reuniao.component';
import { GetHymnsResolver } from '../resolver/get-hymns.resolver';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: HomeComponent, canActivate: [AuthGuard], resolve: { familyMember : GetFamilyMemberResolver}},
  { path: 'ata/:data-reuniao', component: ReuniaoComponent, canActivate: [AuthGuard], resolve: { familyMember : GetFamilyMemberResolver, hinos: GetHinosResolver, hymns: GetHymnsResolver}},
  { path: 'reuniao', component: ReuniaoComponent, canActivate: [AuthGuard], resolve: { familyMember : GetFamilyMemberResolver, hinos: GetHinosResolver, hymns: GetHymnsResolver}},
  { path: '**', component: HomeComponent, canActivate: [AuthGuard], resolve: { familyMember : GetFamilyMemberResolver}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
