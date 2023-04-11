import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import Brand from 'src/app/core/models/brand.model';
import Category from 'src/app/core/models/category.model';
import Product from 'src/app/core/models/product.model';
import { BrandService } from 'src/app/core/services/brand.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-catalog-administration',
  templateUrl: './catalog-administration.component.html',
  styleUrls: ['./catalog-administration.component.scss'],
})
export class CatalogAdministrationComponent implements OnInit {
  loading = true;
  brands!: Brand[];
  categories!: Category[];
  products!: Product[];

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const brand$ = this.brandService.getBrands();
    const categories$ = this.categoryService.getcategories();
    const products$ = this.productService.getProductsAsAdmin();

    forkJoin([brand$, categories$, products$]).subscribe({
      next: (res) => {
        this.brands = res[0];
        this.categories = res[1];
        this.products = res[2];
        this.loading = false;
      },
    });
  }

  openBrandPage(brandId = '') {
    this.router.navigate([
      '/catalog-administration/brand',
      brandId ? brandId : '',
    ]);
  }

  openCategoryPage(categoryId = '') {
    this.router.navigate([
      '/catalog-administration/category',
      categoryId ? categoryId : '',
    ]);
  }

  deleteCategoryById(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar a categoria selecionada?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCategory(categoryId),
      reject: () => this.reject()
    });
  }

  deleteProductById(productId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar o producto selecionadao',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteProduct(productId),
      reject: () => this.reject()
    });
  }

  deleteBrandById(brandId: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar a marca selecionada?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteBrand(brandId),
      reject: () => this.reject()
    });
  }

  deleteBrand(brandId: string) {
    this.loading = true;
    this.brandService.deleteBrandById(brandId).subscribe({
      next: () => {
        this.openSuccessToast("Marca deletada com sucesso!");
        this.ngOnInit();
      },
      error: (err) => {
        this.loading = false;
        this.openErrorToast(err.error.message);
      },
    })
  }

  openProductPage(productId = '') {
    this.router.navigate([
      '/catalog-administration/product',
      productId ? productId : '',
    ]);
  }

  deleteProduct(productId: string) {
    this.loading = true;
    this.productService.deleteProductById(productId).subscribe({
      next: () => {
        this.openSuccessToast("Produto deletado com sucesso!");
        this.ngOnInit();
      },
      error: (err) => {
        this.loading = false;
        this.openErrorToast(err.error.menssage);
      }
    });
  }

  deleteCategory(categoryId: string) {
    this.loading = true;
    this.categoryService.deleteCategoryById(categoryId).subscribe({
      next: () => {
        this.openSuccessToast("Categoria deletada com sucesso!");
        this.ngOnInit();
      },
      error: (err) => {
        this.loading = false;
        this.openErrorToast(err.error.message);
      },
    });
  }

  reject(): void {
    return;
  }

  openErrorToast(msg: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: msg,
      life: 3000,
    });
  }

  openSuccessToast(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: msg,
      life: 3000,
    });
  }
}
