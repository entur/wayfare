# omsa_api.model.OfferProperties

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**legs** | [**List<Leg>**](Leg.md) |  | [optional] [default to const []]
**usageValidityPeriods** | [**List<UsageValidityPeriod>**](UsageValidityPeriod.md) | Usage validity periods referenced by the offer's legs. | [optional] [default to const []]
**frequenciesOfUse** | [**List<FrequencyOfUse>**](FrequencyOfUse.md) | Frequency-of-use parameters referenced by the offer's legs. | [optional] [default to const []]
**ancillaries** | [**List<Ancillary>**](Ancillary.md) |  | [optional] [default to const []]
**products** | [**List<Product>**](Product.md) |  | [optional] [default to const []]
**price** | [**AmountOfMoney**](AmountOfMoney.md) |  | [optional] 
**summary** | [**Map<String, Object>**](Object.md) | Flexible summary metadata for the offer. Known keys include:   - `name`: offer display name   - `description`: human-readable offer description   - `isRefundable`: whether included products are refundable   - `isExchangeable`: whether included products are exchangeable   - `geographicalValidity`: zonal validity details, including labeled `fareZones` and `groups`   - `recommendationType`: recommendation category from Offers (for example `CHEAPEST`)   - `recommendationGroup`: 1-based recommendation index in Offers response order   - `recommendationRank`: 1-based `offersToBuy` index within a recommendation  | [optional] [default to const {}]
**guarantees** | [**List<Guarantee>**](Guarantee.md) |  | [optional] [default to const []]
**expiryTime** | [**DateTime**](DateTime.md) | https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z) | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


