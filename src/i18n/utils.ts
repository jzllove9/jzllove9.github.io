import { config } from '../consts.ts'
import { en } from './en'
import { zhCn } from './zhCn'
import { cs } from './cs'

const ui: any = {
  en,
  'zh-cn': zhCn,
  cs,
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string) {
    return ui[lang][key] || ui[config.lang][key]
  }
}

export const t = useTranslations(config.lang)
