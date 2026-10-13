//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class RefundOptionInput {
  /// Returns a new [RefundOptionInput] instance.
  RefundOptionInput({
    required this.type,
    this.optionId,
  });

  String type;

  /// https://en.wikipedia.org/wiki/Universally_unique_identifier see also https://www.ietf.org/rfc/rfc4122.txt (ae76f51c-a1a6-46af-b9ab-8233564adcae)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? optionId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RefundOptionInput &&
          other.type == type &&
          other.optionId == optionId;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) + (optionId == null ? 0 : optionId!.hashCode);

  @override
  String toString() => 'RefundOptionInput[type=$type, optionId=$optionId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.optionId != null) {
      json[r'optionId'] = this.optionId;
    } else {
      json[r'optionId'] = null;
    }
    return json;
  }

  /// Returns a new [RefundOptionInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static RefundOptionInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "RefundOptionInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "RefundOptionInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return RefundOptionInput(
        type: mapValueOfType<String>(json, r'type')!,
        optionId: mapValueOfType<String>(json, r'optionId'),
      );
    }
    return null;
  }

  static List<RefundOptionInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <RefundOptionInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = RefundOptionInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, RefundOptionInput> mapFromJson(dynamic json) {
    final map = <String, RefundOptionInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = RefundOptionInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of RefundOptionInput-objects as value to a dart map
  static Map<String, List<RefundOptionInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<RefundOptionInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = RefundOptionInput.listFromJson(
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
