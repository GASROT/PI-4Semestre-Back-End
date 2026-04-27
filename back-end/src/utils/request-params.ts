export function getStringParam(value: string | string[] | undefined, fieldName = 'id'): string {
  if (!value) {
    throw new Error(`Parametro obrigatorio ausente: ${fieldName}`);
  }

  if (Array.isArray(value)) {
    if (!value[0]) {
      throw new Error(`Parametro invalido: ${fieldName}`);
    }
    return value[0];
  }

  return value;
}
