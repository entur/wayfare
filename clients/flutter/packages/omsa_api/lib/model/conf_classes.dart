//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ConfClasses {
  /// Returns a new [ConfClasses] instance.
  ConfClasses({
    this.conformsTo = const [],
  });

  List<String> conformsTo;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ConfClasses &&
          _deepEquality.equals(other.conformsTo, conformsTo);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (conformsTo.hashCode);

  @override
  String toString() => 'ConfClasses[conformsTo=$conformsTo]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'conformsTo'] = this.conformsTo;
    return json;
  }

  /// Returns a new [ConfClasses] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ConfClasses? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ConfClasses[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ConfClasses[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ConfClasses(
        conformsTo: json[r'conformsTo'] is Iterable
            ? (json[r'conformsTo'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
      );
    }
    return null;
  }

  static List<ConfClasses> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ConfClasses>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ConfClasses.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ConfClasses> mapFromJson(dynamic json) {
    final map = <String, ConfClasses>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ConfClasses.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ConfClasses-objects as value to a dart map
  static Map<String, List<ConfClasses>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ConfClasses>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ConfClasses.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'conformsTo',
  };
}
