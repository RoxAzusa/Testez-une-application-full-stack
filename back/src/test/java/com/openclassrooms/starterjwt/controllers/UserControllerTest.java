package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {
	@Mock
	private UserMapper userMapper;
	
	@Mock
	private UserService userService;
	
	@InjectMocks
	private UserController userController;

	@Nested
	class findByIdTestSuite {
		@Test
		void findByIdFailed() {
			when(userService.findById(anyLong())).thenReturn(null);
			
			ResponseEntity<?> response = userController.findById("1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
		}
		
		@Test
		void findByIdSuccess() {
			User user = new User();
			UserDto userDto = new UserDto();
			
			when(userService.findById(anyLong())).thenReturn(user);
			when(userMapper.toDto(user)).thenReturn(userDto);
			
			ResponseEntity<?> response = userController.findById("1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);	
			assertThat(response.getBody()).isEqualTo(userDto);
		}
		
		@Test
		void findByIdThrowNumberFormatException() {
			ResponseEntity<?> response = userController.findById("a");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}
	}
	
	@Nested
	class saveTestSuite {
		@Test
		void saveFailedUserNotFound() {
			when(userService.findById(anyLong())).thenReturn(null);
			
			ResponseEntity<?> response = userController.save("1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
		}
		
		@Test
		void saveThrowNumberFormatException() {			
			ResponseEntity<?> response = userController.save("a");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}
	}
}
