import { Component } from "@angular/core";
import { UserCredentials } from "../../../models/User";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "discord-clone-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent {
    userCredentials: UserCredentials = new UserCredentials("", "");

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        /** 
         @todo: Add validation
         @todo: Add error handling
        */
        this.authService.login(this.userCredentials).subscribe((token) => {
            if (token === undefined) {
                console.log("Login failed");
            } else {
                this.router.navigate([""]);
            }
        });
    }
}
