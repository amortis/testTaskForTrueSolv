@isTest
private class managerController_Test {

	@isTest
	static void testIsCurrentUserManager_true() {
		// User with IsManager__c = true
		Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];

		User testUser = new User(
				FirstName = 'Manager',
				LastName = 'User',
				Email = 'manager@example.com',
				Username = 'manageruser' + DateTime.now().getTime() + '@test.com',
				Alias = 'mgr',
				TimeZoneSidKey = 'America/Los_Angeles',
				LocaleSidKey = 'en_US',
				EmailEncodingKey = 'UTF-8',
				LanguageLocaleKey = 'en_US',
				ProfileId = p.Id,
				IsManager__c = true
		);
		insert testUser;

		System.runAs(testUser) {
			Test.startTest();
			Boolean result = managerController.isCurrentUserManager();
			Test.stopTest();

			System.assertEquals(true, result, 'Expected true for manager user');
		}
	}

	@isTest
	static void testIsCurrentUserManager_false() {
		// User with IsManager__c = false
		Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];

		User testUser = new User(
				FirstName = 'NonManager',
				LastName = 'User',
				Email = 'nonmanager@example.com',
				Username = 'nonmanager' + DateTime.now().getTime() + '@test.com',
				Alias = 'nmgr',
				TimeZoneSidKey = 'America/Los_Angeles',
				LocaleSidKey = 'en_US',
				EmailEncodingKey = 'UTF-8',
				LanguageLocaleKey = 'en_US',
				ProfileId = p.Id,
				IsManager__c = false
		);
		insert testUser;

		System.runAs(testUser) {
			Test.startTest();
			Boolean result = managerController.isCurrentUserManager();
			Test.stopTest();

			System.assertEquals(false, result, 'Expected false for non-manager user');
		}
	}

	@isTest
	static void testIsCurrentUserManager_null() {
		// An user without IsManager__c
		Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];

		User testUser = new User(
				FirstName = 'NullManager',
				LastName = 'User',
				Email = 'nullmanager@example.com',
				Username = 'nullmanager' + DateTime.now().getTime() + '@test.com',
				Alias = 'nml',
				TimeZoneSidKey = 'America/Los_Angeles',
				LocaleSidKey = 'en_US',
				EmailEncodingKey = 'UTF-8',
				LanguageLocaleKey = 'en_US',
				ProfileId = p.Id
			// IsManager__c not stated
		);
		insert testUser;

		System.runAs(testUser) {
			Test.startTest();
			Boolean result = managerController.isCurrentUserManager();
			Test.stopTest();

			System.assertEquals(false, result, 'Expected false when IsManager__c is null');
		}
	}
}
