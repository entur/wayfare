//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class NetworkParameter {
  /// Returns a new [NetworkParameter] instance.
  NetworkParameter({
    required this.type,
    this.location,
    this.line,
    this.zones = const [],
  });

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PlaceReference? location;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? line;

  List<ZoneReference> zones;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is NetworkParameter &&
          other.type == type &&
          other.location == location &&
          other.line == line &&
          _deepEquality.equals(other.zones, zones);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (location == null ? 0 : location!.hashCode) +
      (line == null ? 0 : line!.hashCode) +
      (zones.hashCode);

  @override
  String toString() =>
      'NetworkParameter[type=$type, location=$location, line=$line, zones=$zones]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.location != null) {
      json[r'location'] = this.location;
    } else {
      json[r'location'] = null;
    }
    if (this.line != null) {
      json[r'line'] = this.line;
    } else {
      json[r'line'] = null;
    }
    json[r'zones'] = this.zones;
    return json;
  }

  /// Returns a new [NetworkParameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static NetworkParameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "NetworkParameter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "NetworkParameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return NetworkParameter(
        type: mapValueOfType<String>(json, r'type')!,
        location: PlaceReference.fromJson(json[r'location']),
        line: mapValueOfType<String>(json, r'line'),
        zones: ZoneReference.listFromJson(json[r'zones']),
      );
    }
    return null;
  }

  static List<NetworkParameter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <NetworkParameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = NetworkParameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, NetworkParameter> mapFromJson(dynamic json) {
    final map = <String, NetworkParameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = NetworkParameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of NetworkParameter-objects as value to a dart map
  static Map<String, List<NetworkParameter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<NetworkParameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = NetworkParameter.listFromJson(
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
