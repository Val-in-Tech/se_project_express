import React, { useContext, useEffect, useState } from 'react';
import './ProfileEdit.css';
import greyX from '../../assets/greyX.svg';
import CurrentUserContext from '../../../contexts/CurrentUserContext';

function ProfileEditModal({ isOpen, onClose, onSave }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(currentUser?.name || '');
      setAvatar(currentUser?.avatar || '');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (typeof onSave === 'function') {
      onSave({ name: name.trim(), avatar: avatar.trim() });
    }
  }

  return (
    <div className="modal__is-open">
      <div className="modal__content-profile" role="dialog" aria-modal="true" aria-label="Edit profile">
        <div className="modal-header">
          <h2>Change Profile Info</h2>
          <button className="close-button" onClick={onClose}>
            <img src={greyX} alt="Close" />
          </button>
        </div>

        <form className="profile-modal__form" onSubmit={handleSubmit}>
          <label className="profile-modal__label">
            Name
            <input
              className="profile-modal__input"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>

          <label className="profile-modal__label">
            Avatar URL
            <input
              className="profile-modal__input"
              name="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <div className="profile-modal__actions">
            <button type="submit" className="profile__submit-btn">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEditModal;
