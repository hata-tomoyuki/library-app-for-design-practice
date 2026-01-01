export class Book {
    constructor(
        private _id: string,
        private _title: string,
        private _author: string,
        private _publishedAt: Date,
        private _createdAt: Date,
        private _updatedAt: Date
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

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }
}
