export interface SignupResponseDto {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
}
