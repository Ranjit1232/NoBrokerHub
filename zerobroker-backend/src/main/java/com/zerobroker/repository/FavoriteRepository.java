package com.zerobroker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerobroker.entity.Favorite;

public interface FavoriteRepository
        extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUser_UserId(Long userId);

    Optional<Favorite> findByUser_UserIdAndProperty_PropertyId(
            Long userId,
            Long propertyId);

    void deleteByProperty_PropertyId(Long propertyId);
}

