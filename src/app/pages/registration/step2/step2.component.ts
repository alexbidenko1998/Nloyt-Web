import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
declare var $;

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit, AfterViewInit {

  uploadForm: FormGroup;
  servicePhotos: any;
  isValidAddress = false;
  latitude = 0;
  longitude = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (localStorage.getItem('service')) {
      this.router.navigateByUrl('registration/3').then();
    }
  }

  ngOnInit() {
    // @ts-ignore
    window.intlTelInput(document.querySelector('#phone'), {
      utilsScript: 'assets/intl-tel-input/build/js/utils.js?1562189064761'
    });
    this.uploadForm = this.formBuilder.group({
      legalEntityName: ['', Validators.required],
      legalEntityNumber: ['', Validators.required],
      isOfficialDealer: [false],
      isInHolding: [false],
      holdingName: ['', Validators.required],
      holdingSite: ['', Validators.required],
      serviceName: ['', Validators.required],
      serviceAddress: ['', Validators.required],
      servicePhone: ['', Validators.required],
      serviceTime: ['', Validators.required],
      serviceSite: ['', Validators.required],
      autoMarks: [[], Validators.required],
      equipmentsAndSoftware: [[], Validators.required],
      servicePhotos: [[], Validators.required],
      description: [''],
      receiversCount: [0],
      agreeWithCloudService: [false, Validators.required],
      agreeWithNVCD: [false, Validators.required]
    });
  }

  addressValidator() {
    this.isValidAddress = false;
    fetch('/api/data/address/' + this.uploadForm.get('serviceAddress').value).then(response => response.json()).then(result => {
      this.isValidAddress = result.success;
      this.latitude = result.data.latitude;
      this.longitude = result.data.longitude;
    });
  }

  ngAfterViewInit(): void {
    $('select').selectpicker();
  }

  changeImage(event) {
    for (let i = 1; i <= (event.target.files.length < 3 ? event.target.files.length : 3); i++) {
      const reader = new FileReader();
      reader.onload = e => {
        // @ts-ignore
        document.getElementById('photo' + i).style.backgroundImage = 'url(' + e.target.result + ')';
      };
      if (event.target.files[i - 1]) {
        reader.readAsDataURL(event.target.files[i - 1]);
      }
    }
    this.servicePhotos = event.target.files;
  }

  makeSubmit() {
    this.uploadForm.markAllAsTouched();

    if (this.uploadForm.valid && this.isValidAddress) {
      const formData = new FormData();
      formData.set('legalEntityName', this.uploadForm.get('legalEntityName').value);
      formData.set('legalEntityNumber', this.uploadForm.get('legalEntityNumber').value);
      formData.set('isOfficialDealer', this.uploadForm.get('isOfficialDealer').value);
      formData.set('isInHolding', this.uploadForm.get('isInHolding').value);
      formData.set('holdingName', this.uploadForm.get('holdingName').value);
      formData.set('holdingSite', this.uploadForm.get('holdingSite').value);
      formData.set('serviceName', this.uploadForm.get('serviceName').value);
      formData.set('serviceAddress', this.uploadForm.get('serviceAddress').value);
      formData.set('servicePhone', this.uploadForm.get('servicePhone').value);
      formData.set('serviceTime', this.uploadForm.get('serviceTime').value);
      formData.set('serviceSite', this.uploadForm.get('serviceSite').value);
      formData.set('autoMarks', $('#autoMarks').val());
      formData.set('equipmentsAndSoftware', $('#equipmentsAndSoftware').val());
      // @ts-ignore
      formData.set('servicePhotosCount', document.querySelector('[type=file]').files.length);
      // @ts-ignore
      for (let i = 0; i < document.querySelector('[type=file]').files.length; i++) {
        // @ts-ignore
        formData.set('servicePhotos' + i, document.querySelector('[type=file]').files[i]);
      }
      formData.set('description', this.uploadForm.get('description').value);
      formData.set('receiversCount', this.uploadForm.get('receiversCount').value);
      formData.set('latitude', this.latitude.toString());
      formData.set('longitude', this.longitude.toString());
      fetch('http://194.182.85.89/api/service', {
        method: 'POST',
        mode: 'cors',
        body: formData,
        headers: {
          Authorization: localStorage.getItem('userToken')
        }
      }).then(response => response.text()).then(data => this.checkResult(data));
    }
  }

  checkResult(data) {
    console.log(data);
    data = JSON.parse(data);
    if (data.success) {
      localStorage.setItem('service', JSON.stringify(data.data));

      this.router.navigateByUrl('registration/3').then();
    } else {
      alert(data.error.message);
    }
  }
}
