export function formatDisplayValue(value: string): string {
  if (value === 'Infinity' || value === '-Infinity' || value === 'NaN') {
    return value;
  }

  if (!/^-?\d*\.?\d+(?:[eE][+-]?\d+)?$/.test(value)) {
    return value;
  }

  const num = Number(value);

  if (Number.isNaN(num)) {
    return 'NaN';
  }

  if (!Number.isFinite(num)) {
    return num > 0 ? 'Infinity' : '-Infinity';
  }

  const absNum = Math.abs(num);

  if (absNum >= 1e11 || (absNum < 1e-6 && absNum !== 0)) {
    return num.toExponential(4).replace(/\.?0+e/, 'e');
  }

  if (value.endsWith('.')) {
    return value;
  }

  if (value.includes('.')) {
    const [, decPart] = value.split('.');
    if (decPart.length > 12) {
      return parseFloat(num.toFixed(12)).toString();
    }
  }

  return value;
}


export function formatResultValue(result: number): string {
  if (Number.isNaN(result)) {
    return 'NaN';
  }
  if (!Number.isFinite(result)) {
    return result > 0 ? 'Infinity' : '-Infinity';
  }

  if (Math.abs(result) >= 1e11 || (Math.abs(result) < 1e-6 && result !== 0)) {
    return formatDisplayValue(result.toString());
  }


  const normalized = parseFloat(result.toPrecision(15));
  return formatDisplayValue(normalized.toString());
}