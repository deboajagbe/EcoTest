/**
 * Menu Contents
 *
 * React Native Starter App
 * https://github.com/deboAjagbe/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

// Components
import { Spacer, Text, Button } from '@ui/';
import { observer } from 'mobx-react/native';
import userStore from '../stores/userStore';
import Icon from 'react-native-vector-icons/Ionicons';

/* Styles ==================================================================== */
const MENU_BG_COLOR = '#263137';

const styles = StyleSheet.create({
  container: {
    backgroundColor: MENU_BG_COLOR,
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    left: 0,
    right: 0,
    backgroundColor: MENU_BG_COLOR,
  },

  // Main Menu
  menu: {
    flex: 3,
    left: 0,
    right: 0,
    backgroundColor: MENU_BG_COLOR,
    padding: 20,
    paddingTop: AppSizes.statusBarHeight + 20,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  menuItem_text: {
    fontSize: 16,
    lineHeight: parseInt(16 + (16 * 0.5), 10),
    fontWeight: '500',
    marginTop: 14,
    marginBottom: 8,
    color: '#EEEFF0',
  },

  // Menu Bottom
  menuBottom: {
    flex: 1,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  menuBottom_text: {
    color: '#EEEFF0',
  },
});

/* Component ==================================================================== */
//@observer
class Menu extends Component {
  static propTypes = {
    unauthMenu: PropTypes.arrayOf(PropTypes.shape({})),
    authMenu: PropTypes.arrayOf(PropTypes.shape({})),
  };

  static defaultProps = {
    unauthMenu: [
      { title: 'Login', onPress: () => { Actions.login(); } },
      { title: 'Sign Up', onPress: () => { Actions.signUp(); } },
    ],
    authMenu: [
      { title: 'Update Profile', onPress: () => { Actions.updateProfile(); } },
      { title: 'Change Password', onPress: () => { Actions.passwordReset(); } },
    ],
  }

  /**
   * Each Menu Item looks like this
   */
  menuItem = item => (
    <TouchableOpacity
      key={`menu-item-${item.title}`}
      onPress={() => this.onPress(item.onPress)}
    >
      <View style={[styles.menuItem]}>
        <Text style={[styles.menuItem_text]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  /**
   * Build the Menu List
   */
  menuList = () => {
    // Determine which menu to use - authenticated user menu or unauthenicated version?
    let menu = this.props.unauthMenu;
    console.log("UID: ", userStore.uid, userStore.email);
    if (userStore.uid && userStore.email) menu = this.props.authMenu;

    return menu.map(item => this.menuItem(item));
  };

  /**
   * On Press of any menu item
   */
  onPress = (action) => {
    Actions.drawerClose();
    if (action) action();
  };

  render = () => (
    <View style={[styles.container]}>
      <View style={[styles.backgroundFill]} />

      <View style={[styles.menuContainer]}>
        <View style={[styles.menu]}>{this.menuList()}</View>

        <View style={[styles.menuBottom]}>
          {userStore.uid && userStore.email ?
            <View>
              <Text
                style={[
                  styles.menuBottom_text,
                  AppStyles.textCenterAligned,
                ]}
              >
                Logged in as:{'\n'}
                {userStore.firstName} {userStore.lastName} {userStore.email}
              </Text>

              <Spacer size={10} />

              <View style={[AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml]}>
                <Button small title={'Log Out'} onPress={() => { Actions.logout(); Actions.drawerClose()}} />
              </View>
            </View>
            :
            <View style={[AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml]}>
              <Button small title={'Log In'}  onPress={() => { Actions.drawerClose(); Actions.login(); }} />
            </View>
          }
        </View>
      </View>
    </View>
  )
}
export default Menu;