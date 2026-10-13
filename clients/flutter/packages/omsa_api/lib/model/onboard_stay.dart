//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class OnboardStay {
  /// Returns a new [OnboardStay] instance.
  OnboardStay({
    required this.type,
    this.description,
    this.classOfUse,
    this.permission,
    this.duration,
  });

  String type;

  /// long string, memos etc (length 0-10.000)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ClassOfUse? classOfUse;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? permission;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? duration;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is OnboardStay &&
          other.type == type &&
          other.description == description &&
          other.classOfUse == classOfUse &&
          other.permission == permission &&
          other.duration == duration;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (description == null ? 0 : description!.hashCode) +
      (classOfUse == null ? 0 : classOfUse!.hashCode) +
      (permission == null ? 0 : permission!.hashCode) +
      (duration == null ? 0 : duration!.hashCode);

  @override
  String toString() =>
      'OnboardStay[type=$type, description=$description, classOfUse=$classOfUse, permission=$permission, duration=$duration]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.classOfUse != null) {
      json[r'classOfUse'] = this.classOfUse;
    } else {
      json[r'classOfUse'] = null;
    }
    if (this.permission != null) {
      json[r'permission'] = this.permission;
    } else {
      json[r'permission'] = null;
    }
    if (this.duration != null) {
      json[r'duration'] = this.duration;
    } else {
      json[r'duration'] = null;
    }
    return json;
  }

  /// Returns a new [OnboardStay] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static OnboardStay? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "OnboardStay[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "OnboardStay[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return OnboardStay(
        type: mapValueOfType<String>(json, r'type')!,
        description: mapValueOfType<String>(json, r'description'),
        classOfUse: ClassOfUse.fromJson(json[r'classOfUse']),
        permission: mapValueOfType<bool>(json, r'permission'),
        duration: mapValueOfType<String>(json, r'duration'),
      );
    }
    return null;
  }

  static List<OnboardStay> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <OnboardStay>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = OnboardStay.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, OnboardStay> mapFromJson(dynamic json) {
    final map = <String, OnboardStay>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = OnboardStay.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of OnboardStay-objects as value to a dart map
  static Map<String, List<OnboardStay>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<OnboardStay>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = OnboardStay.listFromJson(
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
