import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard.jsx";
import ItemModal from "../ItemModal/ItemModal.jsx";
import CurrentUserContext from "../../../contexts/CurrentUserContext";

function ClothesSection({ clothingItems, handleOpenAddGarmentModal, onCardClick }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const handleImageClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const currentUser = useContext(CurrentUserContext);

  const itemsToShow = location.pathname === "/profile" && currentUser
    ? clothingItems.filter((i) => String(i.owner) === String(currentUser._id))
    : clothingItems;

  return (
    <section className="clothes-section">
      <div className="clothes-section__row">
        Your Items{" "}
        <button
          className="clothes-section__btn"
          onClick={handleOpenAddGarmentModal}
        >
          + Add New
        </button>
      </div>
      <ul className="clothes-section__card-list">
        {itemsToShow.map((item) => (
          <ItemCard
            key={item._id}
            data={item}
            onImageClick={() => onCardClick(item)}
          />
        ))}
      </ul>
      {isModalOpen && selectedItem && location.pathname === "/profile" && (
        <ItemModal item={selectedItem} onClose={handleCloseModal} />
      )}
    </section>
  );
}

export default ClothesSection;