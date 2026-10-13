# omsa_api.model.SearchOfferInput

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **String** |  | 
**specification** | [**TravelSpecification**](TravelSpecification.md) |  | [optional] 
**filters** | [**List<SearchOfferFilter>**](SearchOfferFilter.md) | Request-wide predicates that every returned offer must satisfy. | [optional] [default to const []]
**pattern** | [**List<TripPatternInner>**](TripPatternInner.md) |  | [optional] [default to const []]
**packageToExchange** | **String** | default string, full names etc (length 0-200) | [optional] 
**travellers** | [**List<IndividualTraveller>**](IndividualTraveller.md) |  | [optional] [default to const []]
**profiles** | [**List<UserProfile>**](UserProfile.md) |  | [optional] [default to const []]
**travellingAssets** | [**List<TravellingAsset>**](TravellingAsset.md) |  | [optional] [default to const []]
**entur** | [**EnturSearchOfferInput**](EnturSearchOfferInput.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


