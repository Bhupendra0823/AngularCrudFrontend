import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  allData: any[] = [];
  flag: boolean = false;
  itemID = '';

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAllData();
  }
  setID(id: string) {
    this.itemID = id;
    this.dataService.itemID = this.itemID;
    console.log(this.itemID);
  }
  getTimeStamp(): number {
    return Date.now();
  }
  openModal(content: any) {
    const modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
    });
  }
  getAllData() {
    this.http.get<any[]>('http://localhost:8000/record/all-user').subscribe(
      (data) => {
        this.allData = data;
        console.log(this.allData);
        this.flag = true;
      },
      (error) => {
        console.log('Error retrieving data:', error);
      }
    );
  }

  deleteItem(id: string) {
    this.http.delete(`http://localhost:8000/record/delete/${id}`).subscribe(
      () => {
        console.log('Item deleted successfully');
        this.getAllData();
      },
      (error) => {
        console.log('Error deleting item:', error);
      }
    );
  }
}
