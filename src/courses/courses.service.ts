import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './course.interface';
import { CreateCourseDTO } from './create-course.dto';

@Injectable()
export class CoursesService {
  private readonly courses = [
    { id: 1, title: 'Intro to NestJS' },
    { id: 2, title: 'Advanced TypeScript' },
    { id: 3, title: 'Database Integration' },
  ];

  findAll(): Course[] {
    return this.courses;
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

  update(id: number, updatedCourse: Partial<Course>): Course {
    const courseIndex = this.courses.findIndex((course) => course.id === id);
    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      ...updatedCourse,
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
