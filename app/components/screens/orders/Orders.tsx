// noinspection DuplicatedCode

import React from "react";
import {StyleSheet, View} from "react-native";
import {AppState} from "../../../redux/Reducer";
import {connect} from "react-redux";
import showPopup from "../../Popup";
import getOrdersFromApi from "../../../data/order/GetOrders";

import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../../redux/Dispatchers";
import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
import {NavigationStateHere, NavigationStateOrderDetails, NavigationStateType, State} from "./State";
import OrdersList from "./OrdersList";
import Order from "../../../data/order/Order";
import CentralMessage from "../products/CentralMessage";
import Header from "../../Header";
import OrderDetails from "../order_details/OrderDetails";
import BarCodeSearchHeader from "../products/BarCodeSearchHeader";

class Orders extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      error: null,
      allOrders: null,
      navigationState: new NavigationStateHere(),

    }
    this.getOrders = this.getOrders.bind(this)
    this.onBackButtonPress = this.onBackButtonPress.bind(this)
    this.renderContent = this.renderContent.bind(this)
    this.showOrderDetailsScreen = this.showOrderDetailsScreen.bind(this)
    this.renderOrderDetailsScreen = this.renderOrderDetailsScreen.bind(this)
    this.showOrdersScreen = this.showOrdersScreen.bind(this)
  }


  componentDidMount() {
    (async () => {
      await this.getOrders(null)

    })()
  }

  async getOrders(query: string | null): Promise<Order[] | null> {
    let orders = null
    try {
      this.props.showProgressBar("Fetching orders")
      orders = await getOrdersFromApi(query)
    } catch (e) {
      const title = e.message ? "Failed to fetch orders" : null
      const message = e.message ?? "Failed to fetch orders"
      return Promise.resolve(null)
    } finally {
      this.props.hideProgressBar()
    }
    if (!orders) {
      this.props.exit()
      return null
    }

    if (orders.length == 0) {
      this.setState({
        error: "No orders found",
        allOrders: orders
      })
    } else if (orders.length == 1) {
      this.showOrderDetailsScreen(orders[0])
    }else {
      console.debug("orders found::"+orders.length)
      this.setState({
        error: null,
        allOrders: orders
      })
    }
    return orders
  }


  onBackButtonPress() {
    const currState = this.state
      this.props.exit()
  }

  renderOrderDetailsScreen(order: Order) {
    return (
      <OrderDetails
        order={order}
        pickList={null}
        pickListItem={[]}
        exit={this.showOrdersScreen}
      />
    )
  }

  render() {
    const vm = this.state
    switch (this.state.navigationState.type) {
      case NavigationStateType.Here:
        return this.renderContent();
      case NavigationStateType.OrderDetails:
        const navigationStateOrderDetails = vm.navigationState as NavigationStateOrderDetails
        return this.renderOrderDetailsScreen(navigationStateOrderDetails.order);
    }
  }

  renderContent() {
    return (
      <View style={styles.screenContainer}>
        <Header
          title="Orders"
          subtitle={'All Outbound Orders'}
          backButtonVisible={true}
          onBackButtonPress={this.onBackButtonPress}
        />
        <BarCodeSearchHeader
          onBarCodeSearchQuerySubmitted={this.getOrders}
          placeHolder={'Search Orders by Name'}
          searchBox={false}/>
        <View style={styles.content}>
          <OrdersList orders={this.state.allOrders} onOrderTapped={this.showOrderDetailsScreen}/>
          {/*<CentralMessage message={this.state.centralErrorMessage}/>*/}

        </View>
      </View>
    )
  }
  showOrdersScreen() {
    this.setState({
      navigationState: new NavigationStateHere()
    })
  }
  showOrderDetailsScreen(order: Order) {
    this.setState({
      navigationState: new NavigationStateOrderDetails(order)
    })
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});


const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
})

const mapDispatchToProps: DispatchProps = {
  showProgressBar,
  hideProgressBar
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Orders);
