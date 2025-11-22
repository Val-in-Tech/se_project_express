import React from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';

function RegisterModal({ isOpen, onClose, onRegister, serverError }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const avatar = e.target.avatar?.value || '';
    const email = e.target.email.value;
    const password = e.target.password.value;
    onRegister({ name, email, password, avatar });
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Sign Up"
      title="Create account"
      name="register-form"
      onSubmit={handleSubmit}
    >
      <label>
        Name
        <input name="name" type="text" className="modal__input" required />
      </label>
      <label>
        Avatar (optional URL)
        <input name="avatar" type="url" className="modal__input" placeholder="https://example.com/avatar.jpg" />
      </label>
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

export default RegisterModal;
