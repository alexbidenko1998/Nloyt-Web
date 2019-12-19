import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
declare var $;

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit {

  uploadForm: FormGroup;
  inputPhone: any;
  iti: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (localStorage.getItem('userToken')) {
      this.router.navigateByUrl('registration/2').then();
    }
  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      phone: ['', this.phoneValidator],
      number: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', this.passwordValidator],
      agree: [false, Validators.required]
    });
    this.inputPhone = document.querySelector('#phone');
    // @ts-ignore
    this.iti = window.intlTelInput(this.inputPhone, {
      utilsScript: 'assets/intl-tel-input/build/js/utils.js?1562189064761'
    });
  }

  passwordValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors => {
      if (!this.uploadForm) {
        return;
      } else if (this.uploadForm.get('password').value !== group.value) {
        return {notEquivalent: true};
      } else {
        return;
      }
    };
  }

  phoneValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors => {
        if (this.inputPhone.value.trim()) {
          if (this.iti.isValidNumber()) {
            return;
          } else {
            return {notValid: true};
          }
        } else {
          return {isEmpty: true};
        }
    };
  }

  makeSubmit() {
    this.uploadForm.markAllAsTouched();
    if (this.uploadForm.valid) {
      const formData = new FormData();
      formData.append('country', this.uploadForm.get('country').value);
      formData.append('email', this.uploadForm.get('email').value);
      formData.append('name', this.uploadForm.get('name').value);
      formData.append('phone', this.uploadForm.get('phone').value);
      formData.append('number', this.uploadForm.get('number').value);
      formData.append('password', this.uploadForm.get('password').value);

      fetch('http://194.182.85.89/api/admin', {
        method: 'POST',
        mode: 'cors',
        body: formData
      }).then(response => response.text()).then(data => this.checkResult(data));
    }
  }

  checkResult(data) {
    console.log(data);
    data = JSON.parse(data);
    if (data.success) {
      localStorage.setItem('userData', JSON.stringify(data.data));
      localStorage.setItem('userId', data.data.id);
      localStorage.setItem('userToken', data.data.token);

      this.router.navigateByUrl('registration/2').then();
    } else {
      alert(data.error.message);
    }
  }
}
