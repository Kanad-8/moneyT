import { Routes } from '@angular/router';
import { MainLayout } from '../layout/main-layout/main-layout';
import { authGuard } from '../core/guards/authGuard';
import { AuthPage } from '../features/auth/page/auth-page/auth-page';


export const routes: Routes = [

    {path:'',redirectTo:'app',pathMatch:'full'},

    {
       path: '',
       loadChildren: () => import('../features/auth/auth.routes').then(r => r.AUTH_ROUTES)
    },

    {
        path:'app',
        component:MainLayout,
        canActivate:[authGuard],
        children:[
            {
                path:'dashboard',
                loadChildren: ()=> import('../features/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES),
                data:{title:'Dashboard'}

            },
            {
                path:'transactions',
                loadChildren: ()=> import('../features/expenses/expenses.routes').then(r =>r.EXPENSE_ROUTES),
                data:{title:'Transactions Tracking'}
            },
            {
                path:'budgets',
                loadChildren: ()=> import('../features/budgets/budget.routes').then(r => r.BUDGET_ROUTES),
                data:{title:'Budget Management'}
            },
            {
                path:'user',
                loadChildren: ()=> import('../features/user-profile/user-profile.routes').then(r => r.USERP_ROUTES),
                data:{title:'User Profile'}
            },
            { path:'',redirectTo:'dashboard',pathMatch:'full'}
        ]
    }
];
