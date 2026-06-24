export const FALLBACK_MOCK_USER_NAME = "Manfred Auto Hub User";

export function getDisplayNameFromEmail(email: string) {
  const localPart = email.trim().split("@")[0];

  if (!localPart) {
    return FALLBACK_MOCK_USER_NAME;
  }

  return localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getMockUserDisplayName(fullName?: string, email?: string) {
  const trimmedName = fullName?.trim();

  if (trimmedName) {
    return trimmedName;
  }

  if (email?.trim()) {
    return getDisplayNameFromEmail(email);
  }

  return FALLBACK_MOCK_USER_NAME;
}
