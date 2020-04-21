import { Component, OnInit } from '@angular/core';
import { EventsService, OidcClientNotification, OidcSecurityService, PublicConfiguration } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
    configuration: PublicConfiguration;
    isModuleSetUp$: Observable<boolean>;
    userDataChanged$: Observable<OidcClientNotification<any>>;
    userData$: Observable<any>;
    isAuthenticated$: Observable<boolean>;
    checkSessionChanged$: Observable<boolean>;
    checkSessionChanged: any;

    constructor(public oidcSecurityService: OidcSecurityService, public eventsService: EventsService) {}

    ngOnInit() {
        this.configuration = this.oidcSecurityService.configuration;
        this.userData$ = this.oidcSecurityService.userData$;
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
        this.isModuleSetUp$ = this.oidcSecurityService.moduleSetup$;
        this.checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;

        this.oidcSecurityService
            .checkAuth()
            .pipe(tap(() => this.doCallbackLogicIfRequired()))
            .subscribe((isAuthenticated) => console.log('app authenticated', isAuthenticated));
    }

    login() {
        console.log('start login');
        this.oidcSecurityService.authorize();
    }

    refreshSession() {
        console.log('start refreshSession');
        this.oidcSecurityService.authorize();
    }

    logout() {
        console.log('start logoff');
        this.oidcSecurityService.logoff();
    }

    private doCallbackLogicIfRequired() {
        console.log('AppComponent:doCallbackLogicIfRequired');
        if (window.location.hash) {
            this.oidcSecurityService.authorizedImplicitFlowCallback();
        }
    }
}
