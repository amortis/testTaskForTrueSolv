@isTest
private class itemController_Test {

	@isTest
	static void testGetItems() {
		// Arrange: test items
		Item__c item1 = new Item__c(
				Name = 'Test Item 1',
				Description__c = 'First item',
				Type__c = 'Accessory',
				Family__c = 'Consumer Electronics',
				Image__c = 'https://images.unsplash.com/photo-1556745750-68295fefafc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODMxMTF8MXwxfHNlYXJjaHwxfHxiYWtlcnl8ZW58MHx8fHwxNzUzNjA2OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
				Price__c = 99.99
		);
		Item__c item2 = new Item__c(
				Name = 'Test Item 2',
				Description__c = 'Second item',
				Type__c = 'Bag',
				Family__c = 'Carry Goods',
				Image__c = 'https://images.unsplash.com/photo-1465805139202-a644e217f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODMxMTF8MHwxfHNlYXJjaHwxfHxnb29kfGVufDB8fHx8MTc1MzYwNjk4MHww&ixlib=rb-4.1.0&q=80&w=1080',
				Price__c = 49.99
		);
		insert new List<Item__c>{ item1, item2 };

		Test.startTest();
		List<Item__c> items = itemController.getItems();
		Test.stopTest();

		System.assert(items.size() >= 2, 'Expected at least 2 items returned');
		System.assertNotEquals(null, items[0].Name, 'Item should have a name');
	}

	@isTest
	static void testCreateNewItem_success() {
		// Arrange: Item__c without insertion
		Item__c newItem = new Item__c(
				Name = 'New Test Item',
				Description__c = 'Created in test',
				Type__c = 'Automotive',
				Family__c = 'Pet Care',
				Image__c = 'https://images.unsplash.com/photo-1556745750-68295fefafc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODMxMTF8MXwxfHNlYXJjaHwxfHxiYWtlcnl8ZW58MHx8fHwxNzUzNjA2OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
				Price__c = 199.99
		);

		Test.startTest();
		Item__c insertedItem = itemController.createNewItem(newItem);
		Test.stopTest();

		System.assertNotEquals(null, insertedItem.Id, 'Inserted item must have Id');
		System.assertEquals('New Test Item', insertedItem.Name);
	}

	@isTest
	static void testCreateNewItem_failure() {
		// Arrange: Item__c without required fields
		Item__c badItem = new Item__c(); // No required fields

		Boolean exceptionThrown = false;
		Test.startTest();
		try {
			itemController.createNewItem(badItem);
		} catch (AuraHandledException e) {
			exceptionThrown = true;
			System.debug('Caught expected exception: ' + e.getMessage());
		}
		Test.stopTest();


	}
}
