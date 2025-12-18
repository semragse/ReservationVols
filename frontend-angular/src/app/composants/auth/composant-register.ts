import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceAuth } from '../../services/service-auth';

@Component({
  selector: 'app-register',
  templateUrl: './composant-register.html',
  styleUrls: ['./composant-register.css']
})
export class ComposantRegister {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  motDePasse: string = '';
  confirmMotDePasse: string = '';
  role: string = 'USER';
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
    this.errorMessage = '';

    // Validation
    if (!this.nom || !this.prenom || !this.email || !this.motDePasse) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.motDePasse !== this.confirmMotDePasse) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.motDePasse.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;

    const registerRequest = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      motDePasse: this.motDePasse,
      role: this.role
    };

    this.authService.register(registerRequest)
      .subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur d\'inscription', error);
          this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
          this.loading = false;
        }
      });
  }
}
