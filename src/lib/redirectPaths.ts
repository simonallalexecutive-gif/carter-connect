export const normalizeAuthRedirect = (path: string | null): string | null => {
  if (!path) return null;

  let target = path;
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(target);
      if (decoded === target) break;
      target = decoded;
    } catch {
      break;
    }
  }

  if (!target.startsWith('/')) return null;
  if (target === '/admin/*' || target === '/admin*') return '/admin';

  return target;
};