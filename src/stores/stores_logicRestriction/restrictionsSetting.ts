import { getProductIdOptions, getProductNameOptions } from '@/api/api_product'
import { getCategoryIdOptions } from '@/api/api_product/category'
import { getCustomerIdOptions } from '@/api/api_product/customer'
import { getOrderIdOptions } from '@/api/api_order'
import { getRoutingIdOptions } from '@/api/api_routing'

// 取得動態欄位 建議選項
export const valueInArrayInputArrtMap = {
  CUSTOMER_NO: {
    modalSelectKey: 'custNo',
    modalSelect: {
      searchType: 'productCustomer',
      multiple: false,
      multipleLimit: 0
    },
    type: 'autocomplete',
    fetchSuggestions: async (query: string, cb: any) => {
      const options = await getCustomerIdOptions(query)
      cb(options)
    }
  },
  PRODUCT_NO: {
    modalSelectKey: 'productId',
    modalSelect: {
      searchType: 'product',
      multiple: false,
      multipleLimit: 0
    },
    type: 'autocomplete',
    fetchSuggestions: async (query: string, cb: any) => {
      const options = await getProductIdOptions(query)
      cb(options)
    }
  },
  PRODUCT_NANE: {
    modalSelectKey: 'productName',
    modalSelect: {
      searchType: 'product',
      multiple: false,
      multipleLimit: 0
    },
    type: 'autocomplete',
    fetchSuggestions: async (query: string, cb: any) => {
      const options = await getProductNameOptions(query)
      cb(options)
    }
  },
  PRODUCT_CATEGORY: {
    modalSelectKey: 'productCategoryId',
    modalSelect: {
      searchType: 'productCategory',
      multiple: false,
      multipleLimit: 0
    },
    type: 'autocomplete',
    fetchSuggestions: async (query: string, cb: any) => {
      const options = await getCategoryIdOptions(query)
      cb(options)
    }
  },
  MO_NO: {
    modalSelectKey: 'id',
    modalSelect: {
      searchType: 'order',
      multiple: false,
      multipleLimit: 0
    },
    type: 'autocomplete',
    fetchSuggestions: async (query: string, cb: any) => {
      const options = await getOrderIdOptions(query)
      cb(options)
    }
  },
  MO_ROUTE: {
    modalSelectKey: 'routeId',
    modalSelect: {
      searchType: 'routing',
      multiple: false,
      multipleLimit: 0
    },
    type: 'autocomplete',
    fetchSuggestions: async (query: string, cb: any) => {
      const options = await getRoutingIdOptions(query)
      cb(options)
    }
  },
  default: {
    modalSelectKey: '',
    modalSelect: null,
    type: 'text',
    fetchSuggestions: (query: string, cb: any) => {
      const options = []
      cb(options)
    }
  }
}
