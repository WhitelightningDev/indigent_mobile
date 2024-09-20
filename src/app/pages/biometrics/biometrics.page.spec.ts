import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiometricsPage } from './biometrics.page';

describe('BiometricsPage', () => {
  let component: BiometricsPage;
  let fixture: ComponentFixture<BiometricsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
