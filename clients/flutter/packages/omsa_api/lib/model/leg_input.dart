//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class LegInput {
  /// Returns a new [LegInput] instance.
  LegInput({
    required this.packageId,
    required this.type,
    this.offerId,
    required this.legId,
    this.location,
  });

  /// default string, full names etc (length 0-200)
  String packageId;

  String type;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? offerId;

  /// default string, full names etc (length 0-200)
  String legId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PlaceReference? location;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LegInput &&
          other.packageId == packageId &&
          other.type == type &&
          other.offerId == offerId &&
          other.legId == legId &&
          other.location == location;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (packageId.hashCode) +
      (type.hashCode) +
      (offerId == null ? 0 : offerId!.hashCode) +
      (legId.hashCode) +
      (location == null ? 0 : location!.hashCode);

  @override
  String toString() =>
      'LegInput[packageId=$packageId, type=$type, offerId=$offerId, legId=$legId, location=$location]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'packageId'] = this.packageId;
    json[r'type'] = this.type;
    if (this.offerId != null) {
      json[r'offerId'] = this.offerId;
    } else {
      json[r'offerId'] = null;
    }
    json[r'legId'] = this.legId;
    if (this.location != null) {
      json[r'location'] = this.location;
    } else {
      json[r'location'] = null;
    }
    return json;
  }

  /// Returns a new [LegInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static LegInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "LegInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "LegInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return LegInput(
        packageId: mapValueOfType<String>(json, r'packageId')!,
        type: mapValueOfType<String>(json, r'type')!,
        offerId: mapValueOfType<String>(json, r'offerId'),
        legId: mapValueOfType<String>(json, r'legId')!,
        location: PlaceReference.fromJson(json[r'location']),
      );
    }
    return null;
  }

  static List<LegInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <LegInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = LegInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, LegInput> mapFromJson(dynamic json) {
    final map = <String, LegInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = LegInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of LegInput-objects as value to a dart map
  static Map<String, List<LegInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<LegInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = LegInput.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'packageId',
    'type',
    'legId',
  };
}
