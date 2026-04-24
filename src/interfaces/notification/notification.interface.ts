export const NotificationType = {
  NEW_MESSAGE: "new_message",
  PRICE_OFFER: "price_offer",
  INQUIRY_RESPONSE: "inquiry_response",
  PROPERTY_APPROVED: "property_approved",
  PROPERTY_REJECTED: "property_rejected",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface INotification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string | null;
  payload?: Record<string, unknown> | null;
  read: boolean;
  createdAt: string;
}

export interface INotificationsPage {
  items: INotification[];
  nextCursor: string | null;
}
