/**
 * Index - this is where everything
 *  starts - but offloads to app.js
 *
 * React Native Starter App
 * https://github.com/deboAjagbe/react-native-starter-app
 */
import React, { Component } from 'react';
import { Router, Tabs, Drawer, Scene, Stack, Lightbox } from 'react-native-router-flux';
import { AppConfig } from './constants/';
import Launch from './scenes/Launch';
import DrawerMenu from './scenes/DrawerMenu';
import Login from './scenes/Login';
import SignUp from './scenes/SignUp';
import ListingView from './scenes/ListingView';
import RecipeView from './scenes/RecipeView';
import UpdateProfile from './scenes/UpdateProfile';
import PasswordReset from './scenes/ResetPassword';
import { TabIcon } from '@ui/';
import Placeholder from '@components/general/Placeholder';
import Error from '@components/general/Error';
import StyleGuide from './scenes/StyleGuideView';
import Icon from 'react-native-vector-icons/Ionicons';
import { observer } from 'mobx-react/native';
import codePush from "react-native-code-push";
import { View, StatusBar, Platform} from 'react-native';
import userStore from './stores/userStore';
import OneSignal from 'react-native-onesignal';

const drawerIcon = () => <Icon name={'ios-menu'} size={(Platform.isPad ? 40 : 30)} color={'#FFF'} />;


class App extends Component {

    componentWillMount() {
        OneSignal.init(userStore.onesignal_app_id);
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

  onReceived = async (notification) => {
        console.log("Notification received: ", notification);
        const latest = 'latest';
        const pageNumber = 1;
        const res = await NetworkCall.LoadNews({ pageNumber, latest })
        console.log('backgroundSync: ', res);
    }

  onOpened = async (openResult) => {
      const link = openResult.notification.payload.launchURL;
      console.log('Message: ', openResult.notification.payload.launchURL);
      console.log('Data: ', openResult.notification.payload.additionalData);
      console.log('isActive: ', openResult.notification.isAppInFocus);
      console.log('openResult: ', openResult);
      const res = await NetworkCall.SearchMix({ link })
      if (!res || res.length < 1) {
        alert('Link is broken')
      } else {
        Actions.EcoTestView({
          title: 'EcoTest News',
          news: res[0]
        })
      }
    }

    onIds(device) {
		console.log('Device info: ', device);
    }


  render() {
    console.disableYellowBox = true
    return (
  <View style={{flex: 1}}>
        <StatusBar backgroundColor='#4385B7' barStyle='light-content'/>
     <Router wrapBy={observer}>
          <Lightbox>
            <Stack {...AppConfig.navbarProps} headerMode="screen">
              <Scene component={Launch} hideNavBar  />
              <Scene key="login" component={Login} type="replace" title="Login"
                onLogin="doAuth"
                onSignUp="signUp"
                onForgotPassword="passwordReset" />
              <Scene key="signUp" component={SignUp} type="replace" tintColor={'white'} title="Sign Up" />
              <Scene key="passwordReset" component={PasswordReset} tintColor={'white'} title="Password Reset" />
              <Drawer key="app" contentComponent={DrawerMenu} hideNavBar type="reset" drawerIcon={drawerIcon}>
                <Tabs hideNavBar>
                  <Stack title="Recipes" icon={TabIcon('search')} headerMode="float">
                    <Scene component={ListingView} />
                    <Scene key="recipeView" component={RecipeView} back />
                  </Stack>
                  <Scene title="Coming Soon" component={Placeholder} icon={TabIcon('timeline')} />
                  <Scene title="Example Error" component={Error} icon={TabIcon('error')} />
                  <Scene title="Style Guide" component={StyleGuide} icon={TabIcon('speaker-notes')} />
                </Tabs>
              </Drawer>
              <Scene key="updateProfile" title="Update Profile" back component={UpdateProfile} />
            </Stack>
            <Scene key="doCheck" on={userStore.hasCredentials} success="doAuth" failure="login" />
            <Scene key="doAuth" on={userStore.login} success="app" failure="login" />
            <Scene key="doSignUp" on={userStore.signUp} success="app" failure="signUp" />
            <Scene key="logout" on={userStore.logout} success="login" />
          </Lightbox>
  </Router>
  </View>
    );
  }
}

export default App = codePush()(App);

