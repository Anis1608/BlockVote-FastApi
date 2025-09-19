// src/utils/dateHelpers.ts
export function calculateAge(dobString: string): string {
  const dob = new Date(dobString);
  const today = new Date();

  // Total years
  let years = today.getFullYear() - dob.getFullYear();

  // Adjust if birthday hasn't happened yet this year
  const hasBirthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hasBirthdayPassed) years--;

  // Days since last birthday
  const lastBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (!hasBirthdayPassed) {
    lastBirthday.setFullYear(today.getFullYear() - 1);
  }

  const diffInMs = today.getTime() - lastBirthday.getTime();
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return `${years} years ${days} days`;
}
