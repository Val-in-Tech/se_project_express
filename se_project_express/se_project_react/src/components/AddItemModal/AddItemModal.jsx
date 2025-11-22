import { useForm } from "../../hooks/useForm";
import ModalWithForm from "../ModalWithForm/ModalWithForm";


function AddItemModal({ isOpen, closeAllModals, handleAddGarmentSubmit, handleAddItemSubmit }) {
  const { values, handleChange, setValues } = useForm({name: "", imageUrl: "", weather: ""});

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddItemSubmit(values, setValues);
  };

  return (
    <ModalWithForm
          isOpen={isOpen}
          onClose={closeAllModals}
          buttonText="Add Garment"
          title="New Garment"
          name="add-garment-form"
          onSubmit={handleSubmit}
        >
          <label>
            Name
            <input 
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            className="modal__input" required />
          </label>
          <label>
            Image URL
            <input 
            name="imageUrl" 
            type="url"
            value={values.imageUrl}
            onChange={handleChange}
            className="modal__input" required />
          </label>
          <div className="modal__weather-group">
            <span>Weather:</span>
            <div className="modal__weather-option">
              <input 
              type="radio" 
              id="Hot" 
              name="weather" 
              value="hot"
              checked={values.weather === "hot"}
              onChange={handleChange}
              required />
              <label htmlFor="Hot" className="modal__weather-label">Hot</label>
            </div>
            <div className="modal__weather-option">
              <input 
              type="radio" 
              id="Warm" 
              name="weather" 
              value="warm"
              checked={values.weather === "warm"}
              onChange={handleChange} />
              <label htmlFor="Warm" className="modal__weather-label">Warm</label>
            </div>
            <div className="modal__weather-option">
              <input 
              type="radio" 
              id="Cold" 
              name="weather" 
              value="cold"
              checked={values.weather === "cold"}
              onChange={handleChange} />
              <label htmlFor="Cold" className="modal__weather-label">Cold</label>
            </div>
          </div>
        </ModalWithForm>
  );
}

export default AddItemModal;