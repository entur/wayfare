//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class UsageValidityPeriod {
  /// Returns a new [UsageValidityPeriod] instance.
  UsageValidityPeriod({
    required this.id,
    required this.type,
    this.validityPeriodType,
    this.usageTrigger,
    this.usageEnd,
    this.standardDuration,
    this.activationMeans,
    this.startDate,
    this.startTime,
    this.endDate,
    this.endTime,
    this.usageStartConstraintType,
    this.blackoutUse,
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
  UsageValidityPeriodType? validityPeriodType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  UsageTrigger? usageTrigger;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  UsageEnd? usageEnd;

  /// Positive ISO 8601 duration of the usage validity period, for example PT168H.
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? standardDuration;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ActivationMeans? activationMeans;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, full-date (2019-10-12)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? startDate;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? startTime;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, full-date (2019-10-12)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? endDate;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? endTime;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  UsageStartConstraintType? usageStartConstraintType;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  BlackoutUse? blackoutUse;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UsageValidityPeriod &&
          other.id == id &&
          other.type == type &&
          other.validityPeriodType == validityPeriodType &&
          other.usageTrigger == usageTrigger &&
          other.usageEnd == usageEnd &&
          other.standardDuration == standardDuration &&
          other.activationMeans == activationMeans &&
          other.startDate == startDate &&
          other.startTime == startTime &&
          other.endDate == endDate &&
          other.endTime == endTime &&
          other.usageStartConstraintType == usageStartConstraintType &&
          other.blackoutUse == blackoutUse;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (id.hashCode) +
      (type.hashCode) +
      (validityPeriodType == null ? 0 : validityPeriodType!.hashCode) +
      (usageTrigger == null ? 0 : usageTrigger!.hashCode) +
      (usageEnd == null ? 0 : usageEnd!.hashCode) +
      (standardDuration == null ? 0 : standardDuration!.hashCode) +
      (activationMeans == null ? 0 : activationMeans!.hashCode) +
      (startDate == null ? 0 : startDate!.hashCode) +
      (startTime == null ? 0 : startTime!.hashCode) +
      (endDate == null ? 0 : endDate!.hashCode) +
      (endTime == null ? 0 : endTime!.hashCode) +
      (usageStartConstraintType == null
          ? 0
          : usageStartConstraintType!.hashCode) +
      (blackoutUse == null ? 0 : blackoutUse!.hashCode);

  @override
  String toString() =>
      'UsageValidityPeriod[id=$id, type=$type, validityPeriodType=$validityPeriodType, usageTrigger=$usageTrigger, usageEnd=$usageEnd, standardDuration=$standardDuration, activationMeans=$activationMeans, startDate=$startDate, startTime=$startTime, endDate=$endDate, endTime=$endTime, usageStartConstraintType=$usageStartConstraintType, blackoutUse=$blackoutUse]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'id'] = this.id;
    json[r'type'] = this.type;
    if (this.validityPeriodType != null) {
      json[r'validityPeriodType'] = this.validityPeriodType;
    } else {
      json[r'validityPeriodType'] = null;
    }
    if (this.usageTrigger != null) {
      json[r'usageTrigger'] = this.usageTrigger;
    } else {
      json[r'usageTrigger'] = null;
    }
    if (this.usageEnd != null) {
      json[r'usageEnd'] = this.usageEnd;
    } else {
      json[r'usageEnd'] = null;
    }
    if (this.standardDuration != null) {
      json[r'standardDuration'] = this.standardDuration;
    } else {
      json[r'standardDuration'] = null;
    }
    if (this.activationMeans != null) {
      json[r'activationMeans'] = this.activationMeans;
    } else {
      json[r'activationMeans'] = null;
    }
    if (this.startDate != null) {
      json[r'startDate'] = this.startDate;
    } else {
      json[r'startDate'] = null;
    }
    if (this.startTime != null) {
      json[r'startTime'] = this.startTime;
    } else {
      json[r'startTime'] = null;
    }
    if (this.endDate != null) {
      json[r'endDate'] = this.endDate;
    } else {
      json[r'endDate'] = null;
    }
    if (this.endTime != null) {
      json[r'endTime'] = this.endTime;
    } else {
      json[r'endTime'] = null;
    }
    if (this.usageStartConstraintType != null) {
      json[r'usageStartConstraintType'] = this.usageStartConstraintType;
    } else {
      json[r'usageStartConstraintType'] = null;
    }
    if (this.blackoutUse != null) {
      json[r'blackoutUse'] = this.blackoutUse;
    } else {
      json[r'blackoutUse'] = null;
    }
    return json;
  }

  /// Returns a new [UsageValidityPeriod] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UsageValidityPeriod? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "UsageValidityPeriod[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "UsageValidityPeriod[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UsageValidityPeriod(
        id: mapValueOfType<String>(json, r'id')!,
        type: mapValueOfType<String>(json, r'type')!,
        validityPeriodType:
            UsageValidityPeriodType.fromJson(json[r'validityPeriodType']),
        usageTrigger: UsageTrigger.fromJson(json[r'usageTrigger']),
        usageEnd: UsageEnd.fromJson(json[r'usageEnd']),
        standardDuration: mapValueOfType<String>(json, r'standardDuration'),
        activationMeans: ActivationMeans.fromJson(json[r'activationMeans']),
        startDate: mapValueOfType<String>(json, r'startDate'),
        startTime: mapValueOfType<String>(json, r'startTime'),
        endDate: mapValueOfType<String>(json, r'endDate'),
        endTime: mapValueOfType<String>(json, r'endTime'),
        usageStartConstraintType: UsageStartConstraintType.fromJson(
            json[r'usageStartConstraintType']),
        blackoutUse: BlackoutUse.fromJson(json[r'blackoutUse']),
      );
    }
    return null;
  }

  static List<UsageValidityPeriod> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <UsageValidityPeriod>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UsageValidityPeriod.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UsageValidityPeriod> mapFromJson(dynamic json) {
    final map = <String, UsageValidityPeriod>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UsageValidityPeriod.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UsageValidityPeriod-objects as value to a dart map
  static Map<String, List<UsageValidityPeriod>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<UsageValidityPeriod>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UsageValidityPeriod.listFromJson(
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
