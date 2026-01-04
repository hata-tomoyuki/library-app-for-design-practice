export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`メールアドレス ${email} は既に登録されています`);
    this.name = "EmailAlreadyExistsError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("メールアドレスまたはパスワードが違います");
    this.name = "InvalidCredentialsError";
  }
}

export class UserNotFoundError extends Error {
  constructor(email: string) {
    super(`メールアドレス ${email} のユーザーが見つかりません`);
    this.name = "UserNotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "この操作を実行する権限がありません") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
