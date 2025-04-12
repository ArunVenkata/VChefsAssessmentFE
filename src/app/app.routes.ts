import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [

    {
        path: "",
        canActivate: [AuthGuard],
        component: HomeComponent
    },
    {
        path: "login",
        component: LoginComponent
    }
];
