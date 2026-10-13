# omsa_api.model.Error

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **String** | valid URL | 
**title** | **String** | short string, display names (length 0-75) | 
**status** | **int** | HTTP status code (100–599) | 
**detail** | **String** | long string, memos etc (length 0-10.000) | 
**instance** | **String** | valid URL | [optional] 
**links** | [**List<Link>**](Link.md) |  | [optional] [default to const []]
**code** | **String** | Stable machine-readable problem code. | 
**category** | **String** | Public problem category used by curated problems. | 
**hint** | **String** | Short client-facing remediation hint. | 
**context** | [**Map<String, Object>**](Object.md) | Safe structured context fields for the problem. | [optional] [default to const {}]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


