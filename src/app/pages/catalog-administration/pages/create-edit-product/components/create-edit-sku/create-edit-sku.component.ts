import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import Sku, { SkuAttributes } from 'src/app/core/models/sku.model';
import { SkuTable } from '../../create-edit-product.component';

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
    arrows: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    const overlayData: SkuTable = this.config.data

    this.isEdition = overlayData.action === 'create' ? false : true;

    this.initialSkuData = overlayData.skuData;

    this.skuAttributes = this.initialSkuData?.skuAttributes || [];

    this.createForm();
    this.loading = false;
  }

  createForm() {
    this.form = this.formBuilder.group({
      active: [this.initialSkuData?.active || false],
      name: [this.initialSkuData?.name || '', [Validators.required]],
      skuCode: [
        { value: this.initialSkuData?.skuCode || '', disabled: this.isEdition },
        [Validators.required],
      ],
      price: [
        this.initialSkuData?.price?.listPrice || 0,
        [Validators.required],
      ],
      stockQuantity: [
        this.initialSkuData?.stockQuantity || 0,
        [Validators.required],
      ],

      mainImageUrl: [
        this.initialSkuData?.mainImageUrl || '',
        Validators.required,
      ],
      urlImages: [this.initialSkuData?.urlImages || ''],

      height: [this.initialSkuData?.height || 0],
      width: [this.initialSkuData?.width || 0],
      length: [this.initialSkuData?.length || 0],
      weight: [this.initialSkuData?.weight || 0],
    });
  }

  createSkuAttribute() {
    this.skuAttributes.push({ label: '', type: '', value: '' });
  }

  deleteSkuAttribute(index: number) {
    this.skuAttributes.splice(index, 1);
  }

  submitSku() {
    console.log(this.form.getRawValue());

    this.ref.close({
      isEdition: this.isEdition,
      skuData: {
        active: this.form.get('active')?.value,
        name: this.form.get('name')?.value,
        skuCode: this.form.get('skuCode')?.value,
        price: { listPrice: this.form.get('price')?.value },
        stockQuantity: this.form.get('stockQuantity')?.value,

        height: this.form.get('height')?.value,
        width: this.form.get('width')?.value,
        length: this.form.get('length')?.value,
        weight: this.form.get('weight')?.value,

        mainImageUrl: this.form.get('mainImageUrl')?.value,
        urlImages: this.form.get('urlImages')?.value || [],
        skuAttributes: this.skuAttributes,
      },
    });
  }
}
