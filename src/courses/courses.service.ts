import { Injectable } from '@nestjs/common';
import { Course } from './course.interface';

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

  create(course: Course): Course {
    const newCourse = {
      id: this.courses.length + 1, // simple way to generate the next ID
      ...course,
    };
    this.courses.push(newCourse);
    return newCourse;
  }
}
