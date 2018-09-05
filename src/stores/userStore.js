import { AsyncStorage } from 'react-native';
import { ErrorMessages, Firebase, FirebaseRef } from '@constants/';
import { observable } from 'mobx';

class UserStore {
  @observable uid: string;
  @observable email: string;
  @observable password: string;
  @observable firstName: string;
  @observable lastName: string;

  load = async () => {
    const values = await AsyncStorage.getItem('api/credentials');
    return JSON.parse(values) || {};
  };

  hasCredentials = ({ email, password }) => email && password && { email, password };

  save = async (email = '', password = '') => {
    await AsyncStorage.setItem('api/credentials', JSON.stringify({ email, password }));
  };

  remove = async () => {
    await AsyncStorage.removeItem('api/credentials');
  };

  getUserData = () => new Promise((resolve, reject) => {
    if (Firebase === null) {
      reject(ErrorMessages.invalidFirebase);
    }

    const UID = Firebase.auth().currentUser.uid;
    if (!UID) return false;

    const ref = FirebaseRef.child(`users/${UID}`);
    return ref.on('value', (snapshot) => {
      const userData = snapshot.val() || [];
      resolve(userData);
    });
  });

  login = async ({ email, password }) => {
    if (email && password) {
      this.save(email, password);
    }
    if (Firebase === null) {
      throw ErrorMessages.invalidFirebase;
    }
    const { uid } = await Firebase.auth().signInWithEmailAndPassword(email, password);
    this.uid = uid;
    const { firstName, lastName } = await this.getUserData();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    return true;
  };

  signUp = async ({ email, password, firstName, lastName }) => {
    if (Firebase === null) {
      throw ErrorMessages.invalidFirebase;
    }
    const { uid } = await Firebase.auth().createUserWithEmailAndPassword(email, password);
    await FirebaseRef.child(`users/${uid}`).set({
      firstName,
      lastName,
      signedUp: Firebase.database.ServerValue.TIMESTAMP,
      lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
    });
    this.save(email, password);
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    return true;
  };

  logout = async () => {
    if (Firebase === null) {
      throw ErrorMessages.invalidFirebase;
    }
    console.log("LOGOUT!");
    await Firebase.auth().signOut();
    await this.remove();
    this.email = null;
    this.uid = null;
    this.firstName = null;
    this.lastName = null;
    return true;
  };

  sleep = time => new Promise(resolve => setTimeout(resolve, time));

  update = async ({ email, firstName, lastName }) => {
    if (Firebase === null) {
      throw ErrorMessages.invalidFirebase;
    }
    const UID = Firebase.auth().currentUser.uid;
    if (!UID) {
      throw 'No uid!';
    }

    await Firebase.auth().currentUser.updateEmail(email);
    await FirebaseRef.child(`users/${UID}`).update({ firstName, lastName });
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  };

  resetPassword = async ({ email }) => {
    await Firebase.auth().sendPasswordResetEmail(email);
    return true;
  };
}

export default new UserStore();
