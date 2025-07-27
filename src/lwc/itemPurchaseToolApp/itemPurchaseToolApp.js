import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


// Account fields
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import ACCOUNT_INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

// User fields
import USER_ID from '@salesforce/user/Id';
import USER_IS_MANAGER_FIELD from '@salesforce/schema/User.IsManager__c';

export default class ItemPurchaseToolApp extends LightningElement {
    @api recordId;

    @track error = 'def';
    @track showCreateItemModal = false;

    @track showCartModal = false;

    @track showItemDetailModal = false;
    @track selectedItemIdForDetails;
    @track cartItems = [];


    // Account data
    @wire(getRecord, {
        recordId: '$recordId',
        fields: [
            ACCOUNT_NAME_FIELD,
            ACCOUNT_NUMBER_FIELD,
            ACCOUNT_INDUSTRY_FIELD
        ]
    }) account;


    get accountName() {
        return this.account.data ? getFieldValue(this.account.data, ACCOUNT_NAME_FIELD) : 'Loading...';
    }

    get accountNumber() {
        return this.account.data ? getFieldValue(this.account.data, ACCOUNT_NUMBER_FIELD) : '';
    }

    get accountIndustry() {
        return this.account.data ? getFieldValue(this.account.data, ACCOUNT_INDUSTRY_FIELD) : '';
    }



    // IsManager check
    @wire(getRecord, {
        recordId: USER_ID,
        fields: [USER_IS_MANAGER_FIELD]
    }) user;



    get isManager() {
        return this.user.data ? getFieldValue(this.user.data, USER_IS_MANAGER_FIELD) : false;
    }

    // Loading
    get isLoading() {
        this.error = getFieldValue(this.account.data, ACCOUNT_NAME_FIELD);
        return this.account.isLoading || this.user.isLoading || !this.account.data || !this.user.data;
    }

    get userId(){
        return USER_ID;
    }

    get accountLoaded(){
        return !this.isLoading;
    }

    get hasError() {
        return this.account.error || this.user.error;
    }

    get cartItemCount() {

        if (!this.cartItems || this.cartItems.length === 0) {
            return null;
        }

        const total = this.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        return total.toString();
    }


    // Create Item window
    handleCreateItem() {
        this.showCreateItemModal = true;
    }

    handleCloseCreateItem() {
        this.showCreateItemModal = false;
        // TODO make page reload
    }

    // Item Details
    handleItemSelected(event) {
        this.selectedItemIdForDetails = event.detail.Id;
        this.showItemDetailModal = true;
    }
    handleCloseItemDetailModal() {
        this.showItemDetailModal = false;
        this.selectedItemIdForDetails = null;
    }

    // Cart
    handleShowCart() {
        this.showCartModal = true;
    }

    // Handles closing the cart modal
    handleCloseCart() {
        this.showCartModal = false;
    }

    // Add item to cart
    handleAddToCart(event) {
        const item = event.detail;

        const existingItem = this.cartItems.find(cartItem => String(cartItem.Id) === String(item.Id));

        if (existingItem) {

            existingItem.quantity = (existingItem.quantity || 1) + 1;
            this.cartItems = [...this.cartItems]; // Force reactivity
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Item ' + item.Name +  ' added to cart',
                    variant: 'success'
                })
            );

        } else {
            this.cartItems.push({ ...item, quantity: 1 });
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Item ' + item.Name +  ' added to cart',
                    variant: 'success'
                })
            );
        }

    }

    handleItemCreated(event){
        console.log('Item created:', event.detail);
    }

}