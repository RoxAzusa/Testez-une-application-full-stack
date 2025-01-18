/// <reference types="cypress" />

describe('Session Form Page', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'adminUser',
        admin: true
      }
    }).as('adminLogin');

    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 1, firstName: 'Alice', lastName: 'Smith' },
        { id: 2, firstName: 'Bob', lastName: 'Johnson' }
      ]
    }).as('getTeachers');

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

    cy.intercept('POST', '/api/session', {
      body: {
        id: 1,
        name: 'Morning Yoga',
        description: 'Start your day with an energizing yoga session.',
        date: new Date('2025-01-10'),
        teacher_id: 1,
        users: [1, 2, 3],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-05')
      }
    }).as('createSession');

    cy.visit('/login');
  });

  it('should create button disabled when user is logged', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'regularUser',
        admin: false
      }
    }).as('userLogin');

    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();
    cy.get('button[routerLink="create"]').should('not.exist');
  });

  it('should allow an admin to create a session', () => {
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();
    cy.get('button[routerLink="create"]').click();

    cy.get('input[formControlName="name"]').type('New Session');
    cy.get('input[formControlName="date"]').type('2025-01-15');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Alice Smith').click();
    cy.get('textarea[formControlName="description"]').type('An exciting new session.');
    cy.get('button[type="submit"]').click();

    cy.contains('Session created !').should('be.visible');
  });

  it('should display an error message when name field are missing', () => {
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();
    cy.get('button[routerLink="create"]').click();

    cy.get('input[formControlName="name"]').type('a').clear();
    cy.get('input[formControlName="date"]').type('2025-01-15');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Alice Smith').click();
    cy.get('textarea[formControlName="description"]').type('An exciting new session.');

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should display an error message when date field are missing', () => {
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();
    cy.get('button[routerLink="create"]').click();

    cy.get('input[formControlName="name"]').type('New Session');
    cy.get('input[formControlName="date"]').type('2025-01-15').clear();
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Alice Smith').click();
    cy.get('textarea[formControlName="description"]').type('An exciting new session.');

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should display an error message when teacher field are missing', () => {
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();
    cy.get('button[routerLink="create"]').click();

    cy.get('input[formControlName="name"]').type('New Session');
    cy.get('input[formControlName="date"]').type('2025-01-15');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-select[formControlName="teacher_id"]').type('{esc}');
    cy.get('textarea[formControlName="description"]').type('An exciting new session.');

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should display an error message when description field are missing', () => {
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();
    cy.get('button[routerLink="create"]').click();

    cy.get('input[formControlName="name"]').type('New Session');
    cy.get('input[formControlName="date"]').type('2025-01-15');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Alice Smith').click();
    cy.get('textarea[formControlName="description"]').type('A').clear();

    cy.get('button[type="submit"]').should('be.disabled');
  });
});
