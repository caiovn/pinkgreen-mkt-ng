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
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
  skus!: Sku[];
  product!: Product;

  isEdition = false;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];

      if (this.productId) this.isEdition = true;
    });

    this.loadData();
  }

  loadData() {
    const brands$ = this.brandService.getBrands();
    const categories$ = this.categoryService.getcategories();

    if (this.productId) {
      const product$ = this.productService.getProductAsAdmin(this.productId);
      const sku$ = this.productService.getSkusAsAdmin(this.productId);

      forkJoin([product$, sku$, brands$, categories$]).subscribe({
        next: (res) => {
          this.product = res[0];
          this.skus = res[1];
          this.brands = res[2];
          this.categories = res[3];
          this.createForm();
          this.loading = false;
        },
        error: () => {
          console.log('erorrrrrou!');
        },
      });

      return;
    }

    forkJoin([brands$, categories$]).subscribe({
      next: (res) => {
        this.brands = res[0];
        this.categories = res[1];
        this.createForm();
        this.loading = false;
      },
      error: () => {
        console.log('errrroooooou');
      },
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [this.product?.name || '', [Validators.required]],
      price: [this.product?.price || '', [Validators.required]],
      mainImageUrl: [this.product?.mainImageUrl || '', [Validators.required]],
      brand: [this.product?.brand?.id || '', [Validators.required]],
      categories: [
        this.product?.categories?.map((category) => category.id) || '',
        [Validators.required],
      ],
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

    if (this.isEdition) {
      this.productService
        .updateProduct(this.productId, productPayload)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Produto atualizado com sucesso',
              life: 3000,
            });
            this.router.navigate(['/catalog-administration']);
          },
        });
      return;
    }

    this.productService.createProduct(productPayload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Produto criado com sucesso',
          life: 3000,
        });
        this.router.navigate(['/catalog-administration']);
      },
    });
  }
}
