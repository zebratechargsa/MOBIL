/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Props, State} from './types';
import {TextInput, View, Text, Button, ToastAndroid} from 'react-native';
import {RootState} from '../../redux/reducers';
import {DispatchProps} from './types';
import styles from './styles';
import {hideScreenLoading, showScreenLoading} from '../../redux/actions/main';
import {connect} from 'react-redux';
import {getBinLocationsAction} from '../../redux/actions/locations';
import {createPutawayOderAction} from '../../redux/actions/putaways';
import AutoInputInternalLocation from '../../components/AutoInputInternalLocation';

class PutawayItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedLocation: null,
      quantity: '1',
    };
  }

  UNSAFE_componentWillMount() {
    this.props.getBinLocationsAction();
  }

  create = () => {
    const {SelectedLocation, createPutawayOderAction} = this.props;
    const {item} = this.props.route.params;
    const {currentLocation} = this.props;
    const data = {
      putawayNumber: '',
      putawayStatus: 'PENDING',
      putawayDate: '',
      putawayAssignee: '',
      'origin.id': SelectedLocation?.id,
      // "origin.name": "Main Warehouse",
      'destination.id': SelectedLocation?.id,
      // "destination.name": "Main Warehouse",
      putawayItems: [
        {
          putawayStatus: 'PENDING',
          'product.id': item['product.id'],
          'inventoryItem.id': item['inventoryItem.id'],
          'putawayFacility.id': SelectedLocation?.id,
          'currentLocation.id': item['currentLocation.id'],
          'putawayLocation.id': this.state?.selectedLocation?.id,
          quantity: this.state?.quantity,
        },
      ],
      'orderedBy.id': '',
      sortBy: null,
    };
    createPutawayOderAction(data, () => {
      ToastAndroid.show('Order created successfully', ToastAndroid.SHORT);
    });
  };

  render() {
    const {item} = this.props.route.params;
    const {locations} = this.props;
    const {quantity} = this.state;
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View style={styles.row}>
            <Text>Product Code</Text>
            <TextInput value={item['product.productCode']} />
          </View>
          <View style={styles.row}>
            <Text>Product Name</Text>
            <TextInput value={item['product.name']} />
          </View>
          <View style={styles.row}>
            <Text>Lot Number</Text>
            <TextInput value={item['inventoryItem.lotNumber'] ?? 'Default'} />
          </View>
          <View style={styles.row}>
            <Text>Current Location</Text>
            <TextInput value={item['currentLocation.name'] ?? 'Default'} />
          </View>
          <View style={styles.row}>
            <Text>Putaway Location</Text>
            <AutoInputInternalLocation
              label="AutoInputInternalContainer"
              data={locations.map(({name}) => name)}
              selectedData={(selectedLocation: any) => {
                this.setState({selectedLocation});
              }}
            />
          </View>
          <View style={styles.row}>
            <Text>Quantity</Text>
            <View style={styles.quantityBox}>
              <TextInput
                style={styles.quantityInput}
                keyboardType="number-pad"
                value={quantity}
                onChangeText={quantity => {
                  this.setState({quantity});
                }}
              />
              <Text style={styles.quantityText}>{`/ ${item.quantity}`}</Text>
            </View>
          </View>
        </View>
        <Button
          title={'Create Putaway'}
          style={{padding: 20}}
          onPress={this.create}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  locations: state.locationsReducer.locations,
  currentLocation: state.mainReducer.currentLocation,
  SelectedLocation: state.locationsReducer.SelectedLocation,
});

const mapDispatchToProps: DispatchProps = {
  getBinLocationsAction,
  createPutawayOderAction,
  showScreenLoading,
  hideScreenLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayItem);
