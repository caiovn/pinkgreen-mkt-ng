import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, forkJoin, of } from 'rxjs';
import Brand from 'src/app/core/models/brand.model';
import Category from 'src/app/core/models/category.model';
import Product from 'src/app/core/models/product.model';
import Sku from 'src/app/core/models/sku.model';
import { BrandService } from 'src/app/core/services/brand.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SkuService } from 'src/app/core/services/sku.service';
import { CreateEditSkuComponent } from './components/create-edit-sku/create-edit-sku.component';

interface SkuTable {
  action: 'create' | 'edit' | 'delete';
  skuData: Sku;
}

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
  skus: SkuTable[] = [];
  product!: Product;

  isEdition = false;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private skuService: SkuService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
      const sku$ = this.skuService.getSkusAsAdmin(this.productId);

      forkJoin([product$, sku$, brands$, categories$]).subscribe({
        next: (res) => {
          this.product = res[0];
          this.brands = res[2];
          this.categories = res[3];

          this.skus = res[1].map((sku) => {
            return { action: 'edit', skuData: sku };
          });

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
      active: [this.product?.active || false],
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

  returnFilteredSkuArray() {
    return this.skus.filter((sku) => sku.action !== 'delete');
  }

  openSkuDialog(sku?: SkuTable, index?: number) {
    this.ref = this.dialogService.open(CreateEditSkuComponent, {
      data: sku ? sku : { isEdition: false, skuData: null },
      header: sku?.action === 'edit' ? 'Editar SKU' : 'Criar SKU',
      width: '85%',
    });

    this.ref.onClose.subscribe((res) => {
      if (res) {
        console.log(res);
        if (res.isEdition && index != undefined) {
          this.skus[index] = res;
          return;
        }

        this.skus.push(res);
      }
    });
  }

  submitProduct() {
    const productPayload: Product = {
      active: this.form.get('active')?.value,
      name: this.form.get('name')?.value,
      mainImageUrl: this.form.get('mainImageUrl')?.value,
      price: this.form.get('price')?.value,
      categories: this.form.get('categories')?.value?.map((res: number) => {
        return { id: res };
      }),
      brand: { id: this.form.get('brand')?.value } as any,
    };

    console.log(productPayload);
    console.log(this.skus);

    if (this.isEdition) {
      this.productService
        .updateProduct(this.productId, productPayload)
        .subscribe({
          next: () => {
            this.updateCreateSku().subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Produto atualizado com sucesso',
                  life: 3000,
                });
                this.router.navigate(['/catalog-administration']);
              },
            });
          },
        });
      return;
    }

    this.productService.createProduct(productPayload).subscribe({
      next: (res) => {
        this.productId =
          res.headers
            .get('Location')
            ?.match('http://localhost:8181/product/(.*)')?.[1] || '';

        this.updateCreateSku().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Produto criado com sucesso',
              life: 3000,
            });
            this.router.navigate(['/catalog-administration']);
          },
        });
      },
    });
  }

  openDeleteSkuDialog(sku: SkuTable, rowIndex: number) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar o SKU selecionado?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteSku(sku, rowIndex),
      reject: () => this.reject(),
    });
  }

  deleteSku(sku: SkuTable, rowIndex: number) {
    console.log(this.skus);
    console.log(this.skus[rowIndex]);

    this.skus[rowIndex] = { ...sku, action: 'delete' };
    console.log('=========================================');

    console.log(this.skus);
    console.log(this.skus[rowIndex]);
  }

  updateCreateSku(): Observable<any> {
    if (this.skus.length > 0) {
      const skus$: Observable<any>[] = [];

      this.skus.map((sku) => {
        const skuPayload: Sku = {
          ...sku.skuData,
          price: {
            ...sku.skuData.price,
            endDate: new Date(),
            salePrice: 0,
            startDate: new Date(),
          },
          product: {
            id: this.productId,
          } as any,
        };

        if (sku.action === 'edit') {
          skus$.push(this.skuService.updateSku(skuPayload.skuCode, skuPayload));
          return;
        }

        if (sku.action === 'delete') {
          skus$.push(this.skuService.deleteSku(skuPayload.skuCode));
          return;
        }

        skus$.push(this.skuService.createSku(skuPayload));
      });

      console.log(skus$);

      return forkJoin(skus$);
    }

    console.log('caiu aqui fora');
    return of(forkJoin([]));
  }

  reject(): void {
    return;
  }
}
