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
  codePays: string = '+33';
  telephone: string = '';
  age: number | null = null;
  role: string = 'USER';
  errorMessage: string = '';
  loading: boolean = false;

  paysDisponibles = [
    { code: '+33', label: 'France (+33)' },
    { code: '+212', label: 'Maroc (+212)' },
    { code: '+32', label: 'Belgique (+32)' },
    { code: '+41', label: 'Suisse (+41)' },
    { code: '+44', label: 'Royaume-Uni (+44)' },
    { code: '+1', label: 'États-Unis (+1)' },
    { code: '+34', label: 'Espagne (+34)' },
    { code: '+39', label: 'Italie (+39)' }
  ];

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
    if (!this.nom || !this.prenom || !this.email || !this.motDePasse || !this.telephone || this.age === null) {
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

    if (this.age < 18 || this.age > 120) {
      this.errorMessage = 'L\'âge doit être compris entre 18 et 120 ans';
      return;
    }

    this.loading = true;

    const registerRequest = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      motDePasse: this.motDePasse,
      codePays: this.codePays,
      telephone: this.telephone,
      age: this.age ?? 0,
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
