# omsa_api.model.FrequencyOfUse

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | default string, full names etc (length 0-200) | 
**type** | **String** |  | 
**frequencyOfUseType** | [**FrequencyOfUseType**](FrequencyOfUseType.md) |  | [optional] 
**minimalFrequency** | **int** | Minimum number of times the product can be used. | [optional] 
**maximalFrequency** | **int** | Maximum number of times the product can be used. | [optional] 
**frequencyInterval** | **String** | Positive ISO 8601 interval within which frequency is measured. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


