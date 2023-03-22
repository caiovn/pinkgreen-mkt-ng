import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { StatesService } from 'src/app/core/services/states.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss'],
})
export class PersonalDataComponent implements OnInit {
  @Output() nextStepEvent = new EventEmitter();

  form!: FormGroup;

  constructor(
    private keycloak: KeycloakService,
    private formBuilder: FormBuilder,
    private stateService: StatesService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.keycloak.loadUserProfile().then((res: any) => {
      console.log(res);
      this.form = this.formBuilder.group({
        name: [{ value: res.firstName, disabled: true }],
        surname: [{ value: res.lastName, disabled: true }],
        email: [{ value: res.email, disabled: true }],
        telephone: [{ value: res.attributes.phone[0], disabled: true }],
        cpf: [{ value: res.attributes.CPF[0], disabled: true }],
        zipCode: ['', [Validators.required]],
        street: ['', [Validators.required]],
        number: ['', [Validators.required]],
        neighborhood: ['', [Validators.required]],
        complement: [''],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
      });

      this.getFormInput('zipCode')?.valueChanges.subscribe((zipCode) => {
        if (zipCode.length === 8) {
          this.stateService.getCep(zipCode).subscribe({
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

  onSubmit() {
    this.clickNextButton();
  }

  clickNextButton() {
    console.log('asd');
    this.nextStepEvent.emit();
  }
}
