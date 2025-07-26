public class unsplashService {


	private static final String UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos';

	@AuraEnabled
	public static String searchUnsplashImage(String query) {

		External_API_Settings__mdt UNSPLASH_ACCESS_KEY =
			[SELECT Unsplash_Access_Key__c
			FROM External_API_Settings__mdt
			WHERE DeveloperName = 'Unsplash_Access_Key' LIMIT 1];

		String imageUrl = null;
		String encodedQuery = EncodingUtil.urlEncode(query, 'UTF-8');
		HttpRequest request = new HttpRequest();
		request.setEndpoint(UNSPLASH_SEARCH_URL + '?query=' + encodedQuery + '&per_page=1&client_id=' +
				UNSPLASH_ACCESS_KEY.Unsplash_Access_Key__c);
		request.setMethod('GET');

		Http http = new Http();
		HttpResponse response = null;

		try {
			response = http.send(request);
			if (response.getStatusCode() == 200) {
				// JSON
				Map<String, Object> results = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
				List<Object> photos = (List<Object>)results.get('results');

				if (photos != null && !photos.isEmpty()) {
					Map<String, Object> firstPhoto = (Map<String, Object>)photos[0];
					Map<String, Object> urls = (Map<String, Object>)firstPhoto.get('urls');
					imageUrl = (String)urls.get('small'); // size of image
				}
			} else {
				System.debug('Unsplash API Error: ' + response.getStatusCode() + ' - ' + response.getStatus());

				throw new AuraHandledException('Failed to search image on Unsplash: ' + response.getStatus());
			}
		} catch (Exception e) {
			System.debug('Unsplash API Exception: ' + e.getMessage());
			throw new AuraHandledException('An unexpected error occurred during Unsplash search: ' + e.getMessage());
		}

		return imageUrl;
	}


    public static void testRealUnsplashCall(String query) {
        String url = searchUnsplashImage(query);
        System.debug('Unsplash image url: ' + url);
    }


}