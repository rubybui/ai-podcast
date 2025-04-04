import { IsNotEmpty } from "class-validator";

export class CreateVariantRequest {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  order: number;
}
