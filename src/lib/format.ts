export function formatCurrency(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
}

export function formatDateTime(date: Date) {
  const d = formatDate(date);
  const time = date.toISOString().slice(11, 16);
  return `${d} ${time}`;
}
