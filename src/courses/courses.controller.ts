import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.interface';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll(): Course[] {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Course {
    return this.coursesService.findOne(Number(id));
  }
}
