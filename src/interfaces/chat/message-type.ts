export const MessageType = {
  TEXT: "text",
  PROPERTY_REFERENCE: "property_reference",
  PRICE_OFFER: "price_offer",
  SYSTEM: "system",
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];
