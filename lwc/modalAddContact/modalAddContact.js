import {LightningElement, track, api} from 'lwc';
import {createRecord} from 'lightning/uiRecordApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';


export default class ModalAddContact extends LightningElement {

    @track contactId;
    @track selectedAccountId;
    @track modalAddContact = false;
    @api recordId;
    @api _wiredResult;
    FirstName = '';
    LastName = '';
    Email = '';
    Phone = '';

    modalAddContactShow() {
        this.modalAddContact = true;
    }

    modalAddContactHide() {

        this.modalAddContact = false;
    }

    contactHandleChange(event) {
        if (event.target.label === 'First Name') {
            this.FirstName = event.target.value;
        }
        if (event.target.label === 'Last Name') {
            this.LastName = event.target.value;
        }
        if (event.target.label === 'Email') {
            this.Email = event.target.value;
        }
        if (event.target.label === 'Mobile Phone') {
            this.Phone = event.target.value;
        }
    }

    myLookupHandle(event) {
        this.selectedAccountId = event.detail;
    }

    modalSaveContact() {
        const fields = {};
        fields[FIRST_NAME_FIELD.fieldApiName] = this.FirstName;
        fields[LAST_NAME_FIELD.fieldApiName] = this.LastName;
        fields[EMAIL_FIELD.fieldApiName] = this.Email;
        fields[PHONE_FIELD.fieldApiName] = this.Phone;
        fields[ACCOUNT_FIELD.fieldApiName] = this.selectedAccountId;

        const recordInput = {apiName: CONTACT_OBJECT.objectApiName, fields};

        createRecord(recordInput)
            .then(contact => {
                this.contactId = contact.id;
                this.fields = {};
                this.modalAddContact = false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact created successfully..!',
                        variant: 'success',

                    }),
                );
                window.location.reload();
                return refreshApex(this._wiredResult);

            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

}