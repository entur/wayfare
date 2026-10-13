//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TravelDocumentCollection {
  /// Returns a new [TravelDocumentCollection] instance.
  TravelDocumentCollection({
    required this.type,
    this.travelDocuments = const [],
    this.numberMatched,
    this.numberReturned,
    this.links = const [],
  });

  String type;

  List<TravelDocumentCollectionTravelDocumentsInner> travelDocuments;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? numberMatched;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? numberReturned;

  /// actions that can be performed on this package, but also alternative (rel=alternative+1, alternative+2) offers or references to other resources In case it is an alternative, specify clearly in the description what the financial consequences are.
  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TravelDocumentCollection &&
          other.type == type &&
          _deepEquality.equals(other.travelDocuments, travelDocuments) &&
          other.numberMatched == numberMatched &&
          other.numberReturned == numberReturned &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (travelDocuments.hashCode) +
      (numberMatched == null ? 0 : numberMatched!.hashCode) +
      (numberReturned == null ? 0 : numberReturned!.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'TravelDocumentCollection[type=$type, travelDocuments=$travelDocuments, numberMatched=$numberMatched, numberReturned=$numberReturned, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'travelDocuments'] = this.travelDocuments;
    if (this.numberMatched != null) {
      json[r'numberMatched'] = this.numberMatched;
    } else {
      json[r'numberMatched'] = null;
    }
    if (this.numberReturned != null) {
      json[r'numberReturned'] = this.numberReturned;
    } else {
      json[r'numberReturned'] = null;
    }
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [TravelDocumentCollection] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TravelDocumentCollection? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "TravelDocumentCollection[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "TravelDocumentCollection[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TravelDocumentCollection(
        type: mapValueOfType<String>(json, r'type')!,
        travelDocuments:
            TravelDocumentCollectionTravelDocumentsInner.listFromJson(
                json[r'travelDocuments']),
        numberMatched: mapValueOfType<int>(json, r'numberMatched'),
        numberReturned: mapValueOfType<int>(json, r'numberReturned'),
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<TravelDocumentCollection> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TravelDocumentCollection>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TravelDocumentCollection.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TravelDocumentCollection> mapFromJson(dynamic json) {
    final map = <String, TravelDocumentCollection>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TravelDocumentCollection.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TravelDocumentCollection-objects as value to a dart map
  static Map<String, List<TravelDocumentCollection>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<TravelDocumentCollection>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TravelDocumentCollection.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'type',
  };
}
