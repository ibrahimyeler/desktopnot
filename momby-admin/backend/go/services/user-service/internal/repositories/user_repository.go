package repositories

import (
	"github.com/google/uuid"
	"github.com/momby/user-service/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetByID(id uuid.UUID) (models.User, error) {
	var user models.User
	err := r.db.Preload("PregnancyInfo").Preload("Addresses").Preload("Favorites").
		First(&user, "id = ?", id).Error
	return user, err
}

func (r *UserRepository) Update(id uuid.UUID, user models.User) (models.User, error) {
	var existingUser models.User
	if err := r.db.First(&existingUser, "id = ?", id).Error; err != nil {
		return existingUser, err
	}

	r.db.Model(&existingUser).Updates(user)
	return existingUser, nil
}

func (r *UserRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.User{}, "id = ?", id).Error
}

func (r *UserRepository) GetPregnancyInfo(userID uuid.UUID) (models.PregnancyInfo, error) {
	var info models.PregnancyInfo
	err := r.db.Where("user_id = ?", userID).First(&info).Error
	return info, err
}

func (r *UserRepository) UpdatePregnancyInfo(userID uuid.UUID, info models.PregnancyInfo) (models.PregnancyInfo, error) {
	var existingInfo models.PregnancyInfo
	if err := r.db.Where("user_id = ?", userID).First(&existingInfo).Error; err != nil {
		// Create if doesn't exist
		info.UserID = userID
		if err := r.db.Create(&info).Error; err != nil {
			return info, err
		}
		return info, nil
	}

	r.db.Model(&existingInfo).Updates(info)
	return existingInfo, nil
}

func (r *UserRepository) GetAddresses(userID uuid.UUID) ([]models.Address, error) {
	var addresses []models.Address
	err := r.db.Where("user_id = ?", userID).Find(&addresses).Error
	return addresses, err
}

func (r *UserRepository) CreateAddress(address models.Address) (models.Address, error) {
	err := r.db.Create(&address).Error
	return address, err
}

func (r *UserRepository) UpdateAddress(userID, addressID uuid.UUID, address models.Address) (models.Address, error) {
	var existingAddress models.Address
	err := r.db.Where("id = ? AND user_id = ?", addressID, userID).First(&existingAddress).Error
	if err != nil {
		return existingAddress, err
	}

	r.db.Model(&existingAddress).Updates(address)
	return existingAddress, nil
}

func (r *UserRepository) DeleteAddress(userID, addressID uuid.UUID) error {
	return r.db.Where("id = ? AND user_id = ?", addressID, userID).Delete(&models.Address{}).Error
}

func (r *UserRepository) GetFavorites(userID uuid.UUID) ([]models.Favorite, error) {
	var favorites []models.Favorite
	err := r.db.Where("user_id = ?", userID).Find(&favorites).Error
	return favorites, err
}

func (r *UserRepository) AddFavorite(favorite models.Favorite) (models.Favorite, error) {
	err := r.db.Create(&favorite).Error
	return favorite, err
}

func (r *UserRepository) RemoveFavorite(userID uuid.UUID, itemID string) error {
	return r.db.Where("user_id = ? AND item_id = ?", userID, itemID).Delete(&models.Favorite{}).Error
}

