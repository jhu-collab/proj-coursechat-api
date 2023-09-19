import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}
