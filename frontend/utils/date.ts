export function ddmmyyyyToISO(d: string | undefined) {
  if (!d) return undefined;
  // já é ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d;
  const [dd, mm, yyyy] = d.split('/');
  if (!dd || !mm || !yyyy) return undefined;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}
