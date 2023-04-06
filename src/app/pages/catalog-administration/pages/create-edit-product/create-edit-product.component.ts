import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import Brand from 'src/app/core/models/brand.model';
import Category from 'src/app/core/models/category.model';
import Sku from 'src/app/core/models/sku.model';
import { BrandService } from 'src/app/core/services/brand.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { CreateEditSkuComponent } from './components/create-edit-sku/create-edit-sku.component';
import Product from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-edit-product',
  templateUrl: './create-edit-product.component.html',
  styleUrls: ['./create-edit-product.component.scss'],
})
export class CreateEditProductComponent implements OnInit {
  loading = true;

  ref!: DynamicDialogRef;

  productId!: string;
  brands!: Brand[];
  categories!: Category[];
  skus: Sku[] = [
    {
      name: 'sadasdasd123213',
      skuCode: 'asdasdas',
      price: {
        listPrice: 0.12,
      },
      stockQuantity: 1322,
      height: 23,
      width: 2312,
      length: 323,
      weight: 2,
      mainImageUrl: 'https://imgs.casasbahia.com.br/55054464/1g.jpg',
      urlImages: [
        'https://imgs.casasbahia.com.br/55054464/2g.jpg',
        'https://imgs.casasbahia.com.br/55054464/3g.jpg',
      ],
      product: {} as any,
      skuAttributes: [
        {
          label: 'valor1',
          type: 'valor1',
          value: 'valor1',
        },
        {
          label: 'valor2',
          type: 'valor2',
          value: 'valor2',
        },
        {
          label: 'valor3',
          type: 'valor3',
          value: 'valor3',
        },
      ],
    },
  ];

  isEdition = false;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.loadData();
    this.createForm();
  }

  loadData() {
    const brands$ = this.brandService.getBrands();
    const categories$ = this.categoryService.getcategories();

    forkJoin([brands$, categories$]).subscribe({
      next: (res) => {
        this.brands = res[0];
        this.categories = res[1];
        this.loading = false;
      },
      error: () => {
        console.log('errrroooooou');
      },
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      mainImageUrl: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      categories: ['', [Validators.required]],
    });
  }

  openSkuDialog(sku?: Sku, index?: number) {
    this.ref = this.dialogService.open(CreateEditSkuComponent, {
      data: { skuData: sku ? sku : null, isEdition: sku ? true : false },
      header: sku ? 'Criar SKU' : 'Editar SKU',
      width: '50vw',
    });

    this.ref.onClose.subscribe((res) => {
      if (res) {
        if (res.isEdition && index != undefined) {
          this.skus[index] = res.skuData;
          return;
        }

        this.skus.push(res.skuData);
      }
    });
  }

  submitProduct() {
    const productPayload: Product = {
      active: true,
      name: this.form.get('name')?.value,
      mainImageUrl: this.form.get('mainImageUrl')?.value,
      price: this.form.get('price')?.value,
      categories: this.form.get('categories')?.value?.map((res: number) => {
        return { id: res };
      }),
      brand: { id: this.form.get('brand')?.value } as any,
    };

    this.productService.createProduct(productPayload).subscribe({
      next: () => {
        console.log('asdasdas');
      },
    });
  }
}
