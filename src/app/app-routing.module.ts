import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MembersComponent } from "./core/members/members.component";
import { ServerComponent } from "./core/server/server.component";

const routes: Routes = [
    {
        path: "server/:id",
        pathMatch: "full",
        component: ServerComponent,
        children: [
            {
                path: "members",
                component: MembersComponent,
                outlet: "members"
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
