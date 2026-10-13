//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class MetadataOneOf1 {
  /// Returns a new [MetadataOneOf1] instance.
  MetadataOneOf1({
    this.role,
    this.title,
    this.lang,
    this.value,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? role;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? title;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? lang;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  MetadataOneOf1Value? value;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MetadataOneOf1 &&
          other.role == role &&
          other.title == title &&
          other.lang == lang &&
          other.value == value;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (role == null ? 0 : role!.hashCode) +
      (title == null ? 0 : title!.hashCode) +
      (lang == null ? 0 : lang!.hashCode) +
      (value == null ? 0 : value!.hashCode);

  @override
  String toString() =>
      'MetadataOneOf1[role=$role, title=$title, lang=$lang, value=$value]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.role != null) {
      json[r'role'] = this.role;
    } else {
      json[r'role'] = null;
    }
    if (this.title != null) {
      json[r'title'] = this.title;
    } else {
      json[r'title'] = null;
    }
    if (this.lang != null) {
      json[r'lang'] = this.lang;
    } else {
      json[r'lang'] = null;
    }
    if (this.value != null) {
      json[r'value'] = this.value;
    } else {
      json[r'value'] = null;
    }
    return json;
  }

  /// Returns a new [MetadataOneOf1] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static MetadataOneOf1? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "MetadataOneOf1[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "MetadataOneOf1[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return MetadataOneOf1(
        role: mapValueOfType<String>(json, r'role'),
        title: mapValueOfType<String>(json, r'title'),
        lang: mapValueOfType<String>(json, r'lang'),
        value: MetadataOneOf1Value.fromJson(json[r'value']),
      );
    }
    return null;
  }

  static List<MetadataOneOf1> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <MetadataOneOf1>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MetadataOneOf1.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MetadataOneOf1> mapFromJson(dynamic json) {
    final map = <String, MetadataOneOf1>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MetadataOneOf1.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of MetadataOneOf1-objects as value to a dart map
  static Map<String, List<MetadataOneOf1>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<MetadataOneOf1>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = MetadataOneOf1.listFromJson(
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
