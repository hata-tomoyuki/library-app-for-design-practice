export class Book {
  constructor(
    private _id: string,
    private _title: string,
    private _author: string,
    private _publishedAt: Date,
    private _isAvailable: boolean = false,
    private _imageUrl?: string,
    private _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {}

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get author(): string {
    return this._author;
  }

  get publishedAt(): Date {
    return this._publishedAt;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
