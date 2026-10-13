//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class GeojsonPolygon {
  /// Returns a new [GeojsonPolygon] instance.
  GeojsonPolygon({
    this.coordinates = const [],
  });

  List<List<List<double>>> coordinates;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GeojsonPolygon &&
          _deepEquality.equals(other.coordinates, coordinates);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (coordinates.hashCode);

  @override
  String toString() => 'GeojsonPolygon[coordinates=$coordinates]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'coordinates'] = this.coordinates;
    return json;
  }

  /// Returns a new [GeojsonPolygon] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static GeojsonPolygon? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "GeojsonPolygon[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "GeojsonPolygon[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return GeojsonPolygon(
        coordinates: json[r'coordinates'] is List
            ? (json[r'coordinates'] as List)
                .map<List<List<double>>>((e) => (e as List)
                    .map<List<double>>(
                        (e) => (e as List).cast<double>().toList())
                    .toList())
                .toList()
            : const [],
      );
    }
    return null;
  }

  static List<GeojsonPolygon> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <GeojsonPolygon>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = GeojsonPolygon.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, GeojsonPolygon> mapFromJson(dynamic json) {
    final map = <String, GeojsonPolygon>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = GeojsonPolygon.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of GeojsonPolygon-objects as value to a dart map
  static Map<String, List<GeojsonPolygon>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<GeojsonPolygon>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = GeojsonPolygon.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'coordinates',
  };
}
