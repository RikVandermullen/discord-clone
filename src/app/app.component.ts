import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
    selector: "discord-clone-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    title = "Home";
    loggedIn: boolean;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.loggedIn = localStorage.getItem("currentuser") !== null;
            }
        });
    }
}
