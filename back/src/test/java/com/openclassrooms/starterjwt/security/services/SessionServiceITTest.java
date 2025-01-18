package com.openclassrooms.starterjwt.security.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;

@SpringBootTest
public class SessionServiceITTest {
	@Autowired
	private SessionRepository sessionRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private TeacherRepository teacherRepository;
	
	private SessionService sessionService;
	
	@Nested
	class sessionServiceCreateTestSuite {
		@Test
		void shouldCreateSession() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			Teacher teacher = new Teacher();
			teacher.setFirstName("Alex");
			teacher.setLastName("King");
			teacherRepository.save(teacher);
			
			Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacher);
			session.setUsers(null);
			
			Session createdSession = sessionService.create(session);
			
			assertThat(createdSession).isNotNull();
	        assertThat(createdSession.getId()).isNotNull();
	        assertThat(createdSession.getName()).isEqualTo("Yoga");
	        assertThat(createdSession.getTeacher()).isEqualTo(teacher);
		}
	}
	
	@Nested
	class sessionServiceDeleteTestSuite {
		@Test
		void shouldDeleteSession() {
			sessionService = new SessionService(sessionRepository, userRepository);

			Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			session.setUsers(null);
			session = sessionRepository.save(session);
			
			sessionService.delete(session.getId());

            assertThat(sessionRepository.findById(session.getId())).isEmpty();
		}
	}
	
	@Nested
	class sessionServiceFindAllTestSuite {
		@Test
		void shouldDeleteSession() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			long initialCount = sessionRepository.count();
			
			Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			session.setUsers(null);
			sessionRepository.save(session);
			
			List<Session> foundSessions = sessionService.findAll();

			assertThat(foundSessions).isNotNull();
			assertThat(foundSessions.size()).isEqualTo(initialCount + 1);
		}
	}
	
	@Nested
	class sessionServiceGetByIdTestSuite {
		@Test
		void getByIdSessionWhenSessionExist() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			session.setUsers(null);
			sessionRepository.save(session);
			
			Session foundSession = sessionService.getById(session.getId());
			
			assertThat(foundSession).isNotNull();
            assertThat(foundSession.getId()).isEqualTo(session.getId());
            assertThat(foundSession.getName()).isEqualTo(session.getName());
		}
		
		@Test
		void getByIdSessionWhenSessionDoesNotExist() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			Session foundSession = sessionService.getById(Long.valueOf(999));
			
			assertThat(foundSession).isNull();
		}
	}
	
	@Nested
	class sessionServiceUpdateTestSuite {
		@Test
		void shouldUpdateSession() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			session.setUsers(null);
			
			Session savedSession = sessionRepository.save(session);
			
			Session updatedSession = new Session();
			updatedSession.setName("Yoga updated");
			updatedSession.setDate(new Date(System.currentTimeMillis() + 86400000L));
			updatedSession.setDescription("description updated");
			updatedSession.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			updatedSession.setUsers(null);
			
			Session result = sessionService.update(savedSession.getId(), updatedSession);
			
			assertThat(result).isNotNull();
	        assertThat(result.getId()).isEqualTo(savedSession.getId());
	        assertThat(result.getName()).isEqualTo("Yoga updated");
	        assertThat(result.getDescription()).isEqualTo("description updated");
	        assertThat(result.getDate()).isAfter(savedSession.getDate());

	        Session dbSession = sessionRepository.findById(savedSession.getId()).orElseThrow();
	        assertThat(dbSession.getName()).isEqualTo("Yoga updated");
	        assertThat(dbSession.getDescription()).isEqualTo("description updated");
	        assertThat(dbSession.getDate()).isAfter(savedSession.getDate());
		}
	}
	
	@Nested
	class sessionServiceParticipateTestSuite {
		@Test
		void shouldParticipateWhenUserDoesNotAlreadyParticipate() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			User user = new User();
            user.setFirstName("Toto");
            user.setLastName("Titi");
            user.setEmail("toto@email.com");
            user.setPassword("toto123");
            user= userRepository.save(user);
            
            Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			session.setUsers(null);
			session = sessionRepository.save(session);
			
			sessionService.participate(session.getId(), user.getId());
			
			Session sessionWithUserParticipate = sessionRepository.findById(session.getId()).orElseThrow();
	        
			assertThat(sessionWithUserParticipate.getUsers()).contains(user);
		}
		
		@Test
		void shouldParticipateWhenUserAlreadyParticipate() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			User user = new User();
            user.setFirstName("Toto");
            user.setLastName("Titi");
            user.setEmail("toto@email.com");
            user.setPassword("toto123");
            final User userSaved = userRepository.save(user);
            
            Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			session.setUsers(Collections.singletonList(userSaved));
			final Session sessionSaved = sessionRepository.save(session);
			
			assertThatThrownBy(() -> sessionService.participate(sessionSaved.getId(), userSaved.getId()))
            .isInstanceOf(BadRequestException.class);
		}
		
		@Test
		void shouldParticipateWhenSessionIsNullNotFound() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			User user = new User();
            user.setFirstName("Toto");
            user.setLastName("Titi");
            user.setEmail("toto@email.com");
            user.setPassword("toto123");
            final User userSaved = userRepository.save(user);
            
            assertThatThrownBy(() -> sessionService.participate(Long.valueOf(999), userSaved.getId()))
            .isInstanceOf(NotFoundException.class);
		}
		
		@Test
		void shouldParticipateWhenUserNotFound() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			session.setUsers(null);
			final Session sessionSaved = sessionRepository.save(session);
            
            assertThatThrownBy(() -> sessionService.participate(sessionSaved.getId(), Long.valueOf(999)))
            .isInstanceOf(NotFoundException.class);
		}
	}
	
	@Nested
	class sessionServiceNoLongerParticipateTestSuite {
		@Test
		void shouldNoLongerParticipateWhenUserAlreadyParticipate() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			User user = new User();
            user.setFirstName("Toto");
            user.setLastName("Titi");
            user.setEmail("toto@email.com");
            user.setPassword("toto123");
            user = userRepository.save(user);
            
            Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			session.setUsers(Collections.singletonList(user));
			session = sessionRepository.save(session);
			
			sessionService.noLongerParticipate(session.getId(), user.getId());
			
			Session sessionWithUserNoLongerParticipate = sessionRepository.findById(session.getId()).orElseThrow();
	        
			assertThat(sessionWithUserNoLongerParticipate.getUsers()).doesNotContain(user);
		}
		
		@Test
		void shouldNoLongerParticipateWhenUserDoesNotAlreadyParticipate() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			User user = new User();
            user.setFirstName("Toto");
            user.setLastName("Titi");
            user.setEmail("toto@email.com");
            user.setPassword("toto123");
            final User userSaved = userRepository.save(user);
            
            Session session = new Session();
			session.setName("Yoga");
			session.setDate(new Date());
			session.setDescription("description");
			session.setTeacher(teacherRepository.getById(Long.valueOf(1)));
			session.setUsers(null);
			final Session sessionSaved = sessionRepository.save(session);
			
			assertThatThrownBy(() -> sessionService.noLongerParticipate(sessionSaved.getId(), userSaved.getId()))
            .isInstanceOf(BadRequestException.class);
		}
		
		@Test
		void shouldParticipateWhenSessionIsNullNotFound() {
			sessionService = new SessionService(sessionRepository, userRepository);
			
			User user = new User();
            user.setFirstName("Toto");
            user.setLastName("Titi");
            user.setEmail("toto@email.com");
            user.setPassword("toto123");
            final User userSaved = userRepository.save(user);
            
            assertThatThrownBy(() -> sessionService.noLongerParticipate(Long.valueOf(999), userSaved.getId()))
            .isInstanceOf(NotFoundException.class);
		}
	}
}
