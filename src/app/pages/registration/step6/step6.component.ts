import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
declare var $;

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.css']
})
export class Step6Component implements OnInit, AfterViewInit {

  employeesCount = 1;
  uploadForms: FormGroup[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.uploadForms.push(this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      serviceName: ['', Validators.required],
      position: ['', Validators.required],
      roles: [[], Validators.required],
      photo: [null, Validators.required]
    }));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('select').selectpicker();
      for (let i = 0; i < this.uploadForms.length; i++) {
        // @ts-ignore
        window.intlTelInput(document.querySelector('#phone'+i), {
          utilsScript: 'assets/intl-tel-input/build/js/utils.js?1562189064761'
        });
      }
    }, 100);
  }

  changeImage(event, index) {
    const reader = new FileReader();
    reader.onload = e => {
      // @ts-ignore
      document.getElementById('photo' + index).style.backgroundImage = 'url(' + e.target.result + ')';
      document.getElementById('photo' + index).classList.remove('d-none');
    };
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
      this.uploadForms[index].get('photo').setValue(event.target.files[0]);
    }
  }

  cloneNewEmployeesForm() {
    this.uploadForms.push(this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      serviceName: ['', Validators.required],
      position: ['', Validators.required],
      roles: [[], Validators.required],
      photo: [null, Validators.required]
    }));

    setTimeout(() => {
      $('select').selectpicker();
      for (let i = 0; i < this.uploadForms.length; i++) {
        // @ts-ignore
        window.intlTelInput(document.querySelector('#phone'+i), {
          utilsScript: 'assets/intl-tel-input/build/js/utils.js?1562189064761'
        });
      }
    }, 100);
  }

  removeEmployeesForm() {
    if (this.uploadForms.length > 1) {
      this.uploadForms.splice(this.uploadForms.length - 1, 1);
    } else {
      alert('Укажите хотя бы одного сотрудника');
    }
  }

  sendEmployees() {
    let isReady = true;
    for (const form of this.uploadForms) {
      if (form.invalid) {
        form.markAllAsTouched();
        isReady = false;
      }
    }
    if (!isReady) { return; }

    const formData = new FormData();
    formData.append('employeesCount', this.uploadForms.length.toString());
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.uploadForms.length; i++) {
      const form = this.uploadForms[i];
      formData.append('name' + i, form.get('name').value);
      formData.append('phone' + i, form.get('phone').value);
      formData.append('email' + i, form.get('email').value);
      formData.append('serviceName' + i, form.get('serviceName').value);
      formData.append('position' + i, form.get('position').value);
      formData.append('roles' + i, $('#roles' + i).val());
      formData.append('photo' + i, form.get('photo').value);
    }
    fetch('http://194.182.85.89/api/service/employees/' + JSON.parse(localStorage.getItem('service')).id, {
      method: 'POST',
      mode: 'cors',
      body: formData,
      headers: {
        Authorization: localStorage.getItem('userToken')
      }
    }).then(response => response.text()).then(data => {
      console.log(data);
      data = JSON.parse(data);
      this.router.navigateByUrl('registration/7').then();
    });
  }
}
