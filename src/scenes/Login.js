import React from 'react';
import FormRender from '../components/ui/FormRender';

export default props => (<FormRender
  {...props}
  submit={formData => props.onLogin({ email: formData.Email, password: formData.Password })}
/>);
