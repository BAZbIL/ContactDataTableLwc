import {LightningElement, track, wire} from 'lwc';
import getCustomLookupAccount from '@salesforce/apex/contactTableController.getAccountModal';

export default class selectorAccount extends LightningElement {

    @track accountName = '';
    @track accountList = [];
    @track objectApiName = 'Account';
    @track accountId;
    @track isShow = false;
    @track messageResult = false;
    @track isShowResult = true;
    @track showSearchedValues = false;

    @wire(getCustomLookupAccount, {accountsName: '$accountName'})
    retrieveAccounts({error, data}) {
        this.messageResult = false;
        if (data) {
            if (data.length > 0 && this.isShowResult) {
                this.accountList = data;
                this.showSearchedValues = true;
                this.messageResult = false;
            } else if (data.length === 0) {
                this.accountList = [];
                this.showSearchedValues = false;
                if (this.accountName !== '') {
                    this.messageResult = true;
                }
            } else if (error) {
                this.accountId = '';
                this.accountName = '';
                this.accountList = [];
                this.showSearchedValues = false;
                this.messageResult = true;
            }
        }
    }

    searchHandleClick() {
        this.isShowResult = true;
        this.messageResult = false;
    }

    searchHandleKeyChange(event) {
        this.messageResult = false;
        this.accountName = event.target.value;
    }

    parentHandleAction(event) {
        this.showSearchedValues = false;
        this.isShowResult = false;
        this.messageResult = false;
        this.accountId = event.target.dataset.value;
        this.accountName = event.target.dataset.label;
        const selectedEvent = new CustomEvent('selected', {detail: this.accountId});
        this.dispatchEvent(selectedEvent);
    }

}