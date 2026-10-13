//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ChangeOptionCollection {
  /// Returns a new [ChangeOptionCollection] instance.
  ChangeOptionCollection({
    required this.type,
    this.options = const [],
    this.numberMatched,
    this.numberReturned,
    this.links = const [],
  });

  String type;

  List<ChangeOptionCollectionOptionsInner> options;

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

  /// actions that can be performed on this collection
  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ChangeOptionCollection &&
          other.type == type &&
          _deepEquality.equals(other.options, options) &&
          other.numberMatched == numberMatched &&
          other.numberReturned == numberReturned &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (options.hashCode) +
      (numberMatched == null ? 0 : numberMatched!.hashCode) +
      (numberReturned == null ? 0 : numberReturned!.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'ChangeOptionCollection[type=$type, options=$options, numberMatched=$numberMatched, numberReturned=$numberReturned, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'options'] = this.options;
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

  /// Returns a new [ChangeOptionCollection] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ChangeOptionCollection? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ChangeOptionCollection[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ChangeOptionCollection[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ChangeOptionCollection(
        type: mapValueOfType<String>(json, r'type')!,
        options:
            ChangeOptionCollectionOptionsInner.listFromJson(json[r'options']),
        numberMatched: mapValueOfType<int>(json, r'numberMatched'),
        numberReturned: mapValueOfType<int>(json, r'numberReturned'),
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<ChangeOptionCollection> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ChangeOptionCollection>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeOptionCollection.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChangeOptionCollection> mapFromJson(dynamic json) {
    final map = <String, ChangeOptionCollection>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChangeOptionCollection.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ChangeOptionCollection-objects as value to a dart map
  static Map<String, List<ChangeOptionCollection>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ChangeOptionCollection>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ChangeOptionCollection.listFromJson(
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
