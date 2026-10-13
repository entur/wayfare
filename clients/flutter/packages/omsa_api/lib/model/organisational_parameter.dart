//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class OrganisationalParameter {
  /// Returns a new [OrganisationalParameter] instance.
  OrganisationalParameter({
    required this.id,
    required this.type,
    this.name,
    this.legalName,
  });

  /// short string, display names (length 0-75)
  String id;

  String type;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? name;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? legalName;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is OrganisationalParameter &&
          other.id == id &&
          other.type == type &&
          other.name == name &&
          other.legalName == legalName;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (id.hashCode) +
      (type.hashCode) +
      (name == null ? 0 : name!.hashCode) +
      (legalName == null ? 0 : legalName!.hashCode);

  @override
  String toString() =>
      'OrganisationalParameter[id=$id, type=$type, name=$name, legalName=$legalName]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'id'] = this.id;
    json[r'type'] = this.type;
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.legalName != null) {
      json[r'legalName'] = this.legalName;
    } else {
      json[r'legalName'] = null;
    }
    return json;
  }

  /// Returns a new [OrganisationalParameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static OrganisationalParameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "OrganisationalParameter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "OrganisationalParameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return OrganisationalParameter(
        id: mapValueOfType<String>(json, r'id')!,
        type: mapValueOfType<String>(json, r'type')!,
        name: mapValueOfType<String>(json, r'name'),
        legalName: mapValueOfType<String>(json, r'legalName'),
      );
    }
    return null;
  }

  static List<OrganisationalParameter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <OrganisationalParameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = OrganisationalParameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, OrganisationalParameter> mapFromJson(dynamic json) {
    final map = <String, OrganisationalParameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = OrganisationalParameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of OrganisationalParameter-objects as value to a dart map
  static Map<String, List<OrganisationalParameter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<OrganisationalParameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = OrganisationalParameter.listFromJson(
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
