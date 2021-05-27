import {State} from "./State";
import {VM} from "./VM";

export default function vmMapper(state: State): VM {
  let subtitle = "All products"
  if (state.searchByCategory) {
    subtitle = `Products in category \"${state.searchByCategory.category.name}\"`
  }
  let list = null
  if (state.error == null) {
    if (state.searchByCategory && state.searchByCategory.results && state.searchByCategory.results.length > 0) {
      list = state.searchByCategory.results
    } else if (state.searchByName && state.searchByName.results && state.searchByName.results.length > 0) {
      list = state.searchByName.results
    } else {
      list = state.allProducts
    }
  }
  let floatingActionButtonVisible = true
  if (state.searchBoxVisible) {
    floatingActionButtonVisible = false
  }
  let centralErrorMessage = state.error
  if (!centralErrorMessage && (!list || list.length == 0)) {
    centralErrorMessage = "No products found"
  }
  return {
    subtitle: subtitle,
    searchBoxVisible: state.searchBoxVisible,
    categoryPickerPopupVisible: state.categoryPickerPopupVisible,
    list: list,
    floatingActionButtonVisible: floatingActionButtonVisible,
    centralErrorMessage: centralErrorMessage,
    navigationState: state.navigationState
  }
}
