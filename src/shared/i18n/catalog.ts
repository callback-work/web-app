export type Catalog<Source> = {
  [Key in keyof Source]: Source[Key] extends string ? string : Catalog<Source[Key]>;
};

export function defineCatalog<Source>(translation: Catalog<Source>): Source {
  return translation as Source;
}
