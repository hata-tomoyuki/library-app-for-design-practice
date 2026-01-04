import { Loan } from "../entities/loan";
import { TransactionContextInterface } from "../utils/transactionContextInterface";

export interface LoanRepositoryInterface {
    create(loan: Loan, ctx?: TransactionContextInterface): Promise<Loan>;
    findById(id: string, ctx?: TransactionContextInterface): Promise<Loan | null>;
    findByUserId(userId: string, ctx?: TransactionContextInterface): Promise<Loan[]>;
    update(loan: Loan, ctx?: TransactionContextInterface): Promise<Loan>;
}
