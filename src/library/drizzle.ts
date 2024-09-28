export const takeFirstOrThrow = <T extends any[]>(values: T): T[number] => {
  if (values.length !== 1) throw new Error('Found non unique or inexistent value');
  return values[0]!;
};
export const takeFirst = <T extends any[]>(values: T): T[number] => {
  return values[0]!;
};
