/**
 * Created by Admin on 15.04.2021.
 */

@IsTest
private class contactTableControllerTest {
    @TestSetup
    static void setup() {
        //Create account
        Account account = new Account(Name = 'TestAccount');
        insert account;

        //Create list of contacts
        List<Contact> contacts = new List<Contact>();
        Contact contact1 = new Contact(FirstName = 'test1', LastName = 'test1', Email = 'test1@test1.com',
                Phone = '123', AccountId = account.Id);
        Contact contact2 = new Contact(FirstName = 'test2', LastName = 'test2', Email = 'test2@test2.com',
                Phone = '1234', AccountId = account.Id);
        Contact contact3 = new Contact(FirstName = 'test3', LastName = 'test3', Email = 'test3@test3.com',
                Phone = '12345', AccountId = account.Id);

        contacts.add(contact1);
        contacts.add(contact2);
        contacts.add(contact3);

        //insert contact list
        insert contacts;
    }
    @IsTest
    static void getFindContact() {
        Test.startTest();
        List<Contact> contactsSearchNull = contactTableController.getFindContact(null);
        List<Contact> contactsSearch = contactTableController.getFindContact('TestName');
        Test.stopTest();
        List<Contact> createdContactsNull = [SELECT FirstName, LastName, Email, AccountId, CreatedDate, Phone FROM Contact];
        for (Integer i = 0; i < contactsSearchNull.size(); i++) {
            System.assert(contactsSearchNull[i].FirstName == createdContactsNull[i].FirstName);
            System.assert(contactsSearchNull[i].LastName == createdContactsNull[i].LastName);
            System.assert(contactsSearchNull[i].Email == createdContactsNull[i].Email);
            System.assert(contactsSearchNull[i].AccountId == createdContactsNull[i].AccountId);
            System.assert(contactsSearchNull[i].CreatedDate == createdContactsNull[i].CreatedDate);
            System.assert(contactsSearchNull[i].Phone == createdContactsNull[i].Phone);
        }

        List<Contact> createdContactsSearch = [SELECT FirstName, LastName, Email, AccountId, CreatedDate, Phone FROM Contact];
        for (Integer i = 0; i < contactsSearch.size(); i++) {
            System.assert(contactsSearch[i].FirstName == createdContactsSearch[i].FirstName);
            System.assert(contactsSearch[i].LastName == createdContactsSearch[i].LastName);
            System.assert(contactsSearch[i].Email == createdContactsSearch[i].Email);
            System.assert(contactsSearch[i].AccountId == createdContactsSearch[i].AccountId);
            System.assert(contactsSearch[i].CreatedDate == createdContactsSearch[i].CreatedDate);
            System.assert(contactsSearch[i].Phone == createdContactsSearch[i].Phone);
        }

    }
    @IsTest
    static void getAccountModal() {
        Test.startTest();
        List<Account> accounts = contactTableController.getAccountModal('Name');
        Test.stopTest();
        List<Account> createdAccounts = [SELECT Id, Name FROM Account];
        for (Integer i = 0; i < accounts.size(); i++) {
            System.assert(accounts[i].Id == createdAccounts[i].Id);
            System.assert(accounts[i].Name == createdAccounts[i].Name);
        }

    }

    @IsTest
    static void deleteContactsTest() {
        List<Id> ldsTest = new List<Id>();
        Id testCon;
        Contact deleteContact = [SELECT Id FROM Contact LIMIT 1];
        ldsTest.add(testCon);
        delete deleteContact;

        Test.startTest();
        try {
            contactTableController.deleteContacts(ldsTest);
        } catch (Exception e) {

        }
        Test.stopTest();

        System.assertEquals(2, [SELECT Id FROM Contact].size());

    }

}