export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0] // "2024-02-12"
}
