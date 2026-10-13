//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class OfferProperties {
  /// Returns a new [OfferProperties] instance.
  OfferProperties({
    this.legs = const [],
    this.usageValidityPeriods = const [],
    this.frequenciesOfUse = const [],
    this.ancillaries = const [],
    this.products = const [],
    this.price,
    this.summary = const {},
    this.guarantees = const [],
    this.expiryTime,
  });

  List<Leg> legs;

  /// Usage validity periods referenced by the offer's legs.
  List<UsageValidityPeriod> usageValidityPeriods;

  /// Frequency-of-use parameters referenced by the offer's legs.
  List<FrequencyOfUse> frequenciesOfUse;

  List<Ancillary> ancillaries;

  List<Product> products;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  AmountOfMoney? price;

  /// Flexible summary metadata for the offer. Known keys include:   - `name`: offer display name   - `description`: human-readable offer description   - `isRefundable`: whether included products are refundable   - `isExchangeable`: whether included products are exchangeable   - `geographicalValidity`: zonal validity details, including labeled `fareZones` and `groups`   - `recommendationType`: recommendation category from Offers (for example `CHEAPEST`)   - `recommendationGroup`: 1-based recommendation index in Offers response order   - `recommendationRank`: 1-based `offersToBuy` index within a recommendation
  Map<String, Object> summary;

  List<Guarantee> guarantees;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? expiryTime;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is OfferProperties &&
          _deepEquality.equals(other.legs, legs) &&
          _deepEquality.equals(
              other.usageValidityPeriods, usageValidityPeriods) &&
          _deepEquality.equals(other.frequenciesOfUse, frequenciesOfUse) &&
          _deepEquality.equals(other.ancillaries, ancillaries) &&
          _deepEquality.equals(other.products, products) &&
          other.price == price &&
          _deepEquality.equals(other.summary, summary) &&
          _deepEquality.equals(other.guarantees, guarantees) &&
          other.expiryTime == expiryTime;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (legs.hashCode) +
      (usageValidityPeriods.hashCode) +
      (frequenciesOfUse.hashCode) +
      (ancillaries.hashCode) +
      (products.hashCode) +
      (price == null ? 0 : price!.hashCode) +
      (summary.hashCode) +
      (guarantees.hashCode) +
      (expiryTime == null ? 0 : expiryTime!.hashCode);

  @override
  String toString() =>
      'OfferProperties[legs=$legs, usageValidityPeriods=$usageValidityPeriods, frequenciesOfUse=$frequenciesOfUse, ancillaries=$ancillaries, products=$products, price=$price, summary=$summary, guarantees=$guarantees, expiryTime=$expiryTime]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'legs'] = this.legs;
    json[r'usageValidityPeriods'] = this.usageValidityPeriods;
    json[r'frequenciesOfUse'] = this.frequenciesOfUse;
    json[r'ancillaries'] = this.ancillaries;
    json[r'products'] = this.products;
    if (this.price != null) {
      json[r'price'] = this.price;
    } else {
      json[r'price'] = null;
    }
    json[r'summary'] = this.summary;
    json[r'guarantees'] = this.guarantees;
    if (this.expiryTime != null) {
      json[r'expiryTime'] = this.expiryTime!.toUtc().toIso8601String();
    } else {
      json[r'expiryTime'] = null;
    }
    return json;
  }

  /// Returns a new [OfferProperties] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static OfferProperties? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "OfferProperties[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "OfferProperties[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return OfferProperties(
        legs: Leg.listFromJson(json[r'legs']),
        usageValidityPeriods:
            UsageValidityPeriod.listFromJson(json[r'usageValidityPeriods']),
        frequenciesOfUse:
            FrequencyOfUse.listFromJson(json[r'frequenciesOfUse']),
        ancillaries: Ancillary.listFromJson(json[r'ancillaries']),
        products: Product.listFromJson(json[r'products']),
        price: AmountOfMoney.fromJson(json[r'price']),
        summary: mapCastOfType<String, Object>(json, r'summary') ?? const {},
        guarantees: Guarantee.listFromJson(json[r'guarantees']),
        expiryTime: mapDateTime(json, r'expiryTime', r''),
      );
    }
    return null;
  }

  static List<OfferProperties> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <OfferProperties>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = OfferProperties.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, OfferProperties> mapFromJson(dynamic json) {
    final map = <String, OfferProperties>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = OfferProperties.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of OfferProperties-objects as value to a dart map
  static Map<String, List<OfferProperties>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<OfferProperties>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = OfferProperties.listFromJson(
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
