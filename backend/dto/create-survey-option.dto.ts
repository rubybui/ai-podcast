import { IsNotEmpty } from "class-validator";

export class CreateSurveyOptionRequest {
  @IsNotEmpty()
  option: string;
}
