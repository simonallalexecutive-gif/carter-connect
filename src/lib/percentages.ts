export type QuantizedPercentageItem<T extends string = string> = {
  key: T;
  raw: number;
};

export const quantizePercentages = <T extends string>(
  items: QuantizedPercentageItem<T>[],
  step = 5,
): Record<T, number> => {
  const sanitized = items.map((item) => ({
    ...item,
    raw: Number.isFinite(item.raw) ? Math.max(0, item.raw) : 0,
  }));

  const total = sanitized.reduce((sum, item) => sum + item.raw, 0);
  const emptyResult = sanitized.reduce((acc, item) => {
    acc[item.key] = 0;
    return acc;
  }, {} as Record<T, number>);

  if (total <= 0 || step <= 0) return emptyResult;

  const bucketCount = Math.round(100 / step);
  const withUnits = sanitized.map((item, index) => {
    const exactUnits = (item.raw / total) * bucketCount;
    const floorUnits = Math.floor(exactUnits);

    return {
      ...item,
      index,
      exactUnits,
      floorUnits,
      remainder: exactUnits - floorUnits,
    };
  });

  let assignedUnits = withUnits.reduce((sum, item) => sum + item.floorUnits, 0);
  let remainingUnits = bucketCount - assignedUnits;

  const sorted = [...withUnits].sort((a, b) => {
    if (b.remainder !== a.remainder) return b.remainder - a.remainder;
    if (b.raw !== a.raw) return b.raw - a.raw;
    return a.index - b.index;
  });

  while (remainingUnits > 0 && sorted.length > 0) {
    const target = sorted[(bucketCount - remainingUnits) % sorted.length];
    target.floorUnits += 1;
    remainingUnits -= 1;
  }

  return withUnits.reduce((acc, item) => {
    acc[item.key] = item.floorUnits * step;
    return acc;
  }, {} as Record<T, number>);
};

export const buildQuantizedChartData = <T extends string>(
  items: Array<{ key: T; name: string; raw: number; color: string }>,
  step = 5,
) => {
  const percentages = quantizePercentages(
    items.map((item) => ({ key: item.key, raw: item.raw })),
    step,
  );

  return items
    .map((item) => ({
      name: item.name,
      value: percentages[item.key] ?? 0,
      color: item.color,
    }))
    .filter((item) => item.value > 0);
};
