/**
 * Login/Sign Up/Forgot Password Screen
 *
 * React Native Starter App
 * https://github.com/deboAjagbe/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import FormValidation from 'tcomb-form-native';

// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
import TcombTextInput from '@components/tcomb/TextInput';
import userStore from '../../stores/userStore';

/* Component ==================================================================== */
let redirectTimeout;
class AuthForm extends Component {
  static componentName = 'Login';

  static propTypes = {
    submit: PropTypes.func,
    error: PropTypes.string,
    formType: PropTypes.oneOf(['login', 'signUp', 'passwordReset', 'updateProfile']),
    formFields: PropTypes.arrayOf(PropTypes.string),
    buttonTitle: PropTypes.string,
    introTitle: PropTypes.string,
    introText: PropTypes.string,
    successMessage: PropTypes.string,
  };

  static defaultProps = {
    error: null,
    submit: null,
    onSuccessfulSubmit: null,
    formType: 'login',
    formFields: ['Email', 'Password'],
    buttonTitle: 'Login',
    successMessage: 'Awesome, you\'re now logged in',
    introTitle: null,
    introText: null,
  };

  constructor(props) {
    super(props);

    // What fields should exist in the form?
    const formFields = {};
    if (props.formFields.indexOf('Email') > -1) formFields.Email = this.validEmail;
    if (props.formFields.indexOf('Password') > -1) formFields.Password = this.validPassword;
    if (props.formFields.indexOf('ConfirmPassword') > -1) formFields.ConfirmPassword = this.validPassword;
    if (props.formFields.indexOf('FirstName') > -1) formFields.FirstName = FormValidation.String;
    if (props.formFields.indexOf('LastName') > -1) formFields.LastName = FormValidation.String;

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      form_fields: FormValidation.struct(formFields),
      form_values: {
        Email: userStore.email,
        FirstName: userStore.firstName,
        LastName: userStore.lastName,
      },
      options: {
        fields: {
          Email: {
            template: TcombTextInput,
            error: 'Please enter a valid email',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Password: {
            template: TcombTextInput,
            error: 'Passwords must be more than 8 characters and contain letters and numbers',
            clearButtonMode: 'while-editing',
            secureTextEntry: true,
          },
          ConfirmPassword: {
            template: TcombTextInput,
            error: 'Your passwords must match',
            clearButtonMode: 'while-editing',
            secureTextEntry: true,
          },
          FirstName: {
            template: TcombTextInput,
            error: 'Please enter your first name',
            clearButtonMode: 'while-editing',
          },
          LastName: {
            template: TcombTextInput,
            error: 'Please enter your last name',
            clearButtonMode: 'while-editing',
          },
        },
      },
    };
  }

  componentDidMount = async () => {
    // Pre-populate any details stored in AsyncStorage
    const values = await this.getStoredCredentials();

    if (values !== null && values.email && values.password) {
      this.setState({
        form_values: {
          ...this.state.form_values,
          Email: values.email || '',
          Password: values.password || '',
        },
      });
    }
  }

  componentWillUnmount = () => clearTimeout(redirectTimeout);

  /**
    * Get user data from AsyncStorage to populate fields
    */
  getStoredCredentials = async () => {
    const values = await AsyncStorage.getItem('api/credentials');
    const jsonValues = JSON.parse(values);

    return jsonValues;
  }

  /**
    * Email Validation
    */
  validEmail = FormValidation.refinement(
    FormValidation.String, (email) => {
      const regularExpression = /^.+@.+\..+$/i;

      return regularExpression.test(email);
    },
  );

  /**
    * Password Validation - Must be 6 chars long
    */
  validPassword = FormValidation.refinement(
    FormValidation.String, (password) => {
      if (password.length < 8) return false; // Too short
      if (password.search(/\d/) === -1) return false; // No numbers
      if (password.search(/[a-zA-Z]/) === -1) return false; // No letters
      return true;
    },
  );

  /**
    * Password Confirmation - password fields must match
    * - Sets the error and returns bool of whether to process form or not
    */
  passwordsMatch = (form) => {
    const error = form.Password !== form.ConfirmPassword;

    this.setState({
      options: FormValidation.update(this.state.options, {
        fields: {
          ConfirmPassword: {
            hasError: { $set: error },
            error: { $set: error ? 'Passwords don\'t match' : '' },
          },
        },
      }),
      form_values: form,
    });

    return error;
  }

  /**
    * Handle Form Submit
    */
  handleSubmit = async () => {
    // Get new credentials and update
    const formData = this.form.getValue();

    // Check whether passwords match
    if (formData && formData.Password && formData.ConfirmPassword) {
      const passwordsDontMatch = this.passwordsMatch(formData);
      if (passwordsDontMatch) return false;
    }

    // Form is valid
    if (formData) {
      this.setState({ form_values: formData }, async () => {
        this.setState({ resultMsg: { error: null, status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) this.scrollView.scrollTo({ y: 0 });

        if (this.props.submit) {
          try {
            await this.props.submit(formData);
            this.setState({ resultMsg: { error: null, status: this.props.successMessage }});
          } catch (e) {
            this.setState({ resultMsg: { error: e.message } });
          }
        } else {
          this.setState({ resultMsg: { error: 'Submit function missing' } });
        }
      });
    }

    return true;
  }

  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        ref={(a) => { this.scrollView = a; }}
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.state.resultMsg.success}
            error={this.props.error || this.state.resultMsg.error}
          />

          {(!!this.props.introTitle || !!this.props.introText) &&
            <View>
              {!!this.props.introTitle &&
                <Text h1>{this.props.introTitle}</Text>
              }
              {!!this.props.introText &&
                <Text>{this.props.introText}</Text>
              }

              <Spacer size={10} />
            </View>
          }

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          <Spacer size={20} />

          <Button title={this.props.buttonTitle} onPress={this.handleSubmit} />

          <Spacer size={10} />

          {this.props.formType === 'login' &&
            <View>
              <TouchableOpacity onPress={this.props.onForgotPassword}>
                <Text p style={[AppStyles.textCenterAligned, AppStyles.link]}>
                  Forgot Password
                </Text>
              </TouchableOpacity>

              <Spacer size={10} />

              <Text p style={[AppStyles.textCenterAligned]}>
                - or -
              </Text>

              <Button outlined title={'Sign Up'} onPress={this.props.onSignUp} />
            </View>
          }
        </Card>

        <Spacer size={60} />
      </ScrollView>
    );
  }
}

/* Export Component ==================================================================== */
export default AuthForm;
