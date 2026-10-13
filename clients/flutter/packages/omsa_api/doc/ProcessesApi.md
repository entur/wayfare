# omsa_api.api.ProcessesApi

## Load the API package
```dart
import 'package:omsa_api/api.dart';
```

All URIs are relative to *https://api.entur.io/sales/v2*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addTravellerHandler**](ProcessesApi.md#addtravellerhandler) | **POST** /processes/add-traveller/execute | Add traveller to package
[**assignAncillaryProcessHandler**](ProcessesApi.md#assignancillaryprocesshandler) | **POST** /processes/assign-ancillary/execute | Assign ancillary products to package
[**assignAssetHandler**](ProcessesApi.md#assignassethandler) | **POST** /processes/assign-asset/execute | Assign asset to package leg
[**cancelPackageProcessHandler**](ProcessesApi.md#cancelpackageprocesshandler) | **POST** /processes/cancel-package/execute | Cancel package
[**claimRefundProcessHandler**](ProcessesApi.md#claimrefundprocesshandler) | **POST** /processes/claim-refund-option/execute | Claim refund option for package
[**confirmPackageProcessHandler**](ProcessesApi.md#confirmpackageprocesshandler) | **POST** /processes/confirm-package/execute | Confirm package before purchase
[**confirmRefundClaimProcessHandler**](ProcessesApi.md#confirmrefundclaimprocesshandler) | **POST** /processes/confirm-refund-option/execute | Confirm claimed refund option
[**extendExpiryTimeProcessHandler**](ProcessesApi.md#extendexpirytimeprocesshandler) | **POST** /processes/extend-expiry-time/execute | Extend package reservation expiry
[**purchaseOffersProcessHandler**](ProcessesApi.md#purchaseoffersprocesshandler) | **POST** /processes/purchase-offers/execute | Purchase selected offers directly
[**purchasePackageProcessHandler**](ProcessesApi.md#purchasepackageprocesshandler) | **POST** /processes/purchase-package/execute | Purchase existing package
[**releasePackageProcessHandler**](ProcessesApi.md#releasepackageprocesshandler) | **POST** /processes/release-package/execute | Release package reservation
[**removeTravellerHandler**](ProcessesApi.md#removetravellerhandler) | **POST** /processes/remove-traveller/execute | Remove traveller from package
[**searchOfferHandler**](ProcessesApi.md#searchofferhandler) | **POST** /processes/search-offers/execute | Search available travel offers
[**selectOffersHandler**](ProcessesApi.md#selectoffershandler) | **POST** /processes/select-offers/execute | Create draft package from selected offers
[**updateTravelDocumentValidityProcessHandler**](ProcessesApi.md#updatetraveldocumentvalidityprocesshandler) | **POST** /processes/update-travel-document-validity/execute | Update travel document validity start
[**updateTravellerHandler**](ProcessesApi.md#updatetravellerhandler) | **POST** /processes/update-traveller/execute | Update traveller in package


# **addTravellerHandler**
> Package addTravellerHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, addTravellerHandlerRequest, eTClientName, xCorrelationId)

Add traveller to package

Adds a traveller to an existing package.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final addTravellerHandlerRequest = AddTravellerHandlerRequest(); // AddTravellerHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.addTravellerHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, addTravellerHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->addTravellerHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **addTravellerHandlerRequest** | [**AddTravellerHandlerRequest**](AddTravellerHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assignAncillaryProcessHandler**
> Package assignAncillaryProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, assignAncillaryProcessHandlerRequest, eTClientName, xCorrelationId)

Assign ancillary products to package

Assigns ancillary products to a package or a package leg.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final assignAncillaryProcessHandlerRequest = AssignAncillaryProcessHandlerRequest(); // AssignAncillaryProcessHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.assignAncillaryProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, assignAncillaryProcessHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->assignAncillaryProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **assignAncillaryProcessHandlerRequest** | [**AssignAncillaryProcessHandlerRequest**](AssignAncillaryProcessHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assignAssetHandler**
> Package assignAssetHandler(acceptLanguage, authorization, assignAssetHandlerRequest, eTClientName, xCorrelationId)

Assign asset to package leg

Assigns an asset to a specific package leg.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final assignAssetHandlerRequest = AssignAssetHandlerRequest(); // AssignAssetHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.assignAssetHandler(acceptLanguage, authorization, assignAssetHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->assignAssetHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **assignAssetHandlerRequest** | [**AssignAssetHandlerRequest**](AssignAssetHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cancelPackageProcessHandler**
> Package cancelPackageProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, purchasePackageProcessHandlerRequest, eTClientName, xCorrelationId)

Cancel package

Cancels an existing purchased or reserved package.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final purchasePackageProcessHandlerRequest = PurchasePackageProcessHandlerRequest(); // PurchasePackageProcessHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.cancelPackageProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, purchasePackageProcessHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->cancelPackageProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **purchasePackageProcessHandlerRequest** | [**PurchasePackageProcessHandlerRequest**](PurchasePackageProcessHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **claimRefundProcessHandler**
> Package claimRefundProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, claimRefundProcessHandlerRequest, eTClientName, xCorrelationId)

Claim refund option for package

Claims a refund option for the selected package content.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final claimRefundProcessHandlerRequest = ClaimRefundProcessHandlerRequest(); // ClaimRefundProcessHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.claimRefundProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, claimRefundProcessHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->claimRefundProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **claimRefundProcessHandlerRequest** | [**ClaimRefundProcessHandlerRequest**](ClaimRefundProcessHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **confirmPackageProcessHandler**
> Package confirmPackageProcessHandler(acceptLanguage, authorization, enturPOS, purchasePackageProcessHandlerRequest, limit, offset, bbox, eTClientName, xCorrelationId)

Confirm package before purchase

Confirms a package before final purchase.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final purchasePackageProcessHandlerRequest = PurchasePackageProcessHandlerRequest(); // PurchasePackageProcessHandlerRequest | 
final limit = 56; // int | The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
final offset = 56; // int | The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
final bbox = []; // List<num> | Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.confirmPackageProcessHandler(acceptLanguage, authorization, enturPOS, purchasePackageProcessHandlerRequest, limit, offset, bbox, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->confirmPackageProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **purchasePackageProcessHandlerRequest** | [**PurchasePackageProcessHandlerRequest**](PurchasePackageProcessHandlerRequest.md)|  | 
 **limit** | **int**| The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100. | [optional] [default to 100]
 **offset** | **int**| The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0. | [optional] [default to 0]
 **bbox** | [**List<num>**](num.md)| Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries. | [optional] [default to const []]
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **confirmRefundClaimProcessHandler**
> Package confirmRefundClaimProcessHandler(acceptLanguage, authorization, claimRefundProcessHandlerRequest, eTClientName, xCorrelationId)

Confirm claimed refund option

Confirms a previously claimed refund option.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final claimRefundProcessHandlerRequest = ClaimRefundProcessHandlerRequest(); // ClaimRefundProcessHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.confirmRefundClaimProcessHandler(acceptLanguage, authorization, claimRefundProcessHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->confirmRefundClaimProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **claimRefundProcessHandlerRequest** | [**ClaimRefundProcessHandlerRequest**](ClaimRefundProcessHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **extendExpiryTimeProcessHandler**
> Package extendExpiryTimeProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, extendExpiryTimeProcessHandlerRequest, eTClientName, xCorrelationId)

Extend package reservation expiry

Extends the expiry time for a reserved package.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final extendExpiryTimeProcessHandlerRequest = ExtendExpiryTimeProcessHandlerRequest(); // ExtendExpiryTimeProcessHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.extendExpiryTimeProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, extendExpiryTimeProcessHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->extendExpiryTimeProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **extendExpiryTimeProcessHandlerRequest** | [**ExtendExpiryTimeProcessHandlerRequest**](ExtendExpiryTimeProcessHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **purchaseOffersProcessHandler**
> Package purchaseOffersProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, purchaseOffersProcessHandlerRequest, eTClientName, xCorrelationId)

Purchase selected offers directly

Purchases selected offers directly and returns the resulting package.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final purchaseOffersProcessHandlerRequest = PurchaseOffersProcessHandlerRequest(); // PurchaseOffersProcessHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.purchaseOffersProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, purchaseOffersProcessHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->purchaseOffersProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **purchaseOffersProcessHandlerRequest** | [**PurchaseOffersProcessHandlerRequest**](PurchaseOffersProcessHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **purchasePackageProcessHandler**
> Package purchasePackageProcessHandler(acceptLanguage, authorization, purchasePackageProcessHandlerRequest, eTClientName, xCorrelationId)

Purchase existing package

Purchases a previously created package.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final purchasePackageProcessHandlerRequest = PurchasePackageProcessHandlerRequest(); // PurchasePackageProcessHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.purchasePackageProcessHandler(acceptLanguage, authorization, purchasePackageProcessHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->purchasePackageProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **purchasePackageProcessHandlerRequest** | [**PurchasePackageProcessHandlerRequest**](PurchasePackageProcessHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **releasePackageProcessHandler**
> Package releasePackageProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, purchasePackageProcessHandlerRequest, limit, offset, bbox, eTClientName, xCorrelationId)

Release package reservation

Releases a package reservation.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final purchasePackageProcessHandlerRequest = PurchasePackageProcessHandlerRequest(); // PurchasePackageProcessHandlerRequest | 
final limit = 56; // int | The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
final offset = 56; // int | The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
final bbox = []; // List<num> | Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.releasePackageProcessHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, purchasePackageProcessHandlerRequest, limit, offset, bbox, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->releasePackageProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **purchasePackageProcessHandlerRequest** | [**PurchasePackageProcessHandlerRequest**](PurchasePackageProcessHandlerRequest.md)|  | 
 **limit** | **int**| The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100. | [optional] [default to 100]
 **offset** | **int**| The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0. | [optional] [default to 0]
 **bbox** | [**List<num>**](num.md)| Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries. | [optional] [default to const []]
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeTravellerHandler**
> Package removeTravellerHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, removeTravellerHandlerRequest, eTClientName, xCorrelationId)

Remove traveller from package

Removes a traveller from an existing package.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final removeTravellerHandlerRequest = RemoveTravellerHandlerRequest(); // RemoveTravellerHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.removeTravellerHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, removeTravellerHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->removeTravellerHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **removeTravellerHandlerRequest** | [**RemoveTravellerHandlerRequest**](RemoveTravellerHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchOfferHandler**
> OfferCollection searchOfferHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, searchOfferHandlerRequest, limit, offset, bbox, eTClientName, xCorrelationId)

Search available travel offers

Searches for available offers based on travel and traveller criteria.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final searchOfferHandlerRequest = SearchOfferHandlerRequest(); // SearchOfferHandlerRequest | 
final limit = 56; // int | The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
final offset = 56; // int | The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
final bbox = []; // List<num> | Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.searchOfferHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, searchOfferHandlerRequest, limit, offset, bbox, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->searchOfferHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **searchOfferHandlerRequest** | [**SearchOfferHandlerRequest**](SearchOfferHandlerRequest.md)|  | 
 **limit** | **int**| The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100. | [optional] [default to 100]
 **offset** | **int**| The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0. | [optional] [default to 0]
 **bbox** | [**List<num>**](num.md)| Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries. | [optional] [default to const []]
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**OfferCollection**](OfferCollection.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **selectOffersHandler**
> Package selectOffersHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, selectOffersHandlerRequest, eTClientName, xCorrelationId)

Create draft package from selected offers

Creates or updates a draft package from selected offer identifiers.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final selectOffersHandlerRequest = SelectOffersHandlerRequest(); // SelectOffersHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.selectOffersHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, selectOffersHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->selectOffersHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **selectOffersHandlerRequest** | [**SelectOffersHandlerRequest**](SelectOffersHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTravelDocumentValidityProcessHandler**
> UpdateTravelDocumentValidityResponse updateTravelDocumentValidityProcessHandler(acceptLanguage, authorization, enturDistributionChannel, updateTravelDocumentValidityProcessHandlerRequest, eTClientName, xCorrelationId)

Update travel document validity start

Updates the validity start time for a travel document in a package.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final updateTravelDocumentValidityProcessHandlerRequest = UpdateTravelDocumentValidityProcessHandlerRequest(); // UpdateTravelDocumentValidityProcessHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.updateTravelDocumentValidityProcessHandler(acceptLanguage, authorization, enturDistributionChannel, updateTravelDocumentValidityProcessHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->updateTravelDocumentValidityProcessHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **updateTravelDocumentValidityProcessHandlerRequest** | [**UpdateTravelDocumentValidityProcessHandlerRequest**](UpdateTravelDocumentValidityProcessHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**UpdateTravelDocumentValidityResponse**](UpdateTravelDocumentValidityResponse.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTravellerHandler**
> Package updateTravellerHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, updateTravellerHandlerRequest, eTClientName, xCorrelationId)

Update traveller in package

Updates traveller details in an existing package.

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

final api_instance = ProcessesApi();
final acceptLanguage = acceptLanguage_example; // String | 
final authorization = authorization_example; // String | Header field, JWT must be supplied
final enturDistributionChannel = enturDistributionChannel_example; // String | Distribution channel identifier used by downstream sales and ticket distribution services.
final enturPOS = enturPOS_example; // String | Point-of-sale identifier used by downstream sales and ticket distribution services.
final updateTravellerHandlerRequest = UpdateTravellerHandlerRequest(); // UpdateTravellerHandlerRequest | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.updateTravellerHandler(acceptLanguage, authorization, enturDistributionChannel, enturPOS, updateTravellerHandlerRequest, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling ProcessesApi->updateTravellerHandler: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **authorization** | **String**| Header field, JWT must be supplied | 
 **enturDistributionChannel** | **String**| Distribution channel identifier used by downstream sales and ticket distribution services. | 
 **enturPOS** | **String**| Point-of-sale identifier used by downstream sales and ticket distribution services. | 
 **updateTravellerHandlerRequest** | [**UpdateTravellerHandlerRequest**](UpdateTravellerHandlerRequest.md)|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Package**](Package.md)

### Authorization

[OAuthPKI](../README.md#OAuthPKI), [BearerAuth](../README.md#BearerAuth), [OAuth](../README.md#OAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

