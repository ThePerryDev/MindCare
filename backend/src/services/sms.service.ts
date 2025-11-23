export async function sendSms(to: string, message: string): Promise<void> {
  // Aqui você pode integrar Twilio, AWS SNS, etc.
  // Por enquanto, só loga para facilitar desenvolvimento.
  console.log('────────────────────────────');
  console.log('Enviando Código de Verificação:');
  console.log('Para:', to);
  console.log('Mensagem:', message);
  console.log('────────────────────────────');
}
