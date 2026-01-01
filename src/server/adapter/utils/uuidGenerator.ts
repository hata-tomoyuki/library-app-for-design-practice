import { IdGeneratorInterface } from "../../domain/utils/idGeneratorInterface";
import { randomUUID } from "crypto";

export class UuidGenerator implements IdGeneratorInterface {
  generate(): string {
    return randomUUID();
  }
}
