export function czechAccountToIBAN(accountStr) {
  if (!accountStr || !accountStr.includes('/')) return null;

  const parts = accountStr.split('/');
  if (parts.length !== 2) return null;

  const [accountPart, bankCode] = parts;
  let prefix = '0';
  let number = accountPart;

  if (accountPart.includes('-')) {
    [prefix, number] = accountPart.split('-');
  }

  const bban = bankCode.padStart(4, '0') + prefix.padStart(6, '0') + number.padStart(10, '0');

  // CZ = 12, 35 in numeric form; append "00" placeholder before mod-97
  const checkStr = bban + '123500';
  let remainder = 0;
  for (let i = 0; i < checkStr.length; i++) {
    remainder = (remainder * 10 + parseInt(checkStr[i], 10)) % 97;
  }

  return `CZ${String(98 - remainder).padStart(2, '0')}${bban}`;
}

export function buildSpayd({ accountNo, amount, currency, variableSymbol, dueDate, message }) {
  const iban = czechAccountToIBAN(accountNo);
  if (!iban) return null;

  const fields = [`SPD*1.0`, `ACC:${iban}`];

  if (amount != null) fields.push(`AM:${parseFloat(amount).toFixed(2)}`);
  if (currency) fields.push(`CC:${currency}`);
  if (variableSymbol) fields.push(`X-VS:${variableSymbol}`);
  if (dueDate) fields.push(`DT:${dueDate.replace(/-/g, '')}`);
  if (message) fields.push(`MSG:${String(message).substring(0, 60)}`);

  return fields.join('*');
}
