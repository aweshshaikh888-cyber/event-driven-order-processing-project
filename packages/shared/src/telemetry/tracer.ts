import {
  trace,
  context,
  propagation,
  Span,
  SpanStatusCode,
  Tracer,
  defaultTextMapGetter,
  defaultTextMapSetter,
  ROOT_CONTEXT
} from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

let sdk: NodeSDK | null = null;
let defaultTracer: Tracer | null = null;

export function initTelemetry(serviceName: string): Tracer {
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces';
  
  if (!sdk) {
    const traceExporter = new OTLPTraceExporter({
      url: otlpEndpoint,
    });

    sdk = new NodeSDK({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_SERVICE_VERSION]: '1.0.0',
        'deployment.environment': process.env.NODE_ENV || 'development',
      }),
      traceExporter,
    });

    try {
      sdk.start();
      console.log(`[Telemetry] OpenTelemetry initialized for ${serviceName} -> ${otlpEndpoint}`);
    } catch (err) {
      console.warn(`[Telemetry] Failed to start OpenTelemetry SDK:`, err);
    }

    process.on('SIGTERM', () => {
      sdk?.shutdown()
        .then(() => console.log('[Telemetry] Tracing terminated'))
        .catch((error) => console.error('[Telemetry] Error terminating tracing', error));
    });
  }

  defaultTracer = trace.getTracer(serviceName, '1.0.0');
  return defaultTracer;
}

export function getTracer(serviceName: string = 'order-processing-system'): Tracer {
  if (!defaultTracer) {
    return initTelemetry(serviceName);
  }
  return defaultTracer;
}

/**
 * Injects active W3C trace context into Kafka message headers or plain object dictionary
 */
export function injectTraceContext(headers: Record<string, string | Buffer | undefined> = {}): Record<string, string> {
  const carrier: Record<string, string> = {};
  propagation.inject(context.active(), carrier, defaultTextMapSetter);

  // Convert buffer headers if any, and merge carrier headers
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(headers)) {
    if (val !== undefined) {
      result[key] = Buffer.isBuffer(val) ? val.toString('utf8') : String(val);
    }
  }
  return Object.assign(result, carrier);
}

/**
 * Extracts trace context from Kafka headers or plain dictionary
 */
export function extractTraceContext(headers: Record<string, any> = {}): any {
  const carrier: Record<string, string> = {};
  for (const [key, val] of Object.entries(headers)) {
    if (val !== undefined && val !== null) {
      carrier[key] = Buffer.isBuffer(val) ? val.toString('utf8') : String(val);
    }
  }
  return propagation.extract(ROOT_CONTEXT, carrier, defaultTextMapGetter);
}

/**
 * Helper to trace asynchronous block of code
 */
export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  parentContext?: any
): Promise<T> {
  const tracer = defaultTracer || trace.getTracer('order-processing-system');
  const ctx = parentContext || context.active();

  return context.with(ctx, async () => {
    const span = tracer.startSpan(name);
    try {
      const result = await context.with(trace.setSpan(ctx, span), () => fn(span));
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error?.message || 'Unknown error',
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
