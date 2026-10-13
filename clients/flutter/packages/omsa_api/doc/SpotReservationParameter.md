# omsa_api.model.SpotReservationParameter

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **String** |  | 
**spotType** | **String** |  | 
**deck** | **String** | default string, full names etc (length 0-200) | [optional] 
**space** | **String** | default string, full names etc (length 0-200) | [optional] 
**spot** | **String** | For LUGGAGE_SPOT and VEHICLE_SPOT, supported values are: HANDBAG, HAND_LUGGAGE, SMALL_SUITCASE, SUITCASE, TRUNK, OVERSIZE_ITEM, BICYCLE, SPORTING_EQUIPMENT, SKIS, MUSICAL_INSTRUMENT, PUSH_CHAIR, MOTORIZED_WHEELCHAIR, LARGE_MOTORIZED_WHEELCHAIR, WHEELCHAIR, SMALL_ANIMAL, ANIMAL, GAME, MOTORCYCLE, OTHER, GUIDE_DOG. Unknown values are ignored. Use VEHICLE_SPOT for vehicles transported as cargo (e.g. motorcycle on a ferry). For PASSENGER_SPOT, the value is an operator-specific seat identifier and is not used for requirement mapping.  | 
**width** | **num** |  | [optional] 
**length** | **num** |  | [optional] 
**height** | **num** |  | [optional] 
**fuel** | **String** |  | [optional] 
**weight** | **String** |  | [optional] 
**mode** | [**Mode**](Mode.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


