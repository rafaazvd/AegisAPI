export interface PaymentGatewayInterface {
  processPayment(
    amount: number,
    currency: string,
    source: string,
  ): Promise<any>;
}
