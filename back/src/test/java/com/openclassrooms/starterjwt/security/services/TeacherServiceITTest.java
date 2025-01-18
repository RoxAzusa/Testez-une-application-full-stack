package com.openclassrooms.starterjwt.security.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;

@SpringBootTest
public class TeacherServiceITTest {
	@Autowired
	private TeacherRepository teacherRepository;
	
	private TeacherService teacherService;
	
	@Nested
	class teacherServiceFindAllTestSuite {
		@Test
		void shouldFindAll() {
			teacherService = new TeacherService(teacherRepository);
			
			long initialCount = teacherRepository.count();
			
			Teacher teacher = new Teacher();
			teacher.setFirstName("Li");
			teacher.setLastName("John");
			teacherRepository.save(teacher);
			
			List<Teacher> foundTeachers = teacherService.findAll();

			assertThat(foundTeachers).isNotNull();
			assertThat(foundTeachers.size()).isEqualTo(initialCount + 1);
		}
	}
	
	@Nested
    class teacherServiceFindByIdTestSuite {
    	@Test
        void shouldFindUserByIdWhenUserExists() {
			teacherService = new TeacherService(teacherRepository);

			Teacher teacher = new Teacher();
			teacher.setFirstName("Li");
			teacher.setLastName("John");
			teacher = teacherRepository.save(teacher);

			Teacher foundTeacher = teacherService.findById(teacher.getId());

            assertThat(foundTeacher).isNotNull();
            assertThat(foundTeacher.getId()).isEqualTo(teacher.getId());
            assertThat(foundTeacher.getFirstName()).isEqualTo(teacher.getFirstName());
            assertThat(foundTeacher.getLastName()).isEqualTo(teacher.getLastName());
        }

        @Test
        void shouldReturnNullWhenUserDoesNotExist() {
			teacherService = new TeacherService(teacherRepository);

			Teacher foundTeacher = teacherService.findById(Long.valueOf(999));

            assertThat(foundTeacher).isNull();
        }
    }
}
