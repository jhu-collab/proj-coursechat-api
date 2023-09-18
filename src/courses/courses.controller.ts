import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.interface';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll(): Course[] {
    return this.coursesService.findAll();
  }
}
