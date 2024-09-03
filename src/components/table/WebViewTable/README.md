## 使用說明

### 可用參數
| 參數           | 說明    | 輸入資料型態                      |
| ------------- | ------- | --------------------------------  |
| paging        |  分頁    | { page: number, size: number }   |
| advanced      | 進階搜尋 | Array<{ columnId: string, condition: string, value: string}> |
| sortingMap    | 多欄位   | Record<string, 'Asc' | 'Desc'>   |
| 前贅詞_{{key}} | 一般搜尋 | 篩選條件 key 對照表               |

### advanced: condition 類型

| 類型       | 實際設定條件           |
| --------- | ---------------------- |
| like      |  like                  |
| not like  |  notLike               |
| =         |  equal                 |
| !=        |  notEqual              |
| >         |  greatterThan          |
| >=        |  greatterThanOrEqualTo |
| <         |  lessThan              |
| <=        |  lessThanOrEqualTo     |
| is blank  |  isBlank               |
| not blank |  notBlank              |
| is null   |  isNull                |
| not null  |  notNull               |
  
### 頁面使用篩選條件 key 對照表

| 項目                         | 前贅詞                | 加上後得到效果               | 使用方法                            | 輸入資料型態  | 實際設定條件                 |
| ---------------------------- | -------------------- | --------------------------- | ---------------------------------- | ------------ | --------------------------- |
| 模糊搜尋                      | 無                   | 模糊搜尋後資料               | 取決於各欄位 key                    | string       | like variable               |
| 資料多選使用                  | isMultiple\_         | 條件多選之篩選結果           | isMultiple_key                      | Array        | in (variableA, variableB)   |
| 資料多選使用且搜尋 isNull 條件 | isMultipleWithNull\_ | 條件多選和 null 之篩選結果   | isMultipleWithNull\_ key            | Array        | in (variableA, variableB, null)，通常用於查找資料狀態 mark 使用 |
| 起始日期                      | isStartDate\_        | 起始日期(含)之後的資料       | isStartDate_CREATE_DATE             | Date(string) | >= yyyy-MM-dd              |
| 結束日期                      | isEndDate\_          | 結束日期(含)之後的資料       | isEndDate_lastUpdateTimestamp       | Date(string) | <= yyyy-MM-dd              |
| 反向模糊搜尋                  | Muti*NotLike*        | 不包含設定條件之模糊搜尋資料  | isWithoutLike_key                   | arrayList    | not like a and not like b  |
| 運算子下拉式選單               | operator* , select*  | 大於/小於等於設定條件之資料  | 運算子使用 operator_key              | string       | >= variable                |
| value 為數字的下拉式選單       | intOption\_          | 符合設定條件之資料           | intOption_key                       | number       | = variable                 |
| 一個選項對應到多個值           | oneSelMultiValue\_   | 符合設定條件之資料           | oneSelMultiValue_key, value 用&串接  | string       | in (variableA, variableB)  |

### operator\_ 類型

| 類型                  | 實際設定條件 |
| --------------------- | ------------ |
| equal                 | =            |
| greatterThan          | >            |
| greatterThanOrEqualTo | >=           |
| lessThan              | <            |
| lessThanOrEqualTo     | <=           |
| notEqual              | <>           |
