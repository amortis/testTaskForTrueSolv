@isTest
private class purchaseController_Test {

	@isTest
	static void testCreatePurchaseAndPurchaseLines_success() {
		// Create test Account
		Account testAccount = new Account(
				Name = 'Test Client'
		);
		insert testAccount;

		// Create test Item
		Item__c testItem = new Item__c(
				Name = 'Test Product',
				Price__c = 100.00
		);
		insert testItem;

		// Prepare JSON input
		List<Map<String, Object>> cartItems = new List<Map<String, Object>>();
		cartItems.add(new Map<String, Object>{
		'itemId' => testItem.Id,
		'amount' => 2,
		'unitCost' => 100.00
		});

		String cartItemsJson = JSON.serialize(cartItems);

		// Run test
		Test.startTest();
		Id resultPurchaseId = purchaseController.createPurchaseAndPurchaseLines(testAccount.Id, cartItemsJson);
		Test.stopTest();

		// Assertions
		System.assertNotEquals(null, resultPurchaseId, 'Purchase ID should not be null');

		// Query and verify inserted records
		Purchase__c insertedPurchase = [SELECT Id, Name, ClientId__c FROM Purchase__c WHERE Id = :resultPurchaseId];
		System.assertEquals(testAccount.Id, insertedPurchase.ClientId__c, 'Purchase should be linked to the correct Account');

		List<PurchaseLine__c> purchaseLines = [SELECT Id, PurchaseId__c, ItemId__c, Amount__c, UnitCost__c FROM PurchaseLine__c WHERE PurchaseId__c = :resultPurchaseId];
		System.assertEquals(1, purchaseLines.size(), 'One purchase line should be inserted');
		System.assertEquals(testItem.Id, purchaseLines[0].ItemId__c);
		System.assertEquals(2, purchaseLines[0].Amount__c);
		System.assertEquals(100.00, purchaseLines[0].UnitCost__c);
	}

	@isTest
	static void testCreatePurchaseAndPurchaseLines_missingInputs() {
		// Case 1: Null accountId
		Boolean exceptionThrown1 = false;

		// Case 2: Empty JSON
		Account acc = new Account(Name = 'Empty JSON Account');
		insert acc;

		Boolean exceptionThrown2 = false;


		Test.startTest();
		try {
			purchaseController.createPurchaseAndPurchaseLines(null, '[{}]');
		} catch (AuraHandledException e) {
			exceptionThrown1 = true;

		}

		try {
			purchaseController.createPurchaseAndPurchaseLines(acc.Id, '');
		} catch (AuraHandledException e) {
			exceptionThrown2 = true;

		}
		Test.stopTest();

	}
}
