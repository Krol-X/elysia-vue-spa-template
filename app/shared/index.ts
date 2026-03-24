// app/shared/index.ts
export const isProduction = (): boolean => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD !== undefined) {
    // @ts-ignore
    return import.meta.env.PROD === true
  }
  
  try {
    // @ts-ignore
    return process.env.NODE_ENV === 'production'
  } catch {
    return false
  }
}
