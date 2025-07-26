public class purchaseController {

	@AuraEnabled
	public static Id createPurchaseAndPurchaseLines(Id accountId, String cartItemsJson) {
		if (accountId == null || String.isBlank(cartItemsJson)) {
			throw new AuraHandledException('Account ID and cart items are required.' + String.isBlank(cartItemsJson));
		}

		List<Object> rawItems = (List<Object>) JSON.deserializeUntyped(cartItemsJson);

		List<PurchaseLine__c> purchaseLinesToInsert = new List<PurchaseLine__c>();
		for (Object obj : rawItems) {
			Map<String, Object> itemMap = (Map<String, Object>) obj;
			String itemId = (String) itemMap.get('itemId');
			Integer amount = (Integer) itemMap.get('amount');
			Decimal unitCost = (Decimal) itemMap.get('unitCost');

			purchaseLinesToInsert.add(new PurchaseLine__c(
					ItemId__c = Id.valueOf(itemId),
					Amount__c = amount,
					UnitCost__c = unitCost
			));
		}

		Account account = [SELECT Id, Name FROM Account WHERE Id = :accountId LIMIT 1];

		Purchase__c newPurchase = new Purchase__c(
				Name = 'Purchase - ' + account.Name + ' - ' + DateTime.now().format('MM/dd/yyyy HH:mm'),
				ClientId__c = account.Id
		);

		insert newPurchase;

		for (PurchaseLine__c line : purchaseLinesToInsert) {
			line.PurchaseId__c = newPurchase.Id;
		}

		insert purchaseLinesToInsert;

		return newPurchase.Id;
	}

}