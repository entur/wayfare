//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TravelParty {
  /// Returns a new [TravelParty] instance.
  TravelParty({
    this.type,
    this.entitlements,
    this.requirements,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  TravelPartyEntitlements? entitlements;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  TravelPartyRequirements? requirements;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TravelParty &&
          other.type == type &&
          other.entitlements == entitlements &&
          other.requirements == requirements;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type == null ? 0 : type!.hashCode) +
      (entitlements == null ? 0 : entitlements!.hashCode) +
      (requirements == null ? 0 : requirements!.hashCode);

  @override
  String toString() =>
      'TravelParty[type=$type, entitlements=$entitlements, requirements=$requirements]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.entitlements != null) {
      json[r'entitlements'] = this.entitlements;
    } else {
      json[r'entitlements'] = null;
    }
    if (this.requirements != null) {
      json[r'requirements'] = this.requirements;
    } else {
      json[r'requirements'] = null;
    }
    return json;
  }

  /// Returns a new [TravelParty] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TravelParty? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "TravelParty[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "TravelParty[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TravelParty(
        type: mapValueOfType<String>(json, r'type'),
        entitlements: TravelPartyEntitlements.fromJson(json[r'entitlements']),
        requirements: TravelPartyRequirements.fromJson(json[r'requirements']),
      );
    }
    return null;
  }

  static List<TravelParty> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TravelParty>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TravelParty.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TravelParty> mapFromJson(dynamic json) {
    final map = <String, TravelParty>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TravelParty.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TravelParty-objects as value to a dart map
  static Map<String, List<TravelParty>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<TravelParty>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TravelParty.listFromJson(
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
