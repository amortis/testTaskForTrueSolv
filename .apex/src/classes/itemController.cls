public class itemController {

    @AuraEnabled(cacheable=true)
    public static List<Item__c> getItems() {
        return [
            SELECT Id, Name, Description__c, Type__c, Family__c, Image__c, Price__c
            FROM Item__c
            ORDER BY Name
        ];
    }

    @AuraEnabled
    public static Item__c createNewItem(Item__c newItem) {
        try {
            insert newItem;
            return newItem;
        } catch (DmlException e) {
            throw new AuraHandledException('Error creating Item: ' + e.getMessage() + ' Details: ' + e.getDmlMessage(0));
        } catch (Exception e) {
            throw new AuraHandledException('An unexpected error occurred while creating the item: ' + e.getMessage());
        }
    }

}