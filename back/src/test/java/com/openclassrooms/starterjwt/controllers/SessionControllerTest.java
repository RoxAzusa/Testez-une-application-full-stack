package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {
	@Mock
	private SessionMapper sessionMapper;
	
	@Mock
	private SessionService sessionService;
	
	@InjectMocks
	private SessionController sessionController;
	
	@Nested
	class findByIdTestSuite {
		@Test
		void findByIdFailed() {
			when(sessionService.getById(anyLong())).thenReturn(null);
			
			ResponseEntity<?> response = sessionController.findById("1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
		}
		
		@Test
		void findByIdSuccess() {
			Session session = new Session();		
			SessionDto sessionDto = new SessionDto();
			
			when(sessionService.getById(anyLong())).thenReturn(session);
			when(sessionMapper.toDto(session)).thenReturn(sessionDto);
			
			ResponseEntity<?> response = sessionController.findById("1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(response.getBody()).isEqualTo(sessionDto);
		}
		
		@Test
		void findByIdThrowNumberFormatException() {		
			ResponseEntity<?> response = sessionController.findById("a");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}	
	}
	
	@Nested
	class findAllTestSuite {
		@Test
		void findAllSuccess() {
			List<Session> sessions = Arrays.asList(new Session());
			List<SessionDto> sessionsDto = Arrays.asList(new SessionDto());
			
			when(sessionService.findAll()).thenReturn(sessions);
			when(sessionMapper.toDto(sessions)).thenReturn(sessionsDto);
			
			ResponseEntity<?> response = sessionController.findAll();
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(response.getBody()).isEqualTo(sessionsDto);
		}
	}
	
	@Nested
	class createTestSuite {
		@Test
		void createSuccess() {
			Session session = new Session();
			SessionDto sessionDto = new SessionDto();
			
			when(sessionService.create(session)).thenReturn(session);
			when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
			when(sessionMapper.toDto(session)).thenReturn(sessionDto);
			
			ResponseEntity<?> response = sessionController.create(sessionDto);
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(response.getBody()).isEqualTo(sessionDto);
		}
	}
	
	@Nested
	class updateTestSuite {
		@Test
		void updateSuccess() {
			Session session = new Session();			
			SessionDto sessionDto = new SessionDto();
			
			when(sessionService.update(Long.parseLong("1"), session)).thenReturn(session);
			when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
			when(sessionMapper.toDto(session)).thenReturn(sessionDto);
			
			ResponseEntity<?> response = sessionController.update("1", sessionDto);
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(response.getBody()).isEqualTo(sessionDto);
		}
		
		@Test
		void updateThrowNumberFormatException() {
			SessionDto sessionDto = new SessionDto();
			
			ResponseEntity<?> response = sessionController.update("a", sessionDto);
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}
	}
	
	@Nested
	class saveTestSuite {
		@Test
		void saveFailed() {
			when(sessionService.getById(anyLong())).thenReturn(null);
			
			ResponseEntity<?> response = sessionController.save("1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
		}
		
		@Test
		void saveSuccess() {
			Session session = new Session();
			
			when(sessionService.getById(anyLong())).thenReturn(session);
			
			ResponseEntity<?> response = sessionController.save("1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		}
		
		@Test
		void saveThrowNumberFormatException() {
			ResponseEntity<?> response = sessionController.save("a");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}
	}
	
	@Nested
	class participateTestSuite {
		@Test
		void participateSuccess() {
			ResponseEntity<?> response = sessionController.participate("1", "1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		}
		
		@Test
		void participateThrowNumberFormatExceptionWithUncorrectId() {
			ResponseEntity<?> response = sessionController.participate("a", "1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}
		
		@Test
		void participateThrowNumberFormatExceptionWithUncorrectUserId() {
			ResponseEntity<?> response = sessionController.participate("1", "a");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}
	}
	
	@Nested
	class noLongerParticipateTestSuite {
		@Test
		void noLongerParticipateSuccess() {
			ResponseEntity<?> response = sessionController.noLongerParticipate("1", "1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		}
		
		@Test
		void noLongerParticipateThrowNumberFormatExceptionWithUncorrectId() {
			ResponseEntity<?> response = sessionController.noLongerParticipate("a", "1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}
		
		@Test
		void noLongerParticipateThrowNumberFormatExceptionWithUncorrectUserId() {
			ResponseEntity<?> response = sessionController.noLongerParticipate("1", "a");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}
	}
}
