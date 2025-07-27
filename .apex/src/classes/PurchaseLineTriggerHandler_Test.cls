@isTest
private class PurchaseLineTriggerHandler_Test {

	@isTest
	static void testRecalculatePurchaseTotals() {
		// create Account
		Account acc = new Account(Name = 'Test Account');
		insert acc;

		// create Purchase
		Purchase__c purchase = new Purchase__c(
				Name = 'Test Purchase',
				ClientId__c = acc.Id
		);
		insert purchase;

		// create test Item
		Item__c item = new Item__c(
				Name = 'Test Item',
				Price__c = 50.00
		);
		insert item;

		// create Purchase Lines with valid ItemId__c
		PurchaseLine__c line1 = new PurchaseLine__c(
				PurchaseId__c = purchase.Id,
				Amount__c = 2,
				UnitCost__c = 50.00,
				ItemId__c = item.Id
		);
		PurchaseLine__c line2 = new PurchaseLine__c(
				PurchaseId__c = purchase.Id,
				Amount__c = 3,
				UnitCost__c = 40.00,
				ItemId__c = item.Id
		);
		insert new List<PurchaseLine__c>{ line1, line2 };

		// call handler
		Test.startTest();
		PurchaseLineTriggerHandler.recalculatePurchaseTotals(new Set<Id>{purchase.Id});
		Test.stopTest();

		// assert expected totals
		Purchase__c updatedPurchase = [
				SELECT Id, TotalItems__c, GrandTotal__c
				FROM Purchase__c
				WHERE Id = :purchase.Id
		];

		System.assertEquals(5, updatedPurchase.TotalItems__c, 'TotalItems__c should equal sum of Amounts');
		System.assertEquals(2 * 50 + 3 * 40, updatedPurchase.GrandTotal__c, 'GrandTotal__c should equal sum of (Amount * UnitCost)');
	}


	@isTest
	static void testRecalculatePurchaseTotals_emptySet() {
		// Just verify that method runs without error if called with an empty set
		Test.startTest();
		PurchaseLineTriggerHandler.recalculatePurchaseTotals(new Set<Id>());
		Test.stopTest();
		System.assert(true, 'Method should complete without throwing');
	}

	@isTest
	static void testRecalculatePurchaseTotals_nullSet() {
		// Just verify that method runs without error if called with null
		Test.startTest();
		PurchaseLineTriggerHandler.recalculatePurchaseTotals(null);
		Test.stopTest();
		System.assert(true, 'Method should complete without throwing');
	}
}
