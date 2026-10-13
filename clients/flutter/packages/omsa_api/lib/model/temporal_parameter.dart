//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TemporalParameter {
  /// Returns a new [TemporalParameter] instance.
  TemporalParameter({
    required this.type,
    this.startTime,
    this.endTime,
    this.duration = 0,
    this.dayType,
  });

  String type;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? startTime;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? endTime;

  /// default length for an integer (0-1000)
  ///
  /// Minimum value: 0
  /// Maximum value: 1000
  int duration;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Day? dayType;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TemporalParameter &&
          other.type == type &&
          other.startTime == startTime &&
          other.endTime == endTime &&
          other.duration == duration &&
          other.dayType == dayType;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (startTime == null ? 0 : startTime!.hashCode) +
      (endTime == null ? 0 : endTime!.hashCode) +
      (duration.hashCode) +
      (dayType == null ? 0 : dayType!.hashCode);

  @override
  String toString() =>
      'TemporalParameter[type=$type, startTime=$startTime, endTime=$endTime, duration=$duration, dayType=$dayType]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.startTime != null) {
      json[r'startTime'] = this.startTime!.toUtc().toIso8601String();
    } else {
      json[r'startTime'] = null;
    }
    if (this.endTime != null) {
      json[r'endTime'] = this.endTime!.toUtc().toIso8601String();
    } else {
      json[r'endTime'] = null;
    }
    json[r'duration'] = this.duration;
    if (this.dayType != null) {
      json[r'dayType'] = this.dayType;
    } else {
      json[r'dayType'] = null;
    }
    return json;
  }

  /// Returns a new [TemporalParameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TemporalParameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "TemporalParameter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "TemporalParameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TemporalParameter(
        type: mapValueOfType<String>(json, r'type')!,
        startTime: mapDateTime(json, r'startTime', r''),
        endTime: mapDateTime(json, r'endTime', r''),
        duration: mapValueOfType<int>(json, r'duration') ?? 0,
        dayType: Day.fromJson(json[r'dayType']),
      );
    }
    return null;
  }

  static List<TemporalParameter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TemporalParameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TemporalParameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TemporalParameter> mapFromJson(dynamic json) {
    final map = <String, TemporalParameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TemporalParameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TemporalParameter-objects as value to a dart map
  static Map<String, List<TemporalParameter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<TemporalParameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TemporalParameter.listFromJson(
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
