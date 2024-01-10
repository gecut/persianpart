export default function factorMaker(
  date: Date | string,
  payment: number,
  description: string,
): string {
  date = new Date(date);

  return `
🗓️ تاریخ: ${date.toLocaleDateString('fa-IR')}

🔴 برداشت:  ${payment.toLocaleString('fa-IR')} ریال


📝 بابت: ${description}
از حساب (مرکزی)    
`;
}
