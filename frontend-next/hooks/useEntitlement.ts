export function useEntitlement() {
  return {
    isAllowed: true,
    source: 'tutorbox' as const,
  };
}
