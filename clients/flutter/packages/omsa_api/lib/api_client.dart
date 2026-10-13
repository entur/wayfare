//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ApiClient {
  ApiClient({
    this.basePath = 'https://api.entur.io/sales/v2',
    this.authentication,
  });

  final String basePath;
  final Authentication? authentication;

  var _client = Client();
  final _defaultHeaderMap = <String, String>{};

  /// Returns the current HTTP [Client] instance to use in this class.
  ///
  /// The return value is guaranteed to never be null.
  Client get client => _client;

  /// Requests to use a new HTTP [Client] in this class.
  set client(Client newClient) {
    _client = newClient;
  }

  Map<String, String> get defaultHeaderMap => _defaultHeaderMap;

  void addDefaultHeader(String key, String value) {
    _defaultHeaderMap[key] = value;
  }

  // We don't use a Map<String, String> for queryParams.
  // If collectionFormat is 'multi', a key might appear multiple times.
  Future<Response> invokeAPI(
    String path,
    String method,
    List<QueryParam> queryParams,
    Object? body,
    Map<String, String> headerParams,
    Map<String, String> formParams,
    String? contentType,
  ) async {
    await authentication?.applyToParams(queryParams, headerParams);

    headerParams.addAll(_defaultHeaderMap);
    if (contentType != null) {
      headerParams['Content-Type'] = contentType;
    }

    final urlEncodedQueryParams = queryParams.map((param) => '$param');
    final queryString = urlEncodedQueryParams.isNotEmpty
        ? '?${urlEncodedQueryParams.join('&')}'
        : '';
    final uri = Uri.parse('$basePath$path$queryString');

    try {
      // Special case for uploading a single file which isn't a 'multipart/form-data'.
      if (body is MultipartFile &&
          (contentType == null ||
              !contentType.toLowerCase().startsWith('multipart/form-data'))) {
        final request = StreamedRequest(method, uri);
        request.headers.addAll(headerParams);
        request.contentLength = body.length;
        body.finalize().listen(
              request.sink.add,
              onDone: request.sink.close,
              // ignore: avoid_types_on_closure_parameters
              onError: (Object error, StackTrace trace) => request.sink.close(),
              cancelOnError: true,
            );
        final response = await _client.send(request);
        return Response.fromStream(response);
      }

      if (body is MultipartRequest) {
        final request = MultipartRequest(method, uri);
        request.fields.addAll(body.fields);
        request.files.addAll(body.files);
        request.headers.addAll(body.headers);
        request.headers.addAll(headerParams);
        final response = await _client.send(request);
        return Response.fromStream(response);
      }

      final msgBody = contentType == 'application/x-www-form-urlencoded'
          ? formParams
          : await serializeAsync(body);
      final nullableHeaderParams = headerParams.isEmpty ? null : headerParams;

      switch (method) {
        case 'POST':
          return await _client.post(
            uri,
            headers: nullableHeaderParams,
            body: msgBody,
          );
        case 'PUT':
          return await _client.put(
            uri,
            headers: nullableHeaderParams,
            body: msgBody,
          );
        case 'DELETE':
          return await _client.delete(
            uri,
            headers: nullableHeaderParams,
            body: msgBody,
          );
        case 'PATCH':
          return await _client.patch(
            uri,
            headers: nullableHeaderParams,
            body: msgBody,
          );
        case 'HEAD':
          return await _client.head(
            uri,
            headers: nullableHeaderParams,
          );
        case 'GET':
          return await _client.get(
            uri,
            headers: nullableHeaderParams,
          );
      }
    } on SocketException catch (error, trace) {
      throw ApiException.withInner(
        HttpStatus.badRequest,
        'Socket operation failed: $method $path',
        error,
        trace,
      );
    } on TlsException catch (error, trace) {
      throw ApiException.withInner(
        HttpStatus.badRequest,
        'TLS/SSL communication failed: $method $path',
        error,
        trace,
      );
    } on IOException catch (error, trace) {
      throw ApiException.withInner(
        HttpStatus.badRequest,
        'I/O operation failed: $method $path',
        error,
        trace,
      );
    } on ClientException catch (error, trace) {
      throw ApiException.withInner(
        HttpStatus.badRequest,
        'HTTP connection failed: $method $path',
        error,
        trace,
      );
    } on Exception catch (error, trace) {
      throw ApiException.withInner(
        HttpStatus.badRequest,
        'Exception occurred: $method $path',
        error,
        trace,
      );
    }

    throw ApiException(
      HttpStatus.badRequest,
      'Invalid HTTP operation: $method $path',
    );
  }

  Future<dynamic> deserializeAsync(
    String value,
    String targetType, {
    bool growable = false,
  }) async =>
      // ignore: deprecated_member_use_from_same_package
      deserialize(value, targetType, growable: growable);

  @Deprecated(
      'Scheduled for removal in OpenAPI Generator 6.x. Use deserializeAsync() instead.')
  dynamic deserialize(
    String value,
    String targetType, {
    bool growable = false,
  }) {
    // Remove all spaces. Necessary for regular expressions as well.
    targetType =
        targetType.replaceAll(' ', ''); // ignore: parameter_assignments

    // If the expected target type is String, nothing to do...
    return targetType == 'String'
        ? value
        : fromJson(json.decode(value), targetType, growable: growable);
  }

  // ignore: deprecated_member_use_from_same_package
  Future<String> serializeAsync(Object? value) async => serialize(value);

  @Deprecated(
      'Scheduled for removal in OpenAPI Generator 6.x. Use serializeAsync() instead.')
  String serialize(Object? value) => value == null ? '' : json.encode(value);

  /// Returns a native instance of an OpenAPI class matching the [specified type][targetType].
  static dynamic fromJson(
    dynamic value,
    String targetType, {
    bool growable = false,
  }) {
    try {
      switch (targetType) {
        case 'String':
          return value is String ? value : value.toString();
        case 'int':
          return value is int ? value : int.parse('$value');
        case 'double':
          return value is double ? value : double.parse('$value');
        case 'bool':
          if (value is bool) {
            return value;
          }
          final valueString = '$value'.toLowerCase();
          return valueString == 'true' || valueString == '1';
        case 'DateTime':
          return value is DateTime ? value : DateTime.tryParse(value);
        case 'Accommodation':
          return Accommodation.fromJson(value);
        case 'ActivationMeans':
          return ActivationMeansTypeTransformer().decode(value);
        case 'AddTravellerHandlerRequest':
          return AddTravellerHandlerRequest.fromJson(value);
        case 'AddTravellerInput':
          return AddTravellerInput.fromJson(value);
        case 'AmountOfMoney':
          return AmountOfMoney.fromJson(value);
        case 'Ancillary':
          return Ancillary.fromJson(value);
        case 'AncillaryCollection':
          return AncillaryCollection.fromJson(value);
        case 'AncillaryCollectionAncillariesInner':
          return AncillaryCollectionAncillariesInner.fromJson(value);
        case 'AncillaryInput':
          return AncillaryInput.fromJson(value);
        case 'AncillaryReference':
          return AncillaryReference.fromJson(value);
        case 'Asset':
          return Asset.fromJson(value);
        case 'AssetInput':
          return AssetInput.fromJson(value);
        case 'AssetSelection':
          return AssetSelectionTypeTransformer().decode(value);
        case 'AssignAncillaryProcessHandlerRequest':
          return AssignAncillaryProcessHandlerRequest.fromJson(value);
        case 'AssignAssetHandlerRequest':
          return AssignAssetHandlerRequest.fromJson(value);
        case 'BerthType':
          return BerthTypeTypeTransformer().decode(value);
        case 'BinaryTicket':
          return BinaryTicket.fromJson(value);
        case 'BlackoutUse':
          return BlackoutUseTypeTransformer().decode(value);
        case 'CancellationParameter':
          return CancellationParameter.fromJson(value);
        case 'Card':
          return Card.fromJson(value);
        case 'CardType':
          return CardType.fromJson(value);
        case 'ChangeOption':
          return ChangeOption.fromJson(value);
        case 'ChangeOptionCollection':
          return ChangeOptionCollection.fromJson(value);
        case 'ChangeOptionCollectionOptionsInner':
          return ChangeOptionCollectionOptionsInner.fromJson(value);
        case 'ClaimRefundProcessHandlerRequest':
          return ClaimRefundProcessHandlerRequest.fromJson(value);
        case 'ClassOfUse':
          return ClassOfUseTypeTransformer().decode(value);
        case 'CollectionInfo':
          return CollectionInfo.fromJson(value);
        case 'Collections':
          return Collections.fromJson(value);
        case 'CommercialProfile':
          return CommercialProfile.fromJson(value);
        case 'ConfClasses':
          return ConfClasses.fromJson(value);
        case 'Customer':
          return Customer.fromJson(value);
        case 'CustomerCollection':
          return CustomerCollection.fromJson(value);
        case 'CustomerInput':
          return CustomerInput.fromJson(value);
        case 'CustomerRef':
          return CustomerRef.fromJson(value);
        case 'DataType':
          return DataType.fromJson(value);
        case 'Day':
          return DayTypeTransformer().decode(value);
        case 'DescriptionType':
          return DescriptionType.fromJson(value);
        case 'DistributionParameter':
          return DistributionParameter.fromJson(value);
        case 'EntitlementGiven':
          return EntitlementGiven.fromJson(value);
        case 'EnturRecommendationControl':
          return EnturRecommendationControl.fromJson(value);
        case 'EnturRecommendationType':
          return EnturRecommendationTypeTypeTransformer().decode(value);
        case 'EnturSearchOfferInput':
          return EnturSearchOfferInput.fromJson(value);
        case 'EquipmentParameter':
          return EquipmentParameter.fromJson(value);
        case 'EquipmentReference':
          return EquipmentReference.fromJson(value);
        case 'Error':
          return Error.fromJson(value);
        case 'ExtendExpiryTimeInput':
          return ExtendExpiryTimeInput.fromJson(value);
        case 'ExtendExpiryTimeProcessHandlerRequest':
          return ExtendExpiryTimeProcessHandlerRequest.fromJson(value);
        case 'ExternalTicket':
          return ExternalTicket.fromJson(value);
        case 'FinancialDetail':
          return FinancialDetail.fromJson(value);
        case 'FrequencyOfUse':
          return FrequencyOfUse.fromJson(value);
        case 'FrequencyOfUseType':
          return FrequencyOfUseTypeTypeTransformer().decode(value);
        case 'Geojson':
          return Geojson.fromJson(value);
        case 'GeojsonCrs':
          return GeojsonCrs.fromJson(value);
        case 'GeojsonCrsProperties':
          return GeojsonCrsProperties.fromJson(value);
        case 'GeojsonFeature':
          return GeojsonFeature.fromJson(value);
        case 'GeojsonFeatureGeometry':
          return GeojsonFeatureGeometry.fromJson(value);
        case 'GeojsonFeatureProperties':
          return GeojsonFeatureProperties.fromJson(value);
        case 'GeojsonLine':
          return GeojsonLine.fromJson(value);
        case 'GeojsonMultiPolygon':
          return GeojsonMultiPolygon.fromJson(value);
        case 'GeojsonPoint':
          return GeojsonPoint.fromJson(value);
        case 'GeojsonPolygon':
          return GeojsonPolygon.fromJson(value);
        case 'Guarantee':
          return Guarantee.fromJson(value);
        case 'IndividualTraveller':
          return IndividualTraveller.fromJson(value);
        case 'JobControlOptions':
          return JobControlOptionsTypeTransformer().decode(value);
        case 'LandingPage':
          return LandingPage.fromJson(value);
        case 'Leg':
          return Leg.fromJson(value);
        case 'LegInput':
          return LegInput.fromJson(value);
        case 'LegState':
          return LegStateTypeTransformer().decode(value);
        case 'License':
          return License.fromJson(value);
        case 'LicenseType':
          return LicenseType.fromJson(value);
        case 'Link':
          return Link.fromJson(value);
        case 'Metadata':
          return Metadata.fromJson(value);
        case 'MetadataOneOf':
          return MetadataOneOf.fromJson(value);
        case 'MetadataOneOf1':
          return MetadataOneOf1.fromJson(value);
        case 'MetadataOneOf1Value':
          return MetadataOneOf1Value.fromJson(value);
        case 'Mode':
          return ModeTypeTransformer().decode(value);
        case 'NetworkParameter':
          return NetworkParameter.fromJson(value);
        case 'OauthTokenPost200Response':
          return OauthTokenPost200Response.fromJson(value);
        case 'Offer':
          return Offer.fromJson(value);
        case 'OfferCollection':
          return OfferCollection.fromJson(value);
        case 'OfferProperties':
          return OfferProperties.fromJson(value);
        case 'OnboardStay':
          return OnboardStay.fromJson(value);
        case 'OrganisationReference':
          return OrganisationReference.fromJson(value);
        case 'OrganisationalFilter':
          return OrganisationalFilter.fromJson(value);
        case 'OrganisationalParameter':
          return OrganisationalParameter.fromJson(value);
        case 'Package':
          return Package.fromJson(value);
        case 'PackageAllOfTravellers':
          return PackageAllOfTravellers.fromJson(value);
        case 'PackageCollection':
          return PackageCollection.fromJson(value);
        case 'PackageInput':
          return PackageInput.fromJson(value);
        case 'PackageStatus':
          return PackageStatusTypeTransformer().decode(value);
        case 'PaymentCategory':
          return PaymentCategoryTypeTransformer().decode(value);
        case 'PendingTicket':
          return PendingTicket.fromJson(value);
        case 'PlaceDefinitions':
          return PlaceDefinitions.fromJson(value);
        case 'PlaceReference':
          return PlaceReference.fromJson(value);
        case 'PostalAddress':
          return PostalAddress.fromJson(value);
        case 'ProcessList':
          return ProcessList.fromJson(value);
        case 'ProcessSummary':
          return ProcessSummary.fromJson(value);
        case 'Product':
          return Product.fromJson(value);
        case 'ProductReference':
          return ProductReference.fromJson(value);
        case 'PurchaseOffersInput':
          return PurchaseOffersInput.fromJson(value);
        case 'PurchaseOffersProcessHandlerRequest':
          return PurchaseOffersProcessHandlerRequest.fromJson(value);
        case 'PurchasePackageProcessHandlerRequest':
          return PurchasePackageProcessHandlerRequest.fromJson(value);
        case 'PurchaseParameter':
          return PurchaseParameter.fromJson(value);
        case 'RefundOption':
          return RefundOption.fromJson(value);
        case 'RefundOptionCollection':
          return RefundOptionCollection.fromJson(value);
        case 'RefundOptionCollectionOptionsInner':
          return RefundOptionCollectionOptionsInner.fromJson(value);
        case 'RefundOptionInput':
          return RefundOptionInput.fromJson(value);
        case 'RemoveTravellerHandlerRequest':
          return RemoveTravellerHandlerRequest.fromJson(value);
        case 'RemoveTravellerInput':
          return RemoveTravellerInput.fromJson(value);
        case 'ReservationPolicy':
          return ReservationPolicyTypeTransformer().decode(value);
        case 'ReservationRequirement':
          return ReservationRequirement.fromJson(value);
        case 'RoutingParameter':
          return RoutingParameter.fromJson(value);
        case 'SearchOfferFilter':
          return SearchOfferFilter.fromJson(value);
        case 'SearchOfferHandlerRequest':
          return SearchOfferHandlerRequest.fromJson(value);
        case 'SearchOfferInput':
          return SearchOfferInput.fromJson(value);
        case 'Seat':
          return Seat.fromJson(value);
        case 'SelectOffersHandlerRequest':
          return SelectOffersHandlerRequest.fromJson(value);
        case 'SelectOffersInput':
          return SelectOffersInput.fromJson(value);
        case 'ServiceFilter':
          return ServiceFilter.fromJson(value);
        case 'ServiceParameter':
          return ServiceParameter.fromJson(value);
        case 'SpotReservationParameter':
          return SpotReservationParameter.fromJson(value);
        case 'Subscriber':
          return Subscriber.fromJson(value);
        case 'TemporalParameter':
          return TemporalParameter.fromJson(value);
        case 'TravelDocument':
          return TravelDocument.fromJson(value);
        case 'TravelDocumentCollection':
          return TravelDocumentCollection.fromJson(value);
        case 'TravelDocumentCollectionTravelDocumentsInner':
          return TravelDocumentCollectionTravelDocumentsInner.fromJson(value);
        case 'TravelDocumentCollectionTravelDocumentsInnerProperties':
          return TravelDocumentCollectionTravelDocumentsInnerProperties
              .fromJson(value);
        case 'TravelDocumentFormat':
          return TravelDocumentFormatTypeTransformer().decode(value);
        case 'TravelDocumentStatus':
          return TravelDocumentStatusTypeTransformer().decode(value);
        case 'TravelParty':
          return TravelParty.fromJson(value);
        case 'TravelPartyEntitlements':
          return TravelPartyEntitlements.fromJson(value);
        case 'TravelPartyRequirements':
          return TravelPartyRequirements.fromJson(value);
        case 'TravelSpecification':
          return TravelSpecification.fromJson(value);
        case 'TravellingAsset':
          return TravellingAsset.fromJson(value);
        case 'TripPatternInner':
          return TripPatternInner.fromJson(value);
        case 'UpdateTravelDocumentValidityInput':
          return UpdateTravelDocumentValidityInput.fromJson(value);
        case 'UpdateTravelDocumentValidityProcessHandlerRequest':
          return UpdateTravelDocumentValidityProcessHandlerRequest.fromJson(
              value);
        case 'UpdateTravelDocumentValidityResponse':
          return UpdateTravelDocumentValidityResponse.fromJson(value);
        case 'UpdateTravellerHandlerRequest':
          return UpdateTravellerHandlerRequest.fromJson(value);
        case 'UpdateTravellerInput':
          return UpdateTravellerInput.fromJson(value);
        case 'UsageEnd':
          return UsageEndTypeTransformer().decode(value);
        case 'UsageStartConstraintType':
          return UsageStartConstraintTypeTypeTransformer().decode(value);
        case 'UsageTrigger':
          return UsageTriggerTypeTransformer().decode(value);
        case 'UsageValidityPeriod':
          return UsageValidityPeriod.fromJson(value);
        case 'UsageValidityPeriodType':
          return UsageValidityPeriodTypeTypeTransformer().decode(value);
        case 'UserNeedReference':
          return UserNeedReference.fromJson(value);
        case 'UserProfile':
          return UserProfile.fromJson(value);
        case 'ZoneReference':
          return ZoneReference.fromJson(value);
        default:
          dynamic match;
          if (value is List &&
              (match = _regList.firstMatch(targetType)?.group(1)) != null) {
            return value
                .map<dynamic>((dynamic v) => fromJson(
                      v,
                      match,
                      growable: growable,
                    ))
                .toList(growable: growable);
          }
          if (value is Set &&
              (match = _regSet.firstMatch(targetType)?.group(1)) != null) {
            return value
                .map<dynamic>((dynamic v) => fromJson(
                      v,
                      match,
                      growable: growable,
                    ))
                .toSet();
          }
          if (value is Map &&
              (match = _regMap.firstMatch(targetType)?.group(1)) != null) {
            return Map<String, dynamic>.fromIterables(
              value.keys.cast<String>(),
              value.values.map<dynamic>((dynamic v) => fromJson(
                    v,
                    match,
                    growable: growable,
                  )),
            );
          }
      }
    } on Exception catch (error, trace) {
      throw ApiException.withInner(
        HttpStatus.internalServerError,
        'Exception during deserialization.',
        error,
        trace,
      );
    }
    throw ApiException(
      HttpStatus.internalServerError,
      'Could not find a suitable class for deserialization',
    );
  }
}

/// Primarily intended for use in an isolate.
class DeserializationMessage {
  const DeserializationMessage({
    required this.json,
    required this.targetType,
    this.growable = false,
  });

  /// The JSON value to deserialize.
  final String json;

  /// Target type to deserialize to.
  final String targetType;

  /// Whether to make deserialized lists or maps growable.
  final bool growable;
}

/// Primarily intended for use in an isolate.
Future<dynamic> decodeAsync(DeserializationMessage message) async {
  // Remove all spaces. Necessary for regular expressions as well.
  final targetType = message.targetType.replaceAll(' ', '');

  // If the expected target type is String, nothing to do...
  return targetType == 'String' ? message.json : json.decode(message.json);
}

/// Primarily intended for use in an isolate.
Future<dynamic> deserializeAsync(DeserializationMessage message) async {
  // Remove all spaces. Necessary for regular expressions as well.
  final targetType = message.targetType.replaceAll(' ', '');

  // If the expected target type is String, nothing to do...
  return targetType == 'String'
      ? message.json
      : ApiClient.fromJson(
          json.decode(message.json),
          targetType,
          growable: message.growable,
        );
}

/// Primarily intended for use in an isolate.
Future<String> serializeAsync(Object? value) async =>
    value == null ? '' : json.encode(value);
