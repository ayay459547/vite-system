/// <reference types="vite/client" />
declare module '*?b64' {
  const b64Value: string
  export default b64Value
}
declare module '*?sheetjs' {
  const sheetjs: string
  export default sheetjs
}

// declare module '*.svg' {
//   const content: React.FC<React.SVGProps<SVGElement>>
//   export default content
// }