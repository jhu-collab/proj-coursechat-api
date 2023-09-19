import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.interface';
import { CreateCourseDTO } from './create-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Course[] {
    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedOffset = offset ? Number(offset) : undefined;
    return this.coursesService.findAll(search, parsedLimit, parsedOffset);
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
