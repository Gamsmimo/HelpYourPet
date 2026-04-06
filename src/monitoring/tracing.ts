import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

// Inicializar OpenTelemetry
export function initializeTracing() {
  const sdk = new NodeSDK({
    serviceName: 'help-your-pet-api',
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  console.log('OpenTelemetry initialized');
  return sdk;
}