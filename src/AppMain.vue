<script setup>
import './assets/all.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { ref, onMounted } from 'vue'
import { useDataStore } from './stores/dataStore'
import axios from 'axios'
//pinia
const dataStore = useDataStore()
//API網址
const APIUrl = 'https://hexschool.github.io/js-filter-data/data.json'
//搜尋欄文字
const searchQuery = ref('')
const searchResultShow = ref(false)
const searchQueryShowText = ref('')

//請求資料
const requestData = async () => {
  try {
    const dataMsg = await axios.get(APIUrl)
    dataStore.dataLoading = true
    dataStore.addPlateData(dataMsg)
  } catch (errMsg) {
    console.log(`錯誤訊息:${errMsg}`)
  }
}

function clickSearch() {
  if (searchQuery.value) {
    searchResultShow.value = true
  } else {
    searchResultShow.value = false
  }
  searchQueryShowText.value = searchQuery.value
  let dataWillChange = [...dataStore.sourceDataLock]
  //item['作物名稱'].toLowerCase().includes(searchQuery.value.toLowerCase())
  let dataChanged = dataWillChange.filter((item) => {
    const name = item['作物名稱']
    return name.includes(searchQuery.value)
  })
  dataStore.searchChange(dataChanged)
  dataStore.searchChangeState()
}

//開場
onMounted(() => {
  requestData()
})
</script>
<template>
  <div>
    <div class="bg-light vw-100 vh-100 all-bg overflow-hidden position-absolute z-n1"></div>
    <div class="container">
      <div class="vh-100 pt-68">
        <div class="mb-6">
          <img src="/logo-new.png" alt="logo" />
        </div>
        <div class="bg-white w-100 rounded-3 p-1 mb-4">
          <div class="bg-white rounded-2 border border-secondary border-3 h-100 pt-5 px-5 pb-6">
            <div class="d-flex justify-content-center mb-20">
              <RouterLink to="/" class="router-link-style me-10">蔬菜</RouterLink>
              <RouterLink to="/fruit" class="router-link-style me-10">水果</RouterLink>
              <RouterLink to="/flower" class="router-link-style">花卉</RouterLink>
            </div>

            <!-- 蔬果搜尋欄 -->
            <div class="d-flex justify-content-center">
              <div class="d-flex search-w">
                <div class="input-group flex-nowrap me-12">
                  <label
                    for="search-crop-input"
                    class="input-group-text bg-primary text-white border border-primary border-2 px-3"
                    >作物名稱</label
                  >
                  <input
                    type="text"
                    class="form-control border border-primary border-2 py-2"
                    id="search-crop-input"
                    placeholder="請輸入作物名稱"
                    aria-label="search-crop"
                    v-model.trim="searchQuery"
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-primary text-nowrap px-54 text-white fw-bold"
                  @click="clickSearch"
                >
                  搜尋
                </button>
              </div>
            </div>
            <!-- 搜尋結果文字 -->
            <div class="d-flex justify-content-between mt-3">
              <p class="text-dark fw-bold fs-18" :class="{ invisible: !searchResultShow }">
                查看「{{ searchQueryShowText }}」的比價結果
              </p>
            </div>
            <!-- 表格RouterView -->
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
body {
  font-family: 'Noto Sans TC', system-ui;
}

.table-content-total-h {
  min-height: 346px;
}

.table-market-w {
  width: 120px;
}
.table2-w {
  width: 95px;
}
.table3-w {
  width: 115px;
}
.table .active-th {
  background-color: rgb(231, 226, 214);
}
.pagin-h {
  height: 38px;
}
</style>
<style scoped>
.all-bg::before {
  content: '';
  background-color: #899e39;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  position: absolute;
  top: 65%;
  left: -3%;
}
.all-bg::after {
  content: '';
  background-color: #f8d45a;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  position: absolute;
  top: -15%;
  left: auto;
  right: -3%;
}
.search-w {
  width: 505px;
}

.router-link-style {
  color: #2a2a2a;
  font-weight: 700;
  text-decoration: none;
  padding: 8px 40px;
  background-color: white;
  border: 2px solid #2a2a2a;
  border-radius: 4px;
  box-shadow: 0 1px 0 0 #2a2a2a;
}

.router-link-active {
  background-color: #f8d45a;
}
</style>
