# omsa_api.model.ReservationRequirement

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **String** |  | 
**spotType** | **String** | The kind of spot the reservation rule applies to. | 
**reservationPolicy** | [**ReservationPolicy**](ReservationPolicy.md) |  | 
**sourceReservationPolicy** | **String** | Raw reservation policy from the upstream provider, when available. | [optional] 
**assetSelection** | [**AssetSelection**](AssetSelection.md) |  | [optional] 
**serviceJourney** | **String** | default string, full names etc (length 0-200) | [optional] 
**fulfilledByAncillaries** | [**List<AncillaryReference>**](AncillaryReference.md) | Ancillaries that can fulfill this reservation requirement when reservation is sold as a separate product. | [optional] [default to const []]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


