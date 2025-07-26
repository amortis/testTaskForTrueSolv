import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createPurchaseAndPurchaseLines from '@salesforce/apex/PurchaseController.createPurchaseAndPurchaseLines';


import { getRecord } from 'lightning/uiRecordApi';
// Поля для текущего Account (с которого открыт компонент)
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import ACCOUNT_INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';


export default class CartModal extends NavigationMixin(LightningElement) {
    @api initialCartItems = []; // Initial items passed from parent
    @track cartItems = []; // Internal state for cart items, including quantity and total price
    @track overallCartTotal = 0.00;

    @api accountId;

    // Данные текущего Account
    @wire(getRecord, {
        recordId: '$accountId',
        fields: [
            ACCOUNT_NAME_FIELD,
            ACCOUNT_NUMBER_FIELD,
            ACCOUNT_INDUSTRY_FIELD
        ]
    }) account;


    connectedCallback() {
        // Initialize internal cartItems from initialCartItems
        // We need to create a deep copy and add quantity and total for each item
        this.cartItems = this.initialCartItems.map(item => ({
            item: item,
            quantity: 1, // Default quantity
            totalPrice: item.Price__c // Initialize total price
        }));
        this.calculateOverallCartTotal();
    }

    // Recalculates the total price for the entire cart
    calculateOverallCartTotal() {
        this.overallCartTotal = this.cartItems.reduce((sum, cartItem) => sum + cartItem.totalPrice, 0);
    }

    // Handles changes in quantity for an individual item
    handleQuantityChange(event) {
        const itemId = event.target.dataset.itemId;
        const newQuantity = parseInt(event.target.value, 10);

        this.cartItems = this.cartItems.map(cartItem => {
            if (cartItem.item.Id === itemId) {
                // Ensure quantity is at least 1
                const quantity = Math.max(1, newQuantity || 1);
                return {
                    ...cartItem,
                    quantity: quantity,
                    totalPrice: cartItem.item.Price__c * quantity
                };
            }
            return cartItem;
        });
        this.calculateOverallCartTotal();
    }

    // Handles removing an item from the cart
    handleRemoveItem(event) {
        const itemIdToRemove = event.target.dataset.itemId;
        this.cartItems = this.cartItems.filter(cartItem => cartItem.item.Id !== itemIdToRemove);
        this.calculateOverallCartTotal();
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Item Removed',
                message: 'Item has been removed from your cart.',
                variant: 'info'
            })
        );
    }

    // Computes if the checkout button should be disabled
    get isCheckoutDisabled() {
        return this.cartItems.length === 0;
    }

    // Handles closing the modal
    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    // Handles the checkout process
    async handleCheckout() {

        if (!this.accountId) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Account ID is missing. Cannot proceed with checkout.',
                    variant: 'error'
                })
            );
            return;
        }



        // Map cartItems to the CartItemWrapper structure expected by Apex
        const itemsForApex = this.cartItems.map(cartItem => ({
            itemId: cartItem.item.Id, //  item.Id holds the Item__c record ID
            amount: cartItem.quantity, // item.quantity holds the amount/quantity
            unitCost: cartItem.item.Price__c //  item.Price__c holds the unit cost
        }));



        try {
            const purchaseId = await createPurchaseAndPurchaseLines({
                accountId: this.accountId,
                cartItemsJson: JSON.stringify(itemsForApex)
            });

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Purchase created successfully! Redirecting...',
                    variant: 'success'
                })
            );

            // Redirect to the newly created Purchase record page
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: purchaseId,
                    objectApiName: 'Purchase__c', // API Name of your Purchase object
                    actionName: 'view'
                }
            });

            this.dispatchEvent(new CustomEvent('close')); // Close the modal after checkout

        } catch (error) {
            console.error('Error during checkout:', error);
            let message = 'Unknown error during checkout.';
            if (error && error.body && error.body.message) {
                message = error.body.message;
            } else if (error && error.message) {
                message = error.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: message,
                    variant: 'error'
                })
            );
        }
    }
}