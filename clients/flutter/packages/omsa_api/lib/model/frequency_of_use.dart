//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class FrequencyOfUse {
  /// Returns a new [FrequencyOfUse] instance.
  FrequencyOfUse({
    required this.id,
    required this.type,
    this.frequencyOfUseType,
    this.minimalFrequency,
    this.maximalFrequency,
    this.frequencyInterval,
  });

  /// default string, full names etc (length 0-200)
  String id;

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  FrequencyOfUseType? frequencyOfUseType;

  /// Minimum number of times the product can be used.
  ///
  /// Minimum value: 0
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? minimalFrequency;

  /// Maximum number of times the product can be used.
  ///
  /// Minimum value: 0
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? maximalFrequency;

  /// Positive ISO 8601 interval within which frequency is measured.
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? frequencyInterval;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FrequencyOfUse &&
          other.id == id &&
          other.type == type &&
          other.frequencyOfUseType == frequencyOfUseType &&
          other.minimalFrequency == minimalFrequency &&
          other.maximalFrequency == maximalFrequency &&
          other.frequencyInterval == frequencyInterval;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (id.hashCode) +
      (type.hashCode) +
      (frequencyOfUseType == null ? 0 : frequencyOfUseType!.hashCode) +
      (minimalFrequency == null ? 0 : minimalFrequency!.hashCode) +
      (maximalFrequency == null ? 0 : maximalFrequency!.hashCode) +
      (frequencyInterval == null ? 0 : frequencyInterval!.hashCode);

  @override
  String toString() =>
      'FrequencyOfUse[id=$id, type=$type, frequencyOfUseType=$frequencyOfUseType, minimalFrequency=$minimalFrequency, maximalFrequency=$maximalFrequency, frequencyInterval=$frequencyInterval]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'id'] = this.id;
    json[r'type'] = this.type;
    if (this.frequencyOfUseType != null) {
      json[r'frequencyOfUseType'] = this.frequencyOfUseType;
    } else {
      json[r'frequencyOfUseType'] = null;
    }
    if (this.minimalFrequency != null) {
      json[r'minimalFrequency'] = this.minimalFrequency;
    } else {
      json[r'minimalFrequency'] = null;
    }
    if (this.maximalFrequency != null) {
      json[r'maximalFrequency'] = this.maximalFrequency;
    } else {
      json[r'maximalFrequency'] = null;
    }
    if (this.frequencyInterval != null) {
      json[r'frequencyInterval'] = this.frequencyInterval;
    } else {
      json[r'frequencyInterval'] = null;
    }
    return json;
  }

  /// Returns a new [FrequencyOfUse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static FrequencyOfUse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "FrequencyOfUse[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "FrequencyOfUse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return FrequencyOfUse(
        id: mapValueOfType<String>(json, r'id')!,
        type: mapValueOfType<String>(json, r'type')!,
        frequencyOfUseType:
            FrequencyOfUseType.fromJson(json[r'frequencyOfUseType']),
        minimalFrequency: mapValueOfType<int>(json, r'minimalFrequency'),
        maximalFrequency: mapValueOfType<int>(json, r'maximalFrequency'),
        frequencyInterval: mapValueOfType<String>(json, r'frequencyInterval'),
      );
    }
    return null;
  }

  static List<FrequencyOfUse> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <FrequencyOfUse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = FrequencyOfUse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, FrequencyOfUse> mapFromJson(dynamic json) {
    final map = <String, FrequencyOfUse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = FrequencyOfUse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of FrequencyOfUse-objects as value to a dart map
  static Map<String, List<FrequencyOfUse>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<FrequencyOfUse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = FrequencyOfUse.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'type',
  };
}
