export enum PaymentIntentStatus {
  CREATED = "Created",
  CANCELLED = "Cancelled",
  RECURRING = "Recurring",
  PAID = "Paid",
  BALANCETOOLOWTORELAY = "Balance too low to relay",
}

export enum Pricing {
  Fixed = "Fixed",
  Dynamic = "Dynamic",
}
