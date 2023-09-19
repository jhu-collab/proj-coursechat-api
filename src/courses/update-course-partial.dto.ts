import { IsString } from 'class-validator';

export class UpdateCoursePartialDTO {
  @IsString()
  title?: string;
}
