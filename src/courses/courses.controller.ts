import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.interface';
import { CreateCourseDTO } from './create-course.dto';

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

  @Post()
  create(@Body() createCourseDto: CreateCourseDTO): Course {
    return this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedCourse: Partial<Course>,
  ): Course {
    return this.coursesService.update(Number(id), updatedCourse);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.coursesService.delete(Number(id));
  }
}
