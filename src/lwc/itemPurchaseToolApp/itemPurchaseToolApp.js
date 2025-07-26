import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

// Поля для текущего Account (с которого открыт компонент)
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import ACCOUNT_INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

// Поля для проверки менеджера (User)
import USER_ID from '@salesforce/user/Id';
import USER_IS_MANAGER_FIELD from '@salesforce/schema/User.IsManager__c';

export default class ItemPurchaseToolApp extends LightningElement {
    @api recordId; // ID текущего Account (получает автоматически при открытии из страницы Account)

    @track error = 'def';
    @track showCreateItemModal = false;


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

    handleCreateItem() {
        this.showCreateItemModal = true;
    }

    handleCloseCreateItem() {
        this.showCreateItemModal = false;
    }

    handleItemCreated() {
        this.showCreateItemModal = false;
        // TODO: Update item list
    }
}