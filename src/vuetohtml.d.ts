declare module "vue-html-to-paper" {
  import { PluginFunction, Plugin } from "vue"

  interface Options {
    name?: "_blank" | "_parent" | "_self" | "_top" | string
    specs?: string[]
    styles?: string[]
    timeout?: number
    autoClose?: boolean
    windowTitle?: string
  }
  export const install: PluginFunction<Options>
  export const htmlToPaper: Plugin<Options>

  declare module "vue/types/vue" {
    interface Vue {
      $htmlToPaper: (
        id: string,
        localOptions?: Options,
        callback?: () => void
      ) => void
    }
  }
}
