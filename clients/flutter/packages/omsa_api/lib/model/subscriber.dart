//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Subscriber {
  /// Returns a new [Subscriber] instance.
  Subscriber({
    this.successUri,
    this.inProgressUri,
    this.failedUri,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? successUri;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? inProgressUri;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? failedUri;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Subscriber &&
          other.successUri == successUri &&
          other.inProgressUri == inProgressUri &&
          other.failedUri == failedUri;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (successUri == null ? 0 : successUri!.hashCode) +
      (inProgressUri == null ? 0 : inProgressUri!.hashCode) +
      (failedUri == null ? 0 : failedUri!.hashCode);

  @override
  String toString() =>
      'Subscriber[successUri=$successUri, inProgressUri=$inProgressUri, failedUri=$failedUri]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.successUri != null) {
      json[r'successUri'] = this.successUri;
    } else {
      json[r'successUri'] = null;
    }
    if (this.inProgressUri != null) {
      json[r'inProgressUri'] = this.inProgressUri;
    } else {
      json[r'inProgressUri'] = null;
    }
    if (this.failedUri != null) {
      json[r'failedUri'] = this.failedUri;
    } else {
      json[r'failedUri'] = null;
    }
    return json;
  }

  /// Returns a new [Subscriber] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Subscriber? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Subscriber[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Subscriber[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Subscriber(
        successUri: mapValueOfType<String>(json, r'successUri'),
        inProgressUri: mapValueOfType<String>(json, r'inProgressUri'),
        failedUri: mapValueOfType<String>(json, r'failedUri'),
      );
    }
    return null;
  }

  static List<Subscriber> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Subscriber>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Subscriber.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Subscriber> mapFromJson(dynamic json) {
    final map = <String, Subscriber>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Subscriber.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Subscriber-objects as value to a dart map
  static Map<String, List<Subscriber>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Subscriber>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Subscriber.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{};
}
