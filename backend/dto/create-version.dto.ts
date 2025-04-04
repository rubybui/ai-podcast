import { IsOptional } from "class-validator";

export class CreateVersionRequest {
  @IsOptional()
  voiceName?: string;

  @IsOptional()
  speed?: number;

  @IsOptional()
  style?: string;
}
