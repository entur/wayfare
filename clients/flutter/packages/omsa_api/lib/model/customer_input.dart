//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CustomerInput {
  /// Returns a new [CustomerInput] instance.
  CustomerInput({
    required this.firstName,
    required this.lastName,
    this.initials,
    this.middleName,
    this.prefix,
    this.postfix,
    this.email,
    this.phoneNumber,
    this.address,
    this.dateOfBirth,
    this.placeOfBirth,
    this.countryOfBirth,
    this.customProperties = const {},
    this.externalReference,
  });

  /// short string, display names (length 0-75)
  String firstName;

  /// short string, display names (length 0-75)
  String lastName;

  /// real short string, codes (length 0-10)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? initials;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? middleName;

  /// real short string, codes (length 0-10)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? prefix;

  /// real short string, codes (length 0-10)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? postfix;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? email;

  /// Mobile phone number of the customer in E.164 format, with + and country code and no spaces or punctuation.
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? phoneNumber;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PostalAddress? address;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, full-date (2019-10-12)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? dateOfBirth;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? placeOfBirth;

  /// two-letter country codes according to ISO 3166-1
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? countryOfBirth;

  /// dictionary for extra fields (bilatural agreements)
  Map<String, Object> customProperties;

  /// The client's own reference for this customer, unique within the organisation. Must not be blank. Leading and trailing whitespace is trimmed. Defaults to the customer number when not set. Can only be set when the customer is created. On replace it must be omitted or equal to the stored value. Use id, not this value, when referring to the customer elsewhere in the API.
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? externalReference;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CustomerInput &&
          other.firstName == firstName &&
          other.lastName == lastName &&
          other.initials == initials &&
          other.middleName == middleName &&
          other.prefix == prefix &&
          other.postfix == postfix &&
          other.email == email &&
          other.phoneNumber == phoneNumber &&
          other.address == address &&
          other.dateOfBirth == dateOfBirth &&
          other.placeOfBirth == placeOfBirth &&
          other.countryOfBirth == countryOfBirth &&
          _deepEquality.equals(other.customProperties, customProperties) &&
          other.externalReference == externalReference;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (firstName.hashCode) +
      (lastName.hashCode) +
      (initials == null ? 0 : initials!.hashCode) +
      (middleName == null ? 0 : middleName!.hashCode) +
      (prefix == null ? 0 : prefix!.hashCode) +
      (postfix == null ? 0 : postfix!.hashCode) +
      (email == null ? 0 : email!.hashCode) +
      (phoneNumber == null ? 0 : phoneNumber!.hashCode) +
      (address == null ? 0 : address!.hashCode) +
      (dateOfBirth == null ? 0 : dateOfBirth!.hashCode) +
      (placeOfBirth == null ? 0 : placeOfBirth!.hashCode) +
      (countryOfBirth == null ? 0 : countryOfBirth!.hashCode) +
      (customProperties.hashCode) +
      (externalReference == null ? 0 : externalReference!.hashCode);

  @override
  String toString() =>
      'CustomerInput[firstName=$firstName, lastName=$lastName, initials=$initials, middleName=$middleName, prefix=$prefix, postfix=$postfix, email=$email, phoneNumber=$phoneNumber, address=$address, dateOfBirth=$dateOfBirth, placeOfBirth=$placeOfBirth, countryOfBirth=$countryOfBirth, customProperties=$customProperties, externalReference=$externalReference]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'firstName'] = this.firstName;
    json[r'lastName'] = this.lastName;
    if (this.initials != null) {
      json[r'initials'] = this.initials;
    } else {
      json[r'initials'] = null;
    }
    if (this.middleName != null) {
      json[r'middleName'] = this.middleName;
    } else {
      json[r'middleName'] = null;
    }
    if (this.prefix != null) {
      json[r'prefix'] = this.prefix;
    } else {
      json[r'prefix'] = null;
    }
    if (this.postfix != null) {
      json[r'postfix'] = this.postfix;
    } else {
      json[r'postfix'] = null;
    }
    if (this.email != null) {
      json[r'email'] = this.email;
    } else {
      json[r'email'] = null;
    }
    if (this.phoneNumber != null) {
      json[r'phoneNumber'] = this.phoneNumber;
    } else {
      json[r'phoneNumber'] = null;
    }
    if (this.address != null) {
      json[r'address'] = this.address;
    } else {
      json[r'address'] = null;
    }
    if (this.dateOfBirth != null) {
      json[r'dateOfBirth'] = this.dateOfBirth;
    } else {
      json[r'dateOfBirth'] = null;
    }
    if (this.placeOfBirth != null) {
      json[r'placeOfBirth'] = this.placeOfBirth;
    } else {
      json[r'placeOfBirth'] = null;
    }
    if (this.countryOfBirth != null) {
      json[r'countryOfBirth'] = this.countryOfBirth;
    } else {
      json[r'countryOfBirth'] = null;
    }
    json[r'customProperties'] = this.customProperties;
    if (this.externalReference != null) {
      json[r'externalReference'] = this.externalReference;
    } else {
      json[r'externalReference'] = null;
    }
    return json;
  }

  /// Returns a new [CustomerInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CustomerInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "CustomerInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "CustomerInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CustomerInput(
        firstName: mapValueOfType<String>(json, r'firstName')!,
        lastName: mapValueOfType<String>(json, r'lastName')!,
        initials: mapValueOfType<String>(json, r'initials'),
        middleName: mapValueOfType<String>(json, r'middleName'),
        prefix: mapValueOfType<String>(json, r'prefix'),
        postfix: mapValueOfType<String>(json, r'postfix'),
        email: mapValueOfType<String>(json, r'email'),
        phoneNumber: mapValueOfType<String>(json, r'phoneNumber'),
        address: PostalAddress.fromJson(json[r'address']),
        dateOfBirth: mapValueOfType<String>(json, r'dateOfBirth'),
        placeOfBirth: mapValueOfType<String>(json, r'placeOfBirth'),
        countryOfBirth: mapValueOfType<String>(json, r'countryOfBirth'),
        customProperties:
            mapCastOfType<String, Object>(json, r'customProperties') ??
                const {},
        externalReference: mapValueOfType<String>(json, r'externalReference'),
      );
    }
    return null;
  }

  static List<CustomerInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <CustomerInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CustomerInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CustomerInput> mapFromJson(dynamic json) {
    final map = <String, CustomerInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CustomerInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CustomerInput-objects as value to a dart map
  static Map<String, List<CustomerInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<CustomerInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CustomerInput.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'firstName',
    'lastName',
  };
}
