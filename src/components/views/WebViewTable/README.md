## 使用說明

### 頁面使用篩選條件 key 對照表

| 項目                           | 前贅詞               | 加上後得到效果               | 使用方法                            | 輸入資料型態      | 實際設定條件                                                    |
| ------------------------------ | -------------------- | ---------------------------- | ----------------------------------- | ----------------- | --------------------------------------------------------------- |
| 模糊搜尋                       | 無                   | 模糊搜尋後資料               | 取決於各欄位 key                    | nvarchar          | like variable                                                   |
| 資料多選使用                   | isMultiple\_         | 條件多選之篩選結果           | isMultiple_key                      | arrayList         | in (variableA, variableB)                                       |
| 資料多選使用且搜尋 isNull 條件 | isMultipleWithNull\_ | 條件多選和 null 之篩選結果   | isMultipleWithNull\_ key            | arrayList         | in (variableA, variableB, null)，通常用於查找資料狀態 mark 使用 |
| 起始日期                       | isStartDate\_        | 起始日期(含)之後的資料       | isStartDate_CREATE_DATE             | Date              | >= yyyy-MM-dd                                                   |
| 結束日期                       | isEndDate\_          | 結束日期(含)之後的資料       | isEndDate_lastupdatetimestamp       | Date              | <= yyyy-MM-dd                                                   |
| 反向模糊搜尋                   | Muti*NotLike*        | 不包含設定條件之模糊搜尋資料 | isWithoutLike_key                   | arrayList         | not like a and not like b                                       |
| 運算子下拉式選單               | operator* , select*  | 大於/小於等於設定條件之資料  | 運算子使用 operator_key             | select : nvarchar | >= variable                                                     |
| value 為數字的下拉式選單       | intOption\_          | 符合設定條件之資料           | intOption_key                       | integer           | = variable                                                      |
| 一個選項對應到多個值           | oneSelMultiValue\_   | 符合設定條件之資料           | oneSelMultiValue_key, value 用&串接 | nvarchar          | in (variableA, variableB)                                       |

### operator\_ 類型

| 類型                 | 實際設定條件 |
| -------------------- | ------------ |
| equal                | =            |
| greatterThan         | >            |
| greaterThanOrEqualTo | >=           |
| lessThan             | <            |
| lessThanOrEqualTo    | <=           |
| notEqual             | <>           |
