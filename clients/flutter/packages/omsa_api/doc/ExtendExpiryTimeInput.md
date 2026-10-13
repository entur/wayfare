# omsa_api.model.ExtendExpiryTimeInput

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**packageId** | **String** | default string, full names etc (length 0-200) | 
**type** | **String** |  | 
**extensionReason** | **String** | in case operation is EXTEND_EXPIRY_TIME, the reason for extension must be supplied here.<br> _PURCHASE_PENDING_ - The internal purchase process on the MP side is not yet finished<br> _PAYMENT_PENDING_ - The customer is in the payment process<br> _OTHER_ - unspecified | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


