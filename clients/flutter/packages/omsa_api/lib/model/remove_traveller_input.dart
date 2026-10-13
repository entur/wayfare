//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class RemoveTravellerInput {
  /// Returns a new [RemoveTravellerInput] instance.
  RemoveTravellerInput({
    required this.type,
    required this.travellerId,
    required this.packageId,
  });

  String type;

  /// default string, full names etc (length 0-200)
  String travellerId;

  /// default string, full names etc (length 0-200)
  String packageId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RemoveTravellerInput &&
          other.type == type &&
          other.travellerId == travellerId &&
          other.packageId == packageId;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) + (travellerId.hashCode) + (packageId.hashCode);

  @override
  String toString() =>
      'RemoveTravellerInput[type=$type, travellerId=$travellerId, packageId=$packageId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'travellerId'] = this.travellerId;
    json[r'packageId'] = this.packageId;
    return json;
  }

  /// Returns a new [RemoveTravellerInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static RemoveTravellerInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "RemoveTravellerInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "RemoveTravellerInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return RemoveTravellerInput(
        type: mapValueOfType<String>(json, r'type')!,
        travellerId: mapValueOfType<String>(json, r'travellerId')!,
        packageId: mapValueOfType<String>(json, r'packageId')!,
      );
    }
    return null;
  }

  static List<RemoveTravellerInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <RemoveTravellerInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = RemoveTravellerInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, RemoveTravellerInput> mapFromJson(dynamic json) {
    final map = <String, RemoveTravellerInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = RemoveTravellerInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of RemoveTravellerInput-objects as value to a dart map
  static Map<String, List<RemoveTravellerInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<RemoveTravellerInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = RemoveTravellerInput.listFromJson(
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
    'travellerId',
    'packageId',
  };
}
