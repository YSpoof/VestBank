const moneyParser = (value: number): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const formattedValue = value
    .toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace('R$', 'F$');
  return formattedValue;
};

export { moneyParser };
