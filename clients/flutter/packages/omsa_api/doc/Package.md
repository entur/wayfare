# omsa_api.model.Package

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
**placeDefinitions** | [**List<PostalAddress>**](PostalAddress.md) | Places that are not specified in an external data source (like a home address) | [optional] [default to const []]
**type** | **String** |  | 
**id** | **String** |  | [optional] 
**externalReference** | **String** | default string, full names etc (length 0-200) | [optional] 
**status** | [**PackageStatus**](PackageStatus.md) |  | 
**price** | [**AmountOfMoney**](AmountOfMoney.md) |  | 
**offers** | [**List<Offer>**](Offer.md) |  | [default to const []]
**guarantees** | **List<String>** |  | [optional] [default to const []]
**travellers** | [**List<PackageAllOfTravellers>**](PackageAllOfTravellers.md) |  | [optional] [default to const []]
**links** | [**List<Link>**](Link.md) |  | [optional] [default to const []]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


