
export async function waitForPaymentConfirmation(pagamento, paymentId) {
    while (true) {
      const check = await pagamento.check_payment(paymentId);
      if (check.status !== "pending") {
        return check.status;
      }
      await sleep(1000); // Aguarde 1 segundo antes de verificar novamente
    }
  }

  export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
