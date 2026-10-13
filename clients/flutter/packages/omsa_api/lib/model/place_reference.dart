//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PlaceReference {
  /// Returns a new [PlaceReference] instance.
  PlaceReference({
    required this.placeId,
    this.name,
  });

  /// this string references to information that can be found in the `data sources`. Enlist all prefixes (=rel) from the /collections/datasources/items that apply to a place/location. Default it matches already with 'GPS' (no entry required in the datasources). In case of a custom place (like home address), you can use the 'P:' prefix and add the address to the **placeDefinitions** list of the request.
  String placeId;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? name;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PlaceReference && other.placeId == placeId && other.name == name;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (placeId.hashCode) + (name == null ? 0 : name!.hashCode);

  @override
  String toString() => 'PlaceReference[placeId=$placeId, name=$name]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'placeId'] = this.placeId;
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    return json;
  }

  /// Returns a new [PlaceReference] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PlaceReference? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "PlaceReference[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "PlaceReference[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PlaceReference(
        placeId: mapValueOfType<String>(json, r'placeId')!,
        name: mapValueOfType<String>(json, r'name'),
      );
    }
    return null;
  }

  static List<PlaceReference> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PlaceReference>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PlaceReference.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PlaceReference> mapFromJson(dynamic json) {
    final map = <String, PlaceReference>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PlaceReference.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PlaceReference-objects as value to a dart map
  static Map<String, List<PlaceReference>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<PlaceReference>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PlaceReference.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'placeId',
  };
}
