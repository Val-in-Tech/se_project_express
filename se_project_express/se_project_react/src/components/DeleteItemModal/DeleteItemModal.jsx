import "./DeleteItemModal.css";
import GreyX from "../../assets/greyX.svg";

function DeleteItemModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="modal__is-open">
     <div className="modal__delete-item">
       <button className="delete__close-button" onClick={onCancel} aria-label="Close">
          <img src={GreyX} alt="Close" className="delete-modal__close-img" />
        </button>
        <div className="delete__title-content">
        <h2 className="delete__text">Are you sure you want to delete this item?</h2>
        <h2 className="delete__text-two">This action is irreversible.</h2>
        </div>
      <div className="delete__buttons">
        <button className="delete__button-confirm" onClick={onConfirm}>Yes, delete item</button>
        <button className="delete__button-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteItemModal;