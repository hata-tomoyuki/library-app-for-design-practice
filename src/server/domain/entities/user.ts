export class User {
  constructor(
    private _id: string,
    private _email: string,
    private _name: string | null,
    private _passwordHash: string | null,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get name(): string | null {
    return this._name;
  }

  get passwordHash(): string | null {
    return this._passwordHash;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
