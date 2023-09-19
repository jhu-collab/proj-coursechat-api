import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './course.interface';
import { CreateCourseDTO } from './create-course.dto';
import { UpdateCourseDTO } from './update-course.dto';
import { UpdateCoursePartialDTO } from './update-course-partial.dto';

@Injectable()
export class CoursesService {
  private readonly courses = [
    { id: 1, title: 'Intro to NestJS' },
    { id: 2, title: 'Advanced TypeScript' },
    { id: 3, title: 'Database Integration' },
  ];

  findAll(search?: string, limit?: number, offset?: number): Course[] {
    let results = this.courses;

    if (search) {
      results = results.filter((course) => course.title.includes(search));
    }

    if (offset !== undefined && limit !== undefined) {
      results = results.slice(offset, offset + limit);
    } else if (offset !== undefined) {
      results = results.slice(offset);
    } else if (limit !== undefined) {
      results = results.slice(0, limit);
    }

    return results;
  }

  findOne(id: number): Course {
    return this.courses.find((course) => course.id === id);
  }

  create(createCourseDto: CreateCourseDTO): Course {
    const newCourse = {
      id: this.courses.length + 1, // simple way to generate the next ID
      ...createCourseDto,
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  update(id: number, updateCourseDto: UpdateCourseDTO): Course {
    const courseIndex = this.courses.findIndex((course) => course.id === id);
    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      ...updateCourseDto,
    };
    return this.courses[courseIndex];
  }

  updatePartial(
    id: number,
    updateCoursePartialDto: UpdateCoursePartialDTO,
  ): Course {
    const courseIndex = this.courses.findIndex((course) => course.id === id);
    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      ...updateCoursePartialDto,
    };
    return this.courses[courseIndex];
  }

  delete(id: number): void {
    const courseIndex = this.courses.findIndex((course) => course.id === id);
    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    this.courses.splice(courseIndex, 1);
  }
}
