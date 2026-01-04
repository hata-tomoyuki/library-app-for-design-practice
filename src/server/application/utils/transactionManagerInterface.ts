import { TransactionContextInterface } from "../../domain/utils/transactionContextInterface";

export interface TransactionManagerInterface {
    run<T>(
        operation: (ctx: TransactionContextInterface) => Promise<T>
    ): Promise<T>;
}
