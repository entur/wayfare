# omsa_api.model.CustomerInput

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstName** | **String** | short string, display names (length 0-75) | 
**lastName** | **String** | short string, display names (length 0-75) | 
**initials** | **String** | real short string, codes (length 0-10) | [optional] 
**middleName** | **String** | short string, display names (length 0-75) | [optional] 
**prefix** | **String** | real short string, codes (length 0-10) | [optional] 
**postfix** | **String** | real short string, codes (length 0-10) | [optional] 
**email** | **String** | default string, full names etc (length 0-200) | [optional] 
**phoneNumber** | **String** | Mobile phone number of the customer in E.164 format, with + and country code and no spaces or punctuation. | [optional] 
**address** | [**PostalAddress**](PostalAddress.md) |  | [optional] 
**dateOfBirth** | **String** | https://www.rfc-editor.org/rfc/rfc3339#section-5.6, full-date (2019-10-12) | [optional] 
**placeOfBirth** | **String** | short string, display names (length 0-75) | [optional] 
**countryOfBirth** | **String** | two-letter country codes according to ISO 3166-1 | [optional] 
**customProperties** | [**Map<String, Object>**](Object.md) | dictionary for extra fields (bilatural agreements) | [optional] [default to const {}]
**externalReference** | **String** | The client's own reference for this customer, unique within the organisation. Must not be blank. Leading and trailing whitespace is trimmed. Defaults to the customer number when not set. Can only be set when the customer is created. On replace it must be omitted or equal to the stored value. Use id, not this value, when referring to the customer elsewhere in the API. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


