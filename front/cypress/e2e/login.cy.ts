/// <reference types="cypress" />

describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Login successfull', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

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

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type("test!1234")
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/sessions')
  })

  it('should show an error message when login fails when invalid email', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401
    }).as('login bad rquest');

    cy.get('input[formControlName="email"]').type('invalid@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();

    cy.get('p.error').should('be.visible');
    cy.get('p.error').should('contain', 'An error occurred');
  });

  it('should disable submit button if form is invalid when empty email', () => {
    cy.get('input[formControlName="email"]').type('a').clear();
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('mat-form-field').eq(0).should('have.class', 'mat-form-field-invalid');
  });

  it('should show an error message when login fails when invalid password', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401
    }).as('login bad rquest');

    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('wrongPassword');

    cy.get('button[type="submit"]').click();

    cy.get('p.error').should('be.visible');
    cy.get('p.error').should('contain', 'An error occurred');
  });

  it('should disable submit button if form is invalid when empty password', () => {
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('a').clear();
    cy.get('mat-card-title').click();

    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('mat-form-field').eq(1).should('have.class', 'mat-form-field-invalid');
  });
});