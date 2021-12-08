/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Menu, Provider} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {logout} from '../redux/actions/auth';

const OptionMenu = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const handleLogout = () => dispatch(logout());
  return (
    <Provider>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          alignContent: 'flex-start',
        }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{
            resizeMode: 'stretch',
            width: 40,
            height: 30,
            marginTop: 10,
            marginEnd:
              route.name !== 'Login' && route.name !== 'Settings' ? 0 : 30,
          }}
        />
        {route.name !== 'Login' && route.name !== 'Settings' ? (
          <Menu
            style={{
              width: 350,
              position: 'absolute',
              top: 50,
              left: 0,
            }}
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Image
                  source={require('../assets/images/option.jpg')}
                  style={{
                    resizeMode: 'stretch',
                    width: 40,
                    height: 40,
                    marginRight: 10,
                    zIndex: 123,
                  }}
                />
              </TouchableOpacity>
            }>
            <Menu.Item
              onPress={() => {
                navigation.navigate('Dashboard');
                closeMenu();
              }}
              title="Dashboard"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="User detail"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="App info / version"
            />
            <Menu.Item
              onPress={() => {
                navigation.navigate('Settings');
                closeMenu();
              }}
              title="Settings"
            />
            <Menu.Item onPress={handleLogout} title="Logout" />
            <Menu.Item
              onPress={() =>  closeMenu()}
              title="Change location"
            />
            <Menu.Item
              onPress={handleLogout}
              title="Logout"
            />
          </Menu>
        ) : null}
      </View>
    </Provider>
  );
};

export default OptionMenu;
