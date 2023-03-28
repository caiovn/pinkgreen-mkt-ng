import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import Sku from 'src/app/core/models/sku.model';
import { StatesService } from 'src/app/core/services/states.service';

@Component({
  selector: 'app-payment-data',
  templateUrl: './payment-data.component.html',
  styleUrls: ['./payment-data.component.scss'],
})
export class PaymentDataComponent implements OnInit {
  @Output() nextStepEvent = new EventEmitter();
  @Output() backStepEvent = new EventEmitter();

  form!: FormGroup;
  paymentMethodList!: { label: string; value: string }[];
  statesList!: { name: string; code: string }[];
  selectedSku!: Sku;

  constructor(
    private formBuilder: FormBuilder,
    private stateService: StatesService
  ) { }

  ngOnInit() {
    this.paymentMethodList = [
      {
        label: 'Cartão de crédito',
        value: 'CREDIT_CARD',
      },
      {
        label: 'Cartão de débito',
        value: 'DEBIT_CARD',
      },
      {
        label: 'Boleto',
        value: 'BANK_SLIP',
      },
    ];

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
      });
  }

  validateForm(): void {
    if (this.form.get('differentTitular')?.value) {
      this.form.get('differentCpf')?.setValidators([Validators.required]);
      this.form.updateValueAndValidity();
      return;
    }

    this.form.get('differentCpf')?.clearValidators();
    this.form.get('differentCpf')?.setValue(['']);
    this.form.updateValueAndValidity();
  }

  resetForm(): void {
    console.log(this.form.getRawValue());
    if (this.form.get('paymentMethod')?.value === 'CREDIT_CARD' || this.form.get('paymentMethod')?.value === 'DEBIT_CARD') {
      this.form.get('numberCard')?.setValidators([Validators.required]);
      this.form.get('cardHolder')?.setValidators([Validators.required]);
      this.form.get('cvv')?.setValidators([Validators.required]);
      this.form.get('validateData')?.setValidators([Validators.required]);

      this.form.updateValueAndValidity();
      return;
    }

    this.form.get('numberCard')?.clearValidators();
    this.form.get('cardHolder')?.clearValidators();
    this.form.get('cvv')?.clearValidators();
    this.form.get('validateData')?.clearValidators();

    this.form.get('numberCard')?.setValue('');
    this.form.get('cardHolder')?.setValue('');
    this.form.get('cvv')?.setValue('');
    this.form.get('validateData')?.setValue('');;

    this.form.updateValueAndValidity();
  }

  createForm() {
    this.form = this.formBuilder.group({
      paymentMethod: ['', [Validators.required]],

      differentAddress: [false],
      differentTitular: [false],

      differentCpf: [''],

      zipCode: ['', [Validators.required]],
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      complement: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],

      numberCard: [''],
      cardHolder: [''],
      cvv: [''],
      validateData: ['']
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
  }

  getFormInput(name: string) {
    return this.form.get(name);
  }

  clickNextButton(): void {
    console.log(this.form.valid);
    if (this.form.get('paymentMethod')?.value === 'BANK_SLIP') {
    }
    // this.nextStepEvent.emit();
  }

  clickBackButton() {
    this.backStepEvent.emit();
  }
}
