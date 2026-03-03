/**
 * inputSanitizer.ts
 *
 * Server-side input sanitization and length validation.
 * Applied to all user-supplied text before it reaches the database.
 *
 * Defends against:
 *   - XSS stored in the DB (HTML/script tag stripping)
 *   - Oversized payload DoS (enforced length caps)
 *   - Null-byte injection (stripped)
 *   - Excessive whitespace / control characters
 *
 * These limits match the VARCHAR constraints defined in add_missing_fields.sql.
 */

/** Field length limits (characters) */
export const FIELD_LIMITS = {
  // Short single-line fields
  SHORT:     200,   // names, roles, platform names
  MEDIUM:    500,   // slogan, single-sentence fields
  LONG:     5000,   // textarea fields (description, impact, about_you, etc.)
  URL:      2000,   // website links
  EMAIL:     255,
  PHONE:      50,
} as const;

/**
 * Strip HTML tags and null bytes, trim whitespace.
 * Does NOT use a third-party library — pure regex sufficient for plain-text fields.
 */
function stripHtml(value: string): string {
  return value
    .replace(/\0/g, '')                          // null bytes
    .replace(/<[^>]*>/g, '')                     // HTML tags
    .replace(/javascript\s*:/gi, '')             // javascript: protocol
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // inline event handlers
    .trim();
}

/**
 * Sanitize a single string field.
 * Throws a descriptive error if the value exceeds maxLength.
 */
export function sanitizeField(
  value: string | undefined | null,
  fieldName: string,
  maxLength: number,
  required = false
): string | null {
  if (value === undefined || value === null || value === '') {
    if (required) throw new Error(`${fieldName} is required`);
    return null;
  }

  const cleaned = stripHtml(String(value));

  if (cleaned.length > maxLength) {
    throw new Error(
      `${fieldName} exceeds the maximum allowed length of ${maxLength} characters`
    );
  }

  return cleaned || null;
}

/** Convenience: required field */
export function sanitizeRequired(value: string | undefined | null, fieldName: string, maxLength: number): string {
  const result = sanitizeField(value, fieldName, maxLength, true);
  return result!; // safe — required=true throws if null
}

/**
 * Validate and sanitize all store registration form fields.
 * Returns a clean copy — does NOT mutate the original object.
 * Throws an Error with a descriptive message on any violation.
 */
export function sanitizeStoreFormData(raw: Record<string, any>): Record<string, any> {
  return {
    ...raw,
    // Administrator fields
    adminFirstName:         sanitizeRequired(raw.adminFirstName,      'First name',          FIELD_LIMITS.SHORT),
    adminLastName:          sanitizeRequired(raw.adminLastName,       'Last name',           FIELD_LIMITS.SHORT),
    email:                  sanitizeRequired(raw.email,               'Email',               FIELD_LIMITS.EMAIL),
    adminRole:              sanitizeField   (raw.adminRole,           'Role',                FIELD_LIMITS.SHORT),
    phoneNumber:            sanitizeField   (raw.phoneNumber,         'Phone number',        FIELD_LIMITS.PHONE),
    streetAddress:          sanitizeRequired(raw.streetAddress,       'Street address',      FIELD_LIMITS.SHORT),
    city:                   sanitizeRequired(raw.city,                'City',                FIELD_LIMITS.SHORT),
    zipCode:                sanitizeRequired(raw.zipCode,             'Zip code',            50),

    // Organization fields
    organizationName:       sanitizeRequired(raw.organizationName,    'Organization name',   FIELD_LIMITS.SHORT),
    organizationType:       sanitizeRequired(raw.organizationType,    'Organization type',   FIELD_LIMITS.SHORT),
    otherOrganizationType:  sanitizeField   (raw.otherOrganizationType,'Other org type',     FIELD_LIMITS.SHORT),
    description:            sanitizeRequired(raw.description,         'Description',         FIELD_LIMITS.LONG),
    impact:                 sanitizeRequired(raw.impact,              'Impact',              FIELD_LIMITS.LONG),
    foundingYear:           sanitizeRequired(raw.foundingYear,        'Founding year',       10),
    slogan:                 sanitizeField   (raw.slogan,              'Slogan',              FIELD_LIMITS.MEDIUM),
    donationPlatform:       sanitizeField   (raw.donationPlatform,    'Donation platform',   FIELD_LIMITS.SHORT),
    otherDonationPlatform:  sanitizeField   (raw.otherDonationPlatform,'Other donation platform', FIELD_LIMITS.SHORT),

    // Referral fields
    referredBy:             sanitizeField   (raw.referredBy,          'Referred by',         FIELD_LIMITS.SHORT),
    otherReferredBy:        sanitizeField   (raw.otherReferredBy,     'Other referral',      FIELD_LIMITS.SHORT),
    referralAssociateName:  sanitizeField   (raw.referralAssociateName,'Referral associate', FIELD_LIMITS.SHORT),
    socialMediaPlatform:    sanitizeField   (raw.socialMediaPlatform, 'Social media platform', FIELD_LIMITS.SHORT),
  };
}

/**
 * Validate and sanitize all vendor registration form fields.
 */
export function sanitizeVendorFormData(raw: Record<string, any>): Record<string, any> {
  return {
    ...raw,
    firstName:          sanitizeRequired(raw.firstName,        'First name',         FIELD_LIMITS.SHORT),
    lastName:           sanitizeRequired(raw.lastName,         'Last name',          FIELD_LIMITS.SHORT),
    email:              sanitizeRequired(raw.email,            'Email',              FIELD_LIMITS.EMAIL),
    phone:              sanitizeRequired(raw.phone,            'Phone',              FIELD_LIMITS.PHONE),
    parishAffiliation:  sanitizeField   (raw.parishAffiliation,'Parish affiliation', FIELD_LIMITS.SHORT),
    ownerDescription:   sanitizeField   (raw.ownerDescription, 'Owner description',  FIELD_LIMITS.LONG),
    businessUnique:     sanitizeField   (raw.businessUnique,   'What makes unique',  FIELD_LIMITS.LONG),
    communityEfforts:   sanitizeField   (raw.communityEfforts, 'Community efforts',  FIELD_LIMITS.LONG),
    businessName:       sanitizeRequired(raw.businessName,     'Business name',      FIELD_LIMITS.SHORT),
    businessType:       sanitizeRequired(raw.businessType,     'Business type',      FIELD_LIMITS.SHORT),
    businessDescription:sanitizeRequired(raw.businessDescription,'Business description', FIELD_LIMITS.LONG),
    businessPolicy:     sanitizeField   (raw.businessPolicy,   'Business policy',    FIELD_LIMITS.LONG),
    businessAddress:    sanitizeRequired(raw.businessAddress,  'Business address',   FIELD_LIMITS.SHORT),
    businessCity:       sanitizeRequired(raw.businessCity,     'Business city',      FIELD_LIMITS.SHORT),
    businessZipCode:    sanitizeRequired(raw.businessZipCode,  'Business zip code',  50),
    websiteLinks:       sanitizeField   (raw.websiteLinks,     'Website links',      FIELD_LIMITS.URL),
    contactEmail:       sanitizeRequired(raw.contactEmail,     'Contact email',      FIELD_LIMITS.EMAIL),
    contactPhone:       sanitizeRequired(raw.contactPhone,     'Contact phone',      FIELD_LIMITS.PHONE),
  };
}
