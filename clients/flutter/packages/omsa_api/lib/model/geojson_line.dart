//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class GeojsonLine {
  /// Returns a new [GeojsonLine] instance.
  GeojsonLine({
    this.coordinates = const [],
  });

  List<List<double>> coordinates;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GeojsonLine &&
          _deepEquality.equals(other.coordinates, coordinates);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (coordinates.hashCode);

  @override
  String toString() => 'GeojsonLine[coordinates=$coordinates]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'coordinates'] = this.coordinates;
    return json;
  }

  /// Returns a new [GeojsonLine] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static GeojsonLine? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "GeojsonLine[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "GeojsonLine[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return GeojsonLine(
        coordinates: json[r'coordinates'] is List
            ? (json[r'coordinates'] as List)
                .map((e) =>
                    e == null ? const <double>[] : (e as List).cast<double>())
                .toList()
            : const [],
      );
    }
    return null;
  }

  static List<GeojsonLine> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <GeojsonLine>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = GeojsonLine.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, GeojsonLine> mapFromJson(dynamic json) {
    final map = <String, GeojsonLine>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = GeojsonLine.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of GeojsonLine-objects as value to a dart map
  static Map<String, List<GeojsonLine>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<GeojsonLine>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = GeojsonLine.listFromJson(
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
