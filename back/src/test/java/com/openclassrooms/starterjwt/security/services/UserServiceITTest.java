package com.openclassrooms.starterjwt.security.services;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;

@SpringBootTest
public class UserServiceITTest {
    @Autowired
    private UserRepository userRepository;

    private UserService userService;
    
    @Nested
    class userServiceFindByIdTestSuite {
    	@Test
        void shouldFindUserByIdWhenUserExists() {
        	userService = new UserService(userRepository);

            User user = new User();
            user.setFirstName("Toto");
            user.setLastName("Titi");
            user.setEmail("toto@email.com");
            user.setPassword("toto123");
            user = userRepository.save(user);

            User foundUser = userService.findById(user.getId());

            assertThat(foundUser).isNotNull();
            assertThat(foundUser.getId()).isEqualTo(user.getId());
            assertThat(foundUser.getFirstName()).isEqualTo(user.getFirstName());
            assertThat(foundUser.getLastName()).isEqualTo(user.getLastName());
            assertThat(foundUser.getEmail()).isEqualTo(user.getEmail());
        }

        @Test
        void shouldReturnNullWhenUserDoesNotExist() {
        	userService = new UserService(userRepository);

            User foundUser = userService.findById(Long.valueOf(999));

            assertThat(foundUser).isNull();
        }
    }
    
    @Nested 
    class userServiceDeleteTestSuite {
    	@Test
        void shouldDeleteUserByIdWhenUserExists() {
        	userService = new UserService(userRepository);

            User user = new User();
            user.setFirstName("Toto");
            user.setLastName("Titi");
            user.setEmail("toto@email.com");
            user.setPassword("toto123");
            user = userRepository.save(user);

            userService.delete(user.getId());

            assertThat(userRepository.findById(user.getId())).isEmpty();
        }
    }
}