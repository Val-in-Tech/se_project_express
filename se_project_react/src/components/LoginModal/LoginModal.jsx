import React from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';

function LoginModal({ isOpen, onClose, onLogin, serverError }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    onLogin({ email, password });
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Sign In"
      title="Sign In"
      name="login-form"
      onSubmit={handleSubmit}
    >
      <label>
        Email
        <input name="email" type="email" className="modal__input" required />
      </label>
      <label>
        Password
        <input name="password" type="password" className="modal__input" required />
      </label>
      {serverError && <p className="modal__error">{serverError}</p>}
    </ModalWithForm>
  );
}

export default LoginModal;
