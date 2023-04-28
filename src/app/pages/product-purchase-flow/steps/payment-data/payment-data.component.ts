import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { PURCHASE_FLOW_PAYMENT_DATA } from 'src/app/core/global';
import Sku from 'src/app/core/models/sku.model';
import { StatesService } from 'src/app/core/services/states.service';
import { GenericValidator } from 'src/app/core/validators/generice.validator';

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
    private stateService: StatesService,
    public datepipe: DatePipe
  ) {}

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
      // {
      //   label: 'Boleto',
      //   value: 'BANK_SLIP',
      // },
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
        error: (res) => {
          console.log('erro ao obter estados do Brasil');
          this.statesList = [{ name: 'São Paulo', code: '35' }];
          this.createForm();
        },
      });
  }

  validateForm(checked: boolean): void {
    if (checked) {
      this.form
        .get('differentCpf')
        ?.setValidators([Validators.required, GenericValidator.isValidCpf()]);
      this.form.updateValueAndValidity();
      return;
    }

    this.form.get('differentCpf')?.clearValidators();
    this.form.get('differentCpf')?.setValue(['']);
    this.form.updateValueAndValidity();
  }

  resetForm(): void {
    if (
      this.form.get('paymentMethod')?.value === 'CREDIT_CARD' ||
      this.form.get('paymentMethod')?.value === 'DEBIT_CARD'
    ) {
      this.form.get('numberCard')?.setValidators([Validators.required]);
      this.form
        .get('cardHolder')
        ?.setValidators([
          Validators.required,
          Validators.pattern('^[a-zA-Z ]*$'),
        ]);
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
    this.form.get('validateData')?.setValue('');

    this.form.updateValueAndValidity();
  }

  createForm() {
    const formData = JSON.parse(
      sessionStorage.getItem(PURCHASE_FLOW_PAYMENT_DATA) || '{}'
    );

    this.form = this.formBuilder.group({
      paymentMethod: [formData.paymentMethod || '', [Validators.required]],

      differentAddress: [formData.differentAddress || false],
      differentTitular: [formData.differentTitular || false],

      differentCpf: [formData.differentCpf || ''],

      zipcode: [formData.zipcode || ''],
      street: [formData.street || ''],
      number: [formData.number || ''],
      neighborhood: [formData.neighborhood || ''],
      complement: [formData.complement || ''],
      city: [formData.city || ''],
      state: [formData.state || ''],

      numberCard: [formData.numberCard || ''],
      cardHolder: [formData.cardHolder || ''],
      cvv: [formData.cvv || ''],
      validateData: [formData.validateData || ''],
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
  }

  formatData(): void {
    this.form
      .get('validateData')
      ?.setValue(
        this.datepipe.transform(this.form.get('validateData')?.value, 'MM/yy')
      );
  }

  differentAddress(checked: boolean): void {
    if (checked) {
      this.form.get('zipcode')?.setValidators([Validators.required]);
      this.form.get('street')?.setValidators([Validators.required]);
      this.form.get('number')?.setValidators([Validators.required]);
      this.form.get('neighborhood')?.setValidators([Validators.required]);
      this.form.get('city')?.setValidators([Validators.required]);
      this.form.get('state')?.setValidators([Validators.required]);

      this.form.updateValueAndValidity();
      return;
    }

    this.form.get('zipcode')?.clearValidators();
    this.form.get('street')?.clearValidators();
    this.form.get('number')?.clearValidators();
    this.form.get('neighborhood')?.clearValidators();
    this.form.get('city')?.clearValidators();
    this.form.get('state')?.clearValidators();

    this.form.get('zipcode')?.setValue('');
    this.form.get('street')?.setValue('');
    this.form.get('number')?.setValue('');
    this.form.get('neighborhood')?.setValue('');
    this.form.get('city')?.setValue('');
    this.form.get('state')?.setValue('');

    this.form.updateValueAndValidity();
  }

  getFormInput(name: string) {
    return this.form.get(name);
  }

  clickNextButton(): void {
    sessionStorage.setItem(
      PURCHASE_FLOW_PAYMENT_DATA,
      JSON.stringify(this.form.getRawValue())
    );
    this.nextStepEvent.emit();
  }

  clickBackButton() {
    this.backStepEvent.emit();
  }
}
