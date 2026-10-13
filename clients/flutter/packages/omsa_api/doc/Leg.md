# omsa_api.model.Leg

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**from** | [**PlaceReference**](PlaceReference.md) |  | [optional] 
**via** | [**List<PlaceReference>**](PlaceReference.md) | use an ID contained in the **placeDefinitions** field, or from an external source, when using coordinates, please use the prefix 'gps:' | [optional] [default to const []]
**to** | [**PlaceReference**](PlaceReference.md) |  | [optional] 
**startTime** | [**DateTime**](DateTime.md) | https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z) | [optional] 
**endTime** | [**DateTime**](DateTime.md) | https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z) | [optional] 
**id** | **String** | default string, full names etc (length 0-200) | 
**type** | **String** |  | 
**sequenceNumber** | **int** | a bit short integer (0-100) | [optional] [default to 0]
**traveller** | **String** | default string, full names etc (length 0-200) | [optional] 
**state** | [**LegState**](LegState.md) |  | [optional] 
**price** | [**AmountOfMoney**](AmountOfMoney.md) |  | [optional] 
**products** | **List<String>** | a reference to a product in the 'products' collection of the offer | [optional] [default to const []]
**ancillaries** | **List<String>** | additional products that can be assigned to this leg, references to 'ancillaries' collection | [optional] [default to const []]
**usageValidityPeriods** | **List<String>** | References to usage validity periods in the offer's usageValidityPeriods collection. | [optional] [default to const []]
**frequenciesOfUse** | **List<String>** | References to frequency-of-use parameters in the offer's frequenciesOfUse collection. | [optional] [default to const []]
**mode** | [**Mode**](Mode.md) |  | [optional] 
**assets** | **List<String>** | The physical asset(s) used for the execution of the leg | [optional] [default to const []]
**reservationRequirement** | [**ReservationRequirement**](ReservationRequirement.md) |  | [optional] 
**operator_** | [**OrganisationReference**](OrganisationReference.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


