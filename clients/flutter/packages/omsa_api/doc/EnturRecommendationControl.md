# omsa_api.model.EnturRecommendationControl

## Load the model package
```dart
import 'package:omsa_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enabled** | **bool** | Enable recommendation-driven bundling based on Offers `recommendations` and `offersToBuy`. | [optional] [default to false]
**types** | [**List<EnturRecommendationType>**](EnturRecommendationType.md) | Entur recommendation categories to request when `enabled` is true. If omitted, the API defaults to `[\"CHEAPEST\", \"NON_FLEXIBLE\", \"SEMI_FLEXIBLE\", \"FLEXIBLE\"]`.  | [optional] [default to const []]
**stripDuplicates** | **bool** | Deduplicate recommendation-driven plans by provider offer + traveller groups + ancillary selections + quantity.  | [optional] [default to false]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


