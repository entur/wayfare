//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class DistributionParameter {
  /// Returns a new [DistributionParameter] instance.
  DistributionParameter({
    required this.type,
    this.fulfilmentMethod,
    this.distributionChannel,
  });

  String type;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? fulfilmentMethod;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? distributionChannel;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DistributionParameter &&
          other.type == type &&
          other.fulfilmentMethod == fulfilmentMethod &&
          other.distributionChannel == distributionChannel;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (fulfilmentMethod == null ? 0 : fulfilmentMethod!.hashCode) +
      (distributionChannel == null ? 0 : distributionChannel!.hashCode);

  @override
  String toString() =>
      'DistributionParameter[type=$type, fulfilmentMethod=$fulfilmentMethod, distributionChannel=$distributionChannel]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.fulfilmentMethod != null) {
      json[r'fulfilmentMethod'] = this.fulfilmentMethod;
    } else {
      json[r'fulfilmentMethod'] = null;
    }
    if (this.distributionChannel != null) {
      json[r'distributionChannel'] = this.distributionChannel;
    } else {
      json[r'distributionChannel'] = null;
    }
    return json;
  }

  /// Returns a new [DistributionParameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static DistributionParameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "DistributionParameter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "DistributionParameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return DistributionParameter(
        type: mapValueOfType<String>(json, r'type')!,
        fulfilmentMethod: mapValueOfType<String>(json, r'fulfilmentMethod'),
        distributionChannel:
            mapValueOfType<String>(json, r'distributionChannel'),
      );
    }
    return null;
  }

  static List<DistributionParameter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <DistributionParameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = DistributionParameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, DistributionParameter> mapFromJson(dynamic json) {
    final map = <String, DistributionParameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = DistributionParameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of DistributionParameter-objects as value to a dart map
  static Map<String, List<DistributionParameter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<DistributionParameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = DistributionParameter.listFromJson(
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
