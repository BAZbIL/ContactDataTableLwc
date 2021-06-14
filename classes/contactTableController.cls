/**
 * Created by Admin on 06.04.2021.
 */

public with sharing class contactTableController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getFindContact(string searchKey) {
        if (String.isBlank(searchKey)) {
            return [SELECT Id, FirstName, LastName, Email, AccountId, CreatedDate, Phone FROM Contact];
        } else {
            string searchKeyword = '%' + searchKey + '%';
            return [SELECT Id, FirstName, LastName, Email, AccountId, CreatedDate, Phone FROM Contact WHERE FirstName LIKE :searchKeyword];
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountModal(String actName) {
        List<Account> accList = new List<Account>();
        if (actName != '') {
            String accountName = '%' + actName + '%';
            accList = [SELECT Id, Name FROM Account WHERE Name LIKE:accountName];
            return accList;
        }
        return accList;
    }

    @AuraEnabled
    public static void deleteContacts(list<Id> lstConIds) {
        try {
            list<Contact> lstConsToDelete = new list<Contact>();
            for (Id idCon : lstConIds) {
                lstConsToDelete.add(new Contact(Id = idCon));
            }
            if (!lstConsToDelete.isEmpty()) {
                delete lstConsToDelete;
            }
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

}