export function getCleanDevID(devDAOID: string | null): number | undefined {
  if (devDAOID) {
    if (devDAOID.startsWith('#')) {
      devDAOID = devDAOID.slice(1);
    }
    return parseInt(devDAOID, 10);
  }

  return undefined;
}
