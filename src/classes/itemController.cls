public class itemController {
    /**
     * Retrieve all available Item__c records for display.
     * @return List of Item__c records with fields: Id, Name, Description__c, Type__c, Family__c, Image__c, and Price__c.
     */
    @AuraEnabled(cacheable=true)
    public static List<Item__c> getItems() {
        return [
            SELECT Id, Name, Description__c, Type__c, Family__c, Image__c, Price__c
            FROM Item__c
            ORDER BY Name
        ];
    }

    /**
     * Create a new Item__c record in the system.
     * @param newItem The Item__c record to insert.
     * @return The inserted Item__c record, with full details.
     * @throws AuraHandledException if the insert fails due to DML errors or unexpected exceptions.
     */
    @AuraEnabled
    public static Item__c createNewItem(Item__c newItem) {
        try {
            insert newItem;
            return [SELECT Id, Name, Description__c, Type__c, Family__c, Image__c, Price__c
            FROM Item__c
            WHERE Id = :newItem.Id];
        } catch (DmlException e) {
            throw new AuraHandledException('Error creating Item: ' + e.getMessage() + ' Details: ' + e.getDmlMessage(0));
        } catch (Exception e) {
            throw new AuraHandledException('An unexpected error occurred while creating the item: ' + e.getMessage());
        }
    }

}