import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceAuth } from '../../services/service-auth';

@Component({
  selector: 'app-login',
  templateUrl: './composant-login.html',
  styleUrls: ['./composant-login.css']
})
export class ComposantLogin {
  email: string = '';
  motDePasse: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: ServiceAuth,
    private router: Router
  ) {
    // Rediriger si déjà connecté
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.motDePasse) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, motDePasse: this.motDePasse })
      .subscribe({
        next: (response) => {
          console.log('Connexion réussie', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur de connexion', error);
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.loading = false;
        }
      });
  }
}
