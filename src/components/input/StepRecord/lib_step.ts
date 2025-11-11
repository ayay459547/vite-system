import {  reactive, ref, type Ref } from 'vue'

export type StepRecord = {
  stepName: string // 步驟名稱
  // Redo 時的參考資料與操作
  redoData: any
  redoAction: (redoData: any) => void
  // Undo 時的參考資料與操作
  undoData: any
  undoAction: (undoData: any) => void
}

export type StepRecordManagement = {
  stepRecords: Array<StepRecord>
  curStepIndex: Ref<number>
  hasPrevStep: () => boolean
  hasNextStep: () => boolean
  prevStep: () => void
  nextStep: () => void
  newStep: (stepRecord: StepRecord) => void
  toStep: (stepIndex: number) => void
}

export const createStepRecorder = () : StepRecordManagement => {
  const stepRecords: Array<StepRecord> = reactive([])
  const curStepIndex = ref(-1)

  const hasPrevStep = () => curStepIndex.value >= 0
  const hasNextStep = () => stepRecords.length  > curStepIndex.value + 1

  // 還原至上一步驟
  const prevStep = () =>  {
    if(!hasPrevStep()) return
    const curStepRecord = stepRecords[curStepIndex.value]
    const { undoData, undoAction } = curStepRecord

    undoAction(undoData)
    curStepIndex.value = curStepIndex.value - 1
  }
  // 重作至下一步驟
  const nextStep = () => {
    if(!hasNextStep()) return
    const nextStepIndex = curStepIndex.value + 1
    const nextStepRecord = stepRecords[nextStepIndex]
    const { redoData, redoAction } = nextStepRecord

    redoAction(redoData)
    curStepIndex.value = curStepIndex.value + 1
  }
  // 跳至指定步驟
  const toStep = stepIndex => {
    // 逐步 還原/重做 各步驟
    const startIndex = curStepIndex.value
    const endIndex = stepIndex

    if(startIndex > endIndex) {
      for(let i = startIndex; i > endIndex; i--) prevStep()
    }
    else if (startIndex < endIndex) {
      for(let i = startIndex; i < endIndex; i++) nextStep()
    }
  }

  // 新增步驟
  const newStep = stepRecord =>  {
    // Delete all steps later then nextStepIndex.
    const nextStepIndex = curStepIndex.value + 1
    stepRecords.splice(nextStepIndex)
    stepRecords.push(stepRecord)
    // Add Step
    nextStep()
    // if size > max
    // stepRecords.shift()
  }

  return {
    stepRecords,
    curStepIndex,
    hasPrevStep,
    hasNextStep,
    newStep,
    prevStep,
    nextStep,
    toStep
  }
}

