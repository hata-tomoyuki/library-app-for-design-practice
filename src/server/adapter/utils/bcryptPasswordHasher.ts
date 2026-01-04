import bcrypt from "bcrypt";
import { PasswordHasherInterface } from "../../domain/utils/passwordHasherInterface";

export class BcryptPasswordHasher implements PasswordHasherInterface {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
