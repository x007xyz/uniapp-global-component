declare interface LoaderOptions {
  pagesPath: string;
  rewrite: string;
  components: ComponentOption[]
}

declare interface ComponentOption {
  code: string;
  global: boolean;
  ref?: string;
}

declare interface PagesMap extends Map<string, ComponentOption[]> {}

declare interface PagesJSON {
  pages: [];
  subpackages?: [];
  subPackages?: [];
}