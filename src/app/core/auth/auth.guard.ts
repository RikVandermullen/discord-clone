import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { Token } from "../../models/Token";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
        return this.authService.currentUser$.pipe(
            map((token: Token | undefined) => {
                if (token && token.token) {
                    const allowed = this.isAllowed(next);
                    if (!allowed) {
                        this.router.navigate(["/games"]);
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    this.router.navigate(["/auth/login"]);
                    return false;
                }
            })
        );
    }

    isAllowed(route: ActivatedRouteSnapshot) {
        return true;
    }
}
