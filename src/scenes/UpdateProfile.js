import React from 'react';
import FormRender from '../components/ui/FormRender';
import userStore from '../stores/userStore';

const props = {
  formType: 'updateProfile',
  formFields: ['Email', 'FirstName', 'LastName'],
  buttonTitle: 'Update',
  successMessage: 'Great, that\'s been updated!',
};

export default () => (<FormRender
  {...props}
  submit={formData => userStore.update({ email: formData.Email, firstName: formData.FirstName, lastName: formData.LastName })}
/>);
