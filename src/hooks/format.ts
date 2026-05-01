export const formatPrice = (n: number): string =>
  `${n.toLocaleString('no-NO')} kr/mnd`;

export const formatSize = (m2: number): string => `${m2} m²`;

export const formatDateNo = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('no-NO', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatBedrooms = (n: number): string => {
  if (n <= 0) return 'Studio';
  return n === 1 ? '1 soverom' : `${n} soverom`;
};
