//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class LicenseType {
  /// Returns a new [LicenseType] instance.
  LicenseType({
    required this.type,
    this.modes = const [],
    this.licenseCode,
    this.issuingCountry,
    this.customFields = const {},
  });

  String type;

  List<Mode> modes;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? licenseCode;

  /// two-letter country codes according to ISO 3166-1
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? issuingCountry;

  /// dictionary for extra fields (bilatural agreements)
  Map<String, Object> customFields;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LicenseType &&
          other.type == type &&
          _deepEquality.equals(other.modes, modes) &&
          other.licenseCode == licenseCode &&
          other.issuingCountry == issuingCountry &&
          _deepEquality.equals(other.customFields, customFields);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (modes.hashCode) +
      (licenseCode == null ? 0 : licenseCode!.hashCode) +
      (issuingCountry == null ? 0 : issuingCountry!.hashCode) +
      (customFields.hashCode);

  @override
  String toString() =>
      'LicenseType[type=$type, modes=$modes, licenseCode=$licenseCode, issuingCountry=$issuingCountry, customFields=$customFields]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'modes'] = this.modes;
    if (this.licenseCode != null) {
      json[r'licenseCode'] = this.licenseCode;
    } else {
      json[r'licenseCode'] = null;
    }
    if (this.issuingCountry != null) {
      json[r'issuingCountry'] = this.issuingCountry;
    } else {
      json[r'issuingCountry'] = null;
    }
    json[r'customFields'] = this.customFields;
    return json;
  }

  /// Returns a new [LicenseType] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static LicenseType? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "LicenseType[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "LicenseType[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return LicenseType(
        type: mapValueOfType<String>(json, r'type')!,
        modes: Mode.listFromJson(json[r'modes']),
        licenseCode: mapValueOfType<String>(json, r'licenseCode'),
        issuingCountry: mapValueOfType<String>(json, r'issuingCountry'),
        customFields:
            mapCastOfType<String, Object>(json, r'customFields') ?? const {},
      );
    }
    return null;
  }

  static List<LicenseType> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <LicenseType>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = LicenseType.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, LicenseType> mapFromJson(dynamic json) {
    final map = <String, LicenseType>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = LicenseType.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of LicenseType-objects as value to a dart map
  static Map<String, List<LicenseType>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<LicenseType>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = LicenseType.listFromJson(
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
