// @ts-ignore
const viteEnv = typeof import.meta !== 'undefined' && import.meta.env
// @ts-ignore
const nodeEnv = typeof process !== 'undefined' && process.env

export const isViteEnv = (): boolean => !!viteEnv

export const isNodeEnv = (): boolean => !!nodeEnv

export const getEnv = (name: string, defaultValue?: string): string | undefined => {
  // @ts-ignore
  return viteEnv?.[name] ?? nodeEnv?.[name] ?? defaultValue
}

export const isProduction = (): boolean => {
  if (viteEnv?.PROD !== undefined) {
    return viteEnv.PROD === true
  }
  return getEnv('NODE_ENV') === 'production'
}
