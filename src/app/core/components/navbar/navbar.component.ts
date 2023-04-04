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
  sidebarVisible = false;

  userRoles!: string[];

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
      this.userRoles = this.keycloak.getUserRoles(true);
    }
    this.mountMenu();
  }

  onSubmitForm() {
    if (this.searchTerm.value?.length == 0) return;

    return this.router.navigate(['/search'], {
      queryParams: {
        searchTerm: this.searchTerm.value,
      },
    });
  }

  mountMenu() {
    if (this.isLoggedIn) {
      this.items = [
        {
          label: `Olá, ${this.userProfile?.firstName}!`,
          items: [
            {
              label: 'Meus pedidos',
              icon: 'pi pi-shopping-bag',
              routerLink: '/order',
            },
            {
              label: 'Encerrar sessão',
              icon: 'pi pi-sign-out',
              command: () => {
                this.logout();
              },
            },
          ],
        },
      ];

      const catalogAdminItem: MenuItem[] = [{
        label: 'Administrar Catálogo',
        icon: 'pi pi-box',
        routerLink: '/catalog-administration',
      }];

      if(this.userRoles.includes('create-sku')) {
        this.items[0].items = catalogAdminItem.concat(this.items[0].items as any)
      }

      console.log(this.items);

      return;
    }

    this.items = [
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
    ];
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }
}
