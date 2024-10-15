<script setup>
import { computed, ref, watch } from 'vue'
import { useDataStore } from '../stores/dataStore'
const dataStore = useDataStore()
//解構pinia
const { updateShowData } = dataStore

//排序處理
//點擊順序狀態
const sequenceState = ref(3)
//用餘數做迴圈
const sequenceStateDivided = computed(() => {
  return sequenceState.value % 3
})
//排序箭頭狀態
const sequenceArrState = ref('')

//排序(1.由大到小 2.由小到大 3.回歸原順序)
const sequenceList = (content) => {
  let Num = sequenceStateDivided
  let txt = sequenceArrState
  sequenceState.value += 1
  const newData = [...dataStore.vegetableData]
  if (Num.value === 1) {
    txt.value = content + '大到小'
    newData.sort((a, b) => b[content] - a[content])
    updateShowData(newData, 'va')
  } else if (Num.value === 2) {
    txt.value = content + '小到大'
    newData.sort((a, b) => a[content] - b[content])
    updateShowData(newData, 'va')
  } else {
    txt.value = ''
    newData.sort((a, b) => a.id - b.id)
    updateShowData(newData, 'va')
  }
}

//Pagination處理
//每頁顯示筆數
const itemShowNum = ref(6)
//目前頁數
const currentPage = ref(1)
//總頁數
const TotalPage = computed(() => {
  return Math.ceil(dataStore.vegetableData.length / itemShowNum.value)
})
//監聽資料並回到第一頁
watch(
  () => dataStore.vegetableData,
  () => {
    currentPage.value = 1
  }
)
//顯示頁數相對的資料
const showPageList = computed(() => {
  const start = (currentPage.value - 1) * 6
  const end = currentPage.value * 6
  return dataStore.vegetableData.slice(start, end)
})
//點擊頁數導航
const clickPage = (page) => {
  currentPage.value = page
}
//顯示頁數給for用的陣列
const pageNumArray = computed(() => {
  const ary = []
  for (let w = 1; w <= TotalPage.value; w++) {
    ary.push(w)
  }
  return ary
})

//處理Pagination頁數大範圍
//顯示目前大頁數
const showBigPage = computed(() => {
  let start, end
  const cur = currentPage.value
  const total = TotalPage.value
  if (cur <= 3) {
    start = 0
    end = 5
  } else if (cur === total - 1) {
    if (total >= 5) {
      start = total - 5
    } else {
      start = 0
    }
    end = total
  } else if (cur === total) {
    if (total >= 5) {
      start = total - 5
    } else {
      start = 0
    }
    end = total
  } else {
    start = cur - 3
    end = cur + 2
  }
  return pageNumArray.value.slice(start, end)
})
//下一大頁
const bigPageNext = () => {
  if (currentPage.value > TotalPage.value - 5) {
    currentPage.value = TotalPage.value
    return
  }
  currentPage.value += 5
}
//上一大頁
const bigPageBack = () => {
  if (currentPage.value <= 5) {
    currentPage.value = 1
    return
  }
  currentPage.value -= 5
}
//跳轉到最後一頁
const goEndPage = () => {
  currentPage.value = TotalPage.value
}
//跳轉到第一頁
const goStartPage = () => {
  currentPage.value = 1
}
//判斷是否為前3頁
const isPreThreePage = computed(() => {
  return currentPage.value <= 3
})
//判斷是否為後3頁
const isLastThreePage = computed(() => {
  return (
    currentPage.value == TotalPage.value ||
    currentPage.value == TotalPage.value - 1 ||
    currentPage.value == TotalPage.value - 2
  )
})

//判斷搜尋欄是否為空
const noSearched = computed(() => {
  if (dataStore.dataIsSerached && dataStore.vegetableData.length === 0) {
    return true
  }
  return false
})
</script>

<template>
  <div class="table-content-total-h mb-4">
    <table class="table table-hover">
      <thead>
        <tr class="table-light border-start-0 border-end-0 border-dark border-2">
          <th scope="col">作物名稱</th>
          <th scope="col" class="table-market-w">市場名稱</th>
          <th
            scope="col"
            class="table2-w"
            :class="{
              'active-th': sequenceArrState === '上價大到小' || sequenceArrState === '上價小到大'
            }"
          >
            <div class="d-flex align-items-center">
              <p class="mb-0 me-1">上價</p>
              <a href="#" class="d-flex flex-column align-top" @click.prevent="sequenceList('上價')"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '上價大到小' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-up-fill mt-3px mb-nega1"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
                  /></svg
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '上價小到大' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                  /></svg
              ></a>
            </div>
          </th>
          <th
            scope="col"
            class="table2-w"
            :class="{
              'active-th': sequenceArrState === '中價大到小' || sequenceArrState === '中價小到大'
            }"
          >
            <div class="d-flex align-items-center">
              <p class="mb-0 me-1">中價</p>
              <a href="#" class="d-flex flex-column align-top" @click.prevent="sequenceList('中價')"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '中價大到小' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-up-fill mt-3px mb-nega1"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
                  /></svg
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '中價小到大' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                  /></svg
              ></a>
            </div>
          </th>
          <th
            scope="col"
            class="table2-w"
            :class="{
              'active-th': sequenceArrState === '下價大到小' || sequenceArrState === '下價小到大'
            }"
          >
            <div class="d-flex align-items-center">
              <p class="mb-0 me-1">下價</p>
              <a href="#" class="d-flex flex-column align-top" @click.prevent="sequenceList('下價')"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '下價大到小' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-up-fill mt-3px mb-nega1"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
                  /></svg
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '下價小到大' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                  /></svg
              ></a>
            </div>
          </th>
          <th
            scope="col"
            class="table3-w"
            :class="{
              'active-th':
                sequenceArrState === '平均價大到小' || sequenceArrState === '平均價小到大'
            }"
          >
            <div class="d-flex align-items-center">
              <p class="mb-0 me-1">平均價</p>
              <a
                href="#"
                class="d-flex flex-column align-top"
                @click.prevent="sequenceList('平均價')"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '平均價大到小' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-up-fill mt-3px mb-nega1"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
                  /></svg
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '平均價小到大' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                  /></svg
              ></a>
            </div>
          </th>
          <th
            scope="col"
            class="table3-w"
            :class="{
              'active-th':
                sequenceArrState === '交易量大到小' || sequenceArrState === '交易量小到大'
            }"
          >
            <div class="d-flex align-items-center">
              <p class="mb-0 me-1">交易量</p>
              <a
                href="#"
                class="d-flex flex-column align-top"
                @click.prevent="sequenceList('交易量')"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '交易量大到小' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-up-fill mt-3px mb-nega1"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
                  /></svg
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="12"
                  :fill="
                    sequenceArrState === '交易量小到大' || sequenceArrState === ''
                      ? 'black'
                      : 'lightgray'
                  "
                  class="bi bi-caret-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                  /></svg
              ></a>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-show="!dataStore.dataLoading">
          <td colspan="7" class="text-center py-20">資料載入中...</td>
        </tr>
        <tr v-show="noSearched">
          <td colspan="7" class="text-center py-20">查詢不到蔬菜當日的交易資訊QQ</td>
        </tr>
        <template v-if="dataStore.dataLoading">
          <tr v-for="item in showPageList" :key="item.id">
            <th scope="row">{{ item['作物名稱'] }}</th>
            <td class="fw-bold">{{ item['市場名稱'] }}</td>
            <td>{{ item['上價'] }}</td>
            <td>{{ item['中價'] }}</td>
            <td>{{ item['下價'] }}</td>
            <td>{{ item['平均價'] }}</td>
            <td>{{ item['交易量'] }}</td>
          </tr></template
        >
      </tbody>
    </table>
  </div>

  <!-- 分頁 -->
  <div class="pagin-h">
    <nav v-if="dataStore.dataLoading">
      <ul class="pagination justify-content-center" v-show="TotalPage !== 1">
        <!-- 最首頁 -->
        <template v-if="TotalPage > 5">
          <li class="page-item">
            <a
              class="page-link"
              :class="{ disabled: isPreThreePage }"
              @click.prevent="bigPageBack"
              href="#"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item" v-if="!isPreThreePage">
            <a class="page-link" href="#" @click.prevent="goStartPage">1</a>
          </li>
          <li class="page-item" v-if="!isPreThreePage">
            <a class="page-link disabled" href="#">...</a>
          </li>
        </template>
        <!-- 頁數 -->
        <li class="page-item" v-for="i in showBigPage" :key="i">
          <a
            class="page-link"
            :class="{ active: currentPage === i }"
            href="#"
            @click.prevent="clickPage(i)"
            >{{ i }}</a
          >
        </li>
        <!-- 最末頁 -->
        <template v-if="TotalPage > 5">
          <li class="page-item" v-if="!isLastThreePage">
            <a class="page-link disabled" href="#">...</a>
          </li>
          <li class="page-item" v-if="!isLastThreePage">
            <a class="page-link" href="#" @click.prevent="goEndPage">{{ TotalPage }}</a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              :class="{ disabled: isLastThreePage }"
              @click.prevent="bigPageNext"
              href="#"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </template>
      </ul>
    </nav>
  </div>
</template>
