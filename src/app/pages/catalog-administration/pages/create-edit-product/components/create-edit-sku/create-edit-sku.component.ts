import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import Sku, { SkuAttributes } from 'src/app/core/models/sku.model';

@Component({
  selector: 'app-create-edit-sku',
  templateUrl: './create-edit-sku.component.html',
  styleUrls: ['./create-edit-sku.component.scss'],
})
export class CreateEditSkuComponent implements OnInit {
  @Input() isEdition = false;

  loading = true;
  form!: FormGroup;

  initialSkuData!: Sku;

  skuAttributes!: SkuAttributes[];

  imageSlideConfig = {
    infinite: false,
    adaptiveHeight: true,
    slidesToShow: 4,
    adaptiveWidth: true,
    lazyLoad: 'ondemand',
    arrows: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.isEdition = this.config.data.isEdition;
    this.initialSkuData = this.config.data.skuData;
    this.skuAttributes = this.initialSkuData.skuAttributes;

    this.createForm();
    this.loading = false;
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [this.initialSkuData?.name || '', [Validators.required]],
      skuCode: [this.initialSkuData?.skuCode || '', [Validators.required]],
      price: [
        this.initialSkuData?.price?.listPrice || '',
        [Validators.required],
      ],
      stockQuantity: [
        this.initialSkuData?.stockQuantity || '',
        [Validators.required],
      ],

      mainImageUrl: [
        this.initialSkuData?.mainImageUrl || '',
        Validators.required,
      ],
      urlImages: [this.initialSkuData?.urlImages || ''],

      height: [this.initialSkuData?.height || '', [Validators.required]],
      width: [this.initialSkuData?.width || '', [Validators.required]],
      length: [this.initialSkuData?.length || '', [Validators.required]],
      weight: [this.initialSkuData?.weight || '', [Validators.required]],
    });
  }

  createSkuAttribute() {
    this.skuAttributes.push({ label: '', type: '', value: '' });
  }

  deleteSkuAttribute(index: number) {
    console.log(index);
    this.skuAttributes.splice(index, 1);
  }

  submitSku() {
    this.ref.close({
      isEdition: this.isEdition,
      skuData: {
        name: this.form.get('name')?.value,
        skuCode: this.form.get('skuCode')?.value,
        price: { listPrice: this.form.get('price')?.value },
        stockQuantity: this.form.get('stockQuantity')?.value,

        height: this.form.get('height')?.value,
        width: this.form.get('width')?.value,
        length: this.form.get('length')?.value,
        weight: this.form.get('weight')?.value,

        mainImageUrl: this.form.get('mainImageUrl')?.value,
        urlImages: this.form.get('urlImages')?.value,
        skuAttributes: this.skuAttributes,
      },
    });
  }
}
