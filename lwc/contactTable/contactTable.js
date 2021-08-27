import {LightningElement, api, track, wire} from 'lwc';
import getContact from "@salesforce/apex/contactTableController.getFindContact";
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
import {refreshApex} from "@salesforce/apex";
import deleteContact from '@salesforce/apex/contactTableController.deleteContacts';

const columns = [
    {label: 'First Name', fieldName: 'FirstName'},
    {label: "Last Name", fieldName: 'LastName'},
    {
        label: 'Accounts',
        type: 'button',
        typeAttributes: {label: {fieldName: 'AccountName'}, value: 'AccountId', name: 'navigate_account', variant: 'base'}
    },
    {label: 'Email', fieldName: 'Email', type: 'email'},
    {label: 'Mobile phone', fieldName: 'Phone', type: 'name'},
    {
        label: 'Created Date', fieldName: 'CreatedDate', type: 'date', typeAttributes: {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    },
    {
        type: 'button-icon', label: 'Action', initialWidth: 75, typeAttributes: {
            iconName: 'action:delete', title: 'Delete', name: 'delete_contact',
            variant: 'border-filled', alternativeText: 'Delete'
        }
    },
];

export default class contactTable extends NavigationMixin(LightningElement) {
    @api recordId;
    @track data;
    @track error;
    @track record = {};
    @track rowOffset = 0;
    @track columns = columns;
    @track isDialogVisible = false;
    @track originalMessage;
    @track displayMessage = 'Click on the \'Open Confirmation\' button to test the dialog.';
    @track selectedRow;
    lastSavedData;
    records;
    _wiredResult;

    @wire(getContact)
    wiredCallback(result) {
        this._wiredResult = result;
        const {data, error} = result;
        if (data) {
            this.records = JSON.parse(JSON.stringify(data));
            this.records.forEach(rec => {
                if(rec.Account){
                    rec.AccountName = rec.Account.Name;
                }
            });
            this.error = undefined;
        } else if (error) {
            this.records = undefined;
            this.error = error;
        } else {
            this.error = undefined;
            this.records = undefined;
        }
        this.lastSavedData;
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

    actionConfirmationDialog(event) {

        this.originalMessage = event.currentTarget.dataset.id;
        if (event.target.name === 'confirmModal') {

            if (event.detail.status === 'confirm') {

                let selectedRow = event.detail.selectedRow;
                this.deleteContacts(selectedRow);
                this.isDialogVisible = false;
            } else if (event.detail.status === 'cancel') {

                this.isDialogVisible = false;
            }

            this.isDialogVisible = false;
        }
    }

    deleteContacts(currentRow) {

        let currentRecord = [];
        currentRecord.push(currentRow.Id);
        deleteContact({listContactIds: currentRecord})
            .then(() => {

                this.dispatchEvent(new ShowToastEvent({
                        title: 'Success!!',
                        message: currentRow.FirstName + ' ' + currentRow.LastName + ' Contact deleted.',
                        variant: 'success'
                    }),
                );

                return refreshApex(this._wiredResult);
            })
            .catch(error => {

                this.dispatchEvent(new ShowToastEvent({
                        title: 'Error!!',
                        message: error.message,
                        variant: 'error'
                    }),
                );
            });
    }


    searchKeyword(event) {

        this.searchValue = event.target.value;
    }

    handleSearchKeyword() {

        if (this.searchValue !== '% + ') {

            getContact({
                searchKey: this.searchValue
            })
                .then(result => {

                    this.records = result;
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