import React, { useContext } from "react";
import "./ItemCard.css";
import CurrentUserContext from "../../../contexts/CurrentUserContext";

function ItemCard({ data, onCardClick, onImageClick, onCardLike, currentUser }) {
        const ctxUser = useContext(CurrentUserContext);
        const user = currentUser || ctxUser;

        const likes = Array.isArray(data.likes) ? data.likes : [];
        const isLiked = user && likes.some((id) => String(id) === String(user._id));

        const itemLikeButtonClassName = `item-card__like-button ${isLiked ? 'item-card__like-button_active' : ''}`;

        function handleLike() {
            if (typeof onCardLike === 'function') {
                onCardLike({ id: data._id, isLiked });
            }
        }

        return (
                <li className="item-card">
                        <h2 className="item-card__title">{data.name}</h2>
                        <img
                            src={data.imageUrl}
                            alt={data.name}
                            className="item-card__image"
                            onClick={onImageClick}
                        />
                        <p className="item-card__description">{data.description}</p>
                        {/* like button: hide for unauthorized users */}
                                    {user && (
                                        <button
                                            type="button"
                                            aria-pressed={isLiked}
                                            aria-label={isLiked ? 'Unlike' : 'Like'}
                                            title={isLiked ? 'Unlike' : 'Like'}
                                            className={itemLikeButtonClassName}
                                            onClick={handleLike}
                                        >
                                            <span className="item-card__like-icon" aria-hidden>
                                                {isLiked ? '♥' : '♡'}
                                            </span>
                                            {likes.length > 0 && <span className="item-card__like-count">{likes.length}</span>}
                                        </button>
                                    )}
                </li>
        );
}

export default ItemCard;