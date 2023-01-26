import { Component } from "@angular/core";
import { UserCredentials } from "../../../models/User";
import { AuthService } from "../auth.service";

@Component({
    selector: "discord-clone-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent {
    userCredentials: UserCredentials = new UserCredentials("", "");

    constructor(private authService: AuthService) {}

    onSubmit() {
        this.authService.login(this.userCredentials).subscribe((token) => {
            if (token === undefined) {
                console.log("Login failed");
            }
        });
    }
}
