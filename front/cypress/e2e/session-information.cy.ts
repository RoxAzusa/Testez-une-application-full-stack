/// <reference types="cypress" />

describe('Session Details Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Morning Yoga',
          description: 'Start your day with an energizing yoga session.',
          date: new Date('2025-01-10'),
          teacher_id: 5,
          users: [1, 2, 3],
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-05')
        }
      ]
    }).as('getSessions');

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Morning Yoga',
        description: 'Start your day with an energizing yoga session.',
        date: new Date('2025-01-10'),
        teacher_id: 5,
        users: [1, 2, 3],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-05')
      }
    }).as('getSession');

    cy.intercept('GET', '/api/teacher/5', {
      body: {
        id: 5,
        firstName: 'John',
        lastName: 'Doe'
      }
    }).as('getTeacher');
  });

  it('should display session details after logging in and clicking on a session', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'adminUser',
        admin: true
      }
    }).as('adminLogin');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();

    cy.get('button').contains('Detail').click();

    cy.contains('h1', 'Morning Yoga').should('be.visible');
    cy.contains('.description', 'Start your day with an energizing yoga session.').should('be.visible');
    cy.contains('.ml1', '3 attendees').should('be.visible');
    cy.contains('.ml1', 'January 10, 2025').should('be.visible');
    cy.contains('.created', 'Create at: January 1, 2025').should('be.visible');
    cy.contains('.updated', 'Last update: January 5, 2025').should('be.visible');
    cy.contains('.ml3', 'John DOE').should('be.visible');
  });

  it('should display "Delete" button for admin users only', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'adminUser',
        admin: true
      }
    }).as('adminLogin');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();

    cy.get('button').contains('Detail').click();

    cy.get('button').contains('span.ml1', 'Delete').should('be.visible');
  });

  it('should not display "Delete" button for regular users', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 2,
        username: 'regularUser',
        admin: false
      }
    }).as('userLogin');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('test123@test.com');
    cy.get('input[formControlName="password"]').type('Anna123');

    cy.get('button[type="submit"]').click();

    cy.get('button').contains('Detail').click();

    cy.get('button').contains('span.ml1', 'Delete').should('not.exist');
  });
});
