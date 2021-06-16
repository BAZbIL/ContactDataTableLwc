public with sharing class contactTableController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getFindContact(string searchKey) {
        if (String.isBlank(searchKey)) {
            return [
                    SELECT Id, FirstName, LastName, Email, AccountId, CreatedDate, Phone
                    FROM Contact
            ];
        } else {
            string searchKeyword = '%' + searchKey + '%';
            return [
                    SELECT Id, FirstName, LastName, Email, AccountId, CreatedDate, Phone
                    FROM Contact
                    WHERE FirstName
                            LIKE :searchKeyword
            ];
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountModal(String accountsName) {
        List<Account> accountsList = new List<Account>();
        if (accountsName != '') {
            String accountName = '%' + accountsName + '%';
            accountsList = [
                    SELECT Id, Name
                    FROM Account
                    WHERE Name
                            LIKE:accountName
            ];

            return accountsList;
        }

        return accountsList;
    }

    @AuraEnabled
    public static void deleteContacts(List<Id> listContactIds) {
        try {
            List<Contact> listContactToDelete = new List<Contact>();
            for (Id idContact : listContactIds) {
                listContactToDelete.add(new Contact(Id = idContact));
            }
            if (!listContactToDelete.isEmpty()) {
                delete listContactToDelete;
            }
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

}