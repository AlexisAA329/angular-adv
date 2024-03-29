import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import { UsuarioService } from 'src/app/services/usuario.service';


declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css'
  ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn: any;

  public formSubbmitted = false;

  

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  
  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone) { }




  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(): void {
    
    google.accounts.id.initialize({
      client_id: "330372155354-nb985lqmt5g92tkk858s0gd92nq7lljr.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
   }); 

   google.accounts.id.renderButton(
    //  document.getElementById("buttonDiv"),
    this.googleBtn.nativeElement,
     { theme: "outline", size: "large" }  // customization attributes
   );
  }

  handleCredentialResponse(response: any){
    // console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential)
    .subscribe( resp => {
      // console.log({ login:resp });
      this.ngZone.run(()=>{
    this.router.navigateByUrl('/');
  });
  });
}

  login(){
    
    this.usuarioService.login(this.loginForm.value)
    .subscribe(resp => {

      if (this.loginForm.get('remember')?.value){
        localStorage.setItem('email', this.loginForm.get('email')?.value! );
      }else {
        localStorage.removeItem('email');
      }
      
      this.router.navigateByUrl('/');

    }, (err) => {      
      Swal.fire('Error', err.error.msg, 'error');
    });

  }
}
