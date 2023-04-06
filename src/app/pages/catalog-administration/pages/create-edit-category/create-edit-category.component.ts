import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import Category from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-create-edit-category',
  templateUrl: './create-edit-category.component.html',
  styleUrls: ['./create-edit-category.component.scss']
})
export class CreateEditCategoryComponent implements OnInit {

  loading = true;
  form!: FormGroup;
  isEdition = false;
  categoryId!: string;
  category: Category = {
    id: 0,
    image: '',
    name: '',
  };

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoryId = params['id'];
    });

    if (this.categoryId) {
      this.isEdition = true;
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (res) => {
          this.category = res;
          this.createForm();
          this.loading = false;
        },
      });
      return;
    }

    this.createForm();
    this.loading = false;
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      name: [this.category.name || '', Validators.required],
      image: [this.category.image || '', Validators.required]
    })
  }

  submitCategory() {
    if (this.isEdition) return;

    this.categoryService.createCategory(this.form.getRawValue()).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Categoria criada com sucesso',
          life: 3000,
        });
        this.router.navigate(['/catalog-administration']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar a categoria.',
          life: 3000,
        });
      },
    });
  }
}
