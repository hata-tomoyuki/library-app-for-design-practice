export interface FindLoanByIdResponseDto {
  id: string;
  bookId: string;
  userId: string;
  loanDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

