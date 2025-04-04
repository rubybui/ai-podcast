import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateReportRowRequest {
  @IsNotEmpty()
  subject: string;
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  anonymous: boolean;
  @IsOptional()
  name?: string;
  @IsOptional()
  email?: string;
}
