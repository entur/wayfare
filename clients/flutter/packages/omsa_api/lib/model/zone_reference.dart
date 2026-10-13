//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ZoneReference {
  /// Returns a new [ZoneReference] instance.
  ZoneReference({
    required this.zoneId,
    this.name,
  });

  /// default string, full names etc (length 0-200)
  String zoneId;

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
      other is ZoneReference && other.zoneId == zoneId && other.name == name;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (zoneId.hashCode) + (name == null ? 0 : name!.hashCode);

  @override
  String toString() => 'ZoneReference[zoneId=$zoneId, name=$name]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'zoneId'] = this.zoneId;
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    return json;
  }

  /// Returns a new [ZoneReference] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ZoneReference? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ZoneReference[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ZoneReference[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ZoneReference(
        zoneId: mapValueOfType<String>(json, r'zoneId')!,
        name: mapValueOfType<String>(json, r'name'),
      );
    }
    return null;
  }

  static List<ZoneReference> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ZoneReference>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ZoneReference.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ZoneReference> mapFromJson(dynamic json) {
    final map = <String, ZoneReference>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ZoneReference.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ZoneReference-objects as value to a dart map
  static Map<String, List<ZoneReference>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ZoneReference>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ZoneReference.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'zoneId',
  };
}
