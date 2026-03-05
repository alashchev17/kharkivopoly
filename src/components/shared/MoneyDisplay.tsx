export function MoneyDisplay({ amount, className = '' }: { amount: number; className?: string }) {
  return (
    <span className={`money-display ${className} ${amount < 0 ? 'money-negative' : ''}`}>
      ${amount.toLocaleString()}
    </span>
  );
}
