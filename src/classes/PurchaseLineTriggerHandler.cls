public with sharing class PurchaseLineTriggerHandler {

	public static void recalculatePurchaseTotals(Set<Id> purchaseIds) {
		if (purchaseIds == null || purchaseIds.isEmpty()) return;

		//  init
		Map<Id, Decimal> totalItemsMap = new Map<Id, Decimal>();
		Map<Id, Decimal> grandTotalMap = new Map<Id, Decimal>();
		for (Id pid : purchaseIds) {
			totalItemsMap.put(pid, 0.00);
			grandTotalMap.put(pid, 0.00);
		}

		//  getting lines
		for (
				PurchaseLine__c line
				:
		[
				SELECT Id, PurchaseId__c, Amount__c, UnitCost__c
				FROM PurchaseLine__c
				WHERE PurchaseId__c IN :purchaseIds
		]) {
			Id purchaseId = line.PurchaseId__c;

			// amount
			totalItemsMap.put(purchaseId,
							totalItemsMap.get(purchaseId) + line.Amount__c
			);

			// (Amount * UnitCost)
			grandTotalMap.put(purchaseId,
							grandTotalMap.get(purchaseId) + (line.Amount__c * line.UnitCost__c)
			);
		}

		// prepare lines
		List<Purchase__c> toUpdate = new List<Purchase__c>();
		for (Id pid : purchaseIds) {
			toUpdate.add(new Purchase__c(
					Id = pid,
					TotalItems__c = totalItemsMap.get(pid),
					GrandTotal__c = grandTotalMap.get(pid)
			));
		}

		//  update
		if (!toUpdate.isEmpty()) {
			try {
				update toUpdate;
			} catch (DmlException e) {
				System.debug('Ошибка обновления: ' + e.getMessage());
			}
		}
	}
}

