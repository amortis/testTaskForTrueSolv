import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi'; // Import for fetching record data by ID
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Import for displaying toast messages

// Import the specific field needed for the image URL
import IMAGE_FIELD from '@salesforce/schema/Item__c.Image__c';

export default class ItemDetailModal extends LightningElement {
    @api itemId;
    imageUrl;

    // Wire service to fetch the Item__c record data, specifically the Image__c field
    // '$itemId' makes the wire reactive to changes in itemId
    @wire(getRecord, { recordId: '$itemId', fields: [IMAGE_FIELD] })
    wiredItem({ error, data }) {
        if (data) {
            // If data is successfully fetched, extract the Image__c field value
            // and assign it to imageUrl
            this.imageUrl = data.fields.Image__c.value;
        } else if (error) {
            // Log and display any errors during data fetching
            console.error('Error fetching item image for details:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Failed to load item image: ' + this._extractErrorMessage(error),
                    variant: 'error'
                })
            );
        }
    }

    // Handles the close button click
    handleClose() {
        // Dispatches a custom event 'close' to the parent component
        // The parent component will listen for this event to close the modal
        this.dispatchEvent(new CustomEvent('close'));
    }

    // Helper method to extract a user-friendly error message from a Salesforce error object
    _extractErrorMessage(error) {
        let message = 'Unknown error';
        if (error && error.body && error.body.message) {
            message = error.body.message;
        } else if (error && error.message) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }
        return message;
    }
}