import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../Header/Header.jsx";
import Main from "../Main/Main.jsx";
import Footer from "../Footer/Footer.jsx";
import Modal from "../ItemModal/ItemModal.jsx"; // <-- changed from ../Modal/Modal.jsx
import DeleteItemModal from "../DeleteItemModal/DeleteItemModal.jsx";

import "./App.css";
import { getWeatherData } from "../../utils/weatherApi.js";
import CurrentTemperatureUnitContext from "../../../contexts/CurrentTemperatureUnitContext.js";
import CurrentUserContext from "../../../contexts/CurrentUserContext.js";
import Profile from "../Profile/Profile.jsx";
import AddItemModal from "../AddItemModal/AddItemModal.jsx";
import LoginModal from "../LoginModal/LoginModal.jsx";
import RegisterModal from "../RegisterModal/RegisterModal.jsx";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.jsx";
import { getItems, addItem, deleteItem, addCardLike, removeCardLike } from "../../utils/api";
import { signup, signin, checkToken } from "../../utils/auth";


function App() {
  const [clothingItems, setClothingItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("clothingItems"));
      return saved && saved.length ? saved : [];
    } catch (e) {
      return [];
    }
  });

  const [weatherData, setWeatherData] = useState({ city: "", temp: 0 });
  const [tempUnit, setTempUnit] = useState("F");

  useEffect(() => {
    localStorage.setItem("clothingItems", JSON.stringify(clothingItems));
  }, [clothingItems]);

  const [selectedCard, setSelectedCard] = useState(null);
  const [activeModal, setActiveModal] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('jwt'));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('jwt'));
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loginError, setLoginError] = useState('');

  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function handleOpenModal(card) {
    setSelectedCard(card);
    setActiveModal("modal");
  }

  function handleOpenGarmentModal() {
    setActiveModal("add-garment-modal");
  }

  function handleOpenLogin() {
    setLoginError('');
    setIsLoginOpen(true);
  }

  function handleCloseLogin() {
    setIsLoginOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    setIsLoggedIn(false);
    setCurrentUser(null);
  }

  function handleLoginSubmit({ email, password }) {
    setLoginError('');
    signin({ email, password })
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setIsAuthenticated(true);
          setIsLoggedIn(true);
          // fetch current user
          return checkToken(data.token);
        }
        return Promise.reject({ message: 'No token returned' });
      })
      .then((user) => {
        setCurrentUser(user);
        return getItems();
      })
      .then((items) => {
        setClothingItems(items.reverse());
        setIsLoginOpen(false);
      })
      .catch((err) => {
        const msg = (err && err.message) || (typeof err === 'string' ? err : 'Login failed');
        setLoginError(msg);
        console.error('Login failed:', err);
      });
  }

  

  function closeAllModals() {
    setActiveModal("");
    // also clear the selected card so the modal unmounts
    setSelectedCard(null);
  }

  function handleAddGarmentSubmit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const imageUrl = e.target.imageUrl.value; // <-- Make sure this matches input's name
    const weather = e.target.weather.value;

    const newItem = {
      _id: Date.now(), 
      name,
      weather,
      link: imageUrl, 
    };

    setClothingItems([newItem, ...clothingItems]);
    closeAllModals();
  }

  function getTimeOfDay(sunrise, sunset) {
    const now = Math.floor(Date.now() / 1000); // current UNIX timestamp in seconds
    return now >= sunrise && now < sunset ? "day" : "night";
  }

function handleAddItemSubmit(inputValues, resetForm) {
  let payload = inputValues;
  if (inputValues && inputValues.target) {
    payload = {
      name: inputValues.target.name?.value,
      imageUrl: inputValues.target.imageUrl?.value,
      weather: inputValues.target.weather?.value,
    };
    inputValues.preventDefault?.();
  }

  if (!payload || !payload.name || !payload.imageUrl) {
    console.warn("Missing required fields:", payload);
    return;
  }

  addItem(payload)
    .then(() => {
      // Fetch updated items from API
      return getItems();
    })
    .then((data) => {
      setClothingItems(data.reverse()); // newest first
      closeAllModals();
      if (typeof resetForm === "function") {
        resetForm({ name: "", imageUrl: "", weather: "hot" });
      }
    })
    .catch((err) => {
      console.error("Failed to add item:", err);
    });
}

function handleDeleteItem(item) {
  deleteItem(item._id)
    .then(() => {
      // Fetch updated items from API
      return getItems();
    })
    .then((items) => {
      setClothingItems(items.reverse()); // newest first
      closeAllModals();
    })
    .catch((err) => {
      console.error("Failed to delete item:", err);
    });
}

  // handle likes/unlikes for cards (optimistic update)
  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");
    const userId = currentUser && currentUser._id;

    // optimistic update: toggle like locally so UI responds immediately
    setClothingItems((cards) => cards.map((item) => {
      if (item._id !== id) return item;
      const likes = Array.isArray(item.likes) ? [...item.likes] : [];
      if (!isLiked) {
        // add like
        if (userId && !likes.some((x) => String(x) === String(userId))) likes.push(userId);
      } else {
        // remove like
        const idx = likes.findIndex((x) => String(x) === String(userId));
        if (idx !== -1) likes.splice(idx, 1);
      }
      return { ...item, likes };
    }));

    // call server and reconcile
    const apiCall = !isLiked ? addCardLike(id) : removeCardLike(id);
    apiCall
      .then((updatedCard) => {
        setClothingItems((cards) => cards.map((item) => (item._id === id ? updatedCard : item)));
      })
      .catch((err) => {
        console.error('Like/unlike API error, reverting local change:', err);
        // revert by refetching items (simple and reliable)
        getItems()
          .then((items) => setClothingItems(items.reverse()))
          .catch((e) => console.error('Failed to refetch items after like error:', e));
      });
  };

  function handleRequestDelete(item) {
    console.log("Delete requested for:", item);
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
    setActiveModal("");
  }

  function handleConfirmDelete() {
    if (itemToDelete) {
      handleDeleteItem(itemToDelete);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  }

  function handleCancelDelete() {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  }

  function handleOpenRegister() {
    setRegisterError('');
    setIsRegisterOpen(true);
  }

  function handleCloseRegister() {
    setIsRegisterOpen(false);
  }

  function handleRegisterSubmit({ name, email, password, avatar }) {
    // Use avatar provided by user if present, otherwise generate a default avatar URL
    const avatarToUse = avatar && avatar.trim() ? avatar.trim() : `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
    setRegisterError('');
    signup({ name, avatar: avatarToUse, email, password })
      .then(() => signin({ email, password }))
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setIsAuthenticated(true);
          setIsLoggedIn(true);
          return checkToken(data.token);
        }
        return Promise.reject({ message: 'No token returned' });
      })
      .then((user) => {
        setCurrentUser(user);
        setIsRegisterOpen(false);
        return getItems();
      })
      .then((items) => {
        setClothingItems(items.reverse());
      })
      .catch((err) => {
        const msg = (err && err.message) || (typeof err === 'string' ? err : 'Registration failed');
        setRegisterError(msg);
        console.error('Registration failed:', err);
      });
  }

  // Update local currentUser state with provided fields (shallow merge)
  function handleUpdateUser(updates) {
    setCurrentUser((prev) => ({ ...(prev || {}), ...updates }));
  }

  useEffect(() => {
    getWeatherData()
      .then((data) => {
        const timeOfDay = getTimeOfDay(data.sunrise, data.sunset);
        setWeatherData({
          ...data,
          timeOfDay,
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((items) => {
        setClothingItems(items.reverse()); // newest first
      })
      .catch((err) => {
        console.error("Failed to fetch items:", err);
      });
  }, []);

  // Check token validity on mount
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      checkToken(token)
        .then((user) => {
          if (user && user._id) {
            setIsAuthenticated(true);
            setIsLoggedIn(true);
            setCurrentUser(user);
          }
        })
        .catch(() => {
          localStorage.removeItem('jwt');
          setIsAuthenticated(false);
          setIsLoggedIn(false);
          setCurrentUser(null);
        });
    }
  }, []);

  const displayTemp =
  tempUnit === "F"
    ? Math.round(weatherData.temp)
    : Math.round(((weatherData.temp - 32) * 5) / 9);

  return (
    <CurrentTemperatureUnitContext.Provider value={tempUnit}>
    <CurrentUserContext.Provider value={currentUser}>
    <div className="page-container">
      <div className="App">
        <Header 
          weatherData={weatherData}
          handleOpenAddGarmentModal={handleOpenGarmentModal}
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          
        />
        <Routes>
          <Route path="/" element={
            <Main
              clothingItems={clothingItems}
              onCardClick={handleOpenModal}
              weatherData={{ ...weatherData, temp: displayTemp }}
              tempUnit={tempUnit}
              handleDeleteItem={handleRequestDelete} //add this for the delete functionality 
              onCardLike={handleCardLike}
              currentUser={currentUser}
            />
          } />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile
                  clothingItems={clothingItems}
                  handleOpenAddGarmentModal={handleOpenGarmentModal}
                  onCardClick={handleOpenModal}
                  onLogout={handleLogout}
                  onUpdateUser={handleUpdateUser}
                />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
        <Modal
          card={selectedCard}
          isOpen={activeModal === "modal"}
          onClose={closeAllModals}
          handleDeleteItem={handleRequestDelete} // This is correct!
        />
        <AddItemModal isOpen={activeModal === "add-garment-modal"} 
        handleAddItemSubmit={handleAddItemSubmit}
        closeAllModals={closeAllModals} 
        />
  <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} onLogin={handleLoginSubmit} serverError={loginError} />
  <RegisterModal isOpen={isRegisterOpen} onClose={handleCloseRegister} onRegister={handleRegisterSubmit} serverError={registerError} />
        <DeleteItemModal
          isOpen={isDeleteModalOpen}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
    </CurrentUserContext.Provider>
  </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;
