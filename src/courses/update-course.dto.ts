import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCourseDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
}
