import {LightningElement, track, wire} from 'lwc';

import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import getItems from "@salesforce/apex/itemController.getItems"

import ITEM_OBJECT from '@salesforce/schema/Item__c';
import FAMILY_FIELD from '@salesforce/schema/Item__c.Family__c';
import TYPE_FIELD from '@salesforce/schema/Item__c.Type__c';

export default class ItemList extends LightningElement {
    @track items = []; // Items
    @track filteredItems = [];
    @track isLoading = true;
    @track searchKey = '';
    @track selectedFamily = '';
    @track selectedType = '';



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
            ? [{ label: 'All', value: '' }, ...this.familyPicklistValues.data.values]
            : [];
    }

    get typeOptions() {
        if (this.typePicklistValues.error) {
            console.error('Type picklist error:', this.typePicklistValues.error);
            return [{ label: 'Error loading types', value: '' }];
        }
        return this.typePicklistValues.data
            ? [{ label: 'All', value: '' }, ...this.typePicklistValues.data.values]
            : [];
    }

    connectedCallback() {
        this.loadItems();
    }

    loadItems() {
        this.isLoading = true;

        getItems()
            .then(result => {
                this.items = result;
                this.filteredItems = result;
                this.isLoading = false;
            })
            .catch(error => {
                // обработка ошибок
                this.isLoading = false;
            });
    }

    getUniqueOptions(items, field) {
        const values = [...new Set(items.map(i => i[field]).filter(Boolean))];
        // noinspection JSAnnotator
        return [{ label: 'All', value: '' }, ...values.map(v => ({ label: v, value: v }))];
    }

    handleSearchChange(event) {
        this.searchKey = event.target.value;
        this.applyFilters();
    }

    handleFamilyChange(event) {
        this.selectedFamily = event.detail.value;
        this.applyFilters();
    }

    handleTypeChange(event) {
        this.selectedType = event.detail.value;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredItems = this.items.filter(item => {
            const matchesSearch =
                (!this.searchKey ||
                    (item.Name && item.Name.toLowerCase().includes(this.searchKey.toLowerCase())) ||
                    (item.Description__c && item.Description__c.toLowerCase().includes(this.searchKey.toLowerCase())));
            const matchesFamily = !this.selectedFamily || item.Family__c === this.selectedFamily;
            const matchesType = !this.selectedType || item.Type__c === this.selectedType;
            return matchesSearch && matchesFamily && matchesType;
        });
    }

    handleItemDetails(event) {
        const item = event.detail;
        this.dispatchEvent(new CustomEvent('itemselected', { detail: item }));
    }

    handleAddToCart(event) {
        const item = event.detail;
        this.dispatchEvent(new CustomEvent('addtocart', { detail: item }));
    }

    get noResults() {
        return !this.isLoading && this.filteredItems.length === 0;
    }
}