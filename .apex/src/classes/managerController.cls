public class managerController {

	/**
     * Check if the current user is a manager
     * @return Boolean indicating if current user has IsManager__c = true
     */
	@AuraEnabled
	public static Boolean isCurrentUserManager() {
		try {
			Id currentUserId = UserInfo.getUserId();

			User currentUser = [
					SELECT Id, IsManager__c
					FROM User
					WHERE Id = :currentUserId
					WITH SECURITY_ENFORCED
					LIMIT 1
			];

			return currentUser.IsManager__c != null ? currentUser.IsManager__c : false;

		} catch (QueryException e) {
			System.debug('Error querying user: ' + e.getMessage());
			return false;
		} catch (Exception e) {
			System.debug('Error checking manager status: ' + e.getMessage());
			return false;
		}
	}
}