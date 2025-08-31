import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmPage } from './algorithm-page';

describe('AlgorithmPage', () => {
  let component: AlgorithmPage;
  let fixture: ComponentFixture<AlgorithmPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlgorithmPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgorithmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
