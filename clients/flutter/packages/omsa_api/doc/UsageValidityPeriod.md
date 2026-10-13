# omsa_api.model.UsageValidityPeriod

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | default string, full names etc (length 0-200) | 
**type** | **String** |  | 
**validityPeriodType** | [**UsageValidityPeriodType**](UsageValidityPeriodType.md) |  | [optional] 
**usageTrigger** | [**UsageTrigger**](UsageTrigger.md) |  | [optional] 
**usageEnd** | [**UsageEnd**](UsageEnd.md) |  | [optional] 
**standardDuration** | **String** | Positive ISO 8601 duration of the usage validity period, for example PT168H. | [optional] 
**activationMeans** | [**ActivationMeans**](ActivationMeans.md) |  | [optional] 
**startDate** | **String** | https://www.rfc-editor.org/rfc/rfc3339#section-5.6, full-date (2019-10-12) | [optional] 
**startTime** | **String** |  | [optional] 
**endDate** | **String** | https://www.rfc-editor.org/rfc/rfc3339#section-5.6, full-date (2019-10-12) | [optional] 
**endTime** | **String** |  | [optional] 
**usageStartConstraintType** | [**UsageStartConstraintType**](UsageStartConstraintType.md) |  | [optional] 
**blackoutUse** | [**BlackoutUse**](BlackoutUse.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


