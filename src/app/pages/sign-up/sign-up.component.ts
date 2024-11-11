import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/API/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterLink,
    MatProgressSpinnerModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.sass'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      UserName: ['', Validators.required],
      Name: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      const { UserName, Name, LastName, Email, Password } = this.signUpForm.value;
      this.authService.register(UserName, Name, LastName, Email, Password).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            console.log('Registro y login exitosos');
          } else {
            console.log('Error en el registro');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en la petición de registro:', error);
        }
      });
    }
  }
}
