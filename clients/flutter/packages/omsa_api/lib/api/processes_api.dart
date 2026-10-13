//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ProcessesApi {
  ProcessesApi([ApiClient? apiClient])
      : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Add traveller to package
  ///
  /// Adds a traveller to an existing package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [AddTravellerHandlerRequest] addTravellerHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> addTravellerHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    AddTravellerHandlerRequest addTravellerHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/add-traveller/execute';

    // ignore: prefer_final_locals
    Object? postBody = addTravellerHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Add traveller to package
  ///
  /// Adds a traveller to an existing package.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [AddTravellerHandlerRequest] addTravellerHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> addTravellerHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    AddTravellerHandlerRequest addTravellerHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await addTravellerHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      addTravellerHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Assign ancillary products to package
  ///
  /// Assigns ancillary products to a package or a package leg.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [AssignAncillaryProcessHandlerRequest] assignAncillaryProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> assignAncillaryProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    AssignAncillaryProcessHandlerRequest assignAncillaryProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/assign-ancillary/execute';

    // ignore: prefer_final_locals
    Object? postBody = assignAncillaryProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Assign ancillary products to package
  ///
  /// Assigns ancillary products to a package or a package leg.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [AssignAncillaryProcessHandlerRequest] assignAncillaryProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> assignAncillaryProcessHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    AssignAncillaryProcessHandlerRequest assignAncillaryProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await assignAncillaryProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      assignAncillaryProcessHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Assign asset to package leg
  ///
  /// Assigns an asset to a specific package leg.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [AssignAssetHandlerRequest] assignAssetHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> assignAssetHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    AssignAssetHandlerRequest assignAssetHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/assign-asset/execute';

    // ignore: prefer_final_locals
    Object? postBody = assignAssetHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Assign asset to package leg
  ///
  /// Assigns an asset to a specific package leg.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [AssignAssetHandlerRequest] assignAssetHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> assignAssetHandler(
    String acceptLanguage,
    String authorization,
    AssignAssetHandlerRequest assignAssetHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await assignAssetHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      assignAssetHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Cancel package
  ///
  /// Cancels an existing purchased or reserved package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [PurchasePackageProcessHandlerRequest] purchasePackageProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> cancelPackageProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    PurchasePackageProcessHandlerRequest purchasePackageProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/cancel-package/execute';

    // ignore: prefer_final_locals
    Object? postBody = purchasePackageProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Cancel package
  ///
  /// Cancels an existing purchased or reserved package.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [PurchasePackageProcessHandlerRequest] purchasePackageProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> cancelPackageProcessHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    PurchasePackageProcessHandlerRequest purchasePackageProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await cancelPackageProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      purchasePackageProcessHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Claim refund option for package
  ///
  /// Claims a refund option for the selected package content.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [ClaimRefundProcessHandlerRequest] claimRefundProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> claimRefundProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    ClaimRefundProcessHandlerRequest claimRefundProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/claim-refund-option/execute';

    // ignore: prefer_final_locals
    Object? postBody = claimRefundProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Claim refund option for package
  ///
  /// Claims a refund option for the selected package content.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [ClaimRefundProcessHandlerRequest] claimRefundProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> claimRefundProcessHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    ClaimRefundProcessHandlerRequest claimRefundProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await claimRefundProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      claimRefundProcessHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Confirm package before purchase
  ///
  /// Confirms a package before final purchase.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [PurchasePackageProcessHandlerRequest] purchasePackageProcessHandlerRequest (required):
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [List<num>] bbox:
  ///   Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> confirmPackageProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturPOS,
    PurchasePackageProcessHandlerRequest purchasePackageProcessHandlerRequest, {
    int? limit,
    int? offset,
    List<num>? bbox,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/confirm-package/execute';

    // ignore: prefer_final_locals
    Object? postBody = purchasePackageProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (limit != null) {
      queryParams.addAll(_queryParams('', 'limit', limit));
    }
    if (offset != null) {
      queryParams.addAll(_queryParams('', 'offset', offset));
    }
    if (bbox != null) {
      queryParams.addAll(_queryParams('csv', 'bbox', bbox));
    }

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Confirm package before purchase
  ///
  /// Confirms a package before final purchase.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [PurchasePackageProcessHandlerRequest] purchasePackageProcessHandlerRequest (required):
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [List<num>] bbox:
  ///   Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> confirmPackageProcessHandler(
    String acceptLanguage,
    String authorization,
    String enturPOS,
    PurchasePackageProcessHandlerRequest purchasePackageProcessHandlerRequest, {
    int? limit,
    int? offset,
    List<num>? bbox,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await confirmPackageProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturPOS,
      purchasePackageProcessHandlerRequest,
      limit: limit,
      offset: offset,
      bbox: bbox,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Confirm claimed refund option
  ///
  /// Confirms a previously claimed refund option.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [ClaimRefundProcessHandlerRequest] claimRefundProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> confirmRefundClaimProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    ClaimRefundProcessHandlerRequest claimRefundProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/confirm-refund-option/execute';

    // ignore: prefer_final_locals
    Object? postBody = claimRefundProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Confirm claimed refund option
  ///
  /// Confirms a previously claimed refund option.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [ClaimRefundProcessHandlerRequest] claimRefundProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> confirmRefundClaimProcessHandler(
    String acceptLanguage,
    String authorization,
    ClaimRefundProcessHandlerRequest claimRefundProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await confirmRefundClaimProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      claimRefundProcessHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Extend package reservation expiry
  ///
  /// Extends the expiry time for a reserved package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [ExtendExpiryTimeProcessHandlerRequest] extendExpiryTimeProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> extendExpiryTimeProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    ExtendExpiryTimeProcessHandlerRequest
        extendExpiryTimeProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/extend-expiry-time/execute';

    // ignore: prefer_final_locals
    Object? postBody = extendExpiryTimeProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Extend package reservation expiry
  ///
  /// Extends the expiry time for a reserved package.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [ExtendExpiryTimeProcessHandlerRequest] extendExpiryTimeProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> extendExpiryTimeProcessHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    ExtendExpiryTimeProcessHandlerRequest
        extendExpiryTimeProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await extendExpiryTimeProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      extendExpiryTimeProcessHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Purchase selected offers directly
  ///
  /// Purchases selected offers directly and returns the resulting package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [PurchaseOffersProcessHandlerRequest] purchaseOffersProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> purchaseOffersProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    PurchaseOffersProcessHandlerRequest purchaseOffersProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/purchase-offers/execute';

    // ignore: prefer_final_locals
    Object? postBody = purchaseOffersProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Purchase selected offers directly
  ///
  /// Purchases selected offers directly and returns the resulting package.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [PurchaseOffersProcessHandlerRequest] purchaseOffersProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> purchaseOffersProcessHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    PurchaseOffersProcessHandlerRequest purchaseOffersProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await purchaseOffersProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      purchaseOffersProcessHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Purchase existing package
  ///
  /// Purchases a previously created package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [PurchasePackageProcessHandlerRequest] purchasePackageProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> purchasePackageProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    PurchasePackageProcessHandlerRequest purchasePackageProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/purchase-package/execute';

    // ignore: prefer_final_locals
    Object? postBody = purchasePackageProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Purchase existing package
  ///
  /// Purchases a previously created package.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [PurchasePackageProcessHandlerRequest] purchasePackageProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> purchasePackageProcessHandler(
    String acceptLanguage,
    String authorization,
    PurchasePackageProcessHandlerRequest purchasePackageProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await purchasePackageProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      purchasePackageProcessHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Release package reservation
  ///
  /// Releases a package reservation.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [PurchasePackageProcessHandlerRequest] purchasePackageProcessHandlerRequest (required):
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [List<num>] bbox:
  ///   Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> releasePackageProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    PurchasePackageProcessHandlerRequest purchasePackageProcessHandlerRequest, {
    int? limit,
    int? offset,
    List<num>? bbox,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/release-package/execute';

    // ignore: prefer_final_locals
    Object? postBody = purchasePackageProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (limit != null) {
      queryParams.addAll(_queryParams('', 'limit', limit));
    }
    if (offset != null) {
      queryParams.addAll(_queryParams('', 'offset', offset));
    }
    if (bbox != null) {
      queryParams.addAll(_queryParams('csv', 'bbox', bbox));
    }

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Release package reservation
  ///
  /// Releases a package reservation.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [PurchasePackageProcessHandlerRequest] purchasePackageProcessHandlerRequest (required):
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [List<num>] bbox:
  ///   Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> releasePackageProcessHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    PurchasePackageProcessHandlerRequest purchasePackageProcessHandlerRequest, {
    int? limit,
    int? offset,
    List<num>? bbox,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await releasePackageProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      purchasePackageProcessHandlerRequest,
      limit: limit,
      offset: offset,
      bbox: bbox,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Remove traveller from package
  ///
  /// Removes a traveller from an existing package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [RemoveTravellerHandlerRequest] removeTravellerHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> removeTravellerHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    RemoveTravellerHandlerRequest removeTravellerHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/remove-traveller/execute';

    // ignore: prefer_final_locals
    Object? postBody = removeTravellerHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Remove traveller from package
  ///
  /// Removes a traveller from an existing package.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [RemoveTravellerHandlerRequest] removeTravellerHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> removeTravellerHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    RemoveTravellerHandlerRequest removeTravellerHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await removeTravellerHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      removeTravellerHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Search available travel offers
  ///
  /// Searches for available offers based on travel and traveller criteria.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [SearchOfferHandlerRequest] searchOfferHandlerRequest (required):
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [List<num>] bbox:
  ///   Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> searchOfferHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    SearchOfferHandlerRequest searchOfferHandlerRequest, {
    int? limit,
    int? offset,
    List<num>? bbox,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/search-offers/execute';

    // ignore: prefer_final_locals
    Object? postBody = searchOfferHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (limit != null) {
      queryParams.addAll(_queryParams('', 'limit', limit));
    }
    if (offset != null) {
      queryParams.addAll(_queryParams('', 'offset', offset));
    }
    if (bbox != null) {
      queryParams.addAll(_queryParams('csv', 'bbox', bbox));
    }

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Search available travel offers
  ///
  /// Searches for available offers based on travel and traveller criteria.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [SearchOfferHandlerRequest] searchOfferHandlerRequest (required):
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [List<num>] bbox:
  ///   Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth): * Lower left corner, coordinate axis 1 * Lower left corner, coordinate axis 2 * Minimum value, coordinate axis 3 (optional) * Upper right corner, coordinate axis 1 * Upper right corner, coordinate axis 2 * Maximum value, coordinate axis 3 (optional) If the value consists of four numbers, the coordinate reference system is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84) unless a different coordinate reference system is specified in the parameter `bbox-crs`. If the value consists of six numbers, the coordinate reference system is WGS 84 longitude/latitude/ellipsoidal height (http://www.opengis.net/def/crs/OGC/0/CRS84h) unless a different coordinate reference system is specified in the parameter `bbox-crs`. The query parameter `bbox-crs` is specified in OGC API - Features - Part 2: Coordinate Reference Systems by Reference. For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge). If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box. If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<OfferCollection?> searchOfferHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    SearchOfferHandlerRequest searchOfferHandlerRequest, {
    int? limit,
    int? offset,
    List<num>? bbox,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await searchOfferHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      searchOfferHandlerRequest,
      limit: limit,
      offset: offset,
      bbox: bbox,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'OfferCollection',
      ) as OfferCollection;
    }
    return null;
  }

  /// Create draft package from selected offers
  ///
  /// Creates or updates a draft package from selected offer identifiers.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [SelectOffersHandlerRequest] selectOffersHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> selectOffersHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    SelectOffersHandlerRequest selectOffersHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/select-offers/execute';

    // ignore: prefer_final_locals
    Object? postBody = selectOffersHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Create draft package from selected offers
  ///
  /// Creates or updates a draft package from selected offer identifiers.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [SelectOffersHandlerRequest] selectOffersHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> selectOffersHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    SelectOffersHandlerRequest selectOffersHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await selectOffersHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      selectOffersHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }

  /// Update travel document validity start
  ///
  /// Updates the validity start time for a travel document in a package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [UpdateTravelDocumentValidityProcessHandlerRequest] updateTravelDocumentValidityProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> updateTravelDocumentValidityProcessHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    UpdateTravelDocumentValidityProcessHandlerRequest
        updateTravelDocumentValidityProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/update-travel-document-validity/execute';

    // ignore: prefer_final_locals
    Object? postBody = updateTravelDocumentValidityProcessHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Update travel document validity start
  ///
  /// Updates the validity start time for a travel document in a package.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [UpdateTravelDocumentValidityProcessHandlerRequest] updateTravelDocumentValidityProcessHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<UpdateTravelDocumentValidityResponse?>
      updateTravelDocumentValidityProcessHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    UpdateTravelDocumentValidityProcessHandlerRequest
        updateTravelDocumentValidityProcessHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response =
        await updateTravelDocumentValidityProcessHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      updateTravelDocumentValidityProcessHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'UpdateTravelDocumentValidityResponse',
      ) as UpdateTravelDocumentValidityResponse;
    }
    return null;
  }

  /// Update traveller in package
  ///
  /// Updates traveller details in an existing package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [UpdateTravellerHandlerRequest] updateTravellerHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> updateTravellerHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    UpdateTravellerHandlerRequest updateTravellerHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/processes/update-traveller/execute';

    // ignore: prefer_final_locals
    Object? postBody = updateTravellerHandlerRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    headerParams[r'Entur-Distribution-Channel'] =
        parameterToString(enturDistributionChannel);
    headerParams[r'Entur-POS'] = parameterToString(enturPOS);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>['application/json'];

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Update traveller in package
  ///
  /// Updates traveller details in an existing package.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] enturPOS (required):
  ///   Point-of-sale identifier used by downstream sales and ticket distribution services.
  ///
  /// * [UpdateTravellerHandlerRequest] updateTravellerHandlerRequest (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> updateTravellerHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    UpdateTravellerHandlerRequest updateTravellerHandlerRequest, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await updateTravellerHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      updateTravellerHandlerRequest,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty &&
        response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(
        await _decodeBodyBytes(response),
        'Package',
      ) as Package;
    }
    return null;
  }
}
