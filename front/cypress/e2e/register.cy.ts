/// <reference types="cypress" />

describe('Register spec', () => {
    beforeEach(() => {
        cy.visit('/register');

        cy.intercept('POST', '/api/auth/register', {
            statusCode: 400
        }).as('userRegisterFailure');
    })

    it('register successfull', () => {
        cy.intercept('POST', '/api/auth/register', {
            body: {
                id: 1,
                firstName: 'Anna',
                lastName: 'Field',
                email: 'test123@test.com',
                admin: false
            }
        }).as('userRegister');

        cy.get('input[formControlName=firstName]').type("Anna");
        cy.get('input[formControlName=lastName]').type("Field");
        cy.get('input[formControlName=email]').type("test123@test.com");
        cy.get('input[formControlName=password]').type("Anna123");

        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/login');
    })

    it('should show an error message when login fails when invalid first name', () => {
        cy.get('input[formControlName=firstName]').type("A");
        cy.get('input[formControlName=lastName]').type("Field");
        cy.get('input[formControlName=email]').type("12345@test.com");
        cy.get('input[formControlName=password]').type("Anna123");

        cy.get('button[type="submit"]').click();

        cy.get('span.error').should('be.visible');
        cy.get('span.error').should('contain', 'An error occurred');
    });

    it('should disable submit button if form is invalid when empty first name', () => {
        cy.get('input[formControlName=firstName]').type("a").clear();
        cy.get('input[formControlName=lastName]').type("Field");
        cy.get('input[formControlName=email]').type("12345@test.com");
        cy.get('input[formControlName=password]').type("Anna123");

        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('mat-form-field').eq(0).should('have.class', 'mat-form-field-invalid');
    });

    it('should show an error message when login fails when invalid last name', () => {
        cy.get('input[formControlName=firstName]').type("Anna");
        cy.get('input[formControlName=lastName]').type("F");
        cy.get('input[formControlName=email]').type("12345@test.com");
        cy.get('input[formControlName=password]').type("Anna123");

        cy.get('button[type="submit"]').click();

        cy.get('span.error').should('be.visible');
        cy.get('span.error').should('contain', 'An error occurred');
    });

    it('should disable submit button if form is invalid when empty first name', () => {
        cy.get('input[formControlName=firstName]').type("Anna");
        cy.get('input[formControlName=lastName]').type("F").clear();
        cy.get('input[formControlName=email]').type("12345@test.com");
        cy.get('input[formControlName=password]').type("Anna123");

        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('mat-form-field').eq(1).should('have.class', 'mat-form-field-invalid');
    });

    it('should show an error message when login fails when invalid email', () => {
        cy.get('input[formControlName=firstName]').type("Anna");
        cy.get('input[formControlName=lastName]').type("Field");
        cy.get('input[formControlName=email]').type("12345");
        cy.get('input[formControlName=password]').type("Anna123");

        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('mat-form-field').eq(2).should('have.class', 'mat-form-field-invalid');
    });

    it('should disable submit button if form is invalid when empty email', () => {
        cy.get('input[formControlName=firstName]').type("Anna");
        cy.get('input[formControlName=lastName]').type("Field");
        cy.get('input[formControlName=email]').type("1").clear();
        cy.get('input[formControlName=password]').type("Anna123");

        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('mat-form-field').eq(2).should('have.class', 'mat-form-field-invalid');
    });

    it('should show an error message when login fails when invalid password', () => {
        cy.get('input[formControlName=firstName]').type("Anna");
        cy.get('input[formControlName=lastName]').type("Field");
        cy.get('input[formControlName=email]').type("12345@test.com");
        cy.get('input[formControlName=password]').type("a");

        cy.get('button[type="submit"]').click();

        cy.get('span.error').should('be.visible');
        cy.get('span.error').should('contain', 'An error occurred');
    });

    it('should disable submit button if form is invalid when empty password', () => {
        cy.get('input[formControlName=firstName]').type("Anna");
        cy.get('input[formControlName=lastName]').type("Field");
        cy.get('input[formControlName=email]').type("12345@test.com");
        cy.get('input[formControlName=password]').type("a").clear();

        cy.get('mat-card-title').click();

        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('mat-form-field').eq(3).should('have.class', 'mat-form-field-invalid');
    });
})