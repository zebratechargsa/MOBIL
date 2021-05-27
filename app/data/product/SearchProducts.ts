import Product from "./Product";
import apiClient from "../../utils/ApiClient";
import {AxiosRequestConfig} from "axios";
import {ProductCategory} from "./category/ProductCategory";

const url = "/generic/product/search"

interface SearchProductsApiRequest {
  searchAttributes: SearchAttributes[]
}

interface SearchAttributes {
  property: string
  operator: string
  value: string
}

interface SearchProductsApiResponse {
  data: Product[]
}

export function searchProductsByName(name: string): Promise<Product[]> {
  const request: SearchProductsApiRequest = {
    searchAttributes: [{
      property: "name",
      operator: "like",
      value: `${name}%`
    }]
  }
  return apiClient.post(url, request)
    .then((response: SearchProductsApiResponse) => response.data)
}

export function searchProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const request: SearchProductsApiRequest = {
    searchAttributes: [{
      property: "category.id",
      operator: "eq",
      value: category.id
    }]
  }

  return apiClient.post(url, request)
    .then((response: SearchProductsApiResponse) => response.data)
}