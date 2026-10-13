//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class AmountOfMoney {
  /// Returns a new [AmountOfMoney] instance.
  AmountOfMoney({
    required this.amount,
    this.taxPercentageUsed,
    this.currencyCode,
    this.vatCountryCode,
  });

  /// This should be in the base unit as defined by the ISO 4217 currency code with the appropriate number of decimal places and omitting the currency symbol. e.g. if the price is in US Dollars the price would be 9.95. This is inclusive VAT
  double amount;

  /// the travelled distance. Only if applicable.
  ///
  /// Minimum value: 0
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  double? taxPercentageUsed;

  /// ISO 4217 currency code
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? currencyCode;

  /// two-letter country codes according to ISO 3166-1
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? vatCountryCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AmountOfMoney &&
          other.amount == amount &&
          other.taxPercentageUsed == taxPercentageUsed &&
          other.currencyCode == currencyCode &&
          other.vatCountryCode == vatCountryCode;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (amount.hashCode) +
      (taxPercentageUsed == null ? 0 : taxPercentageUsed!.hashCode) +
      (currencyCode == null ? 0 : currencyCode!.hashCode) +
      (vatCountryCode == null ? 0 : vatCountryCode!.hashCode);

  @override
  String toString() =>
      'AmountOfMoney[amount=$amount, taxPercentageUsed=$taxPercentageUsed, currencyCode=$currencyCode, vatCountryCode=$vatCountryCode]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'amount'] = this.amount;
    if (this.taxPercentageUsed != null) {
      json[r'taxPercentageUsed'] = this.taxPercentageUsed;
    } else {
      json[r'taxPercentageUsed'] = null;
    }
    if (this.currencyCode != null) {
      json[r'currencyCode'] = this.currencyCode;
    } else {
      json[r'currencyCode'] = null;
    }
    if (this.vatCountryCode != null) {
      json[r'vatCountryCode'] = this.vatCountryCode;
    } else {
      json[r'vatCountryCode'] = null;
    }
    return json;
  }

  /// Returns a new [AmountOfMoney] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AmountOfMoney? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "AmountOfMoney[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "AmountOfMoney[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AmountOfMoney(
        amount: mapValueOfType<double>(json, r'amount')!,
        taxPercentageUsed: mapValueOfType<double>(json, r'taxPercentageUsed'),
        currencyCode: mapValueOfType<String>(json, r'currencyCode'),
        vatCountryCode: mapValueOfType<String>(json, r'vatCountryCode'),
      );
    }
    return null;
  }

  static List<AmountOfMoney> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <AmountOfMoney>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AmountOfMoney.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AmountOfMoney> mapFromJson(dynamic json) {
    final map = <String, AmountOfMoney>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AmountOfMoney.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AmountOfMoney-objects as value to a dart map
  static Map<String, List<AmountOfMoney>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<AmountOfMoney>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AmountOfMoney.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'amount',
  };
}
