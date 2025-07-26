import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CartModal extends LightningElement {
    @api initialCartItems = []; // Initial items passed from parent
    @track cartItems = []; // Internal state for cart items, including quantity and total price
    @track overallCartTotal = 0.00;

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
    handleCheckout() {
        if (this.cartItems.length === 0) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Cart is Empty',
                    message: 'Please add items to your cart before checking out.',
                    variant: 'warning'
                })
            );
            return;
        }

        // Dispatch a 'checkout' event to the parent, passing the current cart items
        this.dispatchEvent(new CustomEvent('checkout', {
            detail: this.cartItems.map(cartItem => ({
                itemId: cartItem.item.Id,
                quantity: cartItem.quantity,
                price: cartItem.item.Price__c // You might want to pass the current price as well
            }))
        }));

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Checkout Initiated',
                message: 'Proceeding to checkout with ' + this.cartItems.length + ' items.',
                variant: 'success'
            })
        );
        // Optionally close the modal after dispatching checkout event
        // this.handleClose();
    }
}