//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PlaceDefinitions {
  /// Returns a new [PlaceDefinitions] instance.
  PlaceDefinitions({
    this.placeDefinitions = const [],
  });

  /// Places that are not specified in an external data source (like a home address)
  List<PostalAddress> placeDefinitions;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PlaceDefinitions &&
          _deepEquality.equals(other.placeDefinitions, placeDefinitions);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (placeDefinitions.hashCode);

  @override
  String toString() => 'PlaceDefinitions[placeDefinitions=$placeDefinitions]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'placeDefinitions'] = this.placeDefinitions;
    return json;
  }

  /// Returns a new [PlaceDefinitions] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PlaceDefinitions? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "PlaceDefinitions[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "PlaceDefinitions[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PlaceDefinitions(
        placeDefinitions: PostalAddress.listFromJson(json[r'placeDefinitions']),
      );
    }
    return null;
  }

  static List<PlaceDefinitions> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PlaceDefinitions>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PlaceDefinitions.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PlaceDefinitions> mapFromJson(dynamic json) {
    final map = <String, PlaceDefinitions>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PlaceDefinitions.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PlaceDefinitions-objects as value to a dart map
  static Map<String, List<PlaceDefinitions>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<PlaceDefinitions>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PlaceDefinitions.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{};
}
