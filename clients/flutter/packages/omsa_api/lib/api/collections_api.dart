//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CollectionsApi {
  CollectionsApi([ApiClient? apiClient])
      : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// List ancillaries for package or leg
  ///
  /// Retrieves ancillary products for a package, optionally filtered by leg.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] packageId (required):
  ///   the identifier of a package
  ///
  /// * [String] legId (required):
  ///   leg identifier
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> ancillariesCollectionHandlerWithHttpInfo(
    String packageId,
    String legId,
    String acceptLanguage,
    String authorization, {
    int? limit,
    int? offset,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/ancillaries/items';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    queryParams.addAll(_queryParams('', 'packageId', packageId));
    queryParams.addAll(_queryParams('', 'legId', legId));
    if (limit != null) {
      queryParams.addAll(_queryParams('', 'limit', limit));
    }
    if (offset != null) {
      queryParams.addAll(_queryParams('', 'offset', offset));
    }

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List ancillaries for package or leg
  ///
  /// Retrieves ancillary products for a package, optionally filtered by leg.
  ///
  /// Parameters:
  ///
  /// * [String] packageId (required):
  ///   the identifier of a package
  ///
  /// * [String] legId (required):
  ///   leg identifier
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<List<AncillaryCollection>?> ancillariesCollectionHandler(
    String packageId,
    String legId,
    String acceptLanguage,
    String authorization, {
    int? limit,
    int? offset,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await ancillariesCollectionHandlerWithHttpInfo(
      packageId,
      legId,
      acceptLanguage,
      authorization,
      limit: limit,
      offset: offset,
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
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(
              responseBody, 'List<AncillaryCollection>') as List)
          .cast<AncillaryCollection>()
          .toList(growable: false);
    }
    return null;
  }

  /// List assets for package or leg
  ///
  /// Retrieves asset information for a package, optionally filtered by leg.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] packageId (required):
  ///   the identifier of a package
  ///
  /// * [String] legId (required):
  ///   leg identifier
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
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
  Future<Response> assetCollectionHandlerWithHttpInfo(
    String packageId,
    String legId,
    String acceptLanguage,
    String authorization, {
    int? limit,
    int? offset,
    List<num>? bbox,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/assets/items';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    queryParams.addAll(_queryParams('', 'packageId', packageId));
    queryParams.addAll(_queryParams('', 'legId', legId));
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
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List assets for package or leg
  ///
  /// Retrieves asset information for a package, optionally filtered by leg.
  ///
  /// Parameters:
  ///
  /// * [String] packageId (required):
  ///   the identifier of a package
  ///
  /// * [String] legId (required):
  ///   leg identifier
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
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
  Future<Geojson?> assetCollectionHandler(
    String packageId,
    String legId,
    String acceptLanguage,
    String authorization, {
    int? limit,
    int? offset,
    List<num>? bbox,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await assetCollectionHandlerWithHttpInfo(
      packageId,
      legId,
      acceptLanguage,
      authorization,
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
        'Geojson',
      ) as Geojson;
    }
    return null;
  }

  /// List available change options
  ///
  /// Retrieves available change options for a package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] packageId (required):
  ///   the identifier of a package
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
  /// * [String] legId:
  ///   leg identifier
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> changeOptionHandlerWithHttpInfo(
    String packageId,
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS, {
    String? legId,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/change-options/items';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    queryParams.addAll(_queryParams('', 'packageId', packageId));
    if (legId != null) {
      queryParams.addAll(_queryParams('', 'legId', legId));
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

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List available change options
  ///
  /// Retrieves available change options for a package.
  ///
  /// Parameters:
  ///
  /// * [String] packageId (required):
  ///   the identifier of a package
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
  /// * [String] legId:
  ///   leg identifier
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<ChangeOptionCollection?> changeOptionHandler(
    String packageId,
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS, {
    String? legId,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await changeOptionHandlerWithHttpInfo(
      packageId,
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      legId: legId,
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
        'ChangeOptionCollection',
      ) as ChangeOptionCollection;
    }
    return null;
  }

  /// Create customer record
  ///
  /// Create a customer record that can be used for purchases.
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
  /// * [CustomerInput] customerInput (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> createCustomerHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    CustomerInput customerInput, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/customers/items';

    // ignore: prefer_final_locals
    Object? postBody = customerInput;

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

  /// Create customer record
  ///
  /// Create a customer record that can be used for purchases.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [CustomerInput] customerInput (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Customer?> createCustomerHandler(
    String acceptLanguage,
    String authorization,
    CustomerInput customerInput, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await createCustomerHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      customerInput,
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
        'Customer',
      ) as Customer;
    }
    return null;
  }

  /// List customers with filters
  ///
  /// Retrieve customers with optional filters and pagination.
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
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [String] customerId:
  ///   optional customer identifier filter
  ///
  /// * [String] externalReference:
  ///   optional filter on the client's own customer reference
  ///
  /// * [String] firstName:
  ///   optional first name filter
  ///
  /// * [String] lastName:
  ///   optional last name filter
  ///
  /// * [String] email:
  ///   optional email filter
  ///
  /// * [String] phoneNumber:
  ///   optional phone number filter, either in E.164 format (send + URL-encoded as %2B) or the national number without country code
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> customerCollectionHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization, {
    int? limit,
    int? offset,
    String? customerId,
    String? externalReference,
    String? firstName,
    String? lastName,
    String? email,
    String? phoneNumber,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/customers/items';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (limit != null) {
      queryParams.addAll(_queryParams('', 'limit', limit));
    }
    if (offset != null) {
      queryParams.addAll(_queryParams('', 'offset', offset));
    }
    if (customerId != null) {
      queryParams.addAll(_queryParams('', 'customerId', customerId));
    }
    if (externalReference != null) {
      queryParams
          .addAll(_queryParams('', 'externalReference', externalReference));
    }
    if (firstName != null) {
      queryParams.addAll(_queryParams('', 'firstName', firstName));
    }
    if (lastName != null) {
      queryParams.addAll(_queryParams('', 'lastName', lastName));
    }
    if (email != null) {
      queryParams.addAll(_queryParams('', 'email', email));
    }
    if (phoneNumber != null) {
      queryParams.addAll(_queryParams('', 'phoneNumber', phoneNumber));
    }

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List customers with filters
  ///
  /// Retrieve customers with optional filters and pagination.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [String] customerId:
  ///   optional customer identifier filter
  ///
  /// * [String] externalReference:
  ///   optional filter on the client's own customer reference
  ///
  /// * [String] firstName:
  ///   optional first name filter
  ///
  /// * [String] lastName:
  ///   optional last name filter
  ///
  /// * [String] email:
  ///   optional email filter
  ///
  /// * [String] phoneNumber:
  ///   optional phone number filter, either in E.164 format (send + URL-encoded as %2B) or the national number without country code
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<CustomerCollection?> customerCollectionHandler(
    String acceptLanguage,
    String authorization, {
    int? limit,
    int? offset,
    String? customerId,
    String? externalReference,
    String? firstName,
    String? lastName,
    String? email,
    String? phoneNumber,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await customerCollectionHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      limit: limit,
      offset: offset,
      customerId: customerId,
      externalReference: externalReference,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
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
        'CustomerCollection',
      ) as CustomerCollection;
    }
    return null;
  }

  /// Delete customer record
  ///
  /// Delete the customer record.
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
  /// * [String] customerId (required):
  ///   customer identifier
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> deleteCustomerHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String customerId, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/customers/items/{customerId}'
        .replaceAll('{customerId}', customerId);

    // ignore: prefer_final_locals
    Object? postBody;

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

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'DELETE',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Delete customer record
  ///
  /// Delete the customer record.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] customerId (required):
  ///   customer identifier
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<void> deleteCustomerHandler(
    String acceptLanguage,
    String authorization,
    String customerId, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await deleteCustomerHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      customerId,
      eTClientName: eTClientName,
      xCorrelationId: xCorrelationId,
    );
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
  }

  /// Get customer by ID
  ///
  /// Retrieves a single customer by identifier.
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
  /// * [String] customerId (required):
  ///   customer identifier
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> getCustomerHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String customerId, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/customers/items/{customerId}'
        .replaceAll('{customerId}', customerId);

    // ignore: prefer_final_locals
    Object? postBody;

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

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Get customer by ID
  ///
  /// Retrieves a single customer by identifier.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] customerId (required):
  ///   customer identifier
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Customer?> getCustomerHandler(
    String acceptLanguage,
    String authorization,
    String customerId, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await getCustomerHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      customerId,
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
        'Customer',
      ) as Customer;
    }
    return null;
  }

  /// List configured external data sources
  ///
  /// Retrieves all datasources
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
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> getDataSourcesWithHttpInfo(
    String acceptLanguage,
    String authorization, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/datasources/items';

    // ignore: prefer_final_locals
    Object? postBody;

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

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List configured external data sources
  ///
  /// Retrieves all datasources
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<List<Link>?> getDataSources(
    String acceptLanguage,
    String authorization, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await getDataSourcesWithHttpInfo(
      acceptLanguage,
      authorization,
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
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<Link>')
              as List)
          .cast<Link>()
          .toList(growable: false);
    }
    return null;
  }

  /// Get package by ID
  ///
  /// Retrieves a single package by identifier.
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
  /// * [String] packageId (required):
  ///   The unique identifier of the package to retrieve
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> getPackageWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String packageId, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/packages/items/{packageId}'
        .replaceAll('{packageId}', packageId);

    // ignore: prefer_final_locals
    Object? postBody;

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

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Get package by ID
  ///
  /// Retrieves a single package by identifier.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] packageId (required):
  ///   The unique identifier of the package to retrieve
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Package?> getPackage(
    String acceptLanguage,
    String authorization,
    String packageId, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await getPackageWithHttpInfo(
      acceptLanguage,
      authorization,
      packageId,
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

  /// List purchased packages
  ///
  /// Returns a paginated list of packages belonging to the authenticated user.
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
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [String] packageId:
  ///   the identifier of a package (maps to Orders id)
  ///
  /// * [String] customerId:
  ///   optional owner customer identifier filter (maps to Orders createdBy, exact match only)
  ///
  /// * [String] contactCustomerId:
  ///   optional contact customer identifier filter (maps to Orders contact, exact match only)
  ///
  /// * [List<String>] balance:
  ///   optional package balance filter, passed through to Orders balance filter
  ///
  /// * [List<String>] createdAt:
  ///   optional package created-at filter, passed through to Orders createdAt filter
  ///
  /// * [List<String>] currency:
  ///   optional package currency filter, passed through to Orders currency filter
  ///
  /// * [List<String>] datedServiceJourneyId:
  ///   optional package dated service journey ID filter, passed through to Orders datedServiceJourneyId filter
  ///
  /// * [List<String>] distributionChannelId:
  ///   optional package distribution channel ID filter, passed through to Orders distributionChannelId filter
  ///
  /// * [List<String>] endTime:
  ///   optional package end-time filter, passed through to Orders endTime filter
  ///
  /// * [List<String>] externalReference:
  ///   optional package external reference filter, passed through to Orders externalReference filter
  ///
  /// * [List<String>] fromStopPlaceId:
  ///   optional package from stop place ID filter, passed through to Orders fromStopPlaceId filter
  ///
  /// * [List<String>] lastConfirmedAt:
  ///   optional package last-confirmed-at filter, passed through to Orders lastConfirmedAt filter
  ///
  /// * [String] orderBy:
  ///   optional package orderBy value, passed through to Orders orderBy
  ///
  /// * [List<String>] legExternalReference:
  ///   optional package leg external reference filter, mapped to Orders orderLineExternalReference
  ///
  /// * [List<String>] legId:
  ///   optional package leg identifier filter, mapped to Orders orderLineId
  ///
  /// * [List<String>] organisationId:
  ///   optional package organisation ID filter, passed through to Orders organisationId filter
  ///
  /// * [List<String>] originalDatedServiceJourneyId:
  ///   optional package original dated service journey ID filter, passed through to Orders originalDatedServiceJourneyId filter
  ///
  /// * [List<String>] pos:
  ///   optional package POS filter, passed through to Orders pos filter
  ///
  /// * [List<String>] reservationId:
  ///   optional package reservation ID filter, passed through to Orders reservationId filter
  ///
  /// * [List<String>] productId:
  ///   optional package product ID filter, mapped to Orders fareProductId
  ///
  /// * [List<String>] fareProductVersion:
  ///   optional package fare product version filter, passed through to Orders fareProductVersion filter
  ///
  /// * [List<String>] serviceJourneyId:
  ///   optional package service journey ID filter, passed through to Orders serviceJourneyId filter
  ///
  /// * [String] sortBy:
  ///   optional package sort direction (ASC or DESC), passed through to Orders sortBy
  ///
  /// * [List<String>] startTime:
  ///   optional package start-time filter, passed through to Orders startTime filter
  ///
  /// * [List<String>] toStopPlaceId:
  ///   optional package to stop place ID filter, passed through to Orders toStopPlaceId filter
  ///
  /// * [List<String>] totalAmount:
  ///   optional package total amount filter, passed through to Orders totalAmount filter
  ///
  /// * [List<String>] totalTaxAmount:
  ///   optional package total tax amount filter, passed through to Orders totalTaxAmount filter
  ///
  /// * [List<String>] version:
  ///   optional package version filter, passed through to Orders version filter
  ///
  /// * [PackageStatus] status:
  ///   Filter packages by their lifecycle status (e.g. CONFIRMED, CANCELLED)
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> packageCollectionHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization, {
    int? limit,
    int? offset,
    String? packageId,
    String? customerId,
    String? contactCustomerId,
    List<String>? balance,
    List<String>? createdAt,
    List<String>? currency,
    List<String>? datedServiceJourneyId,
    List<String>? distributionChannelId,
    List<String>? endTime,
    List<String>? externalReference,
    List<String>? fromStopPlaceId,
    List<String>? lastConfirmedAt,
    String? orderBy,
    List<String>? legExternalReference,
    List<String>? legId,
    List<String>? organisationId,
    List<String>? originalDatedServiceJourneyId,
    List<String>? pos,
    List<String>? reservationId,
    List<String>? productId,
    List<String>? fareProductVersion,
    List<String>? serviceJourneyId,
    String? sortBy,
    List<String>? startTime,
    List<String>? toStopPlaceId,
    List<String>? totalAmount,
    List<String>? totalTaxAmount,
    List<String>? version,
    PackageStatus? status,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/packages/items';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (limit != null) {
      queryParams.addAll(_queryParams('', 'limit', limit));
    }
    if (offset != null) {
      queryParams.addAll(_queryParams('', 'offset', offset));
    }
    if (packageId != null) {
      queryParams.addAll(_queryParams('', 'packageId', packageId));
    }
    if (customerId != null) {
      queryParams.addAll(_queryParams('', 'customerId', customerId));
    }
    if (contactCustomerId != null) {
      queryParams
          .addAll(_queryParams('', 'contactCustomerId', contactCustomerId));
    }
    if (balance != null) {
      queryParams.addAll(_queryParams('multi', 'balance', balance));
    }
    if (createdAt != null) {
      queryParams.addAll(_queryParams('multi', 'createdAt', createdAt));
    }
    if (currency != null) {
      queryParams.addAll(_queryParams('multi', 'currency', currency));
    }
    if (datedServiceJourneyId != null) {
      queryParams.addAll(_queryParams(
          'multi', 'datedServiceJourneyId', datedServiceJourneyId));
    }
    if (distributionChannelId != null) {
      queryParams.addAll(_queryParams(
          'multi', 'distributionChannelId', distributionChannelId));
    }
    if (endTime != null) {
      queryParams.addAll(_queryParams('multi', 'endTime', endTime));
    }
    if (externalReference != null) {
      queryParams.addAll(
          _queryParams('multi', 'externalReference', externalReference));
    }
    if (fromStopPlaceId != null) {
      queryParams
          .addAll(_queryParams('multi', 'fromStopPlaceId', fromStopPlaceId));
    }
    if (lastConfirmedAt != null) {
      queryParams
          .addAll(_queryParams('multi', 'lastConfirmedAt', lastConfirmedAt));
    }
    if (orderBy != null) {
      queryParams.addAll(_queryParams('', 'orderBy', orderBy));
    }
    if (legExternalReference != null) {
      queryParams.addAll(
          _queryParams('multi', 'legExternalReference', legExternalReference));
    }
    if (legId != null) {
      queryParams.addAll(_queryParams('multi', 'legId', legId));
    }
    if (organisationId != null) {
      queryParams
          .addAll(_queryParams('multi', 'organisationId', organisationId));
    }
    if (originalDatedServiceJourneyId != null) {
      queryParams.addAll(_queryParams('multi', 'originalDatedServiceJourneyId',
          originalDatedServiceJourneyId));
    }
    if (pos != null) {
      queryParams.addAll(_queryParams('multi', 'pos', pos));
    }
    if (reservationId != null) {
      queryParams.addAll(_queryParams('multi', 'reservationId', reservationId));
    }
    if (productId != null) {
      queryParams.addAll(_queryParams('multi', 'productId', productId));
    }
    if (fareProductVersion != null) {
      queryParams.addAll(
          _queryParams('multi', 'fareProductVersion', fareProductVersion));
    }
    if (serviceJourneyId != null) {
      queryParams
          .addAll(_queryParams('multi', 'serviceJourneyId', serviceJourneyId));
    }
    if (sortBy != null) {
      queryParams.addAll(_queryParams('', 'sortBy', sortBy));
    }
    if (startTime != null) {
      queryParams.addAll(_queryParams('multi', 'startTime', startTime));
    }
    if (toStopPlaceId != null) {
      queryParams.addAll(_queryParams('multi', 'toStopPlaceId', toStopPlaceId));
    }
    if (totalAmount != null) {
      queryParams.addAll(_queryParams('multi', 'totalAmount', totalAmount));
    }
    if (totalTaxAmount != null) {
      queryParams
          .addAll(_queryParams('multi', 'totalTaxAmount', totalTaxAmount));
    }
    if (version != null) {
      queryParams.addAll(_queryParams('multi', 'version', version));
    }
    if (status != null) {
      queryParams.addAll(_queryParams('', 'status', status));
    }

    headerParams[r'Accept-Language'] = parameterToString(acceptLanguage);
    headerParams[r'authorization'] = parameterToString(authorization);
    if (eTClientName != null) {
      headerParams[r'ET-Client-Name'] = parameterToString(eTClientName);
    }
    if (xCorrelationId != null) {
      headerParams[r'X-Correlation-Id'] = parameterToString(xCorrelationId);
    }

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List purchased packages
  ///
  /// Returns a paginated list of packages belonging to the authenticated user.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [int] limit:
  ///   The optional limit parameter limits the number of items that are presented in the response document. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Minimum = 1. Maximum = 10000. Default = 100.
  ///
  /// * [int] offset:
  ///   The optional offset parameter representing the starting index of the returned collection. Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items shall not be counted. Default = 0.
  ///
  /// * [String] packageId:
  ///   the identifier of a package (maps to Orders id)
  ///
  /// * [String] customerId:
  ///   optional owner customer identifier filter (maps to Orders createdBy, exact match only)
  ///
  /// * [String] contactCustomerId:
  ///   optional contact customer identifier filter (maps to Orders contact, exact match only)
  ///
  /// * [List<String>] balance:
  ///   optional package balance filter, passed through to Orders balance filter
  ///
  /// * [List<String>] createdAt:
  ///   optional package created-at filter, passed through to Orders createdAt filter
  ///
  /// * [List<String>] currency:
  ///   optional package currency filter, passed through to Orders currency filter
  ///
  /// * [List<String>] datedServiceJourneyId:
  ///   optional package dated service journey ID filter, passed through to Orders datedServiceJourneyId filter
  ///
  /// * [List<String>] distributionChannelId:
  ///   optional package distribution channel ID filter, passed through to Orders distributionChannelId filter
  ///
  /// * [List<String>] endTime:
  ///   optional package end-time filter, passed through to Orders endTime filter
  ///
  /// * [List<String>] externalReference:
  ///   optional package external reference filter, passed through to Orders externalReference filter
  ///
  /// * [List<String>] fromStopPlaceId:
  ///   optional package from stop place ID filter, passed through to Orders fromStopPlaceId filter
  ///
  /// * [List<String>] lastConfirmedAt:
  ///   optional package last-confirmed-at filter, passed through to Orders lastConfirmedAt filter
  ///
  /// * [String] orderBy:
  ///   optional package orderBy value, passed through to Orders orderBy
  ///
  /// * [List<String>] legExternalReference:
  ///   optional package leg external reference filter, mapped to Orders orderLineExternalReference
  ///
  /// * [List<String>] legId:
  ///   optional package leg identifier filter, mapped to Orders orderLineId
  ///
  /// * [List<String>] organisationId:
  ///   optional package organisation ID filter, passed through to Orders organisationId filter
  ///
  /// * [List<String>] originalDatedServiceJourneyId:
  ///   optional package original dated service journey ID filter, passed through to Orders originalDatedServiceJourneyId filter
  ///
  /// * [List<String>] pos:
  ///   optional package POS filter, passed through to Orders pos filter
  ///
  /// * [List<String>] reservationId:
  ///   optional package reservation ID filter, passed through to Orders reservationId filter
  ///
  /// * [List<String>] productId:
  ///   optional package product ID filter, mapped to Orders fareProductId
  ///
  /// * [List<String>] fareProductVersion:
  ///   optional package fare product version filter, passed through to Orders fareProductVersion filter
  ///
  /// * [List<String>] serviceJourneyId:
  ///   optional package service journey ID filter, passed through to Orders serviceJourneyId filter
  ///
  /// * [String] sortBy:
  ///   optional package sort direction (ASC or DESC), passed through to Orders sortBy
  ///
  /// * [List<String>] startTime:
  ///   optional package start-time filter, passed through to Orders startTime filter
  ///
  /// * [List<String>] toStopPlaceId:
  ///   optional package to stop place ID filter, passed through to Orders toStopPlaceId filter
  ///
  /// * [List<String>] totalAmount:
  ///   optional package total amount filter, passed through to Orders totalAmount filter
  ///
  /// * [List<String>] totalTaxAmount:
  ///   optional package total tax amount filter, passed through to Orders totalTaxAmount filter
  ///
  /// * [List<String>] version:
  ///   optional package version filter, passed through to Orders version filter
  ///
  /// * [PackageStatus] status:
  ///   Filter packages by their lifecycle status (e.g. CONFIRMED, CANCELLED)
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<PackageCollection?> packageCollectionHandler(
    String acceptLanguage,
    String authorization, {
    int? limit,
    int? offset,
    String? packageId,
    String? customerId,
    String? contactCustomerId,
    List<String>? balance,
    List<String>? createdAt,
    List<String>? currency,
    List<String>? datedServiceJourneyId,
    List<String>? distributionChannelId,
    List<String>? endTime,
    List<String>? externalReference,
    List<String>? fromStopPlaceId,
    List<String>? lastConfirmedAt,
    String? orderBy,
    List<String>? legExternalReference,
    List<String>? legId,
    List<String>? organisationId,
    List<String>? originalDatedServiceJourneyId,
    List<String>? pos,
    List<String>? reservationId,
    List<String>? productId,
    List<String>? fareProductVersion,
    List<String>? serviceJourneyId,
    String? sortBy,
    List<String>? startTime,
    List<String>? toStopPlaceId,
    List<String>? totalAmount,
    List<String>? totalTaxAmount,
    List<String>? version,
    PackageStatus? status,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await packageCollectionHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      limit: limit,
      offset: offset,
      packageId: packageId,
      customerId: customerId,
      contactCustomerId: contactCustomerId,
      balance: balance,
      createdAt: createdAt,
      currency: currency,
      datedServiceJourneyId: datedServiceJourneyId,
      distributionChannelId: distributionChannelId,
      endTime: endTime,
      externalReference: externalReference,
      fromStopPlaceId: fromStopPlaceId,
      lastConfirmedAt: lastConfirmedAt,
      orderBy: orderBy,
      legExternalReference: legExternalReference,
      legId: legId,
      organisationId: organisationId,
      originalDatedServiceJourneyId: originalDatedServiceJourneyId,
      pos: pos,
      reservationId: reservationId,
      productId: productId,
      fareProductVersion: fareProductVersion,
      serviceJourneyId: serviceJourneyId,
      sortBy: sortBy,
      startTime: startTime,
      toStopPlaceId: toStopPlaceId,
      totalAmount: totalAmount,
      totalTaxAmount: totalTaxAmount,
      version: version,
      status: status,
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
        'PackageCollection',
      ) as PackageCollection;
    }
    return null;
  }

  /// List available refund options
  ///
  /// Retrieves available refund options for a package.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] packageId (required):
  ///   the identifier of a package
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] legId:
  ///   leg identifier
  ///
  /// * [String] travellerId:
  ///   traveller identifier
  ///
  /// * [String] ancillaryId:
  ///   ancillary identifier
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> refundOptionHandlerWithHttpInfo(
    String packageId,
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel, {
    String? legId,
    String? travellerId,
    String? ancillaryId,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/refund-options/items';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    queryParams.addAll(_queryParams('', 'packageId', packageId));
    if (legId != null) {
      queryParams.addAll(_queryParams('', 'legId', legId));
    }
    if (travellerId != null) {
      queryParams.addAll(_queryParams('', 'travellerId', travellerId));
    }
    if (ancillaryId != null) {
      queryParams.addAll(_queryParams('', 'ancillaryId', ancillaryId));
    }

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

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List available refund options
  ///
  /// Retrieves available refund options for a package.
  ///
  /// Parameters:
  ///
  /// * [String] packageId (required):
  ///   the identifier of a package
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] enturDistributionChannel (required):
  ///   Distribution channel identifier used by downstream sales and ticket distribution services.
  ///
  /// * [String] legId:
  ///   leg identifier
  ///
  /// * [String] travellerId:
  ///   traveller identifier
  ///
  /// * [String] ancillaryId:
  ///   ancillary identifier
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<RefundOptionCollection?> refundOptionHandler(
    String packageId,
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel, {
    String? legId,
    String? travellerId,
    String? ancillaryId,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await refundOptionHandlerWithHttpInfo(
      packageId,
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      legId: legId,
      travellerId: travellerId,
      ancillaryId: ancillaryId,
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
        'RefundOptionCollection',
      ) as RefundOptionCollection;
    }
    return null;
  }

  /// List travel documents for package
  ///
  /// Retrieves travel documents for a package with optional status filtering.
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
  /// * [String] packageId (required):
  ///   the identifier of a package
  ///
  /// * [String] legId:
  ///   leg identifier
  ///
  /// * [TravelDocumentStatus] status:
  ///   Filter travel documents by status
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> traveldocumentsCollectionHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    String packageId, {
    String? legId,
    TravelDocumentStatus? status,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/travel-documents/items';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    queryParams.addAll(_queryParams('', 'packageId', packageId));
    if (legId != null) {
      queryParams.addAll(_queryParams('', 'legId', legId));
    }
    if (status != null) {
      queryParams.addAll(_queryParams('', 'status', status));
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

    const contentTypes = <String>[];

    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// List travel documents for package
  ///
  /// Retrieves travel documents for a package with optional status filtering.
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
  /// * [String] packageId (required):
  ///   the identifier of a package
  ///
  /// * [String] legId:
  ///   leg identifier
  ///
  /// * [TravelDocumentStatus] status:
  ///   Filter travel documents by status
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<TravelDocumentCollection?> traveldocumentsCollectionHandler(
    String acceptLanguage,
    String authorization,
    String enturDistributionChannel,
    String enturPOS,
    String packageId, {
    String? legId,
    TravelDocumentStatus? status,
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await traveldocumentsCollectionHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      enturDistributionChannel,
      enturPOS,
      packageId,
      legId: legId,
      status: status,
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
        'TravelDocumentCollection',
      ) as TravelDocumentCollection;
    }
    return null;
  }

  /// Replace customer record
  ///
  /// Replace the customer record.
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
  /// * [String] customerId (required):
  ///   customer identifier
  ///
  /// * [CustomerInput] customerInput (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Response> updateCustomerHandlerWithHttpInfo(
    String acceptLanguage,
    String authorization,
    String customerId,
    CustomerInput customerInput, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    // ignore: prefer_const_declarations
    final path = r'/collections/customers/items/{customerId}'
        .replaceAll('{customerId}', customerId);

    // ignore: prefer_final_locals
    Object? postBody = customerInput;

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
      'PUT',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Replace customer record
  ///
  /// Replace the customer record.
  ///
  /// Parameters:
  ///
  /// * [String] acceptLanguage (required):
  ///
  /// * [String] authorization (required):
  ///   Header field, JWT must be supplied
  ///
  /// * [String] customerId (required):
  ///   customer identifier
  ///
  /// * [CustomerInput] customerInput (required):
  ///
  /// * [String] eTClientName:
  ///   Entur Client Header. It is required that all consumers identify themselves by using this header. Entur will deploy strict rate-limiting policies on API-consumers who do not identify with a header and reserves the right to block unidentified consumers. The structure of ET-Client-Name should be: `<company>-<application>`.
  ///
  /// * [String] xCorrelationId:
  ///   Correlation id
  Future<Customer?> updateCustomerHandler(
    String acceptLanguage,
    String authorization,
    String customerId,
    CustomerInput customerInput, {
    String? eTClientName,
    String? xCorrelationId,
  }) async {
    final response = await updateCustomerHandlerWithHttpInfo(
      acceptLanguage,
      authorization,
      customerId,
      customerInput,
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
        'Customer',
      ) as Customer;
    }
    return null;
  }
}
