import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  loading: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

    this.uiSubscription = this.store.select('ui').subscribe(ui => this.loading = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe()
  }

  login() {
    if (this.loginForm.invalid) { return; }

    this.store.dispatch(ui.isLoading())

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .then(() => {
        this.store.dispatch(ui.stopLoading())
        this.router.navigate(['/'])
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading())
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      })
  }

}
