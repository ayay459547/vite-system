import type { Ref } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'

export declare interface Expose {
  key: string
  value: Ref<string>
  handleReset: () => void
  validate: (opts?: Partial<ValidationOptions>) => Promise<ValidationResult>
}