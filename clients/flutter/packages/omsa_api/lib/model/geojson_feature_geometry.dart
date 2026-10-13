//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class GeojsonFeatureGeometry {
  /// Returns a new [GeojsonFeatureGeometry] instance.
  GeojsonFeatureGeometry({
    this.coordinates = const [],
  });

  List<List<List<List<double>>>> coordinates;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GeojsonFeatureGeometry &&
          _deepEquality.equals(other.coordinates, coordinates);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (coordinates.hashCode);

  @override
  String toString() => 'GeojsonFeatureGeometry[coordinates=$coordinates]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'coordinates'] = this.coordinates;
    return json;
  }

  /// Returns a new [GeojsonFeatureGeometry] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static GeojsonFeatureGeometry? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "GeojsonFeatureGeometry[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "GeojsonFeatureGeometry[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return GeojsonFeatureGeometry(
        coordinates: json[r'coordinates'] is List
            ? (json[r'coordinates'] as List)
                .map<List<List<List<double>>>>((e) => (e as List)
                    .map<List<List<double>>>((e) => (e as List)
                        .map<List<double>>(
                            (e) => (e as List).cast<double>().toList())
                        .toList())
                    .toList())
                .toList()
            : const [],
      );
    }
    return null;
  }

  static List<GeojsonFeatureGeometry> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <GeojsonFeatureGeometry>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = GeojsonFeatureGeometry.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, GeojsonFeatureGeometry> mapFromJson(dynamic json) {
    final map = <String, GeojsonFeatureGeometry>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = GeojsonFeatureGeometry.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of GeojsonFeatureGeometry-objects as value to a dart map
  static Map<String, List<GeojsonFeatureGeometry>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<GeojsonFeatureGeometry>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = GeojsonFeatureGeometry.listFromJson(
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
