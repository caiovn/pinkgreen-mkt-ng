import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import Category from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  loading = true;
  categoryList!: Category[];

  constructor(
    private readonly categoryService: CategoryService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categoryService.getcategories().subscribe({
      next: (res) => {
        this.categoryList = res;
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
}
