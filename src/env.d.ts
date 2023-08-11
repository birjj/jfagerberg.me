/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client-image" />

declare module "*.frag" {
  const shader: string;
  export default shader;
}
declare module "*.vert" {
  const shader: string;
  export default shader;
}
