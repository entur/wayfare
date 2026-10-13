//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:omsa_api/api.dart';
import 'package:test/test.dart';

/// tests for CollectionsApi
void main() {
  // final instance = CollectionsApi();

  group('tests for CollectionsApi', () {
    // Handles ancillaries collections
    //
    //Future<List<AncillaryCollection>> ancillariesCollectionHandler(String packageId, String legId, String acceptLanguage, String authorization, { int limit, int offset }) async
    test('test ancillariesCollectionHandler', () async {
      // TODO
    });

    // Handles asset collections
    //
    //Future<Geojson> assetCollectionHandler(String packageId, String legId, String acceptLanguage, String authorization, { int limit, int offset, List<num> bbox }) async
    test('test assetCollectionHandler', () async {
      // TODO
    });

    // Handles change options collections
    //
    //Future<ChangeOptionCollection> changeOptionHandler(String packageId, String acceptLanguage, String authorization, { String legId }) async
    test('test changeOptionHandler', () async {
      // TODO
    });

    // Retrieves all (external) datasources, that are used in requests and responses
    //
    // Retrieves all datasources
    //
    //Future<List<Link>> getDataSources(String acceptLanguage, String authorization) async
    test('test getDataSources', () async {
      // TODO
    });

    // Retrieve a single package
    //
    //Future<Package> getPackage(String acceptLanguage, String authorization, String packageId) async
    test('test getPackage', () async {
      // TODO
    });

    // Retrieve a history of purchased packages
    //
    // Returns a paginated list of packages belonging to the authenticated user.
    //
    //Future<PackageCollection> packageCollectionHandler(String acceptLanguage, String authorization, { int limit, int offset, String packageId, PackageStatus status }) async
    test('test packageCollectionHandler', () async {
      // TODO
    });

    // Handles refund options collections
    //
    //Future<RefundOptionCollection> refundOptionHandler(String packageId, String acceptLanguage, String authorization, { String legId, String travellerId, String ancillaryId }) async
    test('test refundOptionHandler', () async {
      // TODO
    });

    // Handles travel documents
    //
    //Future<TravelDocumentCollection> traveldocumentsCollectionHandler(String acceptLanguage, String authorization, String packageId, { String legId }) async
    test('test traveldocumentsCollectionHandler', () async {
      // TODO
    });
  });
}
