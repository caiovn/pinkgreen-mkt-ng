import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { map } from 'rxjs';
import {
  PURCHASE_FLOW_PERSONAL_DATA,
  SELECTED_SKU_CODE,
} from 'src/app/core/global';
import Sku from 'src/app/core/models/sku.model';
import { StatesService } from 'src/app/core/services/states.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss'],
})
export class PersonalDataComponent implements OnInit {
  @Output() nextStepEvent = new EventEmitter();

  form!: FormGroup;
  selectedSku!: Sku[];

  statesList!: { name: string; code: string }[];

  constructor(
    private keycloak: KeycloakService,
    private formBuilder: FormBuilder,
    private stateService: StatesService,
    private router: Router
  ) {
    this.selectedSku = JSON.parse(
      sessionStorage.getItem(SELECTED_SKU_CODE) || '[]'
    );
  }

  ngOnInit(): void {
    this.stateService
      .getStates()
      .pipe(
        map((states) => {
          return states.map((state) => {
            return { name: state.nome, code: state.sigla };
          });
        })
      )
      .subscribe({
        next: (res) => {
          this.statesList = res;
          this.createForm();
        },
        error: (res) => {
          console.log('erro ao obter estados do Brasil');
          this.statesList = [{ name: 'São Paulo', code: '35' }];
          this.createForm();
        },
      });
  }

  createForm() {
    this.keycloak.loadUserProfile().then((res: any) => {
      const formData = JSON.parse(
        sessionStorage.getItem(PURCHASE_FLOW_PERSONAL_DATA) || '{}'
      );

      this.form = this.formBuilder.group({
        name: [{ value: res.firstName, disabled: true }],
        surname: [{ value: res.lastName, disabled: true }],
        email: [{ value: res.email, disabled: true }],
        telephone: [{ value: res.attributes.phone[0], disabled: true }],
        cpf: [{ value: res.attributes.CPF[0], disabled: true }],
        zipcode: [formData.zipcode || '', [Validators.required]],
        street: [formData.street || '', [Validators.required]],
        number: [formData.number || '', [Validators.required]],
        neighborhood: [formData.neighborhood || '', [Validators.required]],
        complement: [formData.complement || ''],
        city: [formData.city || '', [Validators.required]],
        state: [formData.state || '', [Validators.required]],
        country: ['Brasil'],
      });

      this.getFormInput('zipcode')?.valueChanges.subscribe((zipcode) => {
        if (zipcode.length === 8) {
          this.stateService.getCep(zipcode).subscribe({
            next: (res) => {
              this.getFormInput('street')?.setValue(res.logradouro);
              this.getFormInput('neighborhood')?.setValue(res.bairro);
              this.getFormInput('complement')?.setValue(res.complemento);
              this.getFormInput('city')?.setValue(res.localidade);
              this.getFormInput('state')?.setValue(res.uf);
            },
          });
        }
      });
    });
  }

  getFormInput(name: string) {
    return this.form.get(name);
  }

  backProductPage() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.clickNextButton();
    sessionStorage.setItem(
      PURCHASE_FLOW_PERSONAL_DATA,
      JSON.stringify(this.form.value)
    );
  }

  clickNextButton() {
    this.nextStepEvent.emit();
  }
}
