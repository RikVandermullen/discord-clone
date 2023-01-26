import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./core/auth/auth.guard";
import { LoginComponent } from "./core/auth/login/login.component";
import { RegisterComponent } from "./core/auth/register/register.component";
import { ServerComponent } from "./core/server/server.component";

const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "server/1"
    },
    {
        path: "server/:id",
        pathMatch: "full",
        component: ServerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "auth/login",
        pathMatch: "full",
        component: LoginComponent
    },
    {
        path: "auth/register",
        pathMatch: "full",
        component: RegisterComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
