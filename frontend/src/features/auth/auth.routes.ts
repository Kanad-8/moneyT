import { Routes } from '@angular/router';
import { AuthPage } from './page/auth-page/auth-page';

export const AUTH_ROUTES: Routes = [
    {
        path:'login',
        component:AuthPage,
        data:{tab:'login'}
    },
    {
        path:'register',
        component:AuthPage,
        data:{tab:'signup'}
    },
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    }
];