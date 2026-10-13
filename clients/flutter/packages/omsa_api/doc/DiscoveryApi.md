# omsa_api.api.DiscoveryApi

## Load the API package
```dart
import 'package:omsa_api/api.dart';
```

All URIs are relative to *https://api.entur.io/sales/v2*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiGet**](DiscoveryApi.md#apiget) | **GET** /api | Get OpenAPI specification document
[**describeCollection**](DiscoveryApi.md#describecollection) | **GET** /collections/{collectionId} | Get collection metadata
[**getCollections**](DiscoveryApi.md#getcollections) | **GET** /collections | List available collections
[**getConformanceDeclaration**](DiscoveryApi.md#getconformancedeclaration) | **GET** /conformance | Get API conformance declaration
[**getProcessDescription**](DiscoveryApi.md#getprocessdescription) | **GET** /processes/{processID} | Get process description
[**getProcesses**](DiscoveryApi.md#getprocesses) | **GET** /processes | List available processes
[**landingPage**](DiscoveryApi.md#landingpage) | **GET** / | Get API landing page


# **apiGet**
> String apiGet(f, eTClientName, xCorrelationId)

Get OpenAPI specification document

Returns this OpenAPI document in JSON or YAML format.

### Example
```dart
import 'package:omsa_api/api.dart';

final api_instance = DiscoveryApi();
final f = f_example; // String | Output format for the OpenAPI document.
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.apiGet(f, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling DiscoveryApi->apiGet: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **f** | **String**| Output format for the OpenAPI document. | [optional] [default to 'json']
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

**String**

### Authorization

[OpenData](../README.md#OpenData)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/x-yaml

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **describeCollection**
> CollectionInfo describeCollection(collectionId, acceptLanguage, eTClientName, xCorrelationId)

Get collection metadata

a (machine or human) readable description of this collection

### Example
```dart
import 'package:omsa_api/api.dart';

final api_instance = DiscoveryApi();
final collectionId = collectionId_example; // String | local identifier of a collection
final acceptLanguage = acceptLanguage_example; // String | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.describeCollection(collectionId, acceptLanguage, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling DiscoveryApi->describeCollection: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **collectionId** | **String**| local identifier of a collection | 
 **acceptLanguage** | **String**|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**CollectionInfo**](CollectionInfo.md)

### Authorization

[OpenData](../README.md#OpenData)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, text/html

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCollections**
> Collections getCollections(eTClientName, xCorrelationId)

List available collections

returns a collection of available collection (like offers, packages, legs, support-requests and payments)

### Example
```dart
import 'package:omsa_api/api.dart';

final api_instance = DiscoveryApi();
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.getCollections(eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling DiscoveryApi->getCollections: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Collections**](Collections.md)

### Authorization

[OpenData](../README.md#OpenData)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getConformanceDeclaration**
> ConfClasses getConformanceDeclaration(acceptLanguage, f, eTClientName, xCorrelationId)

Get API conformance declaration

A list of all conformance classes specified in a standard that the server conforms to.

### Example
```dart
import 'package:omsa_api/api.dart';

final api_instance = DiscoveryApi();
final acceptLanguage = acceptLanguage_example; // String | 
final f = f_example; // String | The optional f parameter indicates the output format that the server shall provide as part of the response document.  The default format is JSON.
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.getConformanceDeclaration(acceptLanguage, f, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling DiscoveryApi->getConformanceDeclaration: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **f** | **String**| The optional f parameter indicates the output format that the server shall provide as part of the response document.  The default format is JSON. | [optional] [default to 'json']
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**ConfClasses**](ConfClasses.md)

### Authorization

[OpenData](../README.md#OpenData)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, text/html

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProcessDescription**
> Object getProcessDescription(acceptLanguage, processID, eTClientName, xCorrelationId)

Get process description

The process description contains information about inputs and outputs and a link to the execution-endpoint for the process. The Core does not mandate the use of a specific process description to specify the interface of a process. That said, the Core requirements class makes the following recommendation: Implementations SHOULD consider supporting the OGC process description. For more information, see [Section 7.10](https://docs.ogc.org/is/18-062/18-062.html#sc_process_description). 

### Example
```dart
import 'package:omsa_api/api.dart';

final api_instance = DiscoveryApi();
final acceptLanguage = acceptLanguage_example; // String | 
final processID = processID_example; // String | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.getProcessDescription(acceptLanguage, processID, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling DiscoveryApi->getProcessDescription: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **processID** | **String**|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**Object**](Object.md)

### Authorization

[OpenData](../README.md#OpenData)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProcesses**
> ProcessList getProcesses(acceptLanguage, eTClientName, xCorrelationId)

List available processes

The list of processes contains a summary of each process the OGC API - Processes offers, including the link to a more detailed description of the process.  For more information, see [Section 7.9](https://docs.ogc.org/is/18-062/18-062.html#sc_process_list). 

### Example
```dart
import 'package:omsa_api/api.dart';

final api_instance = DiscoveryApi();
final acceptLanguage = acceptLanguage_example; // String | 
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.getProcesses(acceptLanguage, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling DiscoveryApi->getProcesses: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**ProcessList**](ProcessList.md)

### Authorization

[OpenData](../README.md#OpenData)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **landingPage**
> LandingPage landingPage(acceptLanguage, f, eTClientName, xCorrelationId)

Get API landing page

Gives a (technical & human readable) output describing how this API must be used. If  the parameter f=html is supplied, a human readable page must be responded.

### Example
```dart
import 'package:omsa_api/api.dart';

final api_instance = DiscoveryApi();
final acceptLanguage = acceptLanguage_example; // String | 
final f = f_example; // String | The optional f parameter indicates the output format that the server shall provide as part of the response document.  The default format is JSON.
final eTClientName = eTClientName_example; // String | Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
final xCorrelationId = xCorrelationId_example; // String | Correlation id

try {
    final result = api_instance.landingPage(acceptLanguage, f, eTClientName, xCorrelationId);
    print(result);
} catch (e) {
    print('Exception when calling DiscoveryApi->landingPage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **acceptLanguage** | **String**|  | 
 **f** | **String**| The optional f parameter indicates the output format that the server shall provide as part of the response document.  The default format is JSON. | [optional] [default to 'json']
 **eTClientName** | **String**| Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`. | [optional] 
 **xCorrelationId** | **String**| Correlation id | [optional] 

### Return type

[**LandingPage**](LandingPage.md)

### Authorization

[OpenData](../README.md#OpenData)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, text/html

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

