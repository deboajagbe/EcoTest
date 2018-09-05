import React from 'react';
import FormRender from '../components/ui/FormRender';
import userStore from '../stores/userStore';

const props = {
  formType: 'passwordReset',
  formFields: ['Email'],
  buttonTitle: 'Send Instructions',
  successMessage: 'We\'ve emailed you the instructions',
  introText: 'Please enter the email address associated to your account, and we\'ll send you instructions.',
};

export default () => (<FormRender
  {...props}
  submit={formData => userStore.resetPassword({ email: formData.Email })}
/>);
