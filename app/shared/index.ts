// @ts-ignore
const viteEnv = typeof import.meta !== 'undefined' && import.meta.env
// @ts-ignore
const nodeEnv = typeof process !== 'undefined' && process.env

export const isNodeEnv = (): boolean => !!nodeEnv
export const isViteEnv = (): boolean => !nodeEnv

export const getEnv = (name: string, defaultValue?: string): string | undefined => {
  const env = isViteEnv() ? viteEnv : nodeEnv

  // @ts-ignore
  return env?.[name] ?? defaultValue
}

export const getAllEnv = (): object => {
  // @ts-ignore
  return isViteEnv() ? viteEnv : nodeEnv
}

export const isProduction = (): boolean => {
  if (isNodeEnv()) {
    // @ts-ignore
    return process.env.NODE_ENV === 'production'
  } else {
    // @ts-ignore
    return import.meta.env.PROD === true
  }
}
