export class Notification {
    _id?: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    relatedId?: string;
    isRead: boolean;
    createdAt: Date;

    constructor(
        userId: string,
        title: string,
        message: string,
        type: NotificationType = NotificationType.SYSTEM,
        isRead: boolean = false,
        relatedId?: string,
        createdAt?: Date,
        _id?: string
    ) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.relatedId = relatedId;
        this.createdAt = createdAt || new Date();
        this._id = _id;
    }
}

export enum NotificationType {
    REVIEW = 'REVIEW',
    SYSTEM = 'SYSTEM',
    PRODUCT = 'PRODUCT',
    ORDER = 'ORDER',
    PROMOTION = 'PROMOTION'
}
