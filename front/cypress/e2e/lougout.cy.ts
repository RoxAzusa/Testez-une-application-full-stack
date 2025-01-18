/// <reference types="cypress" />

describe('User Logout Tests', () => {
  it('should log out user and navigate to home page', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'regularUser',
        admin: false
      }
    }).as('userLogin');

    cy.intercept('GET', '/api/session', {
      body: [{
        id: 1,
        name: 'Morning Yoga',
        description: 'Start your day with an energizing yoga session.',
        date: new Date('2025-01-10'),
        teacher_id: 5,
        users: [1, 2, 3],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-05')
      }]
    }).as('getSessions');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('user@example.com');
    cy.get('input[formControlName="password"]').type('userPassword123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');

    cy.get('span.link').contains('Logout').click();

    cy.url().should('eq', `${Cypress.config().baseUrl}`);

    cy.get('span.link').contains('Login').should('be.visible');
    cy.get('span.link').contains('Register').should('be.visible');

    cy.get('span.link').contains('Sessions').should('not.exist');
    cy.get('span.link').contains('Account').should('not.exist');
  });
});
