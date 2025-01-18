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

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

@ExtendWith(MockitoExtension.class)
public class TeacherControllerTest {
	@Mock
	private TeacherMapper teacherMapper;
	
	@Mock
	private TeacherService teacherService;
	
	@InjectMocks
	private TeacherController teacherController;
	
	@Nested
	class findByIdTestSuite {
		@Test
		void findByIdFailed() {
			when(teacherService.findById(anyLong())).thenReturn(null);
			
			ResponseEntity<?> response = teacherController.findById("1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
		}
		
		@Test
		void findByIdSuccess() {
			Teacher teacher = new Teacher();
			TeacherDto teacherDto = new TeacherDto();
			
			when(teacherService.findById(anyLong())).thenReturn(teacher);
			when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);
			
			ResponseEntity<?> response = teacherController.findById("1");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(response.getBody()).isEqualTo(teacherDto);
		}
		
		@Test
		void findByIdThrowNumberFormatException() {
			ResponseEntity<?> response = teacherController.findById("a");
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		}
	}
	
	@Nested
	class findAllTestSuite {
		@Test
		void findAllSuccess() {
			List<Teacher> teachers = Arrays.asList(new Teacher());
			List<TeacherDto> teachersDto = Arrays.asList(new TeacherDto());
			
			when(teacherService.findAll()).thenReturn(teachers);
			when(teacherMapper.toDto(teachers)).thenReturn(teachersDto);
			
			ResponseEntity<?> response = teacherController.findAll();
			
			assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
			assertThat(response.getBody()).isEqualTo(teachersDto);
		}
	}
}
