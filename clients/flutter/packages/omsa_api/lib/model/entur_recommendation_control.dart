//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class EnturRecommendationControl {
  /// Returns a new [EnturRecommendationControl] instance.
  EnturRecommendationControl({
    this.enabled = false,
    this.types = const [],
    this.stripDuplicates = false,
  });

  /// Enable recommendation-driven bundling based on Offers `recommendations` and `offersToBuy`.
  bool enabled;

  /// Entur recommendation categories to request when `enabled` is true. If omitted, the API defaults to `[\"CHEAPEST\", \"NON_FLEXIBLE\", \"SEMI_FLEXIBLE\", \"FLEXIBLE\"]`.
  List<EnturRecommendationType> types;

  /// Deduplicate recommendation-driven plans by provider offer + traveller groups + ancillary selections + quantity.
  bool stripDuplicates;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is EnturRecommendationControl &&
          other.enabled == enabled &&
          _deepEquality.equals(other.types, types) &&
          other.stripDuplicates == stripDuplicates;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (enabled.hashCode) + (types.hashCode) + (stripDuplicates.hashCode);

  @override
  String toString() =>
      'EnturRecommendationControl[enabled=$enabled, types=$types, stripDuplicates=$stripDuplicates]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'enabled'] = this.enabled;
    json[r'types'] = this.types;
    json[r'stripDuplicates'] = this.stripDuplicates;
    return json;
  }

  /// Returns a new [EnturRecommendationControl] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static EnturRecommendationControl? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "EnturRecommendationControl[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "EnturRecommendationControl[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return EnturRecommendationControl(
        enabled: mapValueOfType<bool>(json, r'enabled') ?? false,
        types: EnturRecommendationType.listFromJson(json[r'types']),
        stripDuplicates:
            mapValueOfType<bool>(json, r'stripDuplicates') ?? false,
      );
    }
    return null;
  }

  static List<EnturRecommendationControl> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <EnturRecommendationControl>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EnturRecommendationControl.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EnturRecommendationControl> mapFromJson(dynamic json) {
    final map = <String, EnturRecommendationControl>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EnturRecommendationControl.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of EnturRecommendationControl-objects as value to a dart map
  static Map<String, List<EnturRecommendationControl>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<EnturRecommendationControl>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = EnturRecommendationControl.listFromJson(
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
