import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import styles from './styles';
// import Header from '../../components/Header';
import {connect} from 'react-redux';
// import Icon, {Name} from '../../Icon';
import {DispatchProps, Props, State} from './Types';

import {RootState} from '../../redux/reducers';
// @ts-ignore
import {useNavigation} from "@react-navigation/native";
import useEventListener from "../../hooks/useEventListener";

const Dashboard =()=> {
    const navigation = useNavigation();
    const event =useEventListener();
    console.log("EVENT",event);

        return (
            <View style={styles.screenContainer}>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        navigation.navigate('Products');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        {/*<Icon name={Name.Boxes} size={14} />*/}
                        <Text style={styles.countLabel}>Products</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        navigation.navigate('Orders');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        {/*<Icon name={Name.Boxes} size={14} />*/}
                        <Text style={styles.countLabel}>Orders</Text>
                    </View>
                </TouchableOpacity>
                {/*<TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        navigation.navigate('PutawayList');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        <Text style={styles.countLabel}>Putaway List</Text>
                    </View>
                </TouchableOpacity>*/}
            </View>
        );
}

const mapStateToProps = (state: RootState) => ({
    //no-op
});

const mapDispatchToProps: DispatchProps = {
    //no-op
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
