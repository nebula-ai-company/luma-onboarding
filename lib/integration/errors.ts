import type { OnboardingIntegrationError, OnboardingIntegrationErrorCode } from './contracts';

export const ERROR_MESSAGES_FA: Record<OnboardingIntegrationErrorCode, string> = {
  NETWORK_ERROR: 'خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
  UPLOAD_FAILED: 'خطا در بارگذاری تصویر. لطفاً مجدداً تلاش کنید یا فایل دیگری انتخاب کنید.',
  GENERATION_FAILED: 'تولید خروجی هوش مصنوعی با خطا مواجه شد. لطفاً دوباره تلاش کنید.',
  UNSUPPORTED_FILE: 'فرمت فایل انتخابی پشتیبانی نمی‌شود. لطفاً فایل تصویری معتبر انتخاب کنید.',
  INSUFFICIENT_BALANCE: 'اعتبار حساب شما برای اجرای این پردازش کافی نیست.',
  SERVICE_UNAVAILABLE: 'سرویس هوش مصنوعی در حال حاضر با ترافیک بالا مواجه است.',
  PERSISTENCE_FAILED: 'خطا در ذخیره‌سازی وضعیت آنبوردینگ در پایگاه داده.',
  UNKNOWN: 'خطای پیش‌بینی‌نشده‌ای رخ داد. لطفاً دوباره تلاش کنید.',
};

export type { OnboardingIntegrationError, OnboardingIntegrationErrorCode };

export function isIntegrationError(err: unknown): err is OnboardingIntegrationError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'userMessagePersian' in err
  );
}

export function createIntegrationError(
  code: OnboardingIntegrationErrorCode,
  originalError?: unknown,
  customMessage?: string
): OnboardingIntegrationError {
  const userMessagePersian = customMessage || ERROR_MESSAGES_FA[code] || ERROR_MESSAGES_FA.UNKNOWN;
  const message =
    originalError instanceof Error ? originalError.message : customMessage || code;

  return {
    code,
    message,
    userMessagePersian,
    originalError,
    retryable: code === 'NETWORK_ERROR' || code === 'SERVICE_UNAVAILABLE' || code === 'GENERATION_FAILED',
  };
}
