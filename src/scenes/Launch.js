/**
 * Launch Screen
 *  - Shows a nice loading screen whilst:
 *    - Preloading any specified app content
 *    - Checking if user is logged in, and redirects from there
 *
 * React Native Starter App
 * https://github.com/deboAjagbe/react-native-starter-app
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable'
import Video from 'react-native-video'
import { Actions } from 'react-native-router-flux';
import { Spacer, Button } from '@components/ui';

// Consts and Libs
import { AppStyles, AppColors, AppSizes } from '../theme/';
const background = require('../images/background.mp4')

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  launchImage: {
    width: AppSizes.screen.width,
    height: AppSizes.screen.height,
  },
  btnBox: {
    height: null,
    width: null,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: AppSizes.screen.height / 1.5
  },
  btnContainer: {
    width: AppSizes.screen.width - 40,
    height: 40,
    marginBottom: 20,
    backgroundColor: AppColors.brand.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLogin: {
    width: AppSizes.screen.width - 40,
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff'
  },
});


/* Component ==================================================================== */
export default class Launch extends Component {

  constructor(props) {
    super(props)
    this.state = {
      init: true,
      signInPressed: false,
      signUpPressed: false
    }
  }

  componentDidMount = () => {
    // Show status bar on app launch
    StatusBar.setHidden(true);
    setTimeout(() => {
      //alert('Leaving')
    }, 5000);  
  };
  _handleSignInPress() {
    this.setState({ init: false, signInPressed: true })
  }

  _handleSignUpPress() {
    this.setState({ init: false, signUpPressed: true })
  }

  _handleAnimEnd() {
    if (!this.state.init) {
      if (this.state.signInPressed) {
        Actions.login();
      }
      if (this.state.signUpPressed) {
        Actions.signUp();
      }
    }
  }
  render = () => {
    const animation = this.state.init ? 'bounceInUp' : 'bounceOutDown'
    return(
    <View style={[AppStyles.container]}>
      <Video source={background}
        style={styles.backgroundVideo}
        rate={1}
        volume={1}
        muted={false}
        resizeMode="cover"
        repeat={true}
        key="video1" />
        <Animatable.View
          animation={animation}
          style={{backgroundColor: 'transparent', flex: 2}}
          delay={800}
          onAnimationEnd={this._handleAnimEnd.bind(this)}>
          <Spacer size={20} />
          <View style={styles.btnBox}>
            <TouchableOpacity onPress={this._handleSignUpPress.bind(this)} pressOpacity={0.75}>
              <View style={styles.btnContainer}>
                <Text style={styles.btnText}>{'sign up'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._handleSignInPress.bind(this)}>
              <View style={styles.btnLogin}>
                <Text style={styles.btnText}>{'log in'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animatable.View>
    </View>
    )
  }
}

