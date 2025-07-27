import {LightningElement, track, wire} from 'lwc';

import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import getItems from "@salesforce/apex/itemController.getItems"

import ITEM_OBJECT from '@salesforce/schema/Item__c';
import FAMILY_FIELD from '@salesforce/schema/Item__c.Family__c';
import TYPE_FIELD from '@salesforce/schema/Item__c.Type__c';

export default class ItemList extends LightningElement {
    @track items = []; // Items
    @track filteredItems = [];// Filtered items based on search and checkboxes

    @track isLoading = true;
    @track searchKey = '';
    @track selectedFamilies = [];
    @track selectedTypes = [];

    @track familyOptions = [];
    @track typeOptions = [];



    // Get metadata info to retrieve picklist values
    @wire(getObjectInfo, { objectApiName: ITEM_OBJECT })
    objectInfo;

    // Load Family__c picklist values
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: FAMILY_FIELD })
    wiredFamilies({ data, error }) {
        if (data) {
            this.familyOptions = [
                { label: 'All', value: '__all__', isChecked: false },
                ...data.values.map(opt => ({
                    label: opt.label,
                    value: opt.value,
                    isChecked: false
                }))
            ];

        } else {
            console.error('Error loading family values', error);
        }
    }

    // Load Type__c picklist values
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: TYPE_FIELD })
    wiredTypes({ data, error }) {
        if (data) {
            this.typeOptions = [
                { label: 'All', value: '__all__', isChecked: false },
                ...data.values.map(opt => ({
                    label: opt.label,
                    value: opt.value,
                    isChecked: false
                }))
            ];

        } else {
            console.error('Error loading type values', error);
        }
    }

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

    // Load items when component initializes
    connectedCallback() {
        this.loadItems();
    }

    // Fetch items from Apex
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

    // Handle search bar input
    handleSearchChange(event) {
        this.searchKey = event.target.value;
        this.applyFilters();
    }

    // Handle change in family checkbox group
    handleFamilyChange(event) {
        const value = event.target.dataset.value;
        const isChecked = event.target.checked;

        if (value === '__all__') {
            // check all or remove all
            this.familyOptions = this.familyOptions.map(opt => ({
                ...opt,
                isChecked
            }));
        } else {
            this.familyOptions = this.familyOptions.map(opt =>
                opt.value === value ? { ...opt, isChecked } : opt
            );


            const allOption = this.familyOptions.find(opt => opt.value === '__all__');
            const restChecked = this.familyOptions
                .filter(opt => opt.value !== '__all__' && opt.isChecked);

            allOption.isChecked = restChecked.length === this.familyOptions.length - 1;
        }

        // update selectedFamilies
        this.selectedFamilies = this.familyOptions
            .filter(opt => opt.isChecked && opt.value !== '__all__')
            .map(opt => opt.value);

        this.applyFilters();
    }

    // Handle change in type checkbox group
    handleTypeChange(event) {
        const value = event.target.dataset.value;
        const isChecked = event.target.checked;

        if (value === '__all__') {

            this.typeOptions = this.typeOptions.map(opt => ({
                ...opt,
                isChecked
            }));
        } else {

            this.typeOptions = this.typeOptions.map(opt =>
                opt.value === value ? { ...opt, isChecked } : opt
            );


            const allOption = this.typeOptions.find(opt => opt.value === '__all__');
            const restChecked = this.typeOptions
                .filter(opt => opt.value !== '__all__' && opt.isChecked);

            allOption.isChecked = restChecked.length === this.typeOptions.length - 1;
        }


        this.selectedTypes = this.typeOptions
            .filter(opt => opt.isChecked && opt.value !== '__all__')
            .map(opt => opt.value);

        this.applyFilters();
    }


    // Main filter logic: search, family, type
    applyFilters() {
        this.filteredItems = this.items.filter(item => {
            const matchesSearch =
                (!this.searchKey ||
                    (item.Name && item.Name.toLowerCase().includes(this.searchKey.toLowerCase())) ||
                    (item.Description__c && item.Description__c.toLowerCase().includes(this.searchKey.toLowerCase())));

            const matchesFamily =
                this.selectedFamilies.length === 0 || this.selectedFamilies.includes(item.Family__c);

            const matchesType =
                this.selectedTypes.length === 0 || this.selectedTypes.includes(item.Type__c);

            return matchesSearch && matchesFamily && matchesType;
        });
    }

    isFamilyChecked(value) {
        return this.selectedFamilies.includes(value);
    }

    isTypeChecked(value) {
        return this.selectedTypes.includes(value);
    }


    // Emits item object when user clicks "View details"
    handleItemDetails(event) {
        const itemId = event.detail;
        console.log('Item details clicked, itemId:', itemId);
        // Найти полный объект товара по ID
        const item = this.items.find(i => i.Id === itemId);
        console.log('Found item:', item);
        if (item) {
            this.dispatchEvent(new CustomEvent('itemselected', { detail: item }));
        }
    }

    handleAddToCart(event) {
        const item = event.detail;
        this.dispatchEvent(new CustomEvent('addtocart', { detail: item }));
    }

    get noResults() {
        return !this.isLoading && this.filteredItems.length === 0;
    }
}