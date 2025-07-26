trigger PurchaseLineTrigger on PurchaseLine__c (after insert, after update, after delete, after undelete) {
	// Set to store unique Purchase__c IDs that need recalculation
	Set<Id> purchaseIdsToRecalculate = new Set<Id>();

	// Collect Purchase__c IDs from the trigger context
	// For After Insert, Update, Undelete: Use Trigger.new
	if (Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate || Trigger.isUndelete)) {
		for (PurchaseLine__c pli : Trigger.new) {
			if (pli.PurchaseId__c != null) {
				purchaseIdsToRecalculate.add(pli.PurchaseId__c);
			}
		}
	}
	// For After Delete: Use Trigger.old
	if (Trigger.isAfter && (Trigger.isDelete || Trigger.isUpdate)) { // For updates, old values might point to different PurchaseId or affect existing one
		for (PurchaseLine__c pli : Trigger.old) {
			if (pli.PurchaseId__c != null) {
				purchaseIdsToRecalculate.add(pli.PurchaseId__c);
			}
		}
	}

	// Call the helper method to perform recalculation and update the associated Purchase__c records
	if (!purchaseIdsToRecalculate.isEmpty()) {
		PurchaseLineTriggerHandler.recalculatePurchaseTotals(purchaseIdsToRecalculate);
	}
}