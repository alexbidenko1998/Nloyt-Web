import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadListDialogComponent } from './download-list-dialog.component';

describe('DownloadListDialogComponent', () => {
  let component: DownloadListDialogComponent;
  let fixture: ComponentFixture<DownloadListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
