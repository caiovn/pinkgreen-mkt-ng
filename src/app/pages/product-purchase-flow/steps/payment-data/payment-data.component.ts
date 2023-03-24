import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { SELECTED_SKU_CODE } from 'src/app/core/global';
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

  createForm() {
    this.form = this.formBuilder.group({
      paymentMethod: ['', [Validators.required]],
      differentAddress: ['', [Validators.required]],

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
  }

  getFormInput(name: string) {
    return this.form.get(name);
  }

  clickNextButton() {
    this.nextStepEvent.emit();
  }

  clickBackButton() {
    this.backStepEvent.emit();
  }
}
