import { PrismaClient } from "@/generated/prisma/client";
import { TransactionManagerInterface } from "../../application/utils/transactionManagerInterface";
import { TransactionContextInterface } from "../../domain/utils/transactionContextInterface";

export class PrismaTransactionManager implements TransactionManagerInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async run<T>(
    operation: (ctx: TransactionContextInterface) => Promise<T>,
  ): Promise<T> {
    return await this.prisma.$transaction(async (tx) => {
      // トランザクションコンテキストとしてPrismaのトランザクションクライアントを渡す
      // 現時点ではTransactionContextInterfaceが空なので、空のオブジェクトを渡す
      // 将来的にPrismaTransactionClientを実装する場合は、ここでtxをラップして渡す
      return await operation({} as TransactionContextInterface);
    });
  }
}
