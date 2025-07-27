@isTest
public class accountController_Test {

	@isTest
	static void testGetAccountData_success() {
		// Arrange: creating test Account
		Account testAccount = new Account(
				Name = 'Test Corp',
				AccountNumber = '12345',
				Industry = 'Technology'
		);
		insert testAccount;

		Test.startTest();
		// Act: call the controller
		Account result = accountController.getAccountData(testAccount.Id);
		Test.stopTest();

		// Assert: check, if data is correct
		System.assertNotEquals(null, result);
		System.assertEquals('Test Corp', result.Name);
		System.assertEquals('12345', result.AccountNumber);
		System.assertEquals('Technology', result.Industry);
	}

	@isTest
	static void testGetAccountData_nullId() {
		Boolean exceptionThrown = false;

		try {
			accountController.getAccountData(null);
		} catch (Exception e) {
			exceptionThrown = true;
		}


	}

	@isTest
	static void testGetAccountData_invalidId() {
		Boolean exceptionThrown = false;

		try {
			accountController.getAccountData('001000000000000');
		} catch (Exception e) {
			exceptionThrown = true;
		}


	}


}