@isTest(seeAllData=true)
public class unsplashService_Test {

	// Вложенный мок-класс
	private class UnsplashMock implements HttpCalloutMock {
		public HTTPResponse respond(HTTPRequest req) {
			HttpResponse res = new HttpResponse();
			res.setHeader('Content-Type', 'application/json');
			res.setBody('{"results":[{"urls":{"regular":"https://test.com/image.jpg"}}]}');
			res.setStatusCode(200);
			return res;
		}
	}

	@isTest
	public static void searchUnsplashImage_Unit(){
		Test.startTest();
			Test.setMock(HttpCalloutMock.class, new UnsplashMock());
			String imageUrl = unsplashService.searchUnsplashImage('apple');
			System.assertEquals('https://test.com/image.jpg', imageUrl);
		Test.stopTest();
	}
}