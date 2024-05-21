import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'authentication_frontend_library';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'listing/:type',
    loadChildren: () => import('./listing/listing.module').then( m => m.ListingPageModule), 
    canActivate: [AuthGuard]
  },
  { path: '', loadChildren: () => import('authentication_frontend_library').then(m => m.SlRoutingRoutingModule) },

  {
    path: '**', // Catch-all route, in case no previous routes match
    redirectTo: 'home'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
