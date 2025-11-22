import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import logo from "../../assets/wtwr-logo.svg";
import avatar from "../../assets/avatar.svg";
import "./Header.css";
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch.jsx';
import CurrentUserContext from '../../../contexts/CurrentUserContext';

function Header({ handleOpenAddGarmentModal, weatherData, tempUnit, setTempUnit, onOpenLogin, onOpenRegister, onLogout, isAuthenticated }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("default", {
    month: 'long',
    day: 'numeric'
});

  return (
    <header className="header">
      <div className="header__side-left">
        <Link to="/" className="header__home-link">
        <img src={logo} alt="WTWR Logo" className="header__logo" />
      </Link>
      <p className="header__place">
      <time className="header__date" dateTime={now}>
         {dateStr}
      </time>
      , {weatherData.city}
       </p>
      </div>
      <div className="header__side">
        <ToggleSwitch tempUnit={tempUnit} setTempUnit={setTempUnit} />
        <button onClick={handleOpenAddGarmentModal} className="header__add-clothes-btn">+ Add Clothes</button>
        {isAuthenticated ? (
          <>
            <button className="header__link header__logout" onClick={onLogout}>Logout</button>
            <Link className="header__link" to="/profile">
              <UserHeader />
            </Link>
          </>
        ) : (
          <>
            <button className="header__link header__login" onClick={onOpenLogin}>Login</button>
            <button className="header__link header__register" onClick={onOpenRegister}>Register</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

function UserHeader() {
  const currentUser = useContext(CurrentUserContext);
  const name = currentUser?.name || 'Profile';
  const avatarUrl = currentUser?.avatar;
  const initial = name && name.length ? name[0].toUpperCase() : 'U';

  return (
    <div className="header__user">
      <p className="header__username">{name}</p>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="header__avatar" />
      ) : (
        <div className="header__avatar_placeholder">{initial}</div>
      )}
    </div>
  );
}