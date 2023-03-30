import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import Brand from 'src/app/core/models/brand.model';
import Category from 'src/app/core/models/category.model';
import { BrandService } from 'src/app/core/services/brand.service';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading = true;
  categoryList!: Category[];
  brandList!: Brand[];

  slideConfig = {
    dots: false,
    infinite: false,
    variableWidth: true,
    arrows: false,
  };

  constructor(
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const brand$ = this.brandService.getBrand();
    const category$ = this.categoryService.getcategories();

    forkJoin([category$, brand$]).subscribe({
      next: (results) => {
        this.categoryList = results[0];
        this.brandList = results[1];
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar o conteúdo.',
          life: 3000,
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getImageUrl(imageUrl: string) {
    return `url(${imageUrl})`;
  }
}
