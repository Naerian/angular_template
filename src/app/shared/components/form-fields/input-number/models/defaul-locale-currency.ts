// Lista de locales y sus monedas por defecto
// Esta lista se puede utilizar para establecer un locale y una moneda por defecto
export const DEFAULT_LOCALE_CURRENCY = [
  // América Latina
  { locale: 'es-ES', currency: 'EUR' }, // España
  { locale: 'es-MX', currency: 'MXN' }, // México
  { locale: 'es-AR', currency: 'ARS' }, // Argentina
  { locale: 'es-CO', currency: 'COP' }, // Colombia
  { locale: 'es-CL', currency: 'CLP' }, // Chile
  { locale: 'es-PE', currency: 'PEN' }, // Perú
  { locale: 'es-UY', currency: 'UYU' }, // Uruguay
  { locale: 'es-VE', currency: 'VES' }, // Venezuela
  { locale: 'es-EC', currency: 'USD' }, // Ecuador (usa USD)
  { locale: 'es-BO', currency: 'BOB' }, // Bolivia
  { locale: 'es-PY', currency: 'PYG' }, // Paraguay
  { locale: 'es-CR', currency: 'CRC' }, // Costa Rica
  { locale: 'es-HN', currency: 'HNL' }, // Honduras
  { locale: 'es-NI', currency: 'NIO' }, // Nicaragua
  { locale: 'es-GT', currency: 'GTQ' }, // Guatemala
  { locale: 'es-SV', currency: 'USD' }, // El Salvador (usa USD)
  { locale: 'es-PA', currency: 'PAB' }, // Panamá (y USD)

  // América del Norte
  { locale: 'en-US', currency: 'USD' }, // Estados Unidos
  { locale: 'en-CA', currency: 'CAD' }, // Canadá (inglés)
  { locale: 'fr-CA', currency: 'CAD' }, // Canadá (francés)

  // Europa
  { locale: 'en-GB', currency: 'GBP' }, // Reino Unido
  { locale: 'fr-FR', currency: 'EUR' }, // Francia
  { locale: 'de-DE', currency: 'EUR' }, // Alemania
  { locale: 'it-IT', currency: 'EUR' }, // Italia
  { locale: 'pt-PT', currency: 'EUR' }, // Portugal
  { locale: 'nl-NL', currency: 'EUR' }, // Países Bajos
  { locale: 'pl-PL', currency: 'PLN' }, // Polonia
  { locale: 'cs-CZ', currency: 'CZK' }, // Chequia
  { locale: 'sk-SK', currency: 'EUR' }, // Eslovaquia
  { locale: 'el-GR', currency: 'EUR' }, // Grecia
  { locale: 'hu-HU', currency: 'HUF' }, // Hungría
  { locale: 'sv-SE', currency: 'SEK' }, // Suecia
  { locale: 'da-DK', currency: 'DKK' }, // Dinamarca
  { locale: 'fi-FI', currency: 'EUR' }, // Finlandia
  { locale: 'no-NO', currency: 'NOK' }, // Noruega
  { locale: 'ru-RU', currency: 'RUB' }, // Rusia
  { locale: 'ro-RO', currency: 'RON' }, // Rumanía
  { locale: 'bg-BG', currency: 'BGN' }, // Bulgaria
  { locale: 'hr-HR', currency: 'EUR' }, // Croacia (desde 2023)

  // Asia
  { locale: 'ja-JP', currency: 'JPY' }, // Japón
  { locale: 'zh-CN', currency: 'CNY' }, // China
  { locale: 'zh-TW', currency: 'TWD' }, // Taiwán
  { locale: 'ko-KR', currency: 'KRW' }, // Corea del Sur
  { locale: 'hi-IN', currency: 'INR' }, // India
  { locale: 'th-TH', currency: 'THB' }, // Tailandia
  { locale: 'vi-VN', currency: 'VND' }, // Vietnam
  { locale: 'id-ID', currency: 'IDR' }, // Indonesia
  { locale: 'ms-MY', currency: 'MYR' }, // Malasia
  { locale: 'tr-TR', currency: 'TRY' }, // Turquía
  { locale: 'he-IL', currency: 'ILS' }, // Israel
  { locale: 'ar-SA', currency: 'SAR' }, // Arabia Saudí
  { locale: 'ar-AE', currency: 'AED' }, // Emiratos Árabes Unidos
  { locale: 'fa-IR', currency: 'IRR' }, // Irán

  // África
  { locale: 'en-ZA', currency: 'ZAR' }, // Sudáfrica
  { locale: 'ar-EG', currency: 'EGP' }, // Egipto
  { locale: 'fr-MA', currency: 'MAD' }, // Marruecos
  { locale: 'fr-TN', currency: 'TND' }, // Túnez
  { locale: 'fr-DZ', currency: 'DZD' }, // Argelia
  { locale: 'sw-KE', currency: 'KES' }, // Kenia
  { locale: 'pt-AO', currency: 'AOA' }, // Angola

  // Oceanía
  { locale: 'en-AU', currency: 'AUD' }, // Australia
  { locale: 'en-NZ', currency: 'NZD' }, // Nueva Zelanda
  { locale: 'en-FJ', currency: 'FJD' }, // Fiyi
];

export const DEFAULT_CURRENTY_CODE = 'USD'; // Código de moneda por defecto si no se encuentra en la lista
export const DEFAULT_LOCALE = 'en-US'; // Locale por defecto si no se encuentra en