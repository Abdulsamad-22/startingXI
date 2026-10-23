export function formatPlayerName(playerName: string): string {
  const firstName = playerName.trim().split(/\s+/)[0];

  return (
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLocaleLowerCase()
  );
}

export function capitalizeName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();
}
