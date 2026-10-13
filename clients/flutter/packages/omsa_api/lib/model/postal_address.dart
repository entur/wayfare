//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PostalAddress {
  /// Returns a new [PostalAddress] instance.
  PostalAddress({
    this.placeId,
    required this.addressLine1,
    required this.addressLine2,
    this.street,
    this.houseNumber = 0,
    this.houseNumberAddition,
    this.postalCode,
    this.city,
    this.province,
    this.state,
    this.country,
    this.additionalInfo,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PlaceReference? placeId;

  /// long string, memos etc (length 0-10.000)
  String addressLine1;

  /// long string, memos etc (length 0-10.000)
  String addressLine2;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? street;

  /// default length for an integer (0-1000)
  ///
  /// Minimum value: 0
  /// Maximum value: 1000
  int houseNumber;

  /// real short string, codes (length 0-10)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? houseNumberAddition;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? postalCode;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? city;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? province;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? state;

  /// two-letter country codes according to ISO 3166-1
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? country;

  /// long string, memos etc (length 0-10.000)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? additionalInfo;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PostalAddress &&
          other.placeId == placeId &&
          other.addressLine1 == addressLine1 &&
          other.addressLine2 == addressLine2 &&
          other.street == street &&
          other.houseNumber == houseNumber &&
          other.houseNumberAddition == houseNumberAddition &&
          other.postalCode == postalCode &&
          other.city == city &&
          other.province == province &&
          other.state == state &&
          other.country == country &&
          other.additionalInfo == additionalInfo;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (placeId == null ? 0 : placeId!.hashCode) +
      (addressLine1.hashCode) +
      (addressLine2.hashCode) +
      (street == null ? 0 : street!.hashCode) +
      (houseNumber.hashCode) +
      (houseNumberAddition == null ? 0 : houseNumberAddition!.hashCode) +
      (postalCode == null ? 0 : postalCode!.hashCode) +
      (city == null ? 0 : city!.hashCode) +
      (province == null ? 0 : province!.hashCode) +
      (state == null ? 0 : state!.hashCode) +
      (country == null ? 0 : country!.hashCode) +
      (additionalInfo == null ? 0 : additionalInfo!.hashCode);

  @override
  String toString() =>
      'PostalAddress[placeId=$placeId, addressLine1=$addressLine1, addressLine2=$addressLine2, street=$street, houseNumber=$houseNumber, houseNumberAddition=$houseNumberAddition, postalCode=$postalCode, city=$city, province=$province, state=$state, country=$country, additionalInfo=$additionalInfo]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.placeId != null) {
      json[r'placeId'] = this.placeId;
    } else {
      json[r'placeId'] = null;
    }
    json[r'addressLine1'] = this.addressLine1;
    json[r'addressLine2'] = this.addressLine2;
    if (this.street != null) {
      json[r'street'] = this.street;
    } else {
      json[r'street'] = null;
    }
    json[r'houseNumber'] = this.houseNumber;
    if (this.houseNumberAddition != null) {
      json[r'houseNumberAddition'] = this.houseNumberAddition;
    } else {
      json[r'houseNumberAddition'] = null;
    }
    if (this.postalCode != null) {
      json[r'postalCode'] = this.postalCode;
    } else {
      json[r'postalCode'] = null;
    }
    if (this.city != null) {
      json[r'city'] = this.city;
    } else {
      json[r'city'] = null;
    }
    if (this.province != null) {
      json[r'province'] = this.province;
    } else {
      json[r'province'] = null;
    }
    if (this.state != null) {
      json[r'state'] = this.state;
    } else {
      json[r'state'] = null;
    }
    if (this.country != null) {
      json[r'country'] = this.country;
    } else {
      json[r'country'] = null;
    }
    if (this.additionalInfo != null) {
      json[r'additionalInfo'] = this.additionalInfo;
    } else {
      json[r'additionalInfo'] = null;
    }
    return json;
  }

  /// Returns a new [PostalAddress] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PostalAddress? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "PostalAddress[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "PostalAddress[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PostalAddress(
        placeId: PlaceReference.fromJson(json[r'placeId']),
        addressLine1: mapValueOfType<String>(json, r'addressLine1')!,
        addressLine2: mapValueOfType<String>(json, r'addressLine2')!,
        street: mapValueOfType<String>(json, r'street'),
        houseNumber: mapValueOfType<int>(json, r'houseNumber') ?? 0,
        houseNumberAddition:
            mapValueOfType<String>(json, r'houseNumberAddition'),
        postalCode: mapValueOfType<String>(json, r'postalCode'),
        city: mapValueOfType<String>(json, r'city'),
        province: mapValueOfType<String>(json, r'province'),
        state: mapValueOfType<String>(json, r'state'),
        country: mapValueOfType<String>(json, r'country'),
        additionalInfo: mapValueOfType<String>(json, r'additionalInfo'),
      );
    }
    return null;
  }

  static List<PostalAddress> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PostalAddress>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PostalAddress.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PostalAddress> mapFromJson(dynamic json) {
    final map = <String, PostalAddress>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PostalAddress.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PostalAddress-objects as value to a dart map
  static Map<String, List<PostalAddress>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<PostalAddress>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PostalAddress.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'addressLine1',
    'addressLine2',
  };
}
