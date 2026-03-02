import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectedForecastCard } from './projected-forecast-card';

describe('ProjectedForecastCard', () => {
  let component: ProjectedForecastCard;
  let fixture: ComponentFixture<ProjectedForecastCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectedForecastCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectedForecastCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
