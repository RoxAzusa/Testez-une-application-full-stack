/// <reference types="cypress" />

describe('Session Deletion', () => {
  it('should allow an admin user to delete a session', () => {
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

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'adminUser',
        admin: true
      }
    }).as('adminLogin');

    cy.intercept('DELETE', '/api/session/1', {
      statusCode: 200,
      body: {}
    }).as('deleteSession');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();

    cy.get('button').contains('Detail').click();
    cy.get('button').contains('span.ml1', 'Delete').should('be.visible');
    cy.get('button').contains('span.ml1', 'Delete').click();
    cy.wait('@deleteSession').its('request.method').should('eq', 'DELETE');
    cy.get('snack-bar-container').should('contain.text', 'Session deleted !');
    cy.url().should('include', '/sessions');
  });
});
