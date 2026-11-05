
package com.zerobroker.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())

            .authorizeHttpRequests(auth -> auth

                // Public authentication APIs
                .requestMatchers(
                    "/api/users/register",
                    "/api/users/login",
                    "/api/users/forgot-password",
                    "/api/users/verify-otp",
                    "/api/users/reset-password"
                ).permitAll()

                // Allow browser preflight requests
                .requestMatchers(
                    HttpMethod.OPTIONS, "/**"
                ).permitAll()

                // Allow uploaded property images and videos
                .requestMatchers("/uploads/**").permitAll()

                // Only ADMIN can access admin APIs
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")

                // All other APIs require authentication
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                new JwtFilter(jwtUtil),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of(
                "http://localhost:3000",
                "http://localhost:5173"
            )
        );

        configuration.setAllowedMethods(
            List.of(
                "GET", "POST", "PUT",
                "PATCH", "DELETE", "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of(
                "Authorization",
                "Content-Type",
                "Accept"
            )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**", configuration
        );

        return source;
    }
}
