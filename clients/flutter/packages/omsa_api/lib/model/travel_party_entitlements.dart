//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TravelPartyEntitlements {
  /// Returns a new [TravelPartyEntitlements] instance.
  TravelPartyEntitlements({
    this.commercialProfiles = const [],
    this.entitlementsGiven = const [],
    this.cardTypes = const [],
    this.cards = const [],
    this.licenseTypes = const [],
    this.licenses = const [],
  });

  List<CommercialProfile> commercialProfiles;

  List<EntitlementGiven> entitlementsGiven;

  List<CardType> cardTypes;

  List<Card> cards;

  List<LicenseType> licenseTypes;

  List<License> licenses;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TravelPartyEntitlements &&
          _deepEquality.equals(other.commercialProfiles, commercialProfiles) &&
          _deepEquality.equals(other.entitlementsGiven, entitlementsGiven) &&
          _deepEquality.equals(other.cardTypes, cardTypes) &&
          _deepEquality.equals(other.cards, cards) &&
          _deepEquality.equals(other.licenseTypes, licenseTypes) &&
          _deepEquality.equals(other.licenses, licenses);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (commercialProfiles.hashCode) +
      (entitlementsGiven.hashCode) +
      (cardTypes.hashCode) +
      (cards.hashCode) +
      (licenseTypes.hashCode) +
      (licenses.hashCode);

  @override
  String toString() =>
      'TravelPartyEntitlements[commercialProfiles=$commercialProfiles, entitlementsGiven=$entitlementsGiven, cardTypes=$cardTypes, cards=$cards, licenseTypes=$licenseTypes, licenses=$licenses]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'commercialProfiles'] = this.commercialProfiles;
    json[r'entitlementsGiven'] = this.entitlementsGiven;
    json[r'cardTypes'] = this.cardTypes;
    json[r'cards'] = this.cards;
    json[r'licenseTypes'] = this.licenseTypes;
    json[r'licenses'] = this.licenses;
    return json;
  }

  /// Returns a new [TravelPartyEntitlements] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TravelPartyEntitlements? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "TravelPartyEntitlements[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "TravelPartyEntitlements[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TravelPartyEntitlements(
        commercialProfiles:
            CommercialProfile.listFromJson(json[r'commercialProfiles']),
        entitlementsGiven:
            EntitlementGiven.listFromJson(json[r'entitlementsGiven']),
        cardTypes: CardType.listFromJson(json[r'cardTypes']),
        cards: Card.listFromJson(json[r'cards']),
        licenseTypes: LicenseType.listFromJson(json[r'licenseTypes']),
        licenses: License.listFromJson(json[r'licenses']),
      );
    }
    return null;
  }

  static List<TravelPartyEntitlements> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TravelPartyEntitlements>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TravelPartyEntitlements.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TravelPartyEntitlements> mapFromJson(dynamic json) {
    final map = <String, TravelPartyEntitlements>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TravelPartyEntitlements.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TravelPartyEntitlements-objects as value to a dart map
  static Map<String, List<TravelPartyEntitlements>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<TravelPartyEntitlements>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TravelPartyEntitlements.listFromJson(
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
