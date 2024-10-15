import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', () => {
  const sourceData = ref([])
  const sourceDataLock = ref([])
  const vegetableData = ref([])
  const fruitData = ref([])
  const flowerData = ref([])
  //資料載入中狀態
  const dataLoading = ref(false)
  //資料搜尋狀態--是否搜尋過
  const dataIsSerached = ref(false)

  //將原始資料分裝3類
  function addThreeData() {
    //蔬菜資料
    vegetableData.value = sourceData.value.filter((i) => {
      return i['種類代碼'] === 'N04'
    })
    //水果資料
    fruitData.value = sourceData.value.filter((i) => {
      return i['種類代碼'] === 'N05'
    })
    //花卉資料
    flowerData.value = sourceData.value.filter((i) => {
      return i['種類代碼'] === 'N06'
    })
  }

  //初次載入資料
  function addPlateData(msgData) {
    //放入原始資料
    let temData = []
    temData = msgData.data.filter((i) => {
      return i['作物名稱']
    })
    sourceData.value = temData.map((item, index) => {
      return { ...item, id: index + 1 }
    })
    sourceDataLock.value = [...sourceData.value]
    addThreeData()
  }

  //排序更改資料
  const updateShowData = (newData, ele) => {
    if (ele === 'va') {
      vegetableData.value = [...newData]
      return
    }
    if (ele === 'fru') {
      fruitData.value = [...newData]
      return
    }
    if (ele === 'flo') {
      flowerData.value = [...newData]
      return
    }
    return
  }

  //搜尋更改資料
  const searchChange = (searchData) => {
    sourceData.value = [...searchData]
    addThreeData()
  }

  //搜尋狀態更改
  const searchChangeState = () => {
    dataIsSerached.value = true
  }

  return {
    sourceData,
    sourceDataLock,
    vegetableData,
    fruitData,
    flowerData,
    dataLoading,
    addPlateData,
    updateShowData,
    searchChange,
    dataIsSerached,
    searchChangeState
  }
})
