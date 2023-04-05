import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import Brand from 'src/app/core/models/brand.model';
import { BrandService } from 'src/app/core/services/brand.service';

@Component({
  selector: 'app-create-edit-brand',
  templateUrl: './create-edit-brand.component.html',
  styleUrls: ['./create-edit-brand.component.scss'],
})
export class CreateEditBrandComponent implements OnInit {
  loading = true;
  form!: FormGroup;
  isEdition = false;

  brandId!: string;
  brand: Brand = {
    brandImage: '',
    name: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.brandId = params['id'];
    });

    if (this.brandId) {
      this.isEdition = true;
      this.brandService.getBrand(this.brandId).subscribe({
        next: (res) => {
          this.brand = res;
          this.createForm();
          this.loading = false;
        },
      });
      return;
    }

    this.createForm();
    this.loading = false;
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [this.brand.name || '', Validators.required],
      brandImage: [this.brand.brandImage || '', Validators.required],
    });
  }

  submitBrand() {
    if (this.isEdition) return;

    this.brandService.createBrand(this.form.getRawValue()).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Marca criada com sucesso',
          life: 3000,
        });
        this.router.navigate(['/catalog-administration']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar a marca.',
          life: 3000,
        });
      },
    });
  }
}
