@isTest
private class purchaseLineTrigger_Test {

	@isTest
	static void testTriggerRecalculation_onInsertUpdateDelete() {
		// Step 1: Setup Account
		Account acc = new Account(Name = 'Trigger Test Account');
		insert acc;

		// Step 2: Setup Purchase
		Purchase__c purchase = new Purchase__c(
				Name = 'Trigger Test Purchase',
				ClientId__c = acc.Id
		);
		insert purchase;

		// Step 3: Setup Item
		Item__c item = new Item__c(
				Name = 'Trigger Test Item',
				Price__c = 25.00
		);
		insert item;

		// Step 4: INSERT PurchaseLine__c (Triggers INSERT)
		PurchaseLine__c line = new PurchaseLine__c(
				PurchaseId__c = purchase.Id,
				ItemId__c = item.Id,
				Amount__c = 2,
				UnitCost__c = 25.00
		);
		insert line;

		// Verify recalculated totals
		Purchase__c updatedPurchase = [
				SELECT TotalItems__c, GrandTotal__c FROM Purchase__c WHERE Id = :purchase.Id
		];
		System.assertEquals(2, updatedPurchase.TotalItems__c, 'Insert: total items should be 2');
		System.assertEquals(50.00, updatedPurchase.GrandTotal__c, 'Insert: total price should be 50');

		// Step 5: UPDATE line (Triggers UPDATE)
		line.Amount__c = 4;
		update line;

		updatedPurchase = [
				SELECT TotalItems__c, GrandTotal__c FROM Purchase__c WHERE Id = :purchase.Id
		];
		System.assertEquals(4, updatedPurchase.TotalItems__c, 'Update: total items should be 4');
		System.assertEquals(100.00, updatedPurchase.GrandTotal__c, 'Update: total price should be 100');

		// Step 6: DELETE line (Triggers DELETE)
		delete line;

		updatedPurchase = [
				SELECT TotalItems__c, GrandTotal__c FROM Purchase__c WHERE Id = :purchase.Id
		];
		System.assertEquals(0, updatedPurchase.TotalItems__c, 'Delete: total items should be 0');
		System.assertEquals(0, updatedPurchase.GrandTotal__c, 'Delete: total price should be 0');
	}
}
