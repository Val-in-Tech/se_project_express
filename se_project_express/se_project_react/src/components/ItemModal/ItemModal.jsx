import React, { useContext } from "react";
import CurrentUserContext from '../../../contexts/CurrentUserContext';
// import "./Modal.css";
import "./ItemModal.css"; // <-- changed
import "../ModalWithForm/ModalWithForm.css";
import preview from "../../assets/previewX.svg";


function Modal({ card, item, isOpen, onClose, handleDeleteItem }) {
  const currentUser = useContext(CurrentUserContext);
  const actual = card || item;
  if (!actual) return null;
  /* eslint-disable-next-line no-console */
  console.log(actual);

  function handleDelete() {
    if (typeof handleDeleteItem === "function") {
      handleDeleteItem(actual);
    }
  }

  const isOwn = currentUser && actual.owner && (String(actual.owner) === String(currentUser._id));

  return (
    <div className="modal__is-open" onClick={onClose}>
      <div className="modal__item" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          <img src={preview} alt="Close" className="modal-close__img" />
        </button>
        <img src={card.imageUrl} alt={card.name} className="modal-image" />
        <div className="modal-title">
          {card.name}
          {card.weather && (
            <div>
              {card.weather === "cold" && "Weather: For cold"}
              {card.weather === "hot" && "Weather: For hot"}
              {card.weather === "warm" && "Weather: For warm"}
            </div>
          )}
          {isOwn && (
            <button
              className="modal__delete-button"
              onClick={handleDelete}
            >
              Delete item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;