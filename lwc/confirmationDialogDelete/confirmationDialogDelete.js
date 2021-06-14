/**
 * Created by Admin on 15.04.2021.
 */

import {LightningElement, api, track} from 'lwc';


export default class ConfirmationDialogDelete extends LightningElement {
    @api visible = false;
    @api title = '';
    @api name;
    @api message = '';
    @api confirmLabel = '';
    @api cancelLabel = '';
    @api originalMessage;
    @api recordId;
    @track isDialogVisible = false;
    @track contactId;
    @api selectedRow;

    handleRowAction(event) {
        let finalEvent = {
            originalMessage: this.originalMessage,
            status: event.target.name,
            selectedRow: this.selectedRow
        };
        this.dispatchEvent(new CustomEvent('deletecontact', {detail: finalEvent}));
    }

}