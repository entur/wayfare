# omsa_api.api.AuthenticationApi

## Load the API package
```dart
import 'package:omsa_api/api.dart';
```

All URIs are relative to *https://api.entur.io/sales/v2*

Method | HTTP request | Description
------------- | ------------- | -------------
[**oauthTokenPost**](AuthenticationApi.md#oauthtokenpost) | **POST** /oauth/token | Issue OAuth access token


# **oauthTokenPost**
> OauthTokenPost200Response oauthTokenPost(grantType, eTClientName, xCorrelationId, username, password, clientId, clientSecret)

Issue OAuth access token

This endpoint is used to obtain an access token and optionally an ID token through different OAuth 2.0 grant types, including Client Credentials Flow. Whenever the mTLS flow is taken, the properties will be ignored, and the access token will be generated based on the credentials in the certificate (O or CN).

### Example
```dart
import 'package:omsa_api/api.dart';

final api_instance = AuthenticationApi();
final grantType = grantType_example; // String | The grant type: 'client_credentials', 'password', or 'refresh_token'.
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id
final username = username_example; // String | The username
final password = password_example; // String | The password
final clientId = clientId_example; // String | The client ID (Client Credentials Flow)
final clientSecret = clientSecret_example; // String | The client secret (Client Credentials Flow)

try {
    final result = api_instance.oauthTokenPost(grantType, eTClientName, xCorrelationId, username, password, clientId, clientSecret);
    print(result);
} catch (e) {
    print('Exception when calling AuthenticationApi->oauthTokenPost: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **grantType** | **String**| The grant type: 'client_credentials', 'password', or 'refresh_token'. | [default to 'client_credentials']
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 
 **username** | **String**| The username | [optional] 
 **password** | **String**| The password | [optional] 
 **clientId** | **String**| The client ID (Client Credentials Flow) | [optional] 
 **clientSecret** | **String**| The client secret (Client Credentials Flow) | [optional] 

### Return type

[**OauthTokenPost200Response**](OauthTokenPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/x-www-form-urlencoded
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

