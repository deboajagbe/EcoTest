import React from 'react';
import FormRender from '../components/ui/FormRender';
import { Actions } from 'react-native-router-flux';

export default () => (<FormRender
  formType="signUp"
  buttonTitle="Sign Up"
  successMessage="Perfect, You're all Signed Up!"
  formFields={['Email', 'Password', 'ConfirmPassword', 'FirstName', 'LastName']}
  submit={formData => Actions.doSignUp({ email: formData.Email, password: formData.Password, firstName: formData.FirstName, lastName: formData.LastName })}
/>);
