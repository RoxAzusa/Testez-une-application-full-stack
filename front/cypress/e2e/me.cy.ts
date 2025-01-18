/// <reference types="cypress" />

describe('Me Component', () => {
    beforeEach(() => {
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
    });

    it('should display user information', () => {
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'regularUser',
                admin: false
            }
        }).as('userLogin');

        cy.intercept('GET', '/api/user/1', {
            body: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                admin: false,
                createdAt: new Date('2025-01-01'),
                updatedAt: new Date('2025-01-08')
            }
        }).as('getUser');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('john.doe@example.com');
        cy.get('input[formControlName="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.get('span[routerLink="me"]').click();

        cy.contains('h1', 'User information').should('be.visible');
        cy.contains('p', 'Name: John DOE').should('be.visible');
        cy.contains('p', 'Email: john.doe@example.com').should('be.visible');
        cy.contains('p', 'Create at: January 1, 2025').should('be.visible');
        cy.contains('p', 'Last update: January 8, 2025').should('be.visible');

        cy.get('button').contains('span.ml1', 'Detail').should('be.visible');
    });

    it('should display admin-specific information', () => {
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 2,
                username: 'adminUser',
                admin: true
            }
        }).as('adminLogin');

        cy.intercept('GET', '/api/user/2', {
            body: {
                id: 2,
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                admin: true,
                createdAt: new Date('2024-12-01'),
                updatedAt: new Date('2025-01-05')
            }
        }).as('getAdminUser');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('admin@example.com');
        cy.get('input[formControlName="password"]').type('adminpassword');
        cy.get('button[type="submit"]').click();

        cy.get('span[routerLink="me"]').click();

        cy.contains('p', 'Name: Admin USER').should('be.visible');
        cy.contains('p', 'Email: admin@example.com').should('be.visible');
        cy.contains('p', 'You are admin').should('be.visible');

        cy.contains('button', 'Detail').should('not.exist');
    });

    it('should delete user account', () => {
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'regularUser',
                admin: false
            }
        }).as('userLogin');

        cy.intercept('GET', '/api/user/1', {
            body: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                admin: false,
                createdAt: new Date('2025-01-01'),
                updatedAt: new Date('2025-01-08')
            }
        }).as('getUser');

        cy.intercept('DELETE', '/api/user/1', {
            statusCode: 200
        }).as('deleteUser');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('john.doe@example.com');
        cy.get('input[formControlName="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.get('span[routerLink="me"]').click();

        cy.get('button').contains('Detail').click();

        cy.wait('@deleteUser').its('response.statusCode').should('eq', 200);

        cy.get('snack-bar-container').should('contain.text', 'Your account has been deleted !');
        cy.url().should('eq', Cypress.config().baseUrl);
    });
});
