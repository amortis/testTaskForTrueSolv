import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import searchUnsplashImage from '@salesforce/apex/UnsplashService.searchUnsplashImage';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

import createNewItem from '@salesforce/apex/itemController.createNewItem';

import ITEM_OBJECT from '@salesforce/schema/Item__c';
import FAMILY_FIELD from '@salesforce/schema/Item__c.Family__c';
import TYPE_FIELD from '@salesforce/schema/Item__c.Type__c';

const SEARCH_DELAY = 700; // milliseconds

export default class CreateItemModal extends LightningElement {
    @track itemFields = {
        Name: '',
        Description__c: '',
        Type__c: '',
        Family__c: '',
        Image__c: '',
        Price__c: null
    };
    @api accountId;
    @track isImageSearchLoading = false;
    searchTimeout;

    @wire(getObjectInfo, { objectApiName: ITEM_OBJECT })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: FAMILY_FIELD })
    familyPicklistValues;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: TYPE_FIELD })
    typePicklistValues;

    get familyOptions() {
        if (this.familyPicklistValues.error) {
            console.error('Family picklist error:', this.familyPicklistValues.error);
            return [{ label: 'Error loading families', value: '' }];
        }
        return this.familyPicklistValues.data
            ? this.familyPicklistValues.data.values
            : [];
    }

    get typeOptions() {
        if (this.typePicklistValues.error) {
            console.error('Type picklist error:', this.typePicklistValues.error);
            return [{ label: 'Error loading types', value: '' }];
        }
        return this.typePicklistValues.data
            ? this.typePicklistValues.data.values
            : [];
    }


    // Method for handling changes (except Name)
    handleChange(event) {
        const { name, value } = event.target;
        this.itemFields = { ...this.itemFields, [name]: value };
    }


    // Method for handling changes for Name field
    handleNameChange(event) {
        const itemName = event.target.value;
        this.itemFields.Name = itemName;

        // Reset timer
        clearTimeout(this.searchTimeout);

        // Set new timer
        this.searchTimeout = setTimeout(() => {
            this.searchImage(itemName);
        }, SEARCH_DELAY);
    }

    // Searching method
    async searchImage(query) {
        if (query && query.length >= 3) {
            this.isImageSearchLoading = true;
            try {
                const imageUrl = await searchUnsplashImage({ query: query });
                if (imageUrl) {
                    this.itemFields.Image__c = imageUrl;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Image Found',
                            message: 'Image found for "' + query + '".',
                            variant: 'success'
                        })
                    );
                } else {
                    this.itemFields.Image__c = ''; // clear, if not found
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'No Image Found',
                            message: 'No image found for "' + query + '".',
                            variant: 'info'
                        })
                    );
                }
            } catch (error) {
                console.error('Unsplash Image Search Error:', error);
                this.itemFields.Image__c = ''; // clear, if mistake
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Image Search Error',
                        message: this._extractErrorMessage(error),
                        variant: 'error'
                    })
                );
            } finally {
                this.isImageSearchLoading = false;
            }
        } else {
            this.itemFields.Image__c = ''; // clear, if the field is empty or too short
        }
    }

    // creation item method
    async handleCreateItem() {
        // checking if the fields are valid
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        if (!allValid) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating item',
                    message: 'Please check all required input fields.',
                    variant: 'error'
                })
            );
            return;
        }



        try {
            const createdItem = await createNewItem({ newItem: this.itemFields });
            console.log('Item created:', createdItem);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Item "' + createdItem.Name + '" created successfully!',
                    variant: 'success'
                })
            );

            this.dispatchEvent(new CustomEvent('itemcreated', { detail: createdItem }));
            this.handleCancel();

        } catch (error) {
            console.error('Error creating item:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error creating item: ' + this._extractErrorMessage(error),
                    variant: 'error'
                })
            );
        }
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('close'));
    }

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