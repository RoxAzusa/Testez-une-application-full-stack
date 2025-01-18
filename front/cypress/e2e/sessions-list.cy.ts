/// <reference types="cypress" />

describe('ListComponent', () => {
  it('should display a list of sessions for authenticated users', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'regularUser',
        admin: false
      }
    }).as('userLogin');

    cy.intercept('GET', '/api/session', [
      {
        id: 1,
        name: 'Morning Yoga',
        description: 'Start your day with an energizing yoga session.',
        date: new Date('2025-01-10'),
        teacher_id: 1,
        users: [1, 2, 3],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-05')
      },
      {
        id: 2,
        name: 'Evening Meditation',
        description: 'Unwind with a peaceful meditation session.',
        date: new Date('2025-01-12'),
        teacher_id: 1,
        users: [4, 5],
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-06')
      },
    ]).as('getSessions');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('test123@test.com');
    cy.get('input[formControlName="password"]').type('Anna123');

    cy.get('button[type="submit"]').click();

    cy.get('.item').should('have.length', 2);
    cy.contains('Morning Yoga');
    cy.contains('Evening Meditation');
  });

  it('should redirect to login if user is not authenticated', () => {
    cy.intercept('GET', '/api/session', { statusCode: 401 }).as('getSession');
    cy.visit('/sessions');
    cy.url().should('include', '/login');
  });

  it('should display the "Create" and "Edit" buttons for admin users', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'adminUser',
        firstName: 'Admin',
        lastName: 'User',
        admin: true
      }
    }).as('login');

    cy.intercept('GET', '/api/session', [
      {
        id: 1,
        name: 'Morning Yoga',
        description: 'Start your day with an energizing yoga session.',
        date: new Date('2025-01-10'),
        teacher_id: 5,
        users: [1, 2, 3]
      }
    ]).as('getSessions');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();

    cy.get('button[routerLink="create"]').should('be.visible');
    cy.get('.item').first().within(() => {
      cy.contains('span.ml1', 'Edit').should('be.visible');
    });
  });
});
