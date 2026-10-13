# omsa_api.model.Ancillary

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ancillaryId** | **String** | default string, full names etc (length 0-200) | 
**name** | **String** | default string, full names etc (length 0-200) | [optional] 
**type** | **String** |  | [optional] 
**price** | [**AmountOfMoney**](AmountOfMoney.md) |  | [optional] 
**description** | **String** | A user-friendly description of the ancillary (e.g. 'Reserved seat for bike'). | [optional] 
**available** | **int** | Number of items available in stock (inventory). Useful for creating urgency in GUI. | [optional] 
**service** | [**List<ServiceParameter>**](ServiceParameter.md) | Service characteristics covered by this ancillary, such as service journey, class of use, asset, or accommodation. | [optional] [default to const []]
**reservationRequirements** | [**List<ReservationRequirement>**](ReservationRequirement.md) | Reservation rules carried by this ancillary. | [optional] [default to const []]
**links** | [**List<Link>**](Link.md) |  | [optional] [default to const []]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


