//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Collections {
  /// Returns a new [Collections] instance.
  Collections({
    this.links = const [],
    this.timeStamp,
    this.numberMatched,
    this.numberReturned,
    this.collections = const [],
  });

  List<Link> links;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? timeStamp;

  /// Minimum value: 0
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? numberMatched;

  /// Minimum value: 0
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? numberReturned;

  List<CollectionInfo> collections;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Collections &&
          _deepEquality.equals(other.links, links) &&
          other.timeStamp == timeStamp &&
          other.numberMatched == numberMatched &&
          other.numberReturned == numberReturned &&
          _deepEquality.equals(other.collections, collections);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (links.hashCode) +
      (timeStamp == null ? 0 : timeStamp!.hashCode) +
      (numberMatched == null ? 0 : numberMatched!.hashCode) +
      (numberReturned == null ? 0 : numberReturned!.hashCode) +
      (collections.hashCode);

  @override
  String toString() =>
      'Collections[links=$links, timeStamp=$timeStamp, numberMatched=$numberMatched, numberReturned=$numberReturned, collections=$collections]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'links'] = this.links;
    if (this.timeStamp != null) {
      json[r'timeStamp'] = this.timeStamp!.toUtc().toIso8601String();
    } else {
      json[r'timeStamp'] = null;
    }
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
    json[r'collections'] = this.collections;
    return json;
  }

  /// Returns a new [Collections] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Collections? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Collections[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Collections[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Collections(
        links: Link.listFromJson(json[r'links']),
        timeStamp: mapDateTime(json, r'timeStamp', r''),
        numberMatched: mapValueOfType<int>(json, r'numberMatched'),
        numberReturned: mapValueOfType<int>(json, r'numberReturned'),
        collections: CollectionInfo.listFromJson(json[r'collections']),
      );
    }
    return null;
  }

  static List<Collections> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Collections>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Collections.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Collections> mapFromJson(dynamic json) {
    final map = <String, Collections>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Collections.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Collections-objects as value to a dart map
  static Map<String, List<Collections>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Collections>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Collections.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'links',
    'collections',
  };
}
