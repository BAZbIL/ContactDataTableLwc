/**
 * Created by User on 01.04.2021.
 */

import {LightningElement, api, track, wire} from 'lwc';
import getFindContact from "@salesforce/apex/contactTableController.getFindContact";
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
import {refreshApex} from "@salesforce/apex";
import delSelectedCons from '@salesforce/apex/contactTableController.deleteContacts';


const columns = [
    {label: 'First Name', fieldName: 'FirstName'},
    {label: "Last Name", fieldName: 'LastName'},
    {
        label: 'Accounts',
        type: 'button',
        typeAttributes: {label: {fieldName: 'AccountId'}, name: 'navigate_account', variant: 'base'}
    },
    {label: 'Email', fieldName: 'Email', type: 'email'},
    {label: 'Mobile phone', fieldName: 'Phone', type: 'name'},
    {label: 'Created Date', fieldName: 'CreatedDate', type: 'date'},
    {
        type: 'button-icon', label: 'Action', initialWidth: 75, typeAttributes: {
            iconName: 'action:delete', title: 'Delete', name: 'delete_contact',
            variant: 'border-filled', alternativeText: 'Delete'
        }
    },

];

export default class contactTable extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    @api AccountId;
    @api ContactId;
    @track data;
    @track error;
    @track record = {};
    @track currentRecordId;
    @track rowOffset = 0;
    @track columns = columns;
    @track isDialogVisible = false;
    @track originalMessage;
    @track displayMessage = 'Click on the \'Open Confirmation\' button to test the dialog.'
    @track selectedRow;
    _wiredResult;
    error;

    @wire(getFindContact)
    wiredCallback(result) {
        this._wiredResult = result;
        const {data, error} = result;
        if (data) {
            this.data = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    handleRowAction(event) {
        if (event.detail.action.name === 'navigate_account') {
            this.record = event.detail.row;
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.record.AccountId,
                    actionName: 'view',
                },
            });
        } else if (event.detail.action.name === 'delete_contact') {
            this.selectedRow = event.detail.row;
            this.isDialogVisible = true;
        }
    }

    handleClick(event) {
        this.originalMessage = event.currentTarget.dataset.id;
        if (event.target.name === 'confirmModal') {

            if (event.detail.status === 'confirm') {
                let selectedRow = event.detail.selectedRow;
                this.deleteCons(selectedRow);
                this.isDialogVisible = false;
            } else if (event.detail.status === 'cancel') {
                this.isDialogVisible = false;
            }
            this.isDialogVisible = false;
        }
    }

    @track getFindContact;

    deleteCons(currentRow) {
        let currentRecord = [];
        currentRecord.push(currentRow.Id);

        delSelectedCons({lstConIds: currentRecord})
            .then(() => {

                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!',
                    message: currentRow.FirstName + ' ' + currentRow.LastName + ' Contact deleted.',
                    variant: 'success'
                }),);

                return refreshApex(this._wiredResult);

            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error'
                }),);
            });
    }


    searchKeyword(event) {
        this.searchValue = event.target.value;
    }

    handleSearchKeyword() {

        if (this.searchValue !== '% + ') {
            getFindContact({
                searchKey: this.searchValue
            })
                .then(result => {
                    this.data = result;
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event);
                    this.data = null;
                });
        }
    }
}