# omsa_api.api.CollectionsApi

## Load the API package
```dart
import 'package:omsa_api/api.dart';
```

All URIs are relative to *https://api.entur.io/sales/v2*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ancillariesCollectionHandler**](CollectionsApi.md#ancillariescollectionhandler) | **GET** /collections/ancillaries/items | List ancillaries for package or leg
[**assetCollectionHandler**](CollectionsApi.md#assetcollectionhandler) | **GET** /collections/assets/items | List assets for package or leg
[**changeOptionHandler**](CollectionsApi.md#changeoptionhandler) | **GET** /collections/change-options/items | List available change options
[**createCustomerHandler**](CollectionsApi.md#createcustomerhandler) | **POST** /collections/customers/items | Create customer record
[**customerCollectionHandler**](CollectionsApi.md#customercollectionhandler) | **GET** /collections/customers/items | List customers with filters
[**deleteCustomerHandler**](CollectionsApi.md#deletecustomerhandler) | **DELETE** /collections/customers/items/{customerId} | Delete customer record
[**getCustomerHandler**](CollectionsApi.md#getcustomerhandler) | **GET** /collections/customers/items/{customerId} | Get customer by ID
[**getDataSources**](CollectionsApi.md#getdatasources) | **GET** /collections/datasources/items | List configured external data sources
[**getPackage**](CollectionsApi.md#getpackage) | **GET** /collections/packages/items/{packageId} | Get package by ID
[**packageCollectionHandler**](CollectionsApi.md#packagecollectionhandler) | **GET** /collections/packages/items | List purchased packages
[**refundOptionHandler**](CollectionsApi.md#refundoptionhandler) | **GET** /collections/refund-options/items | List available refund options
[**traveldocumentsCollectionHandler**](CollectionsApi.md#traveldocumentscollectionhandler) | **GET** /collections/travel-documents/items | List travel documents for package
[**updateCustomerHandler**](CollectionsApi.md#updatecustomerhandler) | **PUT** /collections/customers/items/{customerId} | Replace customer record


# **ancillariesCollectionHandler**
> List<AncillaryCollection> ancillariesCollectionHandler(packageId, legId, acceptLanguage, authorization, limit, offset, eTClientName, xCorrelationId)

List ancillaries for package or leg

Retrieves ancillary products for a package, optionally filtered by leg.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final packageId = packageId_example; // String | the identifier of a package
final legId = legId_example; // String | leg identifier
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final limit = 56; // int | The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
final offset = 56; // int | The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.ancillariesCollectionHandler(packageId, legId, acceptLanguage, authorization, limit, offset, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->ancillariesCollectionHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **packageId** | **String**| the identifier of a package | 
 **legId** | **String**| leg identifier | 
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **limit** | **int**| The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100. | [optional] [default to 100]
 **offset** | **int**| The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0. | [optional] [default to 0]
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**List<AncillaryCollection>**](AncillaryCollection.md)

### Authorization

[OpenData](../README.md#OpenData), [OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assetCollectionHandler**
> Geojson assetCollectionHandler(packageId, legId, acceptLanguage, authorization, limit, offset, bbox, eTClientName, xCorrelationId)

List assets for package or leg

Retrieves asset information for a package, optionally filtered by leg.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final packageId = packageId_example; // String | the identifier of a package
final legId = legId_example; // String | leg identifier
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final limit = 56; // int | The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
final offset = 56; // int | The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
final bbox = []; // List<num> | Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.assetCollectionHandler(packageId, legId, acceptLanguage, authorization, limit, offset, bbox, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->assetCollectionHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **packageId** | **String**| the identifier of a package | 
 **legId** | **String**| leg identifier | 
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **limit** | **int**| The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100. | [optional] [default to 100]
 **offset** | **int**| The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0. | [optional] [default to 0]
 **bbox** | [**List<num>**](num.md)| Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries. | [optional] [default to const []]
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Geojson**](Geojson.md)

### Authorization

[OpenData](../README.md#OpenData), [OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **changeOptionHandler**
> ChangeOptionCollection changeOptionHandler(packageId, acceptLanguage, authorization, enturDistributionChannel, enturPOS, legId, eTClientName, xCorrelationId)

List available change options

Retrieves available change options for a package.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final packageId = packageId_example; // String | the identifier of a package
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final legId = legId_example; // String | leg identifier
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.changeOptionHandler(packageId, acceptLanguage, authorization, enturDistributionChannel, enturPOS, legId, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->changeOptionHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **packageId** | **String**| the identifier of a package | 
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **legId** | **String**| leg identifier | [optional] 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**ChangeOptionCollection**](ChangeOptionCollection.md)

### Authorization

[OpenData](../README.md#OpenData), [OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createCustomerHandler**
> Customer createCustomerHandler(acceptLanguage, authorization, customerInput, eTClientName, xCorrelationId)

Create customer record

Create a customer record that can be used for purchases.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final customerInput = CustomerInput(); // CustomerInput | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.createCustomerHandler(acceptLanguage, authorization, customerInput, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->createCustomerHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **customerInput** | [**CustomerInput**](CustomerInput.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Customer**](Customer.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customerCollectionHandler**
> CustomerCollection customerCollectionHandler(acceptLanguage, authorization, limit, offset, customerId, externalReference, firstName, lastName, email, phoneNumber, eTClientName, xCorrelationId)

List customers with filters

Retrieve customers with optional filters and pagination.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final limit = 56; // int | The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
final offset = 56; // int | The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
final customerId = customerId_example; // String | optional customer identifier filter
final externalReference = externalReference_example; // String | optional filter on the client's own customer reference
final firstName = firstName_example; // String | optional first name filter
final lastName = lastName_example; // String | optional last name filter
final email = email_example; // String | optional email filter
final phoneNumber = +4711111111; // String | optional phone number filter, either in E.164 format (send + URL-encoded as %2B) or the national number without country code
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.customerCollectionHandler(acceptLanguage, authorization, limit, offset, customerId, externalReference, firstName, lastName, email, phoneNumber, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->customerCollectionHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **limit** | **int**| The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100. | [optional] [default to 100]
 **offset** | **int**| The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0. | [optional] [default to 0]
 **customerId** | **String**| optional customer identifier filter | [optional] 
 **externalReference** | **String**| optional filter on the client's own customer reference | [optional] 
 **firstName** | **String**| optional first name filter | [optional] 
 **lastName** | **String**| optional last name filter | [optional] 
 **email** | **String**| optional email filter | [optional] 
 **phoneNumber** | **String**| optional phone number filter, either in E.164 format (send + URL-encoded as %2B) or the national number without country code | [optional] 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**CustomerCollection**](CustomerCollection.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteCustomerHandler**
> deleteCustomerHandler(acceptLanguage, authorization, customerId, eTClientName, xCorrelationId)

Delete customer record

Delete the customer record.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final customerId = customerId_example; // String | customer identifier
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    api_instance.deleteCustomerHandler(acceptLanguage, authorization, customerId, eTClientName, xCorrelationId);
} catch (e) {
    print('Exception when calling CollectionsApi->deleteCustomerHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **customerId** | **String**| customer identifier | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

void (empty response body)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCustomerHandler**
> Customer getCustomerHandler(acceptLanguage, authorization, customerId, eTClientName, xCorrelationId)

Get customer by ID

Retrieves a single customer by identifier.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final customerId = customerId_example; // String | customer identifier
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.getCustomerHandler(acceptLanguage, authorization, customerId, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->getCustomerHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **customerId** | **String**| customer identifier | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Customer**](Customer.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDataSources**
> List<Link> getDataSources(acceptLanguage, authorization, eTClientName, xCorrelationId)

List configured external data sources

Retrieves all datasources

### Example
```dart
import 'package:omsa_api/api.dart';

final api_instance = CollectionsApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.getDataSources(acceptLanguage, authorization, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->getDataSources: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**List<Link>**](Link.md)

### Authorization

[OpenData](../README.md#OpenData)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPackage**
> Package getPackage(acceptLanguage, authorization, packageId, eTClientName, xCorrelationId)

Get package by ID

Retrieves a single package by identifier.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final packageId = packageId_example; // String | The unique identifier of the package to retrieve
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.getPackage(acceptLanguage, authorization, packageId, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->getPackage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **packageId** | **String**| The unique identifier of the package to retrieve | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **packageCollectionHandler**
> PackageCollection packageCollectionHandler(acceptLanguage, authorization, limit, offset, packageId, customerId, contactCustomerId, balance, createdAt, currency, datedServiceJourneyId, distributionChannelId, endTime, externalReference, fromStopPlaceId, lastConfirmedAt, orderBy, legExternalReference, legId, organisationId, originalDatedServiceJourneyId, pos, reservationId, productId, fareProductVersion, serviceJourneyId, sortBy, startTime, toStopPlaceId, totalAmount, totalTaxAmount, version, status, eTClientName, xCorrelationId)

List purchased packages

Returns a paginated list of packages belonging to the authenticated user.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final limit = 56; // int | The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
final offset = 56; // int | The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
final packageId = packageId_example; // String | the identifier of a package (maps to Orders id)
final customerId = customerId_example; // String | optional owner customer identifier filter (maps to Orders createdBy, exact match only)
final contactCustomerId = contactCustomerId_example; // String | optional contact customer identifier filter (maps to Orders contact, exact match only)
final balance = []; // List<String> | optional package balance filter, passed through to Orders balance filter
final createdAt = []; // List<String> | optional package created-at filter, passed through to Orders createdAt filter
final currency = []; // List<String> | optional package currency filter, passed through to Orders currency filter
final datedServiceJourneyId = []; // List<String> | optional package dated service journey ID filter, passed through to Orders datedServiceJourneyId filter
final distributionChannelId = []; // List<String> | optional package distribution channel ID filter, passed through to Orders distributionChannelId filter
final endTime = []; // List<String> | optional package end-time filter, passed through to Orders endTime filter
final externalReference = []; // List<String> | optional package external reference filter, passed through to Orders externalReference filter
final fromStopPlaceId = []; // List<String> | optional package from stop place ID filter, passed through to Orders fromStopPlaceId filter
final lastConfirmedAt = []; // List<String> | optional package last-confirmed-at filter, passed through to Orders lastConfirmedAt filter
final orderBy = orderBy_example; // String | optional package orderBy value, passed through to Orders orderBy
final legExternalReference = []; // List<String> | optional package leg external reference filter, mapped to Orders orderLineExternalReference
final legId = []; // List<String> | optional package leg identifier filter, mapped to Orders orderLineId
final organisationId = []; // List<String> | optional package organisation ID filter, passed through to Orders organisationId filter
final originalDatedServiceJourneyId = []; // List<String> | optional package original dated service journey ID filter, passed through to Orders originalDatedServiceJourneyId filter
final pos = []; // List<String> | optional package POS filter, passed through to Orders pos filter
final reservationId = []; // List<String> | optional package reservation ID filter, passed through to Orders reservationId filter
final productId = []; // List<String> | optional package product ID filter, mapped to Orders fareProductId
final fareProductVersion = []; // List<String> | optional package fare product version filter, passed through to Orders fareProductVersion filter
final serviceJourneyId = []; // List<String> | optional package service journey ID filter, passed through to Orders serviceJourneyId filter
final sortBy = sortBy_example; // String | optional package sort direction (ASC or DESC), passed through to Orders sortBy
final startTime = []; // List<String> | optional package start-time filter, passed through to Orders startTime filter
final toStopPlaceId = []; // List<String> | optional package to stop place ID filter, passed through to Orders toStopPlaceId filter
final totalAmount = []; // List<String> | optional package total amount filter, passed through to Orders totalAmount filter
final totalTaxAmount = []; // List<String> | optional package total tax amount filter, passed through to Orders totalTaxAmount filter
final version = []; // List<String> | optional package version filter, passed through to Orders version filter
final status = ; // PackageStatus | Filter packages by their lifecycle status (e.g. CONFIRMED, CANCELLED)
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.packageCollectionHandler(acceptLanguage, authorization, limit, offset, packageId, customerId, contactCustomerId, balance, createdAt, currency, datedServiceJourneyId, distributionChannelId, endTime, externalReference, fromStopPlaceId, lastConfirmedAt, orderBy, legExternalReference, legId, organisationId, originalDatedServiceJourneyId, pos, reservationId, productId, fareProductVersion, serviceJourneyId, sortBy, startTime, toStopPlaceId, totalAmount, totalTaxAmount, version, status, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->packageCollectionHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **limit** | **int**| The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100. | [optional] [default to 100]
 **offset** | **int**| The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0. | [optional] [default to 0]
 **packageId** | **String**| the identifier of a package (maps to Orders id) | [optional] 
 **customerId** | **String**| optional owner customer identifier filter (maps to Orders createdBy, exact match only) | [optional] 
 **contactCustomerId** | **String**| optional contact customer identifier filter (maps to Orders contact, exact match only) | [optional] 
 **balance** | [**List<String>**](String.md)| optional package balance filter, passed through to Orders balance filter | [optional] [default to const []]
 **createdAt** | [**List<String>**](String.md)| optional package created-at filter, passed through to Orders createdAt filter | [optional] [default to const []]
 **currency** | [**List<String>**](String.md)| optional package currency filter, passed through to Orders currency filter | [optional] [default to const []]
 **datedServiceJourneyId** | [**List<String>**](String.md)| optional package dated service journey ID filter, passed through to Orders datedServiceJourneyId filter | [optional] [default to const []]
 **distributionChannelId** | [**List<String>**](String.md)| optional package distribution channel ID filter, passed through to Orders distributionChannelId filter | [optional] [default to const []]
 **endTime** | [**List<String>**](String.md)| optional package end-time filter, passed through to Orders endTime filter | [optional] [default to const []]
 **externalReference** | [**List<String>**](String.md)| optional package external reference filter, passed through to Orders externalReference filter | [optional] [default to const []]
 **fromStopPlaceId** | [**List<String>**](String.md)| optional package from stop place ID filter, passed through to Orders fromStopPlaceId filter | [optional] [default to const []]
 **lastConfirmedAt** | [**List<String>**](String.md)| optional package last-confirmed-at filter, passed through to Orders lastConfirmedAt filter | [optional] [default to const []]
 **orderBy** | **String**| optional package orderBy value, passed through to Orders orderBy | [optional] 
 **legExternalReference** | [**List<String>**](String.md)| optional package leg external reference filter, mapped to Orders orderLineExternalReference | [optional] [default to const []]
 **legId** | [**List<String>**](String.md)| optional package leg identifier filter, mapped to Orders orderLineId | [optional] [default to const []]
 **organisationId** | [**List<String>**](String.md)| optional package organisation ID filter, passed through to Orders organisationId filter | [optional] [default to const []]
 **originalDatedServiceJourneyId** | [**List<String>**](String.md)| optional package original dated service journey ID filter, passed through to Orders originalDatedServiceJourneyId filter | [optional] [default to const []]
 **pos** | [**List<String>**](String.md)| optional package POS filter, passed through to Orders pos filter | [optional] [default to const []]
 **reservationId** | [**List<String>**](String.md)| optional package reservation ID filter, passed through to Orders reservationId filter | [optional] [default to const []]
 **productId** | [**List<String>**](String.md)| optional package product ID filter, mapped to Orders fareProductId | [optional] [default to const []]
 **fareProductVersion** | [**List<String>**](String.md)| optional package fare product version filter, passed through to Orders fareProductVersion filter | [optional] [default to const []]
 **serviceJourneyId** | [**List<String>**](String.md)| optional package service journey ID filter, passed through to Orders serviceJourneyId filter | [optional] [default to const []]
 **sortBy** | **String**| optional package sort direction (ASC or DESC), passed through to Orders sortBy | [optional] 
 **startTime** | [**List<String>**](String.md)| optional package start-time filter, passed through to Orders startTime filter | [optional] [default to const []]
 **toStopPlaceId** | [**List<String>**](String.md)| optional package to stop place ID filter, passed through to Orders toStopPlaceId filter | [optional] [default to const []]
 **totalAmount** | [**List<String>**](String.md)| optional package total amount filter, passed through to Orders totalAmount filter | [optional] [default to const []]
 **totalTaxAmount** | [**List<String>**](String.md)| optional package total tax amount filter, passed through to Orders totalTaxAmount filter | [optional] [default to const []]
 **version** | [**List<String>**](String.md)| optional package version filter, passed through to Orders version filter | [optional] [default to const []]
 **status** | [**PackageStatus**](.md)| Filter packages by their lifecycle status (e.g. CONFIRMED, CANCELLED) | [optional] 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**PackageCollection**](PackageCollection.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refundOptionHandler**
> RefundOptionCollection refundOptionHandler(packageId, acceptLanguage, authorization, enturDistributionChannel, legId, travellerId, ancillaryId, eTClientName, xCorrelationId)

List available refund options

Retrieves available refund options for a package.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final packageId = packageId_example; // String | the identifier of a package
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final legId = legId_example; // String | leg identifier
final travellerId = travellerId_example; // String | traveller identifier
final ancillaryId = ancillaryId_example; // String | ancillary identifier
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.refundOptionHandler(packageId, acceptLanguage, authorization, enturDistributionChannel, legId, travellerId, ancillaryId, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->refundOptionHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **packageId** | **String**| the identifier of a package | 
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **legId** | **String**| leg identifier | [optional] 
 **travellerId** | **String**| traveller identifier | [optional] 
 **ancillaryId** | **String**| ancillary identifier | [optional] 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**RefundOptionCollection**](RefundOptionCollection.md)

### Authorization

[OpenData](../README.md#OpenData), [OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **traveldocumentsCollectionHandler**
> TravelDocumentCollection traveldocumentsCollectionHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, packageId, legId, status, eTClientName, xCorrelationId)

List travel documents for package

Retrieves travel documents for a package with optional status filtering.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final packageId = packageId_example; // String | the identifier of a package
final legId = legId_example; // String | leg identifier
final status = ; // TravelDocumentStatus | Filter travel documents by status
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.traveldocumentsCollectionHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, packageId, legId, status, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->traveldocumentsCollectionHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **packageId** | **String**| the identifier of a package | 
 **legId** | **String**| leg identifier | [optional] 
 **status** | [**TravelDocumentStatus**](.md)| Filter travel documents by status | [optional] 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**TravelDocumentCollection**](TravelDocumentCollection.md)

### Authorization

[OpenData](../README.md#OpenData), [OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCustomerHandler**
> Customer updateCustomerHandler(acceptLanguage, authorization, customerId, customerInput, eTClientName, xCorrelationId)

Replace customer record

Replace the customer record.

### Example
```dart
import 'package:omsa_api/api.dart';
// TODO Configure OAuth2 access token for authorization: OAuthPKI
//defaultApiClient.getAuthentication<OAuth>('OAuthPKI').accessToken = 'YOUR_ACCESS_TOKEN';
// TODO Configure HTTP Bearer authorization: BearerAuth
// Case 1. Use String Token
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken('YOUR_ACCESS_TOKEN');
// Case 2. Use Function which generate token.
// String yourTokenGeneratorFunction() { ... }
//defaultApiClient.getAuthentication<HttpBearerAuth>('BearerAuth').setAccessToken(yourTokenGeneratorFunction);
// TODO Configure OAuth2 access token for authorization: OAuth
//defaultApiClient.getAuthentication<OAuth>('OAuth').accessToken = 'YOUR_ACCESS_TOKEN';

final api_instance = CollectionsApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final customerId = customerId_example; // String | customer identifier
final customerInput = CustomerInput(); // CustomerInput | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.updateCustomerHandler(acceptLanguage, authorization, customerId, customerInput, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling CollectionsApi->updateCustomerHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **customerId** | **String**| customer identifier | 
 **customerInput** | [**CustomerInput**](CustomerInput.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Customer**](Customer.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

