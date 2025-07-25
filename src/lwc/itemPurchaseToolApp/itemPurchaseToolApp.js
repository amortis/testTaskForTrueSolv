import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


// Поля для текущего Account (с которого открыт компонент)
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import ACCOUNT_INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

// Поля для проверки менеджера (User)
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


    // Данные текущего Account
    @wire(getRecord, {
        recordId: '$recordId',
        fields: [
            ACCOUNT_NAME_FIELD,
            ACCOUNT_NUMBER_FIELD,
            ACCOUNT_INDUSTRY_FIELD
        ]
    }) account;

    // Вычисляемые свойства для Account
    get accountName() {
        return this.account.data ? getFieldValue(this.account.data, ACCOUNT_NAME_FIELD) : 'Loading...';
    }

    get accountNumber() {
        return this.account.data ? getFieldValue(this.account.data, ACCOUNT_NUMBER_FIELD) : '';
    }

    get accountIndustry() {
        return this.account.data ? getFieldValue(this.account.data, ACCOUNT_INDUSTRY_FIELD) : '';
    }



    // Проверка, является ли пользователь менеджером
    @wire(getRecord, {
        recordId: USER_ID,
        fields: [USER_IS_MANAGER_FIELD]
    }) user;



    // Проверка менеджера
    get isManager() {
        // Hardcoded for testing for managers
        return true;
        //return this.user.data ? getFieldValue(this.user.data, USER_IS_MANAGER_FIELD) : false;
    }

    // Состояние загрузки
    get isLoading() {
        this.error = getFieldValue(this.account.data, ACCOUNT_NAME_FIELD) + '1111111';
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
        return this.cartItems.length > 0 ? this.cartItems.length.toString() : null;
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
        const existingItem = this.cartItems.find(cartItem => cartItem.Id === item.Id);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
            this.cartItems = [...this.cartItems]; // Force reactivity

        } else {
            this.cartItems.push({ ...item, quantity: 1 });
        }
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Item added to cart',
                message: 'Item was added to cart.',
                variant: 'success'
            })
        );
    }

}