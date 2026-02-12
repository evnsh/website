const BIRTH = new Date("2003-04-04T10:43:00+02:00").getTime()
const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000

export function getAge(): number {
  return Math.floor(getPreciseAge())
}

export function getPreciseAge(): number {
  return (Date.now() - BIRTH) / MS_PER_YEAR
}