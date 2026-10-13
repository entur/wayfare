//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class FinancialDetail {
  /// Returns a new [FinancialDetail] instance.
  FinancialDetail({
    this.amount,
    this.package,
    this.offer,
    this.leg,
    this.category,
    this.expirationDate,
    this.customFields = const {},
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  AmountOfMoney? amount;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? package;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? offer;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? leg;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PaymentCategory? category;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? expirationDate;

  /// dictionary for extra fields (bilatural agreements)
  Map<String, Object> customFields;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FinancialDetail &&
          other.amount == amount &&
          other.package == package &&
          other.offer == offer &&
          other.leg == leg &&
          other.category == category &&
          other.expirationDate == expirationDate &&
          _deepEquality.equals(other.customFields, customFields);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (amount == null ? 0 : amount!.hashCode) +
      (package == null ? 0 : package!.hashCode) +
      (offer == null ? 0 : offer!.hashCode) +
      (leg == null ? 0 : leg!.hashCode) +
      (category == null ? 0 : category!.hashCode) +
      (expirationDate == null ? 0 : expirationDate!.hashCode) +
      (customFields.hashCode);

  @override
  String toString() =>
      'FinancialDetail[amount=$amount, package=$package, offer=$offer, leg=$leg, category=$category, expirationDate=$expirationDate, customFields=$customFields]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.amount != null) {
      json[r'amount'] = this.amount;
    } else {
      json[r'amount'] = null;
    }
    if (this.package != null) {
      json[r'package'] = this.package;
    } else {
      json[r'package'] = null;
    }
    if (this.offer != null) {
      json[r'offer'] = this.offer;
    } else {
      json[r'offer'] = null;
    }
    if (this.leg != null) {
      json[r'leg'] = this.leg;
    } else {
      json[r'leg'] = null;
    }
    if (this.category != null) {
      json[r'category'] = this.category;
    } else {
      json[r'category'] = null;
    }
    if (this.expirationDate != null) {
      json[r'expirationDate'] = this.expirationDate!.toUtc().toIso8601String();
    } else {
      json[r'expirationDate'] = null;
    }
    json[r'customFields'] = this.customFields;
    return json;
  }

  /// Returns a new [FinancialDetail] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static FinancialDetail? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "FinancialDetail[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "FinancialDetail[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return FinancialDetail(
        amount: AmountOfMoney.fromJson(json[r'amount']),
        package: mapValueOfType<String>(json, r'package'),
        offer: mapValueOfType<String>(json, r'offer'),
        leg: mapValueOfType<String>(json, r'leg'),
        category: PaymentCategory.fromJson(json[r'category']),
        expirationDate: mapDateTime(json, r'expirationDate', r''),
        customFields:
            mapCastOfType<String, Object>(json, r'customFields') ?? const {},
      );
    }
    return null;
  }

  static List<FinancialDetail> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <FinancialDetail>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = FinancialDetail.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, FinancialDetail> mapFromJson(dynamic json) {
    final map = <String, FinancialDetail>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = FinancialDetail.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of FinancialDetail-objects as value to a dart map
  static Map<String, List<FinancialDetail>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<FinancialDetail>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = FinancialDetail.listFromJson(
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
