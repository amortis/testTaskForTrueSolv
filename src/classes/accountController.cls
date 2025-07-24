public class accountController {

	@AuraEnabled
	public static Account getAccountData(Id accountId){
		try {
			if (accountId == null) {
				throw new AuraHandledException('Account ID is required');
			}

			Account account = [
					SELECT Id, Name, AccountNumber, Industry
					FROM Account
					WHERE Id = :accountId
					WITH SECURITY_ENFORCED
					LIMIT 1
			];

			return account;

		} catch (QueryException e) {
			throw new AuraHandledException('Account not found: ' + e.getMessage());
		} catch (Exception e) {
			throw new AuraHandledException('Error retrieving account details: ' + e.getMessage());
		}
	}
}