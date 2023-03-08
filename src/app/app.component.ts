import { Component } from '@angular/core';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private primengConfig: PrimeNGConfig,
    private readonly keycloak: KeycloakService
  ) {
    this.keycloak.keycloakEvents$.subscribe({
      next: (e) => {
        if (e.type == KeycloakEventType.OnTokenExpired) {
          keycloak.updateToken(20);
        }
      },
    });

    this.primengConfig.ripple = true;
  }

  title = 'pinkgreen-mkt-ng';
}
