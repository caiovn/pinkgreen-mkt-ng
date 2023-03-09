import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  items!: MenuItem[];
  searchTerm = new FormControl('');

  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;

  constructor(
    private readonly keycloak: KeycloakService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }

    this.mountMenu();
  }

  onSubmitForm() {
    return this.router.navigate(['/search'], {
      queryParams: {
        searchTerm: this.searchTerm.value,
      },
    });
  }

  mountMenu() {
    if (this.isLoggedIn) {
      return (this.items = [
        {
          label: `Olá, ${this.userProfile?.firstName}!`,
          items: [
            {
              label: 'Encerrar sessão',
              icon: 'pi pi-sign-out',
              command: () => {
                this.logout();
              },
            },
          ],
        },
      ]);
    }

    return (this.items = [
      {
        label: 'Você não esta logado.',
        items: [
          {
            label: 'Entrar',
            icon: 'pi pi-sign-in',
            command: () => {
              this.login();
            },
          },
        ],
      },
    ]);
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }
}
