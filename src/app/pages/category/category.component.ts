import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import Category from 'src/app/core/models/category.model';
import Product from 'src/app/core/models/product.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  loading = true;
  public categoryId!: string;
  public actualCategory!: Category;
  public productList!: Product[];

  constructor(
    private route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.categoryId = params['id'];
    });

    this.loadData();
  }

  loadData() {
    const product$ = this.productService.getProductsBycategory(this.categoryId);
    const category$ = this.categoryService.getCategoryById(this.categoryId);

    forkJoin([product$, category$]).subscribe({
      next: (results) => {
        this.productList = results[0];
        this.actualCategory = results[1];
      },
    });
  }

  getImageUrl(imageUrl: string) {
    return `url(${imageUrl})`;
  }
}
