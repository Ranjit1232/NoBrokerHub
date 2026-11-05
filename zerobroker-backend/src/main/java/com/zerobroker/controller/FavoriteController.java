package com.zerobroker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.zerobroker.entity.Favorite;
import com.zerobroker.service.FavoriteService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    // Add Favorite
    //POST http://localhost:8080/api/favorites  
    @PostMapping
    public Favorite addFavorite(
            @RequestBody Favorite favorite) {

        return favoriteService.addFavorite(favorite);
    }

    // Get Favorites by User
    //GET http://localhost:8080/api/favorites/user/4   users che all fav 
    @GetMapping("/user/{userId}")
    public List<Favorite> getFavoritesByUser(
            @PathVariable Long userId) {

        return favoriteService.getFavoritesByUser(userId);
    }

    // Check Favorite
    //http://localhost:8080/api/favorites/check?userId=4&propertyId=15      check karto user ne ti property addhich fav  keli ahe ahe if yes response should be true
    @GetMapping("/check")
    public boolean isFavorite(
            @RequestParam Long userId,
            @RequestParam Long propertyId) {

        return favoriteService.isFavorite(
                userId,
                propertyId);
    }
}