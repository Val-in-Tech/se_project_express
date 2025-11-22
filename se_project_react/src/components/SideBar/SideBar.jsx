import './SideBar.css';
import avatarImg from '../../assets/avatar.svg';
import React, { useContext, useState } from 'react';
import CurrentUserContext from '../../../contexts/CurrentUserContext';
import ProfileEditModal from '../ProfileEditModal/ProfileEditModal';

function SideBar({ onLogout, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const name = currentUser?.name || 'Your Name';
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || 'Your';
  const lastName = nameParts.slice(1).join(' ') || '';
  const avatarUrl = currentUser?.avatar || avatarImg;
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  return (
    <div className="sidebar">
      <div className="sidebar__media">
        <div className="sidebar__profile">
            <img className="sidebar__avatar" src={avatarUrl} alt={name} />
            <div className="sidebar__name">
              <span className="sidebar__firstname">{firstName}</span>
              <span className="sidebar__lastname">{lastName}</span>
            </div>
          </div>
          <div className="sidebar__info">
          </div>
        <div className="sidebar__links">
          {currentUser && currentUser.email && (
            <button className="sidebar__profile-data" onClick={() => setIsProfileEditOpen(true)}>Change profile data</button>
          )}
          {onLogout && (
            <button className="sidebar__signout" onClick={onLogout}>
              Log out
            </button>
          )}
        </div>
      </div>
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        onSave={(data) => {
          // bubble up updated user info to App
          if (typeof onUpdateUser === 'function') onUpdateUser(data);
          setIsProfileEditOpen(false);
        }}
      />
    </div>
  );
}

export default SideBar;