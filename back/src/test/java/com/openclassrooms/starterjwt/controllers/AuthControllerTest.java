package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {
	@Mock
	private UserRepository userRepository;
	
	@Mock
	private PasswordEncoder passwordEncoder;
	
	@Mock
	private AuthenticationManager authenticationManager;
	
	@Mock
	private JwtUtils jwtUtils;
	
	@Mock
	private Authentication authentication;
	
	@InjectMocks
	private AuthController authController;
	
	@Nested
	class authenticateUserTestSuite {
		@Test
		void authenticateUserSuccess() {
			User user = new User();
            user.setFirstName("Toto");
            user.setLastName("Titi");
            user.setEmail("toto@email.com");
            user.setPassword("toto123");       
            
            Optional<User> optionalUser = Optional.of(user);
            
            UserDetailsImpl userDetails = new UserDetailsImpl(1L, "toto@email.com", "Toto", "Titi", false, "Toto123");
            
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setEmail("toto@email.com");
            loginRequest.setPassword("toto123");
			
			when(userRepository.findByEmail(user.getEmail())).thenReturn(optionalUser);
			when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
			when(authentication.getPrincipal()).thenReturn(userDetails);
			
			ResponseEntity<?> response = authController.authenticateUser(loginRequest);
			
			JwtResponse jwtResponse = (JwtResponse) response.getBody();
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(jwtResponse.getAdmin()).isEqualTo(false);
		}
	}
	
	@Nested
	class registerUserTestSuite {
		@Test
		void registerUserFailed() {
			when(userRepository.existsByEmail(anyString())).thenReturn(true);
			
			SignupRequest signupRequest = new SignupRequest();
			signupRequest.setEmail("tot@toto.com");
			signupRequest.setFirstName("Toto");
			signupRequest.setLastName("Titi");
			signupRequest.setPassword("Toto123");
			
			MessageResponse messageResponse = new MessageResponse("Error: Email is already taken!");
			
			ResponseEntity<?> response = authController.registerUser(signupRequest);
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
			assertThat(response.getBody()).isInstanceOf(MessageResponse.class);
			
			MessageResponse actualResponse = (MessageResponse) response.getBody();
			assertThat(actualResponse.getMessage()).isEqualTo(messageResponse.getMessage());
		}
		
		@Test
		void registerUserSuccess() {
			SignupRequest signupRequest = new SignupRequest();
			signupRequest.setEmail("tot@toto.com");
			signupRequest.setFirstName("Toto");
			signupRequest.setLastName("Titi");
			signupRequest.setPassword("Toto123");
			
			MessageResponse messageResponse = new MessageResponse("User registered successfully!");
			
			when(userRepository.existsByEmail(anyString())).thenReturn(false);
			when(userRepository.save(any())).thenReturn(any());
			when(passwordEncoder.encode("Toto123")).thenReturn("Toto123");			
			
			ResponseEntity<?> response = authController.registerUser(signupRequest);
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(response.getBody()).isInstanceOf(MessageResponse.class);
			
			MessageResponse actualResponse = (MessageResponse) response.getBody();
			assertThat(actualResponse.getMessage()).isEqualTo(messageResponse.getMessage());
		}
	}
}
