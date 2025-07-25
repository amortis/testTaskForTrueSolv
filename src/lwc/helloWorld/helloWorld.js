import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getHelloWorld from '@salesforce/apex/helloWorldController.getHelloWorld';

// Import the current user's ID
import USER_ID from '@salesforce/user/Id';
// Import the User's Name field
import USER_NAME_FIELD from '@salesforce/schema/User.Name';

export default class HelloWorld extends LightningElement {
    // We don't need @api recordId anymore for this specific use case
    // @api recordId;

    greeting = 'Загрузка имени пользователя...';
    isLoading = true;
    error;
    userName; // Property to store the current user's name

    // Wire to get the current user's record
    @wire(getRecord, {
        recordId: USER_ID, // Use the imported USER_ID
        fields: [USER_NAME_FIELD] // Request the User's Name field
    })
    wiredUser({ error, data }) {
        if (data) {
            this.userName = getFieldValue(data, USER_NAME_FIELD);
            this.callApexMethod(); // Call Apex once user name is retrieved
        } else if (error) {
            console.error('Ошибка загрузки данных пользователя', error);
            this.error = error;
            this.isLoading = false;
            this.greeting = 'Ошибка загрузки имени пользователя';
        }
    }

    callApexMethod() {
        // Pass the retrieved user name to the Apex method
        getHelloWorld({ name: this.userName })
            .then(result => {
                this.greeting = result;
            })
            .catch(error => {
                console.error('Ошибка в getHelloWorld:', error);
                this.greeting = 'Ошибка при получении приветствия';
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    // A getter for the username, though directly using this.userName is fine
    // get userNameValue() {
    //     return this.userName || 'неизвестно';
    // }
}