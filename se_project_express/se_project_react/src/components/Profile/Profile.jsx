import "./Profile.css";
import SideBar from '../SideBar/SideBar';
import ClothesSection from '../ClothesSection/ClothesSection';
import "../../hooks/useForm";


function Profile({ clothingItems, handleOpenAddGarmentModal, onCardClick, onLogout, onUpdateUser }) {
  return (
    <main className="profile">
      <SideBar onLogout={onLogout} onUpdateUser={onUpdateUser} />
      <ClothesSection 
        clothingItems={clothingItems}
        handleOpenAddGarmentModal={handleOpenAddGarmentModal}
        onCardClick={onCardClick} // <-- pass this prop down
      />
    </main>
  );
}

export default Profile;