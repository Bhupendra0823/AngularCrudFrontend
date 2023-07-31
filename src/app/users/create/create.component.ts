import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  title = 'Create Form';
  t = '';
  allData: any[] = [];
  tmpArr: any[] = [];
  createForm: FormGroup;
  cat: any = ['General', 'SC/ST', 'OBC'];

  constructor(
    private modalService: NgbModal,
    private http: HttpClient
  ) {

  }
  ngOnInit() {
    this.createForm = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/),
        Validators.maxLength(30),
        Validators.minLength(2),
      ]),
      gender: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      category: new FormControl('', [Validators.required]),
      proPic: new FormControl(''),
    });
  }
  base64String: string | ArrayBuffer | null = null;

  onFileUpload(event: any) {
    const file = event.target.files[0];

    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

    const fileExtension = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      this.t =
        'Invalid file extension. Please select a .jpg, .jpeg, or .png file.';
      this.createForm.value.proPic = '';
      return;
    } else {
      this.t = '';
      const reader = new FileReader();
      reader.onloadend = () => {
        this.base64String = reader.result;
        console.log('Base64 String:', this.base64String);
      };
      reader.readAsDataURL(file);
    }

  }
  
  display() {
    console.log(this.createForm.value);
  }
  openModal(content: any) {
    const modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
    });
  }
  share() {
    console.log('All Data', this.createForm.value);
    const postName = this.createForm.value.fullName;
    const postGender = this.createForm.value.gender;
    const postEmail = this.createForm.value.email;
    const postMobile = this.createForm.value.mobile;
    const postCategory = this.createForm.value.category;
    const postProPic = this.base64String;
    const postObj = {
      postName,
      postGender,
      postEmail,
      postMobile,
      postCategory,
      postProPic,
    };
    console.log('Post Object', postObj);
    this.base64String = '';
    this.createForm.reset();


    this.http
      .post('http://localhost:8000/record/create-user', postObj)
      .subscribe((res) => {
        console.log("API Response",res);
      },
      (err) => {
        console.log("Error",err);
      }
      );






  }
  checkAllValidation(content: any) {
    if (this.createForm.valid) {
      this.openModal(content);
    } else {
      this.createForm.markAllAsTouched();
    }
  }
  changeCat(e: any) {
    this.cat?.setValue(e.target.value, {
      onlySelf: true,
    });
  }
}
