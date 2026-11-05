package com.zerobroker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zerobroker.entity.Favorite;
import com.zerobroker.repository.FavoriteRepository;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    // Add Favorite
    public Favorite addFavorite(Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    // Get Favorites by User
    public List<Favorite> getFavoritesByUser(Long userId) {
        return favoriteRepository.findByUser_UserId(userId);
    }

    // Check Favorite
    public boolean isFavorite(Long userId, Long propertyId) {

        return favoriteRepository
                .findByUser_UserIdAndProperty_PropertyId(
                        userId,
                        propertyId)
                .isPresent();
    }
}