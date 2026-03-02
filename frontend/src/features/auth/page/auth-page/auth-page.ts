import { Component, inject, OnInit } from '@angular/core';
import { FormArrayName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage implements OnInit{

  activeTab: 'login' | 'signup' = 'login';

  loginForm:FormGroup;
  signupForm:FormGroup;

  errorMessage:string ='';
  successMessage:string='';
  isLoading:boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(){

    this.loginForm = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      username:['',[Validators.required,Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      confirmPassword:['',Validators.required]
    });
  }

  ngOnInit():void{

    this.route.data.subscribe(data => {
      if(data['tab']){
        this.activeTab=data['tab'];
      }
    })
    

  }

  //Switch Tab
  setActiveTab(tab:'login' | 'signup'):void{
    this.activeTab = tab;
    this.errorMessage='';
    this.successMessage='';
  }

  //Handle Login Submit

  onLoginSubmit():void {
    if(this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage='';

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next : (res) => {
        this.isLoading = false;
        
        this.router.navigate(['/app/dashboard']);
      },

      error: (err) => {
        this.isLoading = false;

        if(err.status == 401){
          this.errorMessage ="Invalid email or password."
        }else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }

  onSignupSubmit():void {
    if(this.signupForm.invalid) return;

    if(this.signupForm.value.password !== this.signupForm.value.confirmPassword){
      this.errorMessage ='Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const {confirmPassword, ...registerData} = this.signupForm.value;

    this.authService.register(registerData).subscribe({
      next: (res) => {
        this.isLoading=false;
        this.successMessage='Registration successful! Please login.'
        this.activeTab='login';
        this.signupForm.reset;
      },
      error: (err) =>{
        this.isLoading = false;
        if(err.error && err.errorMessage){
          this.errorMessage=err.errorMessage;
        }else{
          this.errorMessage = 'Registration failed. Try again.';
        }
      }
    });
  }




}
