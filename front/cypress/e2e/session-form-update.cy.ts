/// <reference types="cypress" />

describe('Session Update', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/teacher', {
            body: [
                { id: 1, firstName: 'John', lastName: 'Doe' },
                { id: 2, firstName: 'Jane', lastName: 'Smith' }
            ]
        }).as('getTeachers');

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
                date: new Date('2025-01-10'),
                teacher_id: 1,
                description: 'Start your day with an energizing yoga session.'
            }
        }).as('getSession');
    });

    it('should not allow updating a session', () => {
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'regularUser',
                admin: false
            }
        }).as('userLogin');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('admin@yoga.com');
        cy.get('input[formControlName="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.get('button').contains('Edit').should('not.exist');
    });

    it('should allow updating a session', () => {
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'adminUser',
                admin: true
            }
        }).as('adminLogin');

        cy.intercept('PUT', '/api/session/1', {
            statusCode: 200,
            body: {}
        }).as('updateSession');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('admin@yoga.com');
        cy.get('input[formControlName="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.get('button').contains('Edit').click();

        cy.get('input[formControlName="name"]').should('have.value', 'Morning Yoga');
        cy.get('input[formControlName="date"]').should('have.value', '2025-01-10');
        cy.get('textarea[formControlName="description"]').should('have.value', 'Start your day with an energizing yoga session.');
        cy.get('mat-select[formControlName="teacher_id"]').should('contain', 'John Doe');

        cy.get('input[formControlName="name"]').clear().type('Evening Yoga');
        cy.get('textarea[formControlName="description"]').clear().type('Relax your mind with a calming yoga session.');
        cy.get('mat-select[formControlName="teacher_id"]').click();
        cy.get('mat-option').contains('Jane Smith').click();

        cy.get('button[type="submit"]').click();

        cy.wait('@updateSession').its('request.body').should('deep.equal', {
            name: 'Evening Yoga',
            date: '2025-01-10',
            teacher_id: 2,
            description: 'Relax your mind with a calming yoga session.'
        });

        cy.get('snack-bar-container').should('contain.text', 'Session updated !');

        cy.url().should('include', '/sessions');
    });

    it('should display an error when a name field is missing', () => {
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'adminUser',
                admin: true
            }
        }).as('adminLogin');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('admin@yoga.com');
        cy.get('input[formControlName="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.get('button').contains('Edit').click();

        cy.get('input[formControlName="name"]').clear();

        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should display an error when a description field is missing', () => {
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'adminUser',
                admin: true
            }
        }).as('adminLogin');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('admin@yoga.com');
        cy.get('input[formControlName="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.get('button').contains('Edit').click();

        cy.get('textarea[formControlName="description"]').clear()

        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should display an error when a date field is missing', () => {
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'adminUser',
                admin: true
            }
        }).as('adminLogin');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('admin@yoga.com');
        cy.get('input[formControlName="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.get('button').contains('Edit').click();

        cy.get('input[formControlName="date"]').clear()

        cy.get('button[type="submit"]').should('be.disabled');
    });
});
