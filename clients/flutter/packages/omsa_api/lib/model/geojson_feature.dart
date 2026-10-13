//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class GeojsonFeature {
  /// Returns a new [GeojsonFeature] instance.
  GeojsonFeature({
    required this.type,
    this.geometry,
    required this.properties,
    required this.id,
    this.links = const [],
  });

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  GeojsonFeatureGeometry? geometry;

  GeojsonFeatureProperties properties;

  /// short string, display names (length 0-75)
  String id;

  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GeojsonFeature &&
          other.type == type &&
          other.geometry == geometry &&
          other.properties == properties &&
          other.id == id &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (geometry == null ? 0 : geometry!.hashCode) +
      (properties.hashCode) +
      (id.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'GeojsonFeature[type=$type, geometry=$geometry, properties=$properties, id=$id, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.geometry != null) {
      json[r'geometry'] = this.geometry;
    } else {
      json[r'geometry'] = null;
    }
    json[r'properties'] = this.properties;
    json[r'id'] = this.id;
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [GeojsonFeature] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static GeojsonFeature? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "GeojsonFeature[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "GeojsonFeature[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return GeojsonFeature(
        type: mapValueOfType<String>(json, r'type')!,
        geometry: GeojsonFeatureGeometry.fromJson(json[r'geometry']),
        properties: GeojsonFeatureProperties.fromJson(json[r'properties'])!,
        id: mapValueOfType<String>(json, r'id')!,
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<GeojsonFeature> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <GeojsonFeature>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = GeojsonFeature.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, GeojsonFeature> mapFromJson(dynamic json) {
    final map = <String, GeojsonFeature>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = GeojsonFeature.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of GeojsonFeature-objects as value to a dart map
  static Map<String, List<GeojsonFeature>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<GeojsonFeature>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = GeojsonFeature.listFromJson(
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
    'properties',
    'id',
  };
}
