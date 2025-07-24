import {LightningElement, track, api, wire} from 'lwc';

import isCurrentUserManager from '@salesforce/apex/managerController.isCurrentUserManager';
import getAccountData from '@salesforce/apex/accountController.getAccountData';


export default class ItemPurchaseToolApp extends LightningElement {

    @api recordId;
    // getAccountData
    @track accountData = null;

    // isCurrentUserManager
    @track isManager = null;

    // Lifecycle hooks
    connectedCallback() {
        this.loadInitialData();
    }

    // Wire methods for reactive data loading
    @wire(getAccountData, { accountId: '$recordId' })
    wiredAccountData({ error, data }) {
        if (data) {
            this.accountData = data;
        } else if (error) {
            console.error('Error loading account data:', error);
        }
    }




    // Event handlers
    async loadInitialData() {
        try {
            // Load manager status
            const managerStatus = await isCurrentUserManager();
            this.isManager = managerStatus;
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    handleCreateItem() {
        // Open create item modal
        // This will be implemented when we add the modal component
        console.log('Create Item clicked');
    }

    handleOpenCart() {
        // Open cart modal
        // This will be implemented when we add the modal component
        console.log('Cart clicked');
    }
}