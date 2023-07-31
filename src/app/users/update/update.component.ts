import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/data.service';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  title = 'Update Form';
  itemID: string;
  createForm: FormGroup;
  updatedTechnology: any[] = [];
  constructor(private http: HttpClient, private dataService: DataService) {}
  ngOnInit() {
    this.itemID = this.dataService.itemID;
    console.log(this.itemID);
    this.http
      .get<any>(
        `http://localhost:8000/record/get-one-for-update/${this.itemID}`
      )
      .subscribe(
        (data) => {
          console.log('User Data:', data);
          this.createForm = new FormGroup({
            postName: new FormControl(data.postName, [
              Validators.required,
              Validators.pattern(/^[a-zA-Z\s]*$/),
              Validators.maxLength(30),
              Validators.minLength(2),
            ]),
            postGender: new FormControl(data.postGender, [Validators.required]),
            postEmail: new FormControl(data.postEmail, [
              Validators.required,
              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
            ]),
            postMobile: new FormControl(data.postMobile, [
              Validators.required,
              Validators.pattern(/^\d{10}$/),
            ]),
            postCategory: new FormControl(data.postCategory, [
              Validators.required,
            ]),
            postProPic: new FormControl(data.postProPic),
          });
        },
        (error) => {
          console.log('Error fetching user data:', error);
        }
      );
    console.log(this.createForm.value);
  }
  handleFileInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.createForm.get('proPic').setValue(base64String);
    };
    reader.readAsDataURL(file);
  }
  base64String: string | ArrayBuffer | null = null;
  t = '';
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
        console.log('New Updated Base64 String:', this.base64String);
      };
      reader.readAsDataURL(file);
    }
  }
  handleUpdateUser() {
    if(this.base64String){
    this.createForm.value.postProPic = this.base64String;
    }
    this.http
      .put<any>(
        `http://localhost:8000/record/update/${this.itemID}`,
        this.createForm.value
      )
      .subscribe(
        (data) => {
          console.log('Update Successful');
          console.log('Update Response:', data);
          this.updatedTechnology = data;
        },
        (error) => {
          console.log('Error updating user data:', error);
        }
      );
    }
    reloadAfterDelay() {
      setTimeout(() => {
        location.reload();
      }, 700);
    }
}
