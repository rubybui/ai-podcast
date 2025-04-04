import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePodcastRequest {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  thumbnail: string;

  @IsOptional()
  primaryImage: string;
}
