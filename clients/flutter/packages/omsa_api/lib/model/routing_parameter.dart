//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class RoutingParameter {
  /// Returns a new [RoutingParameter] instance.
  RoutingParameter({
    required this.type,
    this.journeyPattern = const [],
  });

  String type;

  List<String> journeyPattern;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RoutingParameter &&
          other.type == type &&
          _deepEquality.equals(other.journeyPattern, journeyPattern);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) + (journeyPattern.hashCode);

  @override
  String toString() =>
      'RoutingParameter[type=$type, journeyPattern=$journeyPattern]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'journeyPattern'] = this.journeyPattern;
    return json;
  }

  /// Returns a new [RoutingParameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static RoutingParameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "RoutingParameter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "RoutingParameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return RoutingParameter(
        type: mapValueOfType<String>(json, r'type')!,
        journeyPattern: json[r'journeyPattern'] is Iterable
            ? (json[r'journeyPattern'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
      );
    }
    return null;
  }

  static List<RoutingParameter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <RoutingParameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = RoutingParameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, RoutingParameter> mapFromJson(dynamic json) {
    final map = <String, RoutingParameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = RoutingParameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of RoutingParameter-objects as value to a dart map
  static Map<String, List<RoutingParameter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<RoutingParameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = RoutingParameter.listFromJson(
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
    'journeyPattern',
  };
}
