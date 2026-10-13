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

/// tests for DiscoveryApi
void main() {
  // final instance = DiscoveryApi();

  group('tests for DiscoveryApi', () {
    // This document
    //
    // This document
    //
    //Future<String> apiGet({ String f }) async
    test('test apiGet', () async {
      // TODO
    });

    // describe the feature collection with id `collectionId`
    //
    // a (machine or human) readable description of this collection
    //
    //Future<CollectionInfo> describeCollection(String collectionId, String acceptLanguage) async
    test('test describeCollection', () async {
      // TODO
    });

    // the feature collections in the dataset
    //
    // returns a collection of available collection (like offers, packages, legs, support-requests and payments)
    //
    //Future<Collections> getCollections() async
    test('test getCollections', () async {
      // TODO
    });

    // API conformance definition
    //
    // A list of all conformance classes specified in a standard that the server conforms to.
    //
    //Future<ConfClasses> getConformanceDeclaration(String acceptLanguage, { String f }) async
    test('test getConformanceDeclaration', () async {
      // TODO
    });

    // retrieve a process description
    //
    // The process description contains information about inputs and outputs and a link to the execution-endpoint for the process. The Core does not mandate the use of a specific process description to specify the interface of a process. That said, the Core requirements class makes the following recommendation: Implementations SHOULD consider supporting the OGC process description. For more information, see [Section 7.10](https://docs.ogc.org/is/18-062/18-062.html#sc_process_description).
    //
    //Future<Object> getProcessDescription(String acceptLanguage, String processID) async
    test('test getProcessDescription', () async {
      // TODO
    });

    // retrieve the list of available processes
    //
    // The list of processes contains a summary of each process the OGC API - Processes offers, including the link to a more detailed description of the process.  For more information, see [Section 7.9](https://docs.ogc.org/is/18-062/18-062.html#sc_process_list).
    //
    //Future<ProcessList> getProcesses(String acceptLanguage) async
    test('test getProcesses', () async {
      // TODO
    });

    // Landing page
    //
    // Gives a (technical & human readable) output describing how this API must be used. If  the parameter f=html is supplied, a human readable page must be responded.
    //
    //Future<LandingPage> landingPage(String acceptLanguage, { String f }) async
    test('test landingPage', () async {
      // TODO
    });
  });
}
