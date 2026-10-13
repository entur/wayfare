//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class OrganisationalFilter {
  /// Returns a new [OrganisationalFilter] instance.
  OrganisationalFilter({
    required this.type,
    required this.organisationId,
  });

  String type;

  /// default string, full names etc (length 0-200)
  String organisationId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is OrganisationalFilter &&
          other.type == type &&
          other.organisationId == organisationId;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) + (organisationId.hashCode);

  @override
  String toString() =>
      'OrganisationalFilter[type=$type, organisationId=$organisationId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'organisationId'] = this.organisationId;
    return json;
  }

  /// Returns a new [OrganisationalFilter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static OrganisationalFilter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "OrganisationalFilter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "OrganisationalFilter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return OrganisationalFilter(
        type: mapValueOfType<String>(json, r'type')!,
        organisationId: mapValueOfType<String>(json, r'organisationId')!,
      );
    }
    return null;
  }

  static List<OrganisationalFilter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <OrganisationalFilter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = OrganisationalFilter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, OrganisationalFilter> mapFromJson(dynamic json) {
    final map = <String, OrganisationalFilter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = OrganisationalFilter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of OrganisationalFilter-objects as value to a dart map
  static Map<String, List<OrganisationalFilter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<OrganisationalFilter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = OrganisationalFilter.listFromJson(
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
    'organisationId',
  };
}
