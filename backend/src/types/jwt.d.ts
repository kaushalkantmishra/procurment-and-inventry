import "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface UserJwtPayload extends JwtPayload {
    id: string;
    email: string;
    role: string;
  }
}
