import { PrismaClient } from "@/generated/prisma/client";
import { User } from "../../domain/entities/user";
import { UserRepositoryInterface } from "../../domain/repositories/userRepositoryInterface";

export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        passwordHash: user.passwordHash ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return new User(
      createdUser.id,
      createdUser.email ?? "",
      createdUser.name,
      createdUser.passwordHash,
      createdUser.createdAt,
      createdUser.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser) return null;

    return new User(
      foundUser.id,
      foundUser.email ?? "",
      foundUser.name,
      foundUser.passwordHash,
      foundUser.createdAt,
      foundUser.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!foundUser) return null;

    return new User(
      foundUser.id,
      foundUser.email ?? "",
      foundUser.name,
      foundUser.passwordHash,
      foundUser.createdAt,
      foundUser.updatedAt,
    );
  }
}
