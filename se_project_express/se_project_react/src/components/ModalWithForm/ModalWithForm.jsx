import "./ModalWithForm.css";
import "../ItemModal/ItemModal.css"; // <-- changed
import greyX from "../../assets/greyX.svg";

function ModalWithForm({ isOpen, onClose, buttonText = "Submit", title, children, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="modal__is-open">
      <div className="modal__content-garment">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            <img src={greyX} alt="Close" />
          </button>
        </div>
        <form className="modal__form" onSubmit={onSubmit}>
          {children}
          <button type="submit" className="modal__submit-btn">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ModalWithForm;